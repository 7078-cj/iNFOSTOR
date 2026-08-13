import json

from asgiref.sync import sync_to_async
from django.core.cache import cache

from channels.generic.websocket import AsyncWebsocketConsumer

from .game_environment import (
    GameEnvironment,
    MAX_PLAYERS,
)


PLAYER_CACHE_TIMEOUT = 60 * 60


class MyWebSocketConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        # ------------------------------------------------------------------
        # IMPORTANT: set this before any early `return` below.
        # Channels still calls disconnect() for connections that never
        # finished connect() (e.g. rejected/unauthenticated), and
        # disconnect() reads self.player_id — without a default here that
        # raises AttributeError instead of just being a no-op.
        # ------------------------------------------------------------------

        self.player_id = None
        self.game = None

        self.lobby_id = self.scope[
            "url_route"
        ]["kwargs"]["id"]

        self.group_name = (
            f"group_{self.lobby_id}"
        )

        self.cache_key = (
            f"lobby_players_{self.lobby_id}"
        )

        self.user = self.scope["user"]

        if not self.user.is_authenticated:

            await self.close(
                code=4003
            )

            return

        self.player_id = str(
            self.user.id
        )

        # --------------------------------------------------------------
        # Game Environment
        # --------------------------------------------------------------

        self.game = GameEnvironment(
            self.lobby_id
        )

        players = await self.get_players()

        # Already connected

        if self.player_id in players:

            await self.close(
                code=4002
            )

            return

        # Lobby full

        if len(players) >= MAX_PLAYERS:

            await self.accept()

            await self.send_json({
                "type": "lobby_full",
                "message": "This lobby is full.",
                "max_players": MAX_PLAYERS,
            })

            await self.close(
                code=4001
            )

            return

        # --------------------------------------------------------------
        # Add player to game environment
        # --------------------------------------------------------------

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        await self.send_json({
            "type": "connection",
            "message": "WebSocket connection established",
            "player_id": self.player_id,
            "player_count": len(players) + 1,
            "max_players": MAX_PLAYERS,
        })


    # ==================================================================
    # RECEIVE
    # ==================================================================

    async def receive(
        self,
        text_data
    ):

        try:

            data = json.loads(
                text_data
            )

        except json.JSONDecodeError:

            return

        action = data.get("action")

        # --------------------------------------------------------------
        # PLAYER JOIN / LOCATION
        # --------------------------------------------------------------

        if action == "player_update":

            await self.handle_player_update(
                data
            )

        # --------------------------------------------------------------
        # START GAME
        # --------------------------------------------------------------

        elif action == "start_game":

            await self.handle_start_game()

        # --------------------------------------------------------------
        # EVIDENCE
        # --------------------------------------------------------------

        elif action == "submit_evidence":

            await self.handle_evidence(
                data
            )

        # --------------------------------------------------------------
        # PHASE
        # --------------------------------------------------------------

        elif action == "set_phase":

            await self.handle_phase(
                data
            )

        # --------------------------------------------------------------
        # VOTE
        # --------------------------------------------------------------

        elif action == "vote":

            await self.handle_vote(
                data
            )

        # --------------------------------------------------------------
        # FINISH ROUND
        # --------------------------------------------------------------

        elif action == "finish_round":

            await self.handle_finish_round()

        # --------------------------------------------------------------
        # NEXT ROUND
        # --------------------------------------------------------------

        elif action == "next_round":

            await self.handle_next_round()


    # ==================================================================
    # PLAYER UPDATE
    # ==================================================================

    async def handle_player_update(
        self,
        data
    ):

        name = data.get("name")

        location = data.get(
            "location"
        )

        if not name:
            return

        if not isinstance(
            location,
            dict
        ):
            return

        x = location.get("x")

        y = location.get("y")

        if x is None or y is None:
            return

        players = await self.get_players()

        player = {
            "id": self.player_id,

            "user_id":
                self.user.id,

            "name": name,

            "location": {
                "x": x,
                "y": y,
            },
        }

        is_new_player = (
            self.player_id
            not in players
        )

        players[
            self.player_id
        ] = player

        await self.set_players(
            players
        )

        # Also synchronize player
        # with GameEnvironment

        await sync_to_async(
            self.game.add_player
        )(
            player
        )

        if is_new_player:

            existing_players = [
                player
                for player_id, player
                in players.items()
                if player_id != self.player_id
            ]

            await self.send_json({
                "type": "players",

                "players":
                    existing_players,

                "player_count":
                    len(players),

                "max_players":
                    MAX_PLAYERS,
            })

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "player_joined",

                    "player":
                        player,

                    "sender":
                        self.channel_name,

                    "player_count":
                        len(players),
                }
            )

        else:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "player_update",

                    "player":
                        player,

                    "sender":
                        self.channel_name,
                }
            )


    # ==================================================================
    # START GAME
    # ==================================================================

    async def handle_start_game(self):

        success, result = await sync_to_async(
            self.game.start_game
        )()

        if not success:

            await self.send_json({
                "type": "game_error",
                "message": result,
            })

            return

        # Send game state to EVERYONE

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "game_started",
                "game": result,
            }
        )


    async def game_started(
        self,
        event
    ):

        game = event["game"]

        # --------------------------------------------------------------
        # IMPORTANT:
        # Do NOT send everyone's role.
        # --------------------------------------------------------------

        player = game[
            "players"
        ].get(
            self.player_id
        )

        my_role = (
            player["role"]
            if player
            else None
        )

        my_challenge = game[
            "challenges"
        ].get(
            self.player_id
        )

        announcement = (
            game["announcement"]
        )

        await self.send_json({

            "type":
                "game_started",

            "round":
                game["round"],

            "phase":
                game["phase"],

            "announcement":
                announcement,

            "role":
                my_role,

            "challenge":
                my_challenge,

        })


    # ==================================================================
    # EVIDENCE
    # ==================================================================

    async def handle_evidence(
        self,
        data
    ):

        evidence = data.get(
            "evidence"
        )

        if not evidence:
            return

        success = await sync_to_async(
            self.game.add_evidence
        )(
            self.player_id,
            evidence
        )

        if not success:
            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "evidence_submitted",

                "player_id":
                    self.player_id,

                "evidence":
                    evidence,
            }
        )


    async def evidence_submitted(
        self,
        event
    ):

        await self.send_json({
            "type":
                "evidence_submitted",

            "player_id":
                event["player_id"],

            "evidence":
                event["evidence"],
        })


    # ==================================================================
    # PHASE
    # ==================================================================

    async def handle_phase(
        self,
        data
    ):

        phase = data.get(
            "phase"
        )

        allowed = [
            "investigation",
            "evidence",
            "discussion",
            "consensus",
            "result",
        ]

        if phase not in allowed:
            return

        state = await sync_to_async(
            self.game.set_phase
        )(phase)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "phase_changed",

                "phase":
                    state["phase"],
            }
        )


    async def phase_changed(
        self,
        event
    ):

        await self.send_json({
            "type":
                "phase_changed",

            "phase":
                event["phase"],
        })


    # ==================================================================
    # VOTE
    # ==================================================================

    async def handle_vote(
        self,
        data
    ):

        vote = data.get(
            "vote"
        )

        success, result = (
            await sync_to_async(
                self.game.submit_vote
            )(
                self.player_id,
                vote
            )
        )

        if not success:

            await self.send_json({
                "type":
                    "game_error",

                "message":
                    result,
            })

            return

        consensus = await sync_to_async(
            self.game.check_consensus
        )()

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "vote_submitted",

                "player_id":
                    self.player_id,

                "complete":
                    consensus["complete"],

                "unanimous":
                    consensus["unanimous"],
            }
        )


    async def vote_submitted(
        self,
        event
    ):

        await self.send_json({
            "type":
                "vote_submitted",

            "player_id":
                event["player_id"],

            "complete":
                event["complete"],

            "unanimous":
                event["unanimous"],
        })


    # ==================================================================
    # FINISH ROUND
    # ==================================================================

    async def handle_finish_round(
        self
    ):

        success, result = (
            await sync_to_async(
                self.game.finish_round
            )()
        )

        if not success:

            await self.send_json({
                "type":
                    "game_error",

                "message":
                    result,
            })

            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "round_finished",

                "result":
                    result,
            }
        )


    async def round_finished(
        self,
        event
    ):

        await self.send_json({
            "type":
                "round_finished",

            "result":
                event["result"],
        })


    # ==================================================================
    # NEXT ROUND
    # ==================================================================

    async def handle_next_round(
        self
    ):

        state = await sync_to_async(
            self.game.next_round
        )()

        if state["status"] == "finished":

            result = await sync_to_async(
                self.game.get_final_result
            )()

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "game_finished",

                    "result":
                        result,
                }
            )

            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "next_round",

                "round":
                    state["round"],

                "phase":
                    state["phase"],

                "announcement":
                    state["announcement"],
            }
        )


    async def next_round(
        self,
        event
    ):

        await self.send_json({
            "type":
                "next_round",

            "round":
                event["round"],

            "phase":
                event["phase"],

            "announcement":
                event["announcement"],
        })


    # ==================================================================
    # GAME FINISHED
    # ==================================================================

    async def game_finished(
        self,
        event
    ):

        result = event["result"]

        # Don't expose the imposter
        # until the game is finished.

        await self.send_json({
            "type":
                "game_finished",

            "result":
                result,
        })


    # ==================================================================
    # PLAYER EVENTS
    # ==================================================================

    async def player_joined(
        self,
        event
    ):

        if (
            event["sender"]
            == self.channel_name
        ):
            return

        await self.send_json({
            "type":
                "player_joined",

            "player":
                event["player"],

            "player_count":
                event["player_count"],

            "max_players":
                MAX_PLAYERS,
        })


    async def player_update(
        self,
        event
    ):

        if (
            event["sender"]
            == self.channel_name
        ):
            return

        await self.send_json({
            "type":
                "player_update",

            "player":
                event["player"],
        })


    # ==================================================================
    # DISCONNECT
    # ==================================================================

    async def disconnect(
        self,
        close_code
    ):

        # ------------------------------------------------------------------
        # A socket can reach disconnect() without ever having finished
        # connect() successfully (unauthenticated, already-connected, or
        # lobby-full rejections). In those cases there's nothing to clean
        # up — bail out before touching the cache or the game environment.
        # ------------------------------------------------------------------

        if not self.player_id:
            return

        players = await self.get_players()

        player = players.pop(
            self.player_id,
            None
        )

        if player:

            await self.set_players(
                players
            )

            if self.game:

                await sync_to_async(
                    self.game.remove_player
                )(
                    self.player_id
                )


        if hasattr(self, "group_name"):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )


        if player:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "player_left",

                    "user_id":
                        self.player_id,

                    "player_count":
                        len(players),
                }
            )


    async def player_left(
        self,
        event
    ):

        await self.send_json({
            "type":
                "player_left",

            "user_id":
                event["user_id"],

            "player_count":
                event["player_count"],
        })


    # ==================================================================
    # HELPERS
    # ==================================================================

    async def send_json(
        self,
        data
    ):

        await self.send(
            text_data=json.dumps(
                data
            )
        )


    @sync_to_async
    def get_players(self):

        return cache.get(
            self.cache_key,
            {}
        )


    @sync_to_async
    def set_players(
        self,
        players
    ):

        cache.set(
            self.cache_key,
            players,
            timeout=PLAYER_CACHE_TIMEOUT
        )
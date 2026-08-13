import asyncio
import json

from asgiref.sync import sync_to_async
from django.core.cache import cache

from channels.generic.websocket import AsyncWebsocketConsumer

from .game_environment import (
    GameEnvironment,
    MAX_PLAYERS,
    DISCUSSION_DURATION,
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

        # --------------------------------------------------------------
        # Tracks which channel_name is the CURRENT authoritative socket
        # for each player_id: { player_id: channel_name }.
        #
        # This is what lets us handle reload/reconnect deterministically
        # instead of racing the old socket's disconnect() against the
        # new socket's connect(). Whoever connects most recently for a
        # given player_id becomes authoritative, and we actively evict
        # the previous channel rather than hoping it cleans up in time.
        # --------------------------------------------------------------

        self.channels_cache_key = (
            f"lobby_channels_{self.lobby_id}"
        )

        self.positions_cache_key = (
            f"lobby_positions_{self.lobby_id}"
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

        # --------------------------------------------------------------
        # Lobby full — this check is based on distinct players, not
        # connections, so a reconnecting player never gets blocked here.
        # --------------------------------------------------------------

        already_seated = self.player_id in players

        if not already_seated and len(players) >= MAX_PLAYERS:

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
        # Evict any previous socket for this player_id BEFORE we accept
        # this one. This replaces the old "already connected -> reject
        # the new socket" behavior, which is what caused reloads to
        # sometimes get closed before ever receiving resume data.
        # --------------------------------------------------------------

        channels_map = await self.get_channels_map()

        previous_channel = channels_map.get(
            self.player_id
        )

        if (
            previous_channel
            and previous_channel != self.channel_name
        ):

            # Ask the old socket to close itself. Its disconnect() will
            # still run, but it will see that it's no longer the
            # authoritative channel (checked in disconnect() below) and
            # will skip removing state that this new connection owns.

            await self.channel_layer.send(
                previous_channel,
                {"type": "force_disconnect"},
            )

        # This connection is now authoritative for this player_id.

        channels_map[self.player_id] = self.channel_name

        await self.set_channels_map(
            channels_map
        )

        # --------------------------------------------------------------
        # Accept and join the group
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
            "player_count": len(players) + (
                0 if already_seated else 1
            ),
            "max_players": MAX_PLAYERS,
        })

        # --------------------------------------------------------------
        # RESUME: if a game is already in progress and this player has
        # a seat (e.g. they reloaded the page), replay everything they
        # need to rebuild their UI — role, challenge, phase, votes,
        # score, etc. This is sent only to the reconnecting socket,
        # never broadcast, since it can contain their private role/
        # challenge.
        # --------------------------------------------------------------

        resume = await sync_to_async(
            self.game.get_resume_payload
        )(self.player_id)

        if resume:

            await self.send_json({
                "type": "game_resumed",
                **resume,
            })

        else:

            saved_location = await self._get_saved_location(
                players
            )

            if saved_location:

                await self.send_json({
                    "type": "position_restored",
                    "location": saved_location,
                })


    # ==================================================================
    # FORCED DISCONNECT (sent to a socket that's been superseded by a
    # newer connection for the same player_id — e.g. a page reload)
    # ==================================================================

    async def force_disconnect(self, event):

        await self.close(code=4004)


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
        # NEXT ROUND
        # --------------------------------------------------------------

        elif action == "next_round":

            await self.handle_next_round()

        elif action == "sabotage":

            await self.handle_sabotage(
                data
            )


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
        # with GameEnvironment.
        # add_player() is reconnect-safe: if this player already has
        # a seat (mid-game reload), it just updates name/location and
        # leaves their role/score untouched.

        await sync_to_async(
            self.game.add_player
        )(
            player
        )

        await sync_to_async(
            self.game.update_player_location
        )(
            self.player_id,
            player["location"],
        )

        await self.save_player_position(
            self.player_id,
            player["location"],
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

        investigator_score = sum(
            p["score"]
            for p in game["players"].values()
            if p["role"] != "Imposter"
        )

        required_score = (
            game["max_rounds"] // 2
        ) + 1

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

            "investigator_score":
                investigator_score,

            "required_score":
                required_score,

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

        # Call a Vote now starts discussion first, not voting directly.
        if phase == "consensus":
            phase = "discussion"

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

                "discussion_ends_at":
                    state.get(
                        "discussion_ends_at"
                    ),
            }
        )

        if state["phase"] == "discussion":
            asyncio.create_task(
                self._auto_open_consensus_after(
                    DISCUSSION_DURATION
                )
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

            "discussion_ends_at":
                event.get(
                    "discussion_ends_at"
                ),
        })


    async def _auto_open_consensus_after(
        self,
        delay
    ):

        await asyncio.sleep(delay)

        state = await sync_to_async(
            self.game.auto_open_consensus
        )()

        if not state:
            return

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "phase_changed",

                "phase":
                    state["phase"],

                "discussion_ends_at":
                    None,
            }
        )


    # ==================================================================
    # SABOTAGE
    # ==================================================================

    async def handle_sabotage(
        self,
        data
    ):

        object_id = data.get(
            "object_id"
        )

        if not object_id:
            return

        success, result = (
            await sync_to_async(
                self.game.sabotage_object
            )(
                self.player_id,
                object_id,
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

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "object_sabotaged",

                "object_id":
                    result["object_id"],

                "duration":
                    result["duration"],

                "sabotaged_objects":
                    result[
                        "sabotaged_objects"
                    ],

                "saboteur_id":
                    self.player_id,
            }
        )


    async def object_sabotaged(
        self,
        event
    ):

        await self.send_json({
            "type":
                "object_sabotaged",

            "object_id":
                event["object_id"],

            "duration":
                event["duration"],

            "sabotaged_objects":
                event[
                    "sabotaged_objects"
                ],

            "saboteur_id":
                event["saboteur_id"],
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

        # Broadcast the vote itself so everyone's tally/progress updates
        # immediately, regardless of whether this was the final vote.

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type":
                    "vote_submitted",

                "player_id":
                    self.player_id,

                "vote":
                    vote,

                "complete":
                    consensus["complete"],

                "votes_cast":
                    consensus["votes_cast"],

                "total":
                    consensus["total"],
            }
        )

        # ------------------------------------------------------------
        # AUTO-RESOLVE: the moment everyone has voted, finish the round
        # server-side — no "Reveal Result" button required.
        # ------------------------------------------------------------

        if not consensus["complete"]:
            return

        success, payload = await sync_to_async(
            self.game.finish_round
        )()

        if not success:
            return

        if payload["inconclusive"]:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "vote_inconclusive",

                    "tally":
                        payload["tally"],
                }
            )

        else:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type":
                        "round_finished",

                    "result":
                        payload["result"],
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

            "vote":
                event.get("vote"),

            "complete":
                event["complete"],

            "votes_cast":
                event.get("votes_cast"),

            "total":
                event.get("total"),
        })


    async def vote_inconclusive(
        self,
        event
    ):

        await self.send_json({
            "type":
                "vote_inconclusive",

            "tally":
                event["tally"],
        })


    # ==================================================================
    # ROUND FINISHED
    # ==================================================================

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

        # ------------------------------------------------------------------
        # CRITICAL: only the socket that is still the AUTHORITATIVE
        # channel for this player_id is allowed to remove state.
        #
        # Without this guard, a reload sequence like:
        #   1. old socket starts closing (slow)
        #   2. new socket connects, becomes authoritative, sends resume
        #   3. old socket's disconnect() finally runs
        # would let step 3 pop the player from the cache / broadcast
        # "player_left" / touch GameEnvironment even though a perfectly
        # good new connection has already taken over — silently undoing
        # the reconnect. Checking the channels map here makes stale
        # disconnects a true no-op.
        # ------------------------------------------------------------------

        channels_map = await self.get_channels_map()

        current_owner = channels_map.get(
            self.player_id
        )

        is_stale = (
            current_owner is not None
            and current_owner != self.channel_name
        )

        if hasattr(self, "group_name"):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

        if is_stale:
            # A newer connection already superseded this one — it owns
            # cleanup duties now. Nothing more to do.
            return

        # This socket was (or still is) authoritative for the player,
        # so it's safe — and correct — to actually clean up.

        if current_owner == self.channel_name:

            channels_map.pop(
                self.player_id,
                None
            )

            await self.set_channels_map(
                channels_map
            )

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

                # remove_player() is reconnect-safe: while the game is
                # "playing", it deliberately keeps this player's role
                # and score intact in the GameEnvironment, since a
                # disconnect here might still be a reload rather than
                # an intentional quit. It only actually clears the seat
                # while the lobby is still "waiting".

                await sync_to_async(
                    self.game.remove_player
                )(
                    self.player_id
                )

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

    async def _get_saved_location(
        self,
        lobby_players
    ):
        """
        Prefer the live lobby cache entry, then fall back to the
        GameEnvironment seat record (survives disconnect during play).
        """

        cached = lobby_players.get(self.player_id)

        if cached:

            location = cached.get("location")

            if (
                location
                and location.get("x") is not None
                and location.get("y") is not None
                and not (
                    location.get("x") == 0
                    and location.get("y") == 0
                )
            ):
                return location

        cached_position = await self.get_player_position(
            self.player_id
        )

        if cached_position:
            return cached_position

        return await sync_to_async(
            self.game.get_player_location
        )(self.player_id)


    @sync_to_async
    def get_player_position(
        self,
        player_id
    ):

        positions = cache.get(
            self.positions_cache_key,
            {}
        )

        location = positions.get(str(player_id))

        if not location:
            return None

        x = location.get("x")
        y = location.get("y")

        if x is None or y is None:
            return None

        if x == 0 and y == 0:
            return None

        return location


    @sync_to_async
    def save_player_position(
        self,
        player_id,
        location
    ):

        positions = cache.get(
            self.positions_cache_key,
            {}
        )

        positions[str(player_id)] = location

        cache.set(
            self.positions_cache_key,
            positions,
            timeout=PLAYER_CACHE_TIMEOUT
        )


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


    @sync_to_async
    def get_channels_map(self):

        return cache.get(
            self.channels_cache_key,
            {}
        )


    @sync_to_async
    def set_channels_map(
        self,
        channels_map
    ):

        cache.set(
            self.channels_cache_key,
            channels_map,
            timeout=PLAYER_CACHE_TIMEOUT
        )
import json

from asgiref.sync import sync_to_async
from django.core.cache import cache
from channels.generic.websocket import AsyncWebsocketConsumer


MAX_PLAYERS = 7
PLAYER_CACHE_TIMEOUT = 60 * 60


class MyWebSocketConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.lobby_id = self.scope[
            "url_route"
        ]["kwargs"]["id"]

        self.group_name = (
            f"group_{self.lobby_id}"
        )

        self.cache_key = (
            f"lobby_players_{self.lobby_id}"
        )

        # Authenticated Django user
        self.user = self.scope["user"]

        # Use Django user ID as player identity
        self.player_id = str(self.user.id)

        # ---------------------------------------------------------------
        # Check authentication
        # ---------------------------------------------------------------

        if not self.user.is_authenticated:

            await self.close(code=4003)

            return


        # ---------------------------------------------------------------
        # Get current players
        # ---------------------------------------------------------------

        players = await self.get_players()


        # ---------------------------------------------------------------
        # Prevent duplicate connection
        # ---------------------------------------------------------------

        if self.player_id in players:

            await self.close(code=4002)

            return


        # ---------------------------------------------------------------
        # Maximum 7 players
        # ---------------------------------------------------------------

        if len(players) >= MAX_PLAYERS:

            await self.accept()

            await self.send(
                text_data=json.dumps({
                    "type": "lobby_full",
                    "message": "This lobby is full.",
                    "max_players": MAX_PLAYERS,
                })
            )

            await self.close(code=4001)

            return


        # ---------------------------------------------------------------
        # Add to Channels group
        # ---------------------------------------------------------------

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()


        # ---------------------------------------------------------------
        # Connection response
        # ---------------------------------------------------------------

        await self.send(
            text_data=json.dumps({
                "type": "connection",
                "message": "WebSocket connection established",
                "player_id": self.player_id,
                "player_count": len(players) + 1,
                "max_players": MAX_PLAYERS,
            })
        )


    async def receive(self, text_data):

        try:
            data = json.loads(text_data)

        except json.JSONDecodeError:

            return


        name = data.get("name")
        location = data.get("location")


        if not name:
            return

        if not isinstance(location, dict):
            return


        x = location.get("x")
        y = location.get("y")


        if x is None or y is None:
            return


        players = await self.get_players()


        # ---------------------------------------------------------------
        # Create player object
        # ---------------------------------------------------------------

        player = {
            "id": self.player_id,
            "user_id": self.user.id,
            "name": name,
            "location": {
                "x": x,
                "y": y,
            },
        }


        is_new_player = (
            self.player_id not in players
        )


        # ---------------------------------------------------------------
        # Save player
        # ---------------------------------------------------------------

        players[self.player_id] = player

        await self.set_players(players)


        # ---------------------------------------------------------------
        # New player
        # ---------------------------------------------------------------

        if is_new_player:

            existing_players = [
                player
                for player_id, player in players.items()
                if player_id != self.player_id
            ]


            # Send existing players ONLY
            # to the newly connected player

            await self.send(
                text_data=json.dumps({
                    "type": "players",
                    "players": existing_players,
                    "player_count": len(players),
                    "max_players": MAX_PLAYERS,
                })
            )


            # Tell everyone else
            # about the new player

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "player_joined",
                    "player": player,
                    "sender": self.channel_name,
                    "player_count": len(players),
                }
            )


        # ---------------------------------------------------------------
        # Existing player moved
        # ---------------------------------------------------------------

        else:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "player_update",
                    "player": player,
                    "sender": self.channel_name,
                }
            )


    async def player_joined(self, event):

        # Don't send back to joining player

        if (
            event["sender"] ==
            self.channel_name
        ):
            return


        await self.send(
            text_data=json.dumps({
                "type": "player_joined",
                "player": event["player"],
                "player_count": event["player_count"],
                "max_players": MAX_PLAYERS,
            })
        )


    async def player_update(self, event):

        # Don't send movement back
        # to the player who moved

        if (
            event["sender"] ==
            self.channel_name
        ):
            return


        await self.send(
            text_data=json.dumps({
                "type": "player_update",
                "player": event["player"],
            })
        )


    async def disconnect(self, close_code):

        players = await self.get_players()


        player = players.pop(
            self.player_id,
            None
        )


        if player:

            await self.set_players(
                players
            )


        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )


        # ---------------------------------------------------------------
        # Tell remaining players
        # ---------------------------------------------------------------

        if player:

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "player_left",
                    "user_id": self.player_id,
                    "player_count": len(players),
                }
            )


    async def player_left(self, event):

        await self.send(
            text_data=json.dumps({
                "type": "player_left",
                "user_id": event["user_id"],
                "player_count": event["player_count"],
            })
        )


    # ===================================================================
    # CACHE
    # ===================================================================

    @sync_to_async
    def get_players(self):

        return cache.get(
            self.cache_key,
            {}
        )


    @sync_to_async
    def set_players(self, players):

        cache.set(
            self.cache_key,
            players,
            timeout=PLAYER_CACHE_TIMEOUT
        )
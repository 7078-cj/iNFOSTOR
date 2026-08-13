import useWebSocket from "../hooks/useWebsocket";


function handleLobbyMessage(
    data,
    setPlayers,
    setLobbyInfo
) {
    switch (data.type) {

        case "connection":

            setLobbyInfo((prev) => ({
                ...prev,
                playerId: data.player_id,
                playerCount:
                    data.player_count ??
                    prev.playerCount,
                maxPlayers:
                    data.max_players ??
                    prev.maxPlayers,
                full: false,
            }));

            break;


        case "players":

            setPlayers(
                data.players || []
            );

            setLobbyInfo((prev) => ({
                ...prev,
                playerCount:
                    data.player_count ??
                    prev.playerCount,
                maxPlayers:
                    data.max_players ??
                    prev.maxPlayers,
            }));

            break;


        case "player_joined":

            setPlayers((prev) => {

                const incoming =
                    data.player;

                const exists =
                    prev.some(
                        (player) =>
                            String(
                                player.user_id
                            ) ===
                            String(
                                incoming.user_id
                            )
                    );


                if (exists) {
                    return prev;
                }


                return [
                    ...prev,
                    incoming,
                ];
            });


            setLobbyInfo((prev) => ({
                ...prev,
                playerCount:
                    data.player_count ??
                    prev.playerCount,
                maxPlayers:
                    data.max_players ??
                    prev.maxPlayers,
            }));

            break;


        case "player_update":

            setPlayers((prev) =>
                prev.map((player) =>
                    String(
                        player.user_id
                    ) ===
                    String(
                        data.player.user_id
                    )
                        ? data.player
                        : player
                )
            );

            break;


        case "player_left":

            setPlayers((prev) =>
                prev.filter(
                    (player) =>
                        String(
                            player.user_id
                        ) !==
                        String(
                            data.user_id
                        )
                )
            );


            setLobbyInfo((prev) => ({
                ...prev,
                playerCount:
                    data.player_count ??
                    prev.playerCount,
            }));

            break;


        case "lobby_full":

            setLobbyInfo((prev) => ({
                ...prev,
                full: true,
                maxPlayers:
                    data.max_players ??
                    prev.maxPlayers,
            }));

            break;


        default:

            console.log(
                "Unhandled lobby message:",
                data
            );
    }
}


export default function lobbyListener(
    lobbyId,
    onRefresh,
    setPlayers,
    setLobbyInfo
) {

    const {
        sendMessage,
        connected,
        connectionStatus,
    } = useWebSocket(
        `/ws/game/${lobbyId}/`,
        {
            onOpen: () => {
                console.log(
                    "Connected to lobby:",
                    lobbyId
                );
            },

            onRefresh,

            onClose: () => {
                console.log(
                    "Disconnected from lobby:",
                    lobbyId
                );
            },

            onMessage: (data) => {

                handleLobbyMessage(
                    data,
                    setPlayers,
                    setLobbyInfo
                );
            },
        }
    );


    return {
        sendMessage,
        connected,
        connectionStatus,
    };
}
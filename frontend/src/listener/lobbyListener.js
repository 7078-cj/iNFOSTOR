import useWebSocket from "../hooks/useWebsocket";


function handleLobbyMessage(
    data,
    setPlayers,
    setLobbyInfo,
    setGameState
) {
    switch (data.type) {

        // ------------------------------------------------------------
        // LOBBY (unchanged)
        // ------------------------------------------------------------

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

                const incoming = data.player;

                const exists = prev.some(
                    (player) =>
                        String(player.user_id) ===
                        String(incoming.user_id)
                );

                if (exists) {
                    return prev;
                }

                return [...prev, incoming];
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
                    String(player.user_id) ===
                    String(data.player.user_id)
                        ? data.player
                        : player
                )
            );

            break;


        case "player_left":

            setPlayers((prev) =>
                prev.filter(
                    (player) =>
                        String(player.user_id) !==
                        String(data.user_id)
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


        // ------------------------------------------------------------
        // GAME STATE (new)
        // ------------------------------------------------------------

        case "game_started":

            setGameState((prev) => ({
                ...prev,
                status: "playing",
                round: data.round,
                phase: data.phase,
                announcement: data.announcement,
                role: data.role,
                challenge: data.challenge,
                votes: {},
                voteComplete: false,
                voteUnanimous: false,
                lastRoundResult: null,
                finalResult: null,
                error: null,
            }));

            break;


        case "phase_changed":

            setGameState((prev) => ({
                ...prev,
                phase: data.phase,
            }));

            break;


        case "evidence_submitted":

            setGameState((prev) => ({
                ...prev,
                evidenceLog: [
                    ...(prev.evidenceLog || []),
                    {
                        playerId: data.player_id,
                        evidence: data.evidence,
                    },
                ],
            }));

            break;


        case "vote_submitted":

            setGameState((prev) => ({
                ...prev,
                votes: {
                    ...prev.votes,
                    [data.player_id]: true,
                },
                voteComplete: data.complete,
                voteUnanimous: data.unanimous,
            }));

            break;


        case "round_finished":

            setGameState((prev) => ({
                ...prev,
                lastRoundResult: data.result,
            }));

            break;


        case "next_round":

            setGameState((prev) => ({
                ...prev,
                round: data.round,
                phase: data.phase,
                announcement: data.announcement,
                votes: {},
                voteComplete: false,
                voteUnanimous: false,
                evidenceLog: [],
                lastRoundResult: null,
            }));

            break;


        case "game_finished":

            setGameState((prev) => ({
                ...prev,
                status: "finished",
                phase: "finished",
                finalResult: data.result,
            }));

            break;


        case "game_error":

            setGameState((prev) => ({
                ...prev,
                error: data.message,
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
    setLobbyInfo,
    setGameState
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
                    setLobbyInfo,
                    setGameState
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
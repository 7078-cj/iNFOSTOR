import { useRef } from "react";
import useWebSocket from "../hooks/useWebsocket";


function handleLobbyMessage(
    data,
    setPlayers,
    setLobbyInfo,
    setGameState,
    ownPlayerIdRef
) {
    switch (data.type) {

        // ------------------------------------------------------------
        // LOBBY (unchanged)
        // ------------------------------------------------------------

        case "connection":

            // Remember our own player_id so later messages (like
            // vote_submitted) can tell "my vote" apart from everyone
            // else's without needing extra React state.
            ownPlayerIdRef.current = data.player_id;

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
        // GAME STATE
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
                myVote: null,
                votesCast: 0,
                voteComplete: false,
                voteMajority: false,
                evidenceLog: [],
                lastRoundResult: null,
                finalResult: null,
                error: null,
            }));

            break;


        // --------------------------------------------------------
        // RESUME: sent only to the reconnecting socket right after
        // connect(), when a game is already in progress and this
        // player already has a seat (e.g. they reloaded the page).
        // Restores everything DEFAULT_GAME_STATE would otherwise
        // have wiped: status, round, phase, announcement, role,
        // challenge, votes, vote progress, and the last round
        // result / final result if applicable.
        // --------------------------------------------------------

        case "game_resumed": {

            const ownId = ownPlayerIdRef.current;

            const myVote =
                ownId != null &&
                data.votes &&
                Object.prototype.hasOwnProperty.call(
                    data.votes,
                    ownId
                )
                    ? data.votes[ownId]
                    : null;

            setGameState((prev) => ({
                ...prev,
                status: data.status,
                round: data.round,
                phase: data.phase,
                announcement: data.announcement,
                role: data.role,
                challenge: data.challenge,
                votes: data.votes || {},
                myVote,
                votesCast: data.votes_cast ?? 0,
                voteComplete:
                    data.phase === "consensus"
                        ? (data.votes_cast ?? 0) >=
                          (data.player_count ?? 0)
                        : prev.voteComplete,
                lastRoundResult:
                    data.last_round_result ?? null,
                finalResult: data.final_result ?? null,
                error: null,
            }));

            setLobbyInfo((prev) => ({
                ...prev,
                playerCount:
                    data.player_count ?? prev.playerCount,
            }));

            break;
        }


        case "phase_changed":

            setGameState((prev) => ({
                ...prev,
                phase: data.phase,

                // Entering a fresh voting round should clear out
                // whatever vote state was left over from before.
                ...(data.phase === "consensus"
                    ? {
                          votes: {},
                          myVote: null,
                          votesCast: 0,
                          voteComplete: false,
                          voteMajority: false,
                      }
                    : {}),
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


        case "vote_submitted": {

            const ownId = ownPlayerIdRef.current;

            const isOwnVote =
                ownId != null &&
                String(data.player_id) === String(ownId);

            setGameState((prev) => ({
                ...prev,
                votes: {
                    ...prev.votes,
                    [data.player_id]: data.vote ?? true,
                },
                myVote: isOwnVote
                    ? data.vote ?? prev.myVote
                    : prev.myVote,
                votesCast:
                    data.votes_cast ??
                    Object.keys(prev.votes || {}).length + 1,
                voteComplete: data.complete,
                voteMajority: data.majority,
            }));

            break;
        }


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
                myVote: null,
                votesCast: 0,
                voteComplete: false,
                voteMajority: false,
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

    // Holds this client's own player_id once the "connection" message
    // arrives, so later per-player messages (vote_submitted, etc.) can
    // be checked against "is this me?" without extra re-renders.
    const ownPlayerIdRef = useRef(null);

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
                    setGameState,
                    ownPlayerIdRef
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
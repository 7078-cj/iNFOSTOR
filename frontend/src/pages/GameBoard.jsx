import {
    useState,
    useCallback,
    useMemo,
    useContext,
    useEffect,
} from "react";
import { useParams } from "react-router-dom";

import Player from "../components/Player";
import Wall from "../components/Wall";
import Interactable from "../components/Interactable";
import OtherPlayer from "../components/OtherPlayer";

import SourceInteractable from "../components/interactables/SourceInteractable";
import GameEnvironment from "../components/environment/GameEnvironment";
import BriefingTerminal from "../components/environment/BriefingTerminal";
import EvidenceModal from "../components/EvidenceModal";
import VoteModal from "../components/VoteModal";
import VisionOverlay from "../components/VisionOverlay";
import PhaseBanner from "../components/PhaseBanner";
import ImposterPanel, {
    findNearbyInvestigationObject,
} from "../components/ImposterPanel";
import FabricateEvidenceModal from "../components/FabricateEvidenceModal";
import Minimap from "../components/Minimap";
import Npc from "../components/Npc";
import NpcDialogueModal from "../components/NpcDialogueModal";

import {
    getVisionConfig,
    isPointVisible,
} from "../utils/vision";

import useWindowSize from "../hooks/useWindowSize";
import lobbyListener from "../listener/lobbyListener";
import AuthContext from "../context/AuthContext";


import {
    INVESTIGATION_OBJECTS,
    INTERIOR_WALLS,
} from "../data/mapInteractables";
import { NPCS } from "../data/npcs";
import { WORLD_W, WORLD_H } from "../data/mapEnvironment";

const WALL_THICKNESS = 20;


const DEFAULT_GAME_STATE = {
    status: "waiting", // waiting | playing | finished
    round: 0,
    phase: "waiting",
    announcement: null,
    role: null,
    challenge: null,
    votes: {},
    myVote: null,
    votesCast: 0,
    voteComplete: false,
    evidenceLog: [],
    lastRoundResult: null,
    lastRoundNote: null,
    finalResult: null,
    score: 0,
    requiredScore: null,
    error: null,
    sabotagedObjects: {},
    discussionEndsAt: null,
    sabotageCooldown: 0,
};


/*
|--------------------------------------------------------------------------
| NOTE ON lobbyListener.js
|--------------------------------------------------------------------------
| This component expects lobbyListener's setGameState updater to handle
| the following incoming websocket message types (merging fields into
| gameState the same way it already does for "game_started"):
|
|   "game_resumed"        -> sent ONLY to the reconnecting socket right
|                             after connect(), replays status/round/phase/
|                             announcement/role/challenge/votes/votes_cast/
|                             player_count/investigator_score/required_score/
|                             last_round_result/final_result so a page
|                             reload mid-game restores the UI instead of
|                             falling back to DEFAULT_GAME_STATE.
|
|   "phase_changed"        -> merge { phase }, and reset myVote/voteComplete
|                             when phase becomes "consensus".
|
|   "vote_submitted"       -> merge { votesCast: votes_cast, voteComplete:
|                             complete }. Does NOT set myVote — that's
|                             already applied optimistically by
|                             handleVote() below the instant the local
|                             player votes.
|
|   "vote_inconclusive"    -> sent instead of "round_finished" when the
|                             final vote comes in but nobody reached a
|                             strict majority for a real classification.
|                             Server auto-resets phase back to
|                             "investigation" and clears votes; merge
|                             { phase, votes: {}, myVote: null,
|                             votesCast: 0, voteComplete: false,
|                             lastRoundNote: { type: "inconclusive",
|                             tally } } so the vote modal closes and the
|                             group can gather more evidence.
|
|   "round_finished"       -> now sent automatically the instant the last
|                             vote comes in AND a majority verdict was
|                             reached (no "Reveal Result" button needed).
|                             merge { lastRoundResult: result,
|                             lastRoundNote: null, score:
|                             result.investigator_score, requiredScore:
|                             result.required_score }.
|
|   "next_round"           -> merge { round, phase, announcement,
|                             lastRoundResult: null, lastRoundNote: null,
|                             votes: {}, myVote: null, votesCast: 0,
|                             voteComplete: false }.
|
|   "game_finished"        -> merge { finalResult: result }.
|
|   "evidence_submitted"   -> append to evidenceLog.
|
| These mirror the backend broadcast shapes added in consumers.py.
|--------------------------------------------------------------------------
*/


export default function GameBoard() {

    const { lobbyId } = useParams();

    const { user } = useContext(AuthContext);

    const userId = user?.user_id;

    const playerName =
        user?.first_name ||
        user?.username ||
        "Player";


    const { width, height } = useWindowSize();


    /*
    |--------------------------------------------------------------------------
    | Local Player
    |--------------------------------------------------------------------------
    */

    const [playerRect, setPlayerRect] = useState({
        x: WORLD_W / 2,
        y: WORLD_H / 2,
        w: 26,
        h: 26,
    });

    const [playerFacing, setPlayerFacing] = useState(Math.PI / 2);

    const [fabricateOpen, setFabricateOpen] = useState(false);

    const [discussionSecondsLeft, setDiscussionSecondsLeft] =
        useState(null);

    const [restoredPosition, setRestoredPosition] = useState(null);


    const [message, setMessage] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Other Players
    |--------------------------------------------------------------------------
    */

    const [otherPlayers, setOtherPlayers] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Lobby / Game Information
    |--------------------------------------------------------------------------
    */

    const [lobbyInfo, setLobbyInfo] = useState({
        playerId: null,
        playerCount: 0,
        maxPlayers: 7,
        full: false,
    });

    const [gameState, setGameState] = useState(
        DEFAULT_GAME_STATE
    );


    /*
    |--------------------------------------------------------------------------
    | Interactable Modal
    |--------------------------------------------------------------------------
    */

    const [activeObjectId, setActiveObjectId] = useState(
        null
    );

    const [activeNpcId, setActiveNpcId] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | WebSocket
    |--------------------------------------------------------------------------
    */

    const handleRestorePosition = useCallback((location) => {
        if (location?.x == null || location?.y == null) {
            return;
        }

        setPlayerRect((prev) => ({
            ...prev,
            x: location.x,
            y: location.y,
        }));

        setRestoredPosition({
            x: location.x,
            y: location.y,
        });
    }, []);

    const {
        sendMessage,
        connected,
        connectionStatus,
    } = lobbyListener(
        lobbyId,
        null,
        setOtherPlayers,
        setLobbyInfo,
        setGameState,
        handleRestorePosition
    );

    useEffect(() => {
        if (!restoredPosition || !userId || !connected) {
            return;
        }

        sendMessage({
            action: "player_update",
            name: playerName,
            location: {
                x: restoredPosition.x,
                y: restoredPosition.y,
            },
        });
    }, [
        restoredPosition,
        userId,
        connected,
        sendMessage,
        playerName,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Walls
    |--------------------------------------------------------------------------
    */

    const walls = useMemo(
        () => [
            {
                id: "wall-top",
                x: 0,
                y: 0,
                w: WORLD_W,
                h: WALL_THICKNESS,
                variant: "boundary",
            },
            {
                id: "wall-bottom",
                x: 0,
                y: WORLD_H - WALL_THICKNESS,
                w: WORLD_W,
                h: WALL_THICKNESS,
                variant: "boundary",
            },
            {
                id: "wall-left",
                x: 0,
                y: 0,
                w: WALL_THICKNESS,
                h: WORLD_H,
                variant: "boundary",
            },
            {
                id: "wall-right",
                x: WORLD_W - WALL_THICKNESS,
                y: 0,
                w: WALL_THICKNESS,
                h: WORLD_H,
                variant: "boundary",
            },
            ...INTERIOR_WALLS.map((wall) => ({
                ...wall,
                variant: wall.variant || "interior",
            })),
        ],
        []
    );

    const investigationObjects = useMemo(
        () => INVESTIGATION_OBJECTS,
        []
    );

    const interactable = useMemo(
        () => ({
            id: "hub",
            x: WORLD_W / 2 - 14,
            y: WORLD_H / 2 - 14,
            w: 28,
            h: 28,
        }),
        []
    );

    const handleObjectInteract = useCallback((objectId) => {
        setActiveNpcId(null);
        setActiveObjectId(objectId);
    }, []);

    const handleNpcTalk = useCallback((npcId) => {
        setActiveObjectId(null);
        setActiveNpcId(npcId);
    }, []);

    const handleCloseNpcModal = useCallback(() => {
        setActiveNpcId(null);
    }, []);

    const isImposter = gameState.role === "Imposter";

    const visionConfig = useMemo(
        () => getVisionConfig(isImposter),
        [isImposter]
    );

    const visionEnabled =
        gameState.status === "playing" &&
        (gameState.phase === "investigation" ||
            gameState.phase === "discussion");

    const viewerCenter = useMemo(
        () => ({
            x: playerRect.x + playerRect.w / 2,
            y: playerRect.y + playerRect.h / 2,
        }),
        [playerRect]
    );

    const isWorldPointVisible = useCallback(
        (x, y) => {
            if (!visionEnabled) {
                return true;
            }
            return isPointVisible(
                viewerCenter.x,
                viewerCenter.y,
                playerFacing,
                x,
                y,
                visionConfig
            );
        },
        [
            visionEnabled,
            viewerCenter,
            playerFacing,
            visionConfig,
        ]
    );

    const isObjectSabotagedForPlayer = useCallback(
        (objectId) => {
            const sabotage =
                gameState.sabotagedObjects?.[objectId];
            if (!sabotage?.active) {
                return false;
            }
            return !isImposter;
        },
        [gameState.sabotagedObjects, isImposter]
    );

    const nearbySabotageTarget = useMemo(
        () =>
            isImposter
                ? findNearbyInvestigationObject(
                      playerRect,
                      investigationObjects,
                      gameState.sabotagedObjects
                  )
                : null,
        [
            isImposter,
            playerRect,
            investigationObjects,
            gameState.sabotagedObjects,
        ]
    );

    const handleCloseModal = useCallback(() => {
        setActiveObjectId(null);
    }, []);

    const handleSubmitEvidence = useCallback(
        (evidence) => {
            sendMessage({
                action: "submit_evidence",
                evidence,
            });
        },
        [sendMessage]
    );


    /*
    |--------------------------------------------------------------------------
    | Collision Objects
    |--------------------------------------------------------------------------
    */

    const collidables = useMemo(
        () => [
            ...walls,

            ...otherPlayers.map((player) => ({
                id: player.id,
                x: player.location.x,
                y: player.location.y,
                w: 26,
                h: 26,
            })),

            interactable,

            ...investigationObjects.map((obj) => ({
                id: obj.id,
                x: obj.x,
                y: obj.y,
                w: obj.w,
                h: obj.h,
            })),
        ],
        [
            walls,
            otherPlayers,
            interactable,
            investigationObjects,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Player Movement
    |--------------------------------------------------------------------------
    */

    const handlePositionChange = useCallback(
        (next, facing) => {

            setPlayerRect(next);

            if (facing != null) {
                setPlayerFacing(facing);
            }

            if (!userId) {
                return;
            }

            sendMessage({
                action: "player_update",
                name: playerName,

                location: {
                    x: next.x,
                    y: next.y,
                },
            });
        },
        [
            sendMessage,
            userId,
            playerName,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Orb Interaction (unchanged)
    |--------------------------------------------------------------------------
    */

    const handleInteract = useCallback(() => {

        setMessage((current) =>
            current
                ? null
                : "The briefing hub glows softly — a reminder of your mission."
        );

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Game Actions
    |--------------------------------------------------------------------------
    */

    const handleStartGame = useCallback(() => {
        sendMessage({ action: "start_game" });
    }, [sendMessage]);

    const handleCallVote = useCallback(() => {
        sendMessage({ action: "set_phase", phase: "consensus" });
    }, [sendMessage]);

    const handleFabricateEvidence = useCallback(
        (note) => {
            sendMessage({
                action: "submit_evidence",
                evidence: {
                    source: "imposter",
                    note,
                    fabricated: true,
                },
            });
        },
        [sendMessage]
    );

    const handleSabotage = useCallback(() => {
        if (!nearbySabotageTarget) {
            return;
        }
        sendMessage({
            action: "sabotage",
            object_id: nearbySabotageTarget,
        });
    }, [sendMessage, nearbySabotageTarget]);

    const handleVote = useCallback(
        (vote) => {
            // Optimistically lock the buttons for this player while
            // waiting for the broadcast to confirm. The server auto-
            // resolves the round the instant the last vote comes in,
            // so there's no separate "submit"/"reveal" step to wire up.
            setGameState((prev) => ({ ...prev, myVote: vote }));
            sendMessage({ action: "vote", vote });
        },
        [sendMessage]
    );

    const handleNextRound = useCallback(() => {
        sendMessage({ action: "next_round" });
    }, [sendMessage]);


    /*
    |--------------------------------------------------------------------------
    | Discussion Timer + Imposter Hotkeys
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            gameState.phase !== "discussion" ||
            !gameState.discussionEndsAt
        ) {
            setDiscussionSecondsLeft(null);
            return undefined;
        }

        const tick = () => {
            const remaining = Math.max(
                0,
                Math.ceil(
                    (gameState.discussionEndsAt - Date.now()) / 1000
                )
            );
            setDiscussionSecondsLeft(remaining);
        };

        tick();
        const interval = setInterval(tick, 500);
        return () => clearInterval(interval);
    }, [gameState.phase, gameState.discussionEndsAt]);

    useEffect(() => {
        if (gameState.lastRoundNote?.type !== "inconclusive") {
            return undefined;
        }

        const timeout = setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                lastRoundNote: null,
            }));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [gameState.lastRoundNote, setGameState]);

    useEffect(() => {
        if (!isImposter) {
            return undefined;
        }

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            if (key === "g") {
                setFabricateOpen(true);
            }

            if (key === "f") {
                handleSabotage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () =>
            window.removeEventListener("keydown", handleKeyDown);
    }, [isImposter, handleSabotage]);

    useEffect(() => {
        if (gameState.sabotageCooldown <= 0) {
            return undefined;
        }

        const interval = setInterval(() => {
            setGameState((prev) => ({
                ...prev,
                sabotageCooldown: Math.max(
                    0,
                    prev.sabotageCooldown - 1
                ),
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState.sabotageCooldown, setGameState]);

    const sabotageCount = Object.keys(
        gameState.sabotagedObjects || {}
    ).length;

    useEffect(() => {
        if (sabotageCount === 0) {
            return undefined;
        }

        const interval = setInterval(() => {
            setGameState((prev) => {
                const next = { ...prev.sabotagedObjects };
                let changed = false;

                for (const [objectId, info] of Object.entries(next)) {
                    if (info.secondsLeft <= 1) {
                        delete next[objectId];
                        changed = true;
                    } else {
                        next[objectId] = {
                            ...info,
                            secondsLeft: info.secondsLeft - 1,
                        };
                        changed = true;
                    }
                }

                if (!changed) {
                    return prev;
                }

                return {
                    ...prev,
                    sabotagedObjects: next,
                };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [sabotageCount, setGameState]);


    /*
    |--------------------------------------------------------------------------
    | Camera
    |--------------------------------------------------------------------------
    */

    const cameraX =
        width / 2 -
        (playerRect.x + playerRect.w / 2);

    const cameraY =
        height / 2 -
        (playerRect.y + playerRect.h / 2);


    const activeChallenge = gameState.challenge;

    // The vote modal is open for everyone the moment the phase enters
    // "consensus", and closes automatically once the round resolves
    // (lastRoundResult set) OR the round comes back inconclusive
    // (server already reset phase away from "consensus" in that case).
    const voteModalOpen =
        gameState.status === "playing" &&
        gameState.phase === "consensus" &&
        !gameState.lastRoundResult;

    const canCallVote =
        gameState.status === "playing" &&
        gameState.phase === "investigation" &&
        !gameState.lastRoundResult;

    const visibleOtherPlayers = useMemo(
        () =>
            otherPlayers
                .filter(
                    (player) =>
                        String(player.user_id) !==
                        String(userId)
                )
                .filter((player) => {
                    if (!visionEnabled) {
                        return true;
                    }
                    const px =
                        player.location.x + 13;
                    const py =
                        player.location.y + 13;
                    return isWorldPointVisible(px, py);
                }),
        [
            otherPlayers,
            userId,
            visionEnabled,
            isWorldPointVisible,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 font-mono">

            {/* ------------------------------------------------------------- */}
            {/* HUD */}
            {/* ------------------------------------------------------------- */}

            <div className="absolute top-4 z-10 flex flex-col items-center gap-1 text-xs uppercase tracking-wide">

                <div className="text-slate-400">
                    WASD / Arrows to move · E to interact
                    {isImposter && " · G fabricate · F sabotage"}
                </div>

                <div className="text-slate-500">
                    Lobby: {lobbyId}
                </div>

                <div
                    className={
                        connected
                            ? "text-green-400"
                            : "text-red-400"
                    }
                >
                    {connectionStatus}
                </div>

                <div className="text-slate-400">
                    Players:{" "}
                    {lobbyInfo.playerCount}/
                    {lobbyInfo.maxPlayers}
                </div>

                {gameState.status === "playing" && (
                    <div className="mt-1 flex flex-col items-center gap-0.5 text-slate-300">
                        <div>
                            Round {gameState.round} ·{" "}
                            {gameState.phase}
                        </div>
                        <div className="text-amber-400">
                            Role: {gameState.role}
                            {isImposter && " — wider vision"}
                        </div>
                        {activeChallenge && (
                            <div className="max-w-xs text-center text-[11px] normal-case text-slate-500">
                                {activeChallenge.instructions}
                            </div>
                        )}
                        {gameState.requiredScore != null && (
                            <div className="text-emerald-400">
                                Investigators: {gameState.score}/
                                {gameState.requiredScore} to win
                            </div>
                        )}
                    </div>
                )}

                {gameState.error && (
                    <div className="text-red-400">
                        {gameState.error}
                    </div>
                )}
            </div>


            {/* ------------------------------------------------------------- */}
            {/* Lobby Controls */}
            {/* ------------------------------------------------------------- */}

            {connected && (
                <Minimap
                    playerRect={playerRect}
                    otherPlayers={otherPlayers}
                    userId={userId}
                    viewportWidth={width}
                    viewportHeight={height}
                    walls={walls}
                />
            )}


            {gameState.status === "waiting" && (
                <button
                    onClick={handleStartGame}
                    className="absolute top-4 right-4 z-10 rounded bg-emerald-700 px-3 py-1.5 text-xs font-medium uppercase tracking-wide hover:bg-emerald-600"
                >
                    Start Game
                </button>
            )}


            {/* ------------------------------------------------------------- */}
            {/* Current Announcement */}
            {/* ------------------------------------------------------------- */}

            {gameState.announcement && (
                <div className="absolute top-4 left-4 z-10 max-w-xs rounded border border-white/10 bg-black/70 p-3 text-xs text-slate-200">
                    <div className="mb-1 font-semibold text-slate-100">
                        {gameState.announcement.title}
                    </div>
                    <p className="leading-relaxed text-slate-400">
                        {gameState.announcement.content}
                    </p>
                </div>
            )}


            {/* ------------------------------------------------------------- */}
            {/* Call a Vote */}
            {/* ------------------------------------------------------------- */}

            {canCallVote && (
                <button
                    onClick={handleCallVote}
                    className="absolute bottom-6 right-6 z-10 rounded bg-red-800 px-3 py-1.5 text-xs font-medium uppercase tracking-wide hover:bg-red-700"
                >
                    Call a Vote
                </button>
            )}

            <PhaseBanner
                phase={gameState.phase}
                round={gameState.round}
                discussionSecondsLeft={discussionSecondsLeft}
                evidenceCount={gameState.evidenceLog?.length ?? 0}
            />

            {isImposter && gameState.status === "playing" && (
                <ImposterPanel
                    phase={gameState.phase}
                    nearbyObjectId={nearbySabotageTarget}
                    sabotageCooldown={gameState.sabotageCooldown}
                    onFabricate={() => setFabricateOpen(true)}
                    onSabotage={handleSabotage}
                />
            )}

            <FabricateEvidenceModal
                open={fabricateOpen}
                onClose={() => setFabricateOpen(false)}
                onSubmit={handleFabricateEvidence}
            />


            {/* ------------------------------------------------------------- */}
            {/* Vote Modal — shown to ALL players once phase = consensus */}
            {/* ------------------------------------------------------------- */}

            <VoteModal
                open={voteModalOpen}
                announcement={gameState.announcement}
                evidenceLog={gameState.evidenceLog}
                myVote={gameState.myVote}
                votesCast={gameState.votesCast}
                totalPlayers={lobbyInfo.playerCount}
                onVote={handleVote}
            />


            {/* ------------------------------------------------------------- */}
            {/* Inconclusive Vote Note — round auto-reset, no majority reached */}
            {/* ------------------------------------------------------------- */}

            {gameState.lastRoundNote?.type === "inconclusive" && (
                <div className="absolute bottom-6 z-10 max-w-xs rounded border border-amber-500/30 bg-black/70 p-2 text-center text-xs text-amber-300">
                    No majority reached — back to investigating.
                </div>
            )}


            {/* ------------------------------------------------------------- */}
            {/* Round Result — round auto-resolves once everyone has voted */}
            {/* ------------------------------------------------------------- */}

            {gameState.lastRoundResult && (
                <div className="absolute bottom-20 right-6 z-10 max-w-xs rounded border border-white/10 bg-black/80 p-3 text-xs text-slate-200">
                    <div className="mb-1 font-semibold">
                        {gameState.lastRoundResult.successful
                            ? "Correct verdict"
                            : "Incorrect verdict"}
                    </div>
                    <div className="mb-1 text-slate-400">
                        Group voted:{" "}
                        {gameState.lastRoundResult.verdict}
                    </div>
                    <div className="mb-1 text-slate-400">
                        Actual classification:{" "}
                        {gameState.lastRoundResult.classification}
                    </div>
                    <p className="mb-2 text-slate-400">
                        {gameState.lastRoundResult.explanation}
                    </p>
                    <div className="mb-2 text-emerald-400">
                        Investigators: {gameState.score}/
                        {gameState.requiredScore} to win
                    </div>
                    <button
                        onClick={handleNextRound}
                        className="rounded bg-emerald-700 px-2 py-1 text-[11px] font-medium uppercase hover:bg-emerald-600"
                    >
                        Next Round
                    </button>
                </div>
            )}

            {gameState.finalResult && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85">
                    <div className="max-w-sm rounded border border-white/10 bg-neutral-900 p-5 text-center text-sm text-slate-200">
                        <div className="mb-2 text-lg font-semibold">
                            {gameState.finalResult.winner === "investigators"
                                ? "Investigators Win"
                                : "The Imposter Wins"}
                        </div>
                        <p className="text-slate-400">
                            Score: {gameState.finalResult.investigator_score}
                            /{gameState.finalResult.required_score}{" "}
                            required
                        </p>
                        {gameState.finalResult.imposter_id &&
                            gameState.finalResult.players && (
                                <p className="mt-2 text-red-400">
                                    The Imposter was{" "}
                                    {gameState.finalResult.players[
                                        gameState.finalResult.imposter_id
                                    ]?.name || "unknown"}
                                </p>
                            )}
                    </div>
                </div>
            )}


            {/* ------------------------------------------------------------- */}
            {/* Game World */}
            {/* ------------------------------------------------------------- */}

            <div className="relative h-full w-full overflow-hidden bg-[#06080c]">

                {visionEnabled && (
                    <VisionOverlay
                        width={width}
                        height={height}
                        facing={playerFacing}
                        visionConfig={visionConfig}
                    />
                )}

                <div
                    className="absolute left-0 top-0"
                    style={{
                        width: WORLD_W,
                        height: WORLD_H,
                        transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
                    }}
                >

                    <GameEnvironment />

                    {/* ----------------------------------------------------- */}
                    {/* Walls */}
                    {/* ----------------------------------------------------- */}

                    {walls.map((wall) => (
                        <Wall
                            key={wall.id}
                            x={wall.x}
                            y={wall.y}
                            w={wall.w}
                            h={wall.h}
                            variant={wall.variant || "interior"}
                        />
                    ))}


                    {/* ----------------------------------------------------- */}
                    {/* Other Players */}
                    {/* ----------------------------------------------------- */}

                    {visibleOtherPlayers.map((player) => (
                            <OtherPlayer
                                key={player.id}
                                x={player.location.x}
                                y={player.location.y}
                                name={player.name}
                                color="bg-amber-400"
                            />
                        ))
                    }


                    {/* ----------------------------------------------------- */}
                    {/* Briefing hub (center plaza) */}
                    {/* ----------------------------------------------------- */}

                    <Interactable
                        x={interactable.x}
                        y={interactable.y}
                        w={interactable.w}
                        h={interactable.h}
                        player={playerRect}
                        onInteract={handleInteract}
                        promptLabel="Press E — Briefing Hub"
                    >
                        {(isNear) => (
                            <BriefingTerminal active={isNear} />
                        )}
                    </Interactable>


                    {/* ----------------------------------------------------- */}
                    {/* Investigation Objects */}
                    {/* ----------------------------------------------------- */}

                    {investigationObjects.map((obj) => {
                        const centerX = obj.x + obj.w / 2;
                        const centerY = obj.y + obj.h / 2;
                        const visible = isWorldPointVisible(
                            centerX,
                            centerY
                        );

                        if (!visible) {
                            return null;
                        }

                        const sabotaged = isObjectSabotagedForPlayer(
                            obj.id
                        );

                        return (
                            <SourceInteractable
                                key={obj.id}
                                id={obj.id}
                                x={obj.x}
                                y={obj.y}
                                w={obj.w}
                                h={obj.h}
                                player={playerRect}
                                onInteract={handleObjectInteract}
                                disabled={sabotaged}
                                disabledLabel="Sabotaged"
                            />
                        );
                    })}


                    {/* ----------------------------------------------------- */}
                    {/* NPCs — ask about the news */}
                    {/* ----------------------------------------------------- */}

                    {NPCS.map((npc) => {
                        const centerX = npc.x + 13;
                        const centerY = npc.y + 15;
                        const visible = isWorldPointVisible(
                            centerX,
                            centerY
                        );

                        if (!visible) {
                            return null;
                        }

                        return (
                            <Npc
                                key={npc.id}
                                npc={npc}
                                player={playerRect}
                                onTalk={handleNpcTalk}
                            />
                        );
                    })}


                    {/* ----------------------------------------------------- */}
                    {/* Local Player */}
                    {/* ----------------------------------------------------- */}

                    <Player
                        initialX={WORLD_W / 2}
                        initialY={WORLD_H / 2}
                        size={26}
                        facing={playerFacing}
                        restoredPosition={restoredPosition}
                        walls={collidables}
                        bounds={{
                            width: WORLD_W,
                            height: WORLD_H,
                        }}
                        onPositionChange={handlePositionChange}
                    />

                </div>

            </div>


            {/* ------------------------------------------------------------- */}
            {/* Interaction Message (orb) */}
            {/* ------------------------------------------------------------- */}

            {message && (
                <div className="absolute bottom-6 z-10 max-w-md text-center text-sm text-slate-300">
                    {message}
                </div>
            )}


            {/* ------------------------------------------------------------- */}
            {/* Evidence Modal */}
            {/* ------------------------------------------------------------- */}

            <EvidenceModal
                objectId={activeObjectId}
                announcementId={gameState.announcement?.id}
                challenge={activeChallenge}
                playerRole={gameState.role}
                onClose={handleCloseModal}
                onSubmitEvidence={handleSubmitEvidence}
            />

            <NpcDialogueModal
                npcId={activeNpcId}
                announcement={gameState.announcement}
                playerRole={gameState.role}
                onClose={handleCloseNpcModal}
                onSubmitEvidence={handleSubmitEvidence}
            />

        </div>
    );
}
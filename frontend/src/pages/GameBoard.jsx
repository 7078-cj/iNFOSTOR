import {
    useState,
    useCallback,
    useMemo,
    useContext,
} from "react";
import { useParams } from "react-router-dom";

import Player from "../components/Player";
import Wall from "../components/Wall";
import Interactable from "../components/Interactable";
import OtherPlayer from "../components/OtherPlayer";

import useWindowSize from "../hooks/useWindowSize";
import lobbyListener from "../listener/lobbyListener";
import AuthContext from "../context/AuthContext";


const WALL_THICKNESS = 20;

const WORLD_W = 2400;
const WORLD_H = 1600;


export default function GameBoard() {

    const { lobbyId } = useParams();

    const { user } = useContext(AuthContext);

    const userId = user?.user_id;

    // Change this depending on your User object
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


    const [message, setMessage] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Other Players
    |--------------------------------------------------------------------------
    */

    const [otherPlayers, setOtherPlayers] = useState([]);


    /*
    |--------------------------------------------------------------------------
    | Lobby Information
    |--------------------------------------------------------------------------
    */

    const [lobbyInfo, setLobbyInfo] = useState({
        playerId: null,
        playerCount: 0,
        maxPlayers: 7,
        full: false,
    });


    /*
    |--------------------------------------------------------------------------
    | WebSocket
    |--------------------------------------------------------------------------
    */

    const {
        sendMessage,
        connected,
        connectionStatus,
    } = lobbyListener(
        lobbyId,
        null,
        setOtherPlayers,
        setLobbyInfo
    );


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
            },

            {
                id: "wall-bottom",
                x: 0,
                y: WORLD_H - WALL_THICKNESS,
                w: WORLD_W,
                h: WALL_THICKNESS,
            },

            {
                id: "wall-left",
                x: 0,
                y: 0,
                w: WALL_THICKNESS,
                h: WORLD_H,
            },

            {
                id: "wall-right",
                x: WORLD_W - WALL_THICKNESS,
                y: 0,
                w: WALL_THICKNESS,
                h: WORLD_H,
            },

            {
                id: "wall-mid",
                x: WORLD_W / 2 - 60,
                y: WORLD_H / 2 - 200,
                w: 120,
                h: 140,
            },

            {
                id: "wall-north",
                x: WORLD_W / 2 - 300,
                y: WORLD_H / 2 - 400,
                w: 200,
                h: 30,
            },

            {
                id: "wall-south",
                x: WORLD_W / 2 + 100,
                y: WORLD_H / 2 + 250,
                w: 200,
                h: 30,
            },
        ],
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Interactable
    |--------------------------------------------------------------------------
    */

    const interactable = useMemo(
        () => ({
            id: "orb",
            x: WORLD_W / 2 + 300,
            y: WORLD_H / 2 + 100,
            w: 28,
            h: 28,
        }),
        []
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
        ],
        [
            walls,
            otherPlayers,
            interactable,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Player Movement
    |--------------------------------------------------------------------------
    */

    const handlePositionChange = useCallback(
        (next) => {

            setPlayerRect(next);

            if (!userId) {
                return;
            }

            sendMessage({
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
    | Interaction
    |--------------------------------------------------------------------------
    */

    const handleInteract = useCallback(() => {

        setMessage((current) =>
            current
                ? null
                : "The orb hums quietly. You feel slightly braver."
        );

    }, []);


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


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 font-mono">

            {/* ------------------------------------------------------------- */}
            {/* Lobby Information */}
            {/* ------------------------------------------------------------- */}

            <div className="absolute top-4 z-10 flex flex-col items-center gap-1 text-xs uppercase tracking-wide">

                <div className="text-slate-400">
                    WASD / Arrows to move · E to interact
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

            </div>


            {/* ------------------------------------------------------------- */}
            {/* Game World */}
            {/* ------------------------------------------------------------- */}

            <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,_#1b1f2a,_#0a0c10)]">

                <div
                    className="absolute left-0 top-0"
                    style={{
                        width: WORLD_W,
                        height: WORLD_H,
                        transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
                    }}
                >

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
                        />
                    ))}


                    {/* ----------------------------------------------------- */}
                    {/* Other Players */}
                    {/* ----------------------------------------------------- */}

                    {otherPlayers
                        .filter(
                            (player) =>
                                String(player.user_id) !==
                                String(userId)
                        )
                        .map((player) => (
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
                    {/* Interactable */}
                    {/* ----------------------------------------------------- */}

                    <Interactable
                        x={interactable.x}
                        y={interactable.y}
                        w={interactable.w}
                        h={interactable.h}
                        player={playerRect}
                        onInteract={handleInteract}
                    />


                    {/* ----------------------------------------------------- */}
                    {/* Local Player */}
                    {/* ----------------------------------------------------- */}

                    <Player
                        initialX={WORLD_W / 2}
                        initialY={WORLD_H / 2}
                        size={26}
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
            {/* Interaction Message */}
            {/* ------------------------------------------------------------- */}

            {message && (
                <div className="absolute bottom-6 z-10 max-w-md text-center text-sm text-slate-300">
                    {message}
                </div>
            )}

        </div>
    );
}
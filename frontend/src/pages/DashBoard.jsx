import { useEffect, useState } from "react";

import LobbyForm from "../components/LobbyForm";
import LobbyList from "../components/LobbyList";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";


export default function DashBoard() {

    const [lobbies, setLobbies] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Get Access Token
    |--------------------------------------------------------------------------
    */

    const getToken = () => {

        let token =
            localStorage.getItem("token");

        if (!token) {

            const authTokens =
                localStorage.getItem("authTokens");

            if (authTokens) {

                try {

                    const parsed =
                        JSON.parse(authTokens);

                    token = parsed.access;

                } catch (error) {

                    console.error(
                        "Invalid authTokens:",
                        error
                    );
                }
            }
        }

        return token;
    };


    /*
    |--------------------------------------------------------------------------
    | Get Lobbies
    |--------------------------------------------------------------------------
    */

    const fetchLobbies = async () => {

        setLoading(true);
        setError(null);

        try {

            const token = getToken();

            const response = await fetch(
                `${API_URL}lobbies/`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load lobbies."
                );
            }

            setLobbies(data);

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchLobbies();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Lobby Created
    |--------------------------------------------------------------------------
    */

    const handleLobbyCreated = (lobby) => {

        setLobbies((prev) => [
            lobby,
            ...prev,
        ]);

    };


    /*
    |--------------------------------------------------------------------------
    | Lobby Deleted
    |--------------------------------------------------------------------------
    */

    const handleLobbyDeleted = (lobbyId) => {

        setLobbies((prev) =>
            prev.filter(
                (lobby) =>
                    lobby.id !== lobbyId
            )
        );

    };


    return (
        <div className="min-h-screen bg-neutral-950 p-6 font-mono text-white">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Game Dashboard
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Create or join a multiplayer lobby.
                    </p>

                </div>


                {/* Create Lobby */}

                <div className="mb-8">

                    <LobbyForm
                        onCreated={
                            handleLobbyCreated
                        }
                    />

                </div>


                {/* Error */}

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError(null)
                            }
                            className="ml-4 hover:text-white"
                        >
                            ✕
                        </button>

                    </div>
                )}


                {/* Lobby List */}

                <LobbyList
                    lobbies={lobbies}
                    loading={loading}
                    onDeleted={
                        handleLobbyDeleted
                    }
                    onRefresh={
                        fetchLobbies
                    }
                />

            </div>

        </div>
    );
}
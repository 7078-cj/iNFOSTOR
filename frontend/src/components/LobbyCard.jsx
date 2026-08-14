import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PlayerAppearancePicker from "./PlayerAppearancePicker";
import {
    getStoredPlayerColor,
    storePlayerColor,
} from "../data/playerAppearance";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";


export default function LobbyCard({
    lobby,
    onDeleted,
}) {

    const navigate =
        useNavigate();

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [showJoinPanel, setShowJoinPanel] =
        useState(false);

    const [selectedColor, setSelectedColor] = useState(
        getStoredPlayerColor
    );


    /*
    |--------------------------------------------------------------------------
    | Get Token
    |--------------------------------------------------------------------------
    */

    const getToken = () => {

        let token =
            localStorage.getItem("token");


        if (!token) {

            const authTokens =
                localStorage.getItem(
                    "authTokens"
                );

            if (authTokens) {

                try {

                    const parsed =
                        JSON.parse(authTokens);

                    token = parsed.access;

                } catch {
                    return null;
                }
            }
        }

        return token;
    };


    /*
    |--------------------------------------------------------------------------
    | Join
    |--------------------------------------------------------------------------
    */

    const handleJoin = () => {
        storePlayerColor(selectedColor);
        navigate(`/game/${lobby.id}`);
    };


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                `Delete "${lobby.name}"?`
            );


        if (!confirmed) {
            return;
        }


        setDeleting(true);
        setError(null);


        try {

            const token =
                getToken();


            const response =
                await fetch(
                    `${API_URL}lobbies/${lobby.id}/`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            if (!response.ok) {

                let data = {};

                try {
                    data =
                        await response.json();
                } catch {
                    // DELETE may return 204
                }


                throw new Error(
                    data.detail ||
                    "Failed to delete lobby."
                );
            }


            onDeleted?.(
                lobby.id
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setDeleting(false);
        }
    };


    return (
        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5 transition hover:border-white/20">

            {/* Lobby Information */}

            <div className="mb-5">

                <h3 className="truncate text-lg font-semibold">
                    {lobby.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Lobby #{lobby.id}
                </p>


                {lobby.created_at && (
                    <p className="mt-2 text-xs text-slate-600">
                        Created{" "}
                        {new Date(
                            lobby.created_at
                        ).toLocaleString()}
                    </p>
                )}

            </div>


            {/* Error */}

            {error && (
                <div className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {error}
                </div>
            )}


            {/* Join / appearance */}

            {showJoinPanel ? (
                <div className="space-y-4">
                    <PlayerAppearancePicker
                        value={selectedColor}
                        onChange={setSelectedColor}
                        compact
                        label="Pick your look"
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleJoin}
                            className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-200"
                        >
                            Enter Lobby
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowJoinPanel(false)}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowJoinPanel(true)}
                        className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-200"
                    >
                        Join Lobby
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting
                            ? "..."
                            : "Delete"}
                    </button>
                </div>
            )}

        </div>
    );
}
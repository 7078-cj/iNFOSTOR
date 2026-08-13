import { useState } from "react";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api";


export default function LobbyForm({
    onCreated,
}) {

    const [name, setName] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);


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


    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!name.trim()) {

            setError(
                "Lobby name is required."
            );

            return;
        }


        setLoading(true);
        setError(null);


        try {

            const token =
                getToken();


            const response =
                await fetch(
                    `${API_URL}lobbies/`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            name: name.trim(),
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    data.name?.[0] ||
                    "Failed to create lobby."
                );
            }


            // Give the newly-created lobby
            // back to Dashboard.

            onCreated?.(data);


            // Clear form.

            setName("");

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/10 bg-neutral-900 p-5"
        >

            <h2 className="mb-4 text-lg font-semibold">
                Create Lobby
            </h2>


            <div className="flex flex-col gap-3 sm:flex-row">

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }
                    placeholder="Enter lobby name"
                    disabled={loading}
                    className="flex-1 rounded-lg border border-white/10 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
                />


                <button
                    type="submit"
                    disabled={
                        loading ||
                        !name.trim()
                    }
                    className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Creating..."
                        : "Create Lobby"}
                </button>

            </div>


            {error && (
                <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                </div>
            )}

        </form>
    );
}
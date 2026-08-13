import LobbyCard from "./LobbyCard";


export default function LobbyList({
    lobbies,
    loading,
    onDeleted,
    onRefresh,
}) {

    return (
        <div>

            {/* Header */}

            <div className="mb-4 flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold">
                        Available Lobbies
                    </h2>

                    <p className="text-sm text-slate-500">
                        {lobbies.length}{" "}
                        {lobbies.length === 1
                            ? "lobby"
                            : "lobbies"}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Loading..."
                        : "Refresh"}
                </button>

            </div>


            {/* Loading */}

            {loading && (
                <div className="rounded-xl border border-white/10 bg-neutral-900 p-10 text-center text-slate-500">
                    Loading lobbies...
                </div>
            )}


            {/* Empty */}

            {!loading &&
                lobbies.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900 p-10 text-center">

                        <p className="text-lg text-slate-300">
                            No lobbies available
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Create a lobby to start
                            playing.
                        </p>

                    </div>
                )}


            {/* Lobby Cards */}

            {!loading &&
                lobbies.length > 0 && (

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {lobbies.map((lobby) => (

                            <LobbyCard
                                key={lobby.id}
                                lobby={lobby}
                                onDeleted={onDeleted}
                            />

                        ))}

                    </div>

                )}

        </div>
    );
}
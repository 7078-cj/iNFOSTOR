/** Small CSS art sprites rendered on the game map for each source type. */

export function TVSprite({ active = false }) {
    return (
        <div
            className={`relative h-full w-full ${active ? "animate-pulse" : ""}`}
        >
            <div className="absolute inset-x-1 top-0 h-[72%] rounded-sm border-2 border-neutral-600 bg-neutral-900 shadow-inner">
                <div
                    className={`absolute inset-1 rounded-sm ${
                        active
                            ? "bg-gradient-to-br from-sky-900/80 to-blue-950"
                            : "bg-gradient-to-br from-neutral-800 to-neutral-950"
                    }`}
                >
                    {active && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />
                    )}
                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-red-600/80" />
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 h-[28%] w-[30%] -translate-x-1/2 rounded-b-sm bg-neutral-700" />
            <div className="absolute -top-1 left-1/2 h-1 w-[60%] -translate-x-1/2 rounded-full bg-neutral-500/50" />
        </div>
    );
}

export function LibrarySprite({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute bottom-0 left-0 right-0 h-[85%] rounded-sm border border-amber-900/60 bg-gradient-to-b from-amber-900 to-amber-950">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`absolute bottom-1 rounded-sm ${
                            active ? "shadow-[0_0_6px_rgba(251,191,36,0.4)]" : ""
                        }`}
                        style={{
                            left: `${8 + i * 22}%`,
                            width: "18%",
                            height: `${55 + (i % 2) * 15}%`,
                            backgroundColor: [
                                "#7c2d12",
                                "#92400e",
                                "#a16207",
                                "#854d0e",
                            ][i],
                        }}
                    />
                ))}
            </div>
            <div className="absolute left-1 top-0 text-[8px] font-bold text-amber-200/80">
                LIB
            </div>
        </div>
    );
}

export function ComputerSprite({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div
                className={`absolute inset-x-0 top-0 h-[68%] rounded-sm border-2 border-neutral-500 bg-neutral-800 ${
                    active ? "shadow-[0_0_10px_rgba(56,189,248,0.5)]" : ""
                }`}
            >
                <div className="absolute inset-1 rounded-sm bg-neutral-950">
                    <div className="flex gap-0.5 p-0.5">
                        <div className="h-1 w-1 rounded-full bg-red-500" />
                        <div className="h-1 w-1 rounded-full bg-yellow-500" />
                        <div className="h-1 w-1 rounded-full bg-green-500" />
                    </div>
                    {active && (
                        <div className="mx-1 mt-0.5 h-1 rounded bg-sky-500/40" />
                    )}
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 h-[8%] w-[50%] -translate-x-1/2 rounded-sm bg-neutral-600" />
            <div className="absolute bottom-[10%] left-1/2 h-[18%] w-[70%] -translate-x-1/2 rounded-sm border border-neutral-600 bg-neutral-700" />
        </div>
    );
}

export function RadioSprite({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div
                className={`absolute inset-0 rounded-md border-2 border-amber-950 bg-gradient-to-b from-amber-800 to-amber-950 ${
                    active ? "shadow-[0_0_10px_rgba(251,146,60,0.4)]" : ""
                }`}
            >
                <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full border border-neutral-600 bg-neutral-800">
                    <div className="absolute inset-0.5 grid grid-cols-3 gap-px">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-full bg-neutral-600"
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    <div className="h-2 w-2 rounded-full bg-neutral-900 ring-1 ring-amber-700" />
                    <div
                        className={`h-2 w-2 rounded-full ${
                            active ? "animate-pulse bg-red-500" : "bg-neutral-700"
                        }`}
                    />
                </div>
            </div>
            <div className="absolute -right-0.5 top-0 h-[80%] w-0.5 origin-bottom rotate-12 bg-neutral-500" />
        </div>
    );
}

export function BulletinSprite({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-sm border border-amber-950/80 bg-[#6b4f2a] shadow-inner">
                <div
                    className={`absolute left-1/2 top-1/2 w-[75%] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-sm border border-amber-200/20 bg-amber-50 p-1 ${
                        active ? "shadow-[0_0_8px_rgba(251,191,36,0.3)]" : ""
                    }`}
                >
                    <div className="space-y-0.5">
                        <div className="h-0.5 w-full bg-neutral-300" />
                        <div className="h-0.5 w-[80%] bg-neutral-300" />
                        <div className="h-0.5 w-[90%] bg-neutral-300" />
                    </div>
                </div>
                {["tl", "tr", "bl", "br"].map((corner) => (
                    <div
                        key={corner}
                        className={`absolute h-1.5 w-1.5 rounded-full bg-red-700 shadow-sm ${
                            corner === "tl"
                                ? "left-2 top-3"
                                : corner === "tr"
                                  ? "right-2 top-2"
                                  : corner === "bl"
                                    ? "left-3 bottom-3"
                                    : "right-3 bottom-2"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export function NewsDeskSprite({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute bottom-0 left-0 right-0 h-[40%] rounded-sm bg-neutral-700" />
            <div
                className={`absolute inset-x-1 top-0 h-[55%] rounded-sm border border-neutral-500 bg-neutral-800 ${
                    active ? "shadow-[0_0_8px_rgba(239,68,68,0.4)]" : ""
                }`}
            >
                <div className="absolute left-1 top-1 rounded bg-red-700 px-1 text-[6px] font-bold text-white">
                    NEWS
                </div>
            </div>
        </div>
    );
}

export function getSpriteForObject(objectId, active = false) {
    if (objectId === "tv") return <TVSprite active={active} />;
    if (objectId === "library") return <LibrarySprite active={active} />;
    if (objectId === "computer" || objectId === "archive-computer")
        return <ComputerSprite active={active} />;
    if (objectId === "radio" || objectId === "second-radio")
        return <RadioSprite active={active} />;
    if (objectId === "bulletin") return <BulletinSprite active={active} />;
    if (objectId === "newsdesk") return <NewsDeskSprite active={active} />;

    return null;
}

import {
    PLAYER_COLORS,
    getPlayerColor,
} from "../data/playerAppearance";

export default function PlayerAppearancePicker({
    value,
    onChange,
    compact = false,
    label = "Choose your color",
}) {
    return (
        <div className={compact ? "space-y-2" : "space-y-3"}>
            <p
                className={`font-medium uppercase tracking-wide text-slate-400 ${
                    compact ? "text-[10px]" : "text-xs"
                }`}
            >
                {label}
            </p>

            <div
                className={`grid gap-2 ${
                    compact ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-8"
                }`}
            >
                {PLAYER_COLORS.map((color) => {
                    const selected = value === color.id;

                    return (
                        <button
                            key={color.id}
                            type="button"
                            onClick={() => onChange(color.id)}
                            title={color.label}
                            className={`group flex flex-col items-center gap-1 rounded-lg border p-1.5 transition ${
                                selected
                                    ? "border-white bg-white/10"
                                    : "border-white/10 hover:border-white/30 hover:bg-white/5"
                            }`}
                        >
                            <div
                                className={`h-7 w-7 rounded-md ${color.bodyClass} ${color.glowClass} ${
                                    selected ? "ring-2 ring-white/80" : ""
                                }`}
                            />
                            {!compact && (
                                <span className="text-[9px] text-slate-500 group-hover:text-slate-300">
                                    {color.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-[10px] text-slate-600">
                Preview:{" "}
                <span
                    className={`inline-block h-3 w-3 rounded-sm align-middle ${getPlayerColor(value).bodyClass}`}
                />{" "}
                {getPlayerColor(value).label}
            </p>
        </div>
    );
}

export default function OtherPlayer({
    x,
    y,
    w = 26,
    h = 26,
    z = 0,
    name,
    color = "bg-amber-400",
    asset = null,
    assetClassName = "",
}) {
    return (
        <div
            className="absolute"
            style={{
                left: x,
                top: y,
                width: w,
                height: h,
                zIndex: z,
            }}
        >
            {asset ? (
                <img
                    src={asset}
                    alt={name || "Player"}
                    draggable={false}
                    className={`h-full w-full object-contain ${assetClassName}`}
                />
            ) : (
                <div
                    className={`h-full w-full rounded-md ${color} shadow-[0_0_12px_3px_rgba(0,0,0,0.35)]`}
                />
            )}

            {name && (
                <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-300"
                    style={{ zIndex: z + 1 }}
                >
                    {name}
                </div>
            )}
        </div>
    );
}
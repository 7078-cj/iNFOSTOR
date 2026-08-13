export default function Wall({
    x,
    y,
    w,
    h,
    z = 1,
    variant = "interior",
    asset = null,
    assetClassName = "",
}) {
    const isHorizontal = w >= h;

    const variants = {
        boundary: {
            body: "from-slate-800 via-slate-700 to-slate-800",
            edge: "border-slate-500/40",
            shadow: "shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]",
        },
        interior: {
            body: "from-neutral-600 via-neutral-700 to-neutral-800",
            edge: "border-neutral-500/30",
            shadow: "shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]",
        },
    };

    const style = variants[variant] || variants.interior;

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
                    alt=""
                    draggable={false}
                    className={`h-full w-full object-cover ${assetClassName}`}
                />
            ) : (
                <div
                    className={`relative h-full w-full overflow-hidden rounded-[2px] border bg-gradient-to-br ${style.body} ${style.edge} ${style.shadow}`}
                >
                    {/* Top/left highlight for depth */}
                    <div
                        className={`absolute bg-white/10 ${
                            isHorizontal
                                ? "left-0 right-0 top-0 h-[3px]"
                                : "bottom-0 left-0 top-0 w-[3px]"
                        }`}
                    />
                    {/* Bottom/right shadow edge */}
                    <div
                        className={`absolute bg-black/25 ${
                            isHorizontal
                                ? "bottom-0 left-0 right-0 h-[4px]"
                                : "bottom-0 right-0 top-0 w-[4px]"
                        }`}
                    />
                </div>
            )}
        </div>
    );
}

export default function Wall({
    x,
    y,
    w,
    h,
    z = 0,
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
                    alt=""
                    draggable={false}
                    className={`h-full w-full object-cover ${assetClassName}`}
                />
            ) : (
                <div className="h-full w-full rounded-sm border border-slate-600 bg-slate-700" />
            )}
        </div>
    );
}
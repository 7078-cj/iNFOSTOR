import {
    ChallengeBanner,
    CloseButton,
    LogEvidenceButton,
} from "./shared";

export default function TVView({
    title,
    text,
    objectLabel,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border-4 border-neutral-700 bg-neutral-900 shadow-2xl">
            {/* TV bezel */}
            <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-4 py-2">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Live
                    </span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                    {objectLabel}
                </span>
                <CloseButton onClose={onClose} />
            </div>

            <div className="p-4">
                <ChallengeBanner
                    challenge={challenge}
                    relevantToPlayer={relevantToPlayer}
                />

                {/* CRT screen */}
                <div className="relative overflow-hidden rounded-lg border-[6px] border-neutral-800 bg-black shadow-inner">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.18)_2px,rgba(0,0,0,0.18)_4px)] pointer-events-none z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)] pointer-events-none z-10" />

                    <div className="relative min-h-[200px] bg-gradient-to-br from-slate-900 via-blue-950 to-black p-4">
                        <div className="mb-3 inline-block border-l-4 border-red-600 bg-red-950/60 px-3 py-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-red-300">
                                Breaking
                            </span>
                        </div>

                        <h3 className="mb-3 font-mono text-sm font-bold uppercase tracking-wide text-sky-200">
                            {title}
                        </h3>

                        <p className="font-mono text-sm leading-relaxed text-green-300/90">
                            {text}
                        </p>

                        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                            <div className="h-1 flex-1 overflow-hidden bg-neutral-800">
                                <div className="h-full w-1/3 animate-pulse bg-red-600" />
                            </div>
                            <span className="text-[10px] text-slate-500">
                                NEWS TICKER
                            </span>
                        </div>
                    </div>
                </div>

                <LogEvidenceButton
                    label="Log broadcast as evidence"
                    variant="sky"
                    onClick={() => {
                        onSubmitEvidence({ source: "tv", note: text });
                        onClose();
                    }}
                />
            </div>

            {/* TV stand */}
            <div className="mx-auto mb-2 h-3 w-24 rounded-b-lg bg-neutral-700" />
        </div>
    );
}

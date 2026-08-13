import {
    ChallengeBanner,
    CloseButton,
    LogEvidenceButton,
} from "./shared";

export default function RadioView({
    title,
    text,
    objectLabel,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-amber-950 bg-gradient-to-b from-amber-900 to-amber-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-950/80 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-950 bg-amber-800">
                        <div className="grid grid-cols-3 gap-px p-1">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-1 w-1 rounded-full bg-amber-950/60"
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                            {objectLabel}
                        </div>
                        <div className="text-[10px] text-amber-300/70">
                            98.5 FM · Drive-Time
                        </div>
                    </div>
                </div>
                <CloseButton onClose={onClose} />
            </div>

            <div className="p-4">
                <ChallengeBanner
                    challenge={challenge}
                    relevantToPlayer={relevantToPlayer}
                />

                {/* Tuning dial */}
                <div className="mb-4 flex items-center gap-4 rounded-xl border border-amber-950/60 bg-amber-950/40 p-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-full border-4 border-amber-800 bg-gradient-to-br from-amber-700 to-amber-900 shadow-inner">
                        <div className="absolute left-1/2 top-2 h-4 w-0.5 -translate-x-1/2 rounded bg-amber-200" />
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-amber-200">
                            ON
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="mb-1 text-[10px] uppercase tracking-wider text-amber-400/80">
                            Now playing
                        </div>
                        <div className="text-sm font-semibold text-amber-100">
                            {title}
                        </div>
                        <div className="mt-2 flex h-4 items-end gap-0.5">
                            {[3, 5, 2, 6, 4, 7, 3, 5, 4].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1 animate-pulse rounded-t bg-amber-400/70"
                                    style={{
                                        height: `${h * 3}px`,
                                        animationDelay: `${i * 80}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        <span className="text-[9px] font-bold text-red-400">
                            AIR
                        </span>
                    </div>
                </div>

                {/* Host transcript */}
                <div className="relative rounded-xl border border-amber-800/50 bg-amber-950/30 p-4">
                    <div className="absolute -left-1 top-4 h-3 w-3 rotate-45 border-b border-l border-amber-800/50 bg-amber-950/30" />
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Host says:
                    </div>
                    <p className="text-sm italic leading-relaxed text-amber-100/90">
                        &ldquo;{text}&rdquo;
                    </p>
                </div>

                <LogEvidenceButton
                    label="Log radio segment as evidence"
                    variant="amber"
                    onClick={() => {
                        onSubmitEvidence({ source: "radio", note: text });
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}

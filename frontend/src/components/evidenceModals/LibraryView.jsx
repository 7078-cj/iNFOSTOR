import {
    ChallengeBanner,
    CloseButton,
    LogEvidenceButton,
} from "./shared";

export default function LibraryView({
    title,
    text,
    objectLabel,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-amber-900/50 bg-gradient-to-b from-amber-950 to-neutral-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-900/40 bg-amber-950/80 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">📚</span>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                            {objectLabel}
                        </div>
                        <div className="text-[10px] text-amber-400/60">
                            Reference materials
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

                <div className="relative rounded-lg border border-amber-800/30 bg-amber-50 shadow-xl">
                    <div className="absolute inset-y-3 left-1/2 w-px bg-amber-200/80" />
                    <div className="absolute -right-1 top-8 h-16 w-3 rounded-r-sm bg-gradient-to-r from-red-800 to-red-900 shadow-md" />

                    <div className="p-5">
                        <div className="mb-3 border-b border-amber-300 pb-2">
                            <h3 className="font-serif text-base font-bold text-amber-950">
                                {title}
                            </h3>
                        </div>
                        <p className="font-serif text-sm leading-relaxed text-amber-900/90">
                            {text}
                        </p>
                        <div className="mt-4 text-right text-[10px] italic text-amber-700/60">
                            — Municipal reference archive
                        </div>
                    </div>
                </div>

                <div className="mt-3 rounded-lg border border-amber-900/30 bg-amber-950/40 px-3 py-2 text-[11px] text-amber-300/70">
                    Tip: Library sources tend to be neutral and factual. Check
                    whether the claim matches official reference material.
                </div>

                <LogEvidenceButton
                    label="Log reference passage as evidence"
                    variant="amber"
                    onClick={() => {
                        onSubmitEvidence({ source: "library", note: text });
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}

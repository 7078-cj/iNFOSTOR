import {
    ChallengeBanner,
    CloseButton,
    LogEvidenceButton,
} from "./shared";

export default function NewsDeskView({
    title,
    text,
    objectLabel,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-600 bg-neutral-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        News
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        {objectLabel}
                    </span>
                </div>
                <CloseButton onClose={onClose} />
            </div>

            <div className="p-4">
                <ChallengeBanner
                    challenge={challenge}
                    relevantToPlayer={relevantToPlayer}
                />

                <div className="grid gap-3 sm:grid-cols-5">
                    {/* Desk monitor */}
                    <div className="sm:col-span-3">
                        <div className="overflow-hidden rounded-lg border-4 border-neutral-700 bg-black">
                            <div className="border-b border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] text-slate-500">
                                INTERNAL FEED — NOT FOR BROADCAST
                            </div>
                            <div className="min-h-[160px] bg-gradient-to-br from-slate-900 to-neutral-950 p-4">
                                <h3 className="mb-2 text-sm font-bold text-sky-300">
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-300">
                                    {text}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desk papers */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <div className="rotate-1 rounded border border-neutral-600 bg-neutral-100 p-2 shadow-md">
                            <div className="mb-1 text-[9px] font-bold uppercase text-neutral-600">
                                Wire copy
                            </div>
                            <div className="space-y-1">
                                <div className="h-1 w-full bg-neutral-300" />
                                <div className="h-1 w-4/5 bg-neutral-300" />
                            </div>
                        </div>
                        <div className="-rotate-2 rounded border border-neutral-600 bg-amber-50 p-2 shadow-md">
                            <div className="mb-1 text-[9px] font-bold uppercase text-amber-800">
                                Editor notes
                            </div>
                            <p className="text-[10px] text-amber-900/70">
                                Cross-check with official sources before
                                publishing.
                            </p>
                        </div>
                    </div>
                </div>

                <LogEvidenceButton
                    label="Log desk notes as evidence"
                    variant="sky"
                    onClick={() => {
                        onSubmitEvidence({ source: "newsdesk", note: text });
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}

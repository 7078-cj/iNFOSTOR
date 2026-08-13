import {
    ChallengeBanner,
    CloseButton,
    LogEvidenceButton,
} from "./shared";

export default function BulletinView({
    title,
    text,
    objectLabel,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-amber-950 shadow-2xl">
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: "#5c4033" }}
            >
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                        {objectLabel}
                    </div>
                    <div className="text-[10px] text-amber-200/60">
                        Official community postings
                    </div>
                </div>
                <CloseButton onClose={onClose} />
            </div>

            <div
                className="p-6"
                style={{
                    background:
                        "repeating-linear-gradient(45deg, #6b4f2a 0px, #6b4f2a 4px, #5c4033 4px, #5c4033 8px)",
                }}
            >
                <ChallengeBanner
                    challenge={challenge}
                    relevantToPlayer={relevantToPlayer}
                />

                {/* Pinned notice */}
                <div className="relative mx-auto max-w-sm rotate-[-1deg]">
                    {[
                        "left-3 top-3",
                        "right-3 top-2",
                        "left-4 bottom-4",
                        "right-4 bottom-3",
                    ].map((pos) => (
                        <div
                            key={pos}
                            className={`absolute ${pos} h-3 w-3 rounded-full bg-red-700 shadow-md ring-1 ring-red-900`}
                        />
                    ))}

                    <div className="rounded-sm border border-amber-200/30 bg-amber-50 px-5 py-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between border-b-2 border-double border-amber-900/30 pb-2">
                            <span className="font-serif text-xs font-bold uppercase tracking-widest text-amber-900">
                                Official Notice
                            </span>
                            <span className="rounded border-2 border-red-800 px-2 py-0.5 text-[9px] font-bold uppercase text-red-800 opacity-70">
                                Verified
                            </span>
                        </div>

                        <h3 className="mb-3 font-serif text-base font-bold text-amber-950">
                            {title}
                        </h3>

                        <p className="font-serif text-sm leading-relaxed text-amber-900">
                            {text}
                        </p>

                        <div className="mt-4 border-t border-amber-300 pt-2 text-right text-[10px] text-amber-700">
                            Posted by Municipal Office
                        </div>
                    </div>
                </div>

                <LogEvidenceButton
                    label="Log notice as evidence"
                    variant="amber"
                    onClick={() => {
                        onSubmitEvidence({ source: "bulletin", note: text });
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}

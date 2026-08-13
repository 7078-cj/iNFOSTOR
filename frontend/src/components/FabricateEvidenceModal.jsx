import { useState } from "react";

const FABRICATE_TEMPLATES = [
    "Official sources confirm the announcement is accurate.",
    "Multiple witnesses reported the same details today.",
    "A verified government page posted the same message.",
    "Experts say there is no reason to doubt this claim.",
    "Local news already covered this — it checks out.",
];

export default function FabricateEvidenceModal({ open, onClose, onSubmit }) {
    const [note, setNote] = useState("");

    if (!open) {
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = note.trim();
        if (!trimmed) {
            return;
        }
        onSubmit(trimmed);
        setNote("");
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg border border-red-500/30 bg-neutral-900 p-5 text-slate-100 shadow-xl"
            >
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-red-400">
                        Fabricate Evidence
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded px-2 py-1 text-slate-400 hover:bg-white/10"
                    >
                        ✕
                    </button>
                </div>

                <p className="mb-3 text-xs leading-relaxed text-slate-400">
                    Plant misleading evidence in the shared log. Other players
                    will see it as normal evidence during the vote.
                </p>

                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a convincing but false claim…"
                    rows={4}
                    className="mb-3 w-full rounded border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-red-500"
                />

                <div className="mb-3 flex flex-wrap gap-1">
                    {FABRICATE_TEMPLATES.map((template) => (
                        <button
                            key={template}
                            type="button"
                            onClick={() => setNote(template)}
                            className="rounded bg-white/5 px-2 py-1 text-[10px] text-slate-400 hover:bg-white/10"
                        >
                            {template.slice(0, 32)}…
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={!note.trim()}
                    className="w-full rounded bg-red-800 px-3 py-2 text-sm font-medium uppercase tracking-wide hover:bg-red-700 disabled:opacity-40"
                >
                    Plant Evidence
                </button>
            </form>
        </div>
    );
}

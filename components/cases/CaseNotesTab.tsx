// components/cases/CaseNotesTab.tsx
"use client";

import React from "react";

export default function CaseNotesTab({
                                         notesDraft,
                                         setNotesDraft,
                                         savingNotes,
                                         onSaveNotes,
                                     }: {
    notesDraft: string;
    setNotesDraft: (v: string) => void;
    savingNotes: boolean;
    onSaveNotes: () => void;
}) {
    return (
        <div className="space-y-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Internal Case Notes
                </p>
                <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add confidential notes, strategy, or reminders related to this matter."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs min-h-[140px]"
                />
                <button
                    onClick={onSaveNotes}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-unicPurple text-white text-xs font-semibold px-4 py-2"
                >
                    {savingNotes ? "Saving…" : "Save Notes"}
                </button>
            </div>
            <p className="text-[11px] text-slate-400">
                Notes are visible only inside the UNIC admin workspace and are not
                shared with clients.
            </p>
        </div>
    );
}

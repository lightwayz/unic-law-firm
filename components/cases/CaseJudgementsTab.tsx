// components/cases/CaseJudgmentsTab.tsx
"use client";

import React from "react";
import { CaseJudgment } from "./CaseDetailsShell";

export default function CaseJudgementsTab({
                                             judgments,
                                         }: {
    judgments: CaseJudgment[];
}) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">
                Judgments Linked to This Case
            </p>
            {judgments.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                    No judgments linked yet. Once a matter is concluded, record the
                    judgment in the Judgments module and associate it with this case.
                </p>
            ) : (
                <div className="space-y-2 text-xs">
                    {judgments.map((j) => (
                        <div
                            key={j.id}
                            className="rounded-xl bg-white border border-slate-200 px-3 py-3"
                        >
                            <p className="font-semibold text-slate-900">{j.title}</p>
                            <p className="text-[11px] text-slate-500">
                                {j.court && `${j.court} · `}
                                {j.judge && `Hon. ${j.judge} · `}
                                {j.date ? j.date.toDate().toDateString() : "No date"}
                            </p>
                            {j.summary && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                    {j.summary}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

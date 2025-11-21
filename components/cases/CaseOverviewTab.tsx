// components/cases/CaseOverviewTab.tsx
"use client";

import React from "react";
import { FileText } from "lucide-react";
import { CaseItem, TimelineEntry, CaseJudgment, CaseDocument } from "./CaseDetailsShell";

export default function CaseOverviewTab({
                                            data,
                                            timeline,
                                            judgments,
                                        }: {
    data: CaseItem;
    timeline: TimelineEntry[];
    judgments: CaseJudgment[];
}) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                        Case Snapshot
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <InfoPair label="Client" value={data.client} />
                        <InfoPair label="Area of Law" value={data.area} />
                        <InfoPair
                            label="Documents"
                            value={`${data.documents.length} file${
                                data.documents.length === 1 ? "" : "s"
                            }`}
                        />
                        <InfoPair
                            label="Judgments Linked"
                            value={judgments.length || 0}
                        />
                    </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                        Latest Activity
                    </p>
                    {timeline.length === 0 ? (
                        <p className="text-[11px] text-slate-500">
                            No timeline entries yet. Add your first update in the Timeline tab.
                        </p>
                    ) : (
                        <ul className="space-y-2 text-[11px]">
                            {timeline.slice(0, 3).map((item) => (
                                <li key={item.id} className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-unicPurple" />
                                    <div>
                                        <p className="font-semibold text-slate-900 text-[12px]">
                                            {item.title}
                                        </p>
                                        <p className="text-slate-500">
                                            {item.type} ·{" "}
                                            {item.createdAt
                                                ? item.createdAt.toDate().toLocaleString()
                                                : "No date"}
                                            {item.createdBy ? ` · ${item.createdBy}` : ""}
                                        </p>
                                        {item.description && (
                                            <p className="text-slate-500 mt-0.5">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="rounded-2xl bg-gradient-to-br from-unicPurpleDark to-unicPurpleLite text-white p-4 shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 mb-2">
                        UNIC Workflow
                    </p>
                    <p className="text-sm">
                        This matter is synchronized across UNIC’s digital-first, paperless
                        workflow. Updates to documents, judgments, and activity reflect
                        in real time for the admin team.
                    </p>
                </div>

                {data.documents.length > 0 && (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2">
                            Key Documents
                        </p>
                        <div className="space-y-2">
                            {data.documents.slice(0, 3).map((doc: CaseDocument, i) => (
                                <a
                                    key={`${doc.url}-${i}`}
                                    href={doc.url}
                                    target="_blank"
                                    className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 px-3 py-3 hover:bg-slate-50"
                                >
                                    <div className="mt-0.5 rounded-lg bg-unicPurple/10 text-unicPurple p-1.5">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900">
                                            {doc.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoPair({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <p className="text-slate-500">{label}</p>
            <p className="font-semibold text-slate-900">{value}</p>
        </div>
    );
}

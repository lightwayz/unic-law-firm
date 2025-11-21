// components/cases/CaseDocumentsTab.tsx
// noinspection JSFunctionExpressionToArrowFunction

"use client";

import React from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { CaseDocument } from "./CaseDetailsShell";

export default function CaseDocumentsTab({
                                             documents,
                                             uploading,
                                             onFileChange,
                                             onDeleteDocument,
                                         }: {
    documents: CaseDocument[];
    uploading: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteDocument: (doc: CaseDocument) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Upload Case Document
                </p>
                <label className="inline-flex items-center gap-2 text-xs cursor-pointer text-unicPurple">
                    <Upload className="w-4 h-4" />
                    <span>Select file</span>
                    <input type="file" className="hidden" onChange={onFileChange} />
                </label>
                {uploading && (
                    <p className="text-[11px] text-slate-400 mt-1">Uploading…</p>
                )}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Files Attached to Case
                </p>
                {documents.length === 0 ? (
                    <p className="text-[11px] text-slate-500">
                        No documents yet. Upload pleadings, evidence, or correspondence for
                        quick access.
                    </p>
                ) : (
                    <div className="space-y-2 text-xs">
                        {documents.map((doc, idx) => (
                            <div
                                key={`${doc.url}-${idx}`}
                                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:bg-slate-50"
                            >
                                <div className="mt-0.5 rounded-lg bg-unicPurple/10 text-unicPurple p-1.5">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        className="font-semibold text-slate-900 hover:text-unicPurple"
                                    >
                                        {doc.name}
                                    </a>
                                    <p className="text-[11px] text-slate-500">
                                        {(doc.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                                        {doc.uploadedAt
                                            ? doc.uploadedAt.toDate().toLocaleString()
                                            : "Recently added"}
                                        {doc.uploadedBy ? ` · ${doc.uploadedBy}` : ""}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onDeleteDocument(doc)}
                                    className="mt-0.5 text-[11px] text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

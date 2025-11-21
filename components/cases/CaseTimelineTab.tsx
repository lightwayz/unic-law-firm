// components/cases/CaseTimelineTab.tsx
// noinspection JSFunctionExpressionToArrowFunction

"use client";

import React from "react";
import { TimelineEntry } from "./CaseDetailsShell";

export default function CaseTimelineTab({
                                            timeline,
                                            newTimelineTitle,
                                            setNewTimelineTitle,
                                            newTimelineType,
                                            setNewTimelineType,
                                            newTimelineDesc,
                                            setNewTimelineDesc,
                                            onAddTimeline,
                                        }: {
    timeline: TimelineEntry[];
    newTimelineTitle: string;
    setNewTimelineTitle: (v: string) => void;
    newTimelineType: string;
    setNewTimelineType: (v: string) => void;
    newTimelineDesc: string;
    setNewTimelineDesc: (v: string) => void;
    onAddTimeline: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Add Timeline Event
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                    <input
                        value={newTimelineTitle}
                        onChange={(e) => setNewTimelineTitle(e.target.value)}
                        placeholder="Event title (e.g., Hearing scheduled)"
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                    <select
                        value={newTimelineType}
                        onChange={(e) => setNewTimelineType(e.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                    >
                        <option>Status Update</option>
                        <option>Hearing</option>
                        <option>Filing</option>
                        <option>Meeting</option>
                        <option>Evidence</option>
                    </select>
                </div>
                <textarea
                    value={newTimelineDesc}
                    onChange={(e) => setNewTimelineDesc(e.target.value)}
                    placeholder="Optional description or notes"
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs min-h-[70px]"
                />
                <button
                    onClick={onAddTimeline}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-unicPurple text-white text-xs font-semibold px-4 py-2"
                >
                    Add Event
                </button>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Case Timeline
                </p>
                {timeline.length === 0 ? (
                    <p className="text-[11px] text-slate-500">
                        No events yet. Use the form above to log the first milestone for
                        this case.
                    </p>
                ) : (
                    <ul className="space-y-3 text-xs">
                        {timeline.map((item) => (
                            <li key={item.id} className="flex gap-3">
                                <div className="mt-1 h-4 w-4 rounded-full bg-unicPurple/10 flex items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-unicPurple" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{item.title}</p>
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
    );
}

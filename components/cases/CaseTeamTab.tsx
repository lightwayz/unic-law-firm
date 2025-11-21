// components/cases/CaseTeamTab.tsx
"use client";

import React from "react";
import { TeamMember } from "./CaseDetailsShell";

export default function CaseTeamTab({
                                        team,
                                        teamName,
                                        setTeamName,
                                        teamRole,
                                        setTeamRole,
                                        onAddMember,
                                        assignedLawyer,
                                    }: {
    team: TeamMember[];
    teamName: string;
    setTeamName: (v: string) => void;
    teamRole: string;
    setTeamRole: (v: string) => void;
    onAddMember: () => void;
    assignedLawyer?: string;
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Case Team & Roles
                </p>
                {assignedLawyer && (
                    <p className="text-[11px] text-slate-600 mb-2">
                        Lead Counsel:{" "}
                        <span className="font-semibold text-unicPurple">
              {assignedLawyer}
            </span>
                    </p>
                )}
                {team.length === 0 ? (
                    <p className="text-[11px] text-slate-500">
                        No additional team members added yet. Use the form below to add
                        supporting counsel or clerks.
                    </p>
                ) : (
                    <ul className="space-y-2 text-xs">
                        {team.map((m) => (
                            <li
                                key={m.id}
                                className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-2"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900">{m.name}</p>
                                    <p className="text-[11px] text-slate-500">{m.role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                    Add Team Member
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                    <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Name (e.g., Jane Doe)"
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                    <select
                        value={teamRole}
                        onChange={(e) => setTeamRole(e.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
                    >
                        <option>Counsel</option>
                        <option>Co-Counsel</option>
                        <option>Clerk</option>
                        <option>Paralegal</option>
                    </select>
                </div>
                <button
                    onClick={onAddMember}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-unicPurple text-white text-xs font-semibold px-4 py-2"
                >
                    Add to Team
                </button>
            </div>
        </div>
    );
}

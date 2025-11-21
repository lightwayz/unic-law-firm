// components/cases/CaseDetailsShell.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    collection,
    doc,
    onSnapshot,
    updateDoc,
    addDoc,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToVercelStorage, deleteVercelFile } from "@/lib/vstorage";
import {
    ArrowLeft,
    Gavel,
    Users,
} from "lucide-react";

import HeaderGlassPanel from "./HeaderGlassPanel";
import CaseOverviewTab from "./CaseOverviewTab";
import CaseTimelineTab from "./CaseTimelineTab";
import CaseDocumentsTab from "./CaseDocumentsTab";
import CaseJudgmentsTab from "./CaseJudgementsTab";
import CaseNotesTab from "./CaseNotesTab";
import CaseTeamTab from "./CaseTeamTab";

export type CaseStatus = "Open" | "In Review" | "Closed";

export async function createCase(data: {
    title: string;
    clientName: string;
    areaOfLaw: string;
}) {
    // Create the document
    const ref = await addDoc(collection(db, "cases"), {
        ...data,
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    // Store the actual Firestore ID inside the document
    await updateDoc(ref, { id: ref.id });

    return ref.id;
}

export interface CaseDocument {
    name: string;
    url: string;
    size: number;
    uploadedAt?: Timestamp;
    uploadedBy?: string;
}

export interface TimelineEntry {
    id: string;
    title: string;
    type: string;
    description?: string;
    createdAt?: Timestamp;
    createdBy?: string;
}

export interface CaseJudgment {
    id: string;
    title: string;
    court?: string;
    judge?: string;
    date?: Timestamp;
    summary?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
}

export interface CaseItem {
    id: string;
    title: string;
    client: string;
    area: string;
    status: CaseStatus;
    assignedLawyer?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    documents: CaseDocument[];
    notes?: string;
}

interface FirestoreCaseDoc {
    title?: string;
    clientName?: string;
    areaOfLaw?: string;
    status?: string; // "open" | "closed" | "review"
    lawyerAssigned?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    documents?: CaseDocument[];
    notes?: string;
}

const statusMap: Record<string, CaseStatus> = {
    open: "Open",
    review: "In Review",
    closed: "Closed",
};

type ActiveTab =
    | "overview"
    | "timeline"
    | "documents"
    | "judgments"
    | "notes"
    | "team";

export default function CaseDetailsShell({ caseId }: { caseId: string }) {
    const [data, setData] = useState<CaseItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [judgments, setJudgments] = useState<CaseJudgment[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);

    const [lawyer, setLawyer] = useState("");
    const [uploading, setUploading] = useState(false);

    const [newTimelineTitle, setNewTimelineTitle] = useState("");
    const [newTimelineType, setNewTimelineType] = useState("Status Update");
    const [newTimelineDesc, setNewTimelineDesc] = useState("");

    const [notesDraft, setNotesDraft] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);

    const [teamName, setTeamName] = useState("");
    const [teamRole, setTeamRole] = useState("Counsel");

    const caseRef = doc(db, "cases", caseId);

    // ========= Load main case =========
    useEffect(() => {
        const unsub = onSnapshot(
            caseRef,
            (snap) => {
                if (snap.exists()) {
                    const raw = snap.data() as FirestoreCaseDoc;

                    const mapped: CaseItem = {
                        id: snap.id,
                        title: raw.title ?? "Untitled Case",
                        client: raw.clientName ?? "Unknown Client",
                        area: raw.areaOfLaw ?? "General Law",
                        status: statusMap[raw.status ?? "open"] ?? "Open",
                        assignedLawyer: raw.lawyerAssigned,
                        createdAt: raw.createdAt,
                        updatedAt: raw.updatedAt,
                        documents: raw.documents ?? [],
                        notes: raw.notes ?? "",
                    };

                    setData(mapped);
                    setNotesDraft(mapped.notes ?? "");
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error loading case:", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [caseId, caseRef]);

    // ========= Timeline =========
    useEffect(() => {
        const ref = collection(db, "cases", caseId, "timeline");
        const q = query(ref, orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            const items: TimelineEntry[] = snap.docs.map((d) => {
                const dt = d.data();
                return {
                    id: d.id,
                    title: (dt.title as string) ?? "Event",
                    type: (dt.type as string) ?? "Status Update",
                    description: dt.description as string | undefined,
                    createdAt: dt.createdAt as Timestamp | undefined,
                    createdBy: dt.createdBy as string | undefined,
                };
            });
            setTimeline(items);
        });

        return () => unsub();
    }, [caseId]);

    // ========= Judgments for this case =========
    useEffect(() => {
        const ref = collection(db, "judgments");
        const q = query(ref, where("caseId", "==", caseId), orderBy("date", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            const list: CaseJudgment[] = snap.docs.map((d) => {
                const dt = d.data();
                return {
                    id: d.id,
                    title: (dt.title as string) ?? "Judgment",
                    court: dt.court as string | undefined,
                    judge: dt.judge as string | undefined,
                    date: dt.date as Timestamp | undefined,
                    summary: dt.summary as string | undefined,
                };
            });
            setJudgments(list);
        });

        return () => unsub();
    }, [caseId]);

    // ========= Case Team =========
    useEffect(() => {
        const ref = collection(db, "cases", caseId, "team");
        const q = query(ref, orderBy("createdAt", "asc"));

        const unsub = onSnapshot(q, (snap) => {
            const list: TeamMember[] = snap.docs.map((d) => {
                const dt = d.data();
                return {
                    id: d.id,
                    name: (dt.name as string) ?? "Unnamed",
                    role: (dt.role as string) ?? "Counsel",
                };
            });
            setTeam(list);
        });

        return () => unsub();
    }, [caseId]);

    // ========= Actions =========

    async function handleAssignLawyer() {
        if (!lawyer.trim() || !data) return;

        await updateDoc(caseRef, {
            lawyerAssigned: lawyer.trim(),
            updatedAt: serverTimestamp(),
        });

        setLawyer("");
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!data) return;

        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const res = await uploadToVercelStorage(
                file,
                `cases/${caseId}/${file.name}`
            );

            const updatedDocs: CaseDocument[] = [
                ...(data.documents ?? []),
                {
                    name: file.name,
                    url: res.url,
                    size: file.size,
                    uploadedAt: serverTimestamp() as unknown as Timestamp,
                    uploadedBy: "Admin",
                },
            ];

            await updateDoc(caseRef, {
                documents: updatedDocs,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    }

    async function handleDeleteDocument(docItem: CaseDocument) {
        if (!data) return;

        try {
            await deleteVercelFile(docItem.url);

            const filtered = (data.documents ?? []).filter(
                (d) => d.url !== docItem.url
            );

            await updateDoc(caseRef, {
                documents: filtered,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    async function handleAddTimelineEntry() {
        if (!newTimelineTitle.trim()) return;

        const ref = collection(db, "cases", caseId, "timeline");
        await addDoc(ref, {
            title: newTimelineTitle.trim(),
            type: newTimelineType,
            description: newTimelineDesc.trim() || null,
            createdAt: serverTimestamp(),
            createdBy: "Admin",
        });

        setNewTimelineTitle("");
        setNewTimelineDesc("");
    }

    async function handleSaveNotes() {
        if (!data) return;
        setSavingNotes(true);

        try {
            await updateDoc(caseRef, {
                notes: notesDraft,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Failed to save notes:", err);
        } finally {
            setSavingNotes(false);
        }
    }

    async function handleAddTeamMember() {
        if (!teamName.trim()) return;

        const ref = collection(db, "cases", caseId, "team");
        await addDoc(ref, {
            name: teamName.trim(),
            role: teamRole,
            createdAt: serverTimestamp(),
        });

        setTeamName("");
        setTeamRole("Counsel");
    }

    // ========= Render =========

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <p className="text-sm text-slate-500">Loading case details…</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <p className="text-sm text-red-600">Case not found.</p>
            </div>
        );
    }

    const tabs: { id: ActiveTab; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "timeline", label: "Timeline" },
        { id: "documents", label: "Documents" },
        { id: "judgments", label: "Judgments" },
        { id: "notes", label: "Notes" },
        { id: "team", label: "Team" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4 sm:px-6 lg:px-8 py-8">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Backlink */}
                <Link
                    href="/admin/cases"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600 hover:text-unicPurple transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cases
                </Link>

                {/* Futuristic Header */}
                <HeaderGlassPanel
                    title={data.title}
                    subtitle={`${data.client} • ${data.area}`}
                    stats={[
                        { label: "Status", value: data.status },
                        { label: "Documents", value: data.documents.length },
                        {
                            label: "Created",
                            value: data.createdAt
                                ? data.createdAt.toDate().toDateString()
                                : "N/A",
                        },
                        {
                            label: "Updated",
                            value: data.updatedAt
                                ? data.updatedAt.toDate().toDateString()
                                : "N/A",
                        },
                    ]}
                />

                {/* Primary action bar */}
                <section className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                            Assign Lawyer
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={lawyer}
                                onChange={(e) => setLawyer(e.target.value)}
                                placeholder="Enter lawyer name"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs sm:text-sm"
                            />
                            <button
                                onClick={handleAssignLawyer}
                                className="px-3 sm:px-4 py-2 rounded-xl bg-unicPurple text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-unicPurpleLite transition"
                            >
                                Assign
                            </button>
                        </div>
                        {data.assignedLawyer && (
                            <p className="text-[11px] text-slate-500 mt-1">
                                Lead Counsel:{" "}
                                <span className="font-semibold text-unicPurple">
                  {data.assignedLawyer}
                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 border border-slate-200">
                            <Gavel className="w-4 h-4 text-unicPurple" />
                            <span>Case Management</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 border border-slate-200">
                            <Users className="w-4 h-4 text-unicPurple" />
                            <span>Team & Counsel</span>
                        </div>
                    </div>
                </section>

                {/* Tabs + content */}
                <section className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 sm:p-5">
                    {/* Tab nav */}
                    <div className="mb-5">
                        <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                                        activeTab === tab.id
                                            ? "bg-unicPurple text-white shadow-md shadow-unicPurple/30"
                                            : "text-slate-600 hover:bg-white"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab panels */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-4"
                    >
                        {activeTab === "overview" && (
                            <CaseOverviewTab
                                data={data}
                                timeline={timeline}
                                judgments={judgments}
                            />
                        )}

                        {activeTab === "timeline" && (
                            <CaseTimelineTab
                                timeline={timeline}
                                newTimelineTitle={newTimelineTitle}
                                setNewTimelineTitle={setNewTimelineTitle}
                                newTimelineType={newTimelineType}
                                setNewTimelineType={setNewTimelineType}
                                newTimelineDesc={newTimelineDesc}
                                setNewTimelineDesc={setNewTimelineDesc}
                                onAddTimeline={handleAddTimelineEntry}
                            />
                        )}

                        {activeTab === "documents" && (
                            <CaseDocumentsTab
                                documents={data.documents}
                                uploading={uploading}
                                onFileChange={handleFileUpload}
                                onDeleteDocument={handleDeleteDocument}
                            />
                        )}

                        {activeTab === "judgments" && (
                            <CaseJudgmentsTab judgments={judgments} />
                        )}

                        {activeTab === "notes" && (
                            <CaseNotesTab
                                notesDraft={notesDraft}
                                setNotesDraft={setNotesDraft}
                                savingNotes={savingNotes}
                                onSaveNotes={handleSaveNotes}
                            />
                        )}

                        {activeTab === "team" && (
                            <CaseTeamTab
                                team={team}
                                teamName={teamName}
                                setTeamName={setTeamName}
                                teamRole={teamRole}
                                setTeamRole={setTeamRole}
                                onAddMember={handleAddTeamMember}
                                assignedLawyer={data.assignedLawyer}
                            />
                        )}
                    </motion.div>
                </section>
            </div>
        </div>
    );
}

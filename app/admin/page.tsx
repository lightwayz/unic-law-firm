// noinspection JSIgnoredPromiseFromCall

"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    getCountFromServer,
    onSnapshot,
    orderBy,
    limit,
    query,
    Timestamp
} from "firebase/firestore";

import { motion } from "framer-motion";
import {
    Gavel,
    Scale,
    BookOpen,
    FileText,
    Users,
    Clock,
    Upload,
    CheckCircle2,
    FolderOpen,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

/* ========================= */
/* TYPES                     */
/* ========================= */

type CaseStatus = "Open" | "In Review" | "Closed";

interface CaseItem {
    id: string;
    title: string;
    client: string;
    area: string;
    status: CaseStatus;
    opened?: string;
}

interface UploadItem {
    id: string;
    title: string;
    category: string;
    size: string;
    uploadedBy: string;
    createdAt?: Timestamp;
    url?: string;
}

interface StatsData {
    cases: number;
    clients: number;
    judgments: number;
    docs: number;
}

/* ========================= */
/* ANIMATION                 */
/* ========================= */

const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
};

/* ========================= */
/* MAIN COMPONENT            */
/* ========================= */

export default function AdminDashboardPage() {
    const [statsData, setStatsData] = useState<StatsData>({
        cases: 0,
        clients: 0,
        judgments: 0,
        docs: 0,
    });

    const [cases, setCases] = useState<CaseItem[]>([]);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [loadingCases, setLoadingCases] = useState(true);

    /* ========================= */
    /* FETCH UPLOADS             */
    /* ========================= */

    useEffect(() => {
        const q = query(
            collection(db, "library"),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const unsub = onSnapshot(q, (snap) => {
            const items: UploadItem[] = snap.docs.map((doc) => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    title: data.title ?? "Untitled",
                    category: data.category ?? "General",
                    size: data.size ?? "Unknown",
                    uploadedBy: data.uploadedBy ?? "Unknown",
                    createdAt: data.createdAt,
                    url: data.url,
                };
            });
            setUploads(items);
        });

        return () => unsub();
    }, []);

    /* ========================= */
    /* FETCH STATS               */
    /* ========================= */

    useEffect(() => {
        async function loadStats() {
            try {
                const casesSnap = await getCountFromServer(collection(db, "cases"));
                const judgmentsSnap = await getCountFromServer(collection(db, "judgments"));
                const docsSnap = await getCountFromServer(collection(db, "library"));
                const usersSnap = await getCountFromServer(collection(db, "users"));

                setStatsData({
                    cases: casesSnap.data().count,
                    clients: usersSnap.data().count,
                    judgments: judgmentsSnap.data().count,
                    docs: docsSnap.data().count,
                });
            } catch (e) {
                console.error("Failed to load dashboard stats:", e);
            }
        }

        loadStats();
    }, []);

    /* ========================= */
    /* FETCH CASES               */
    /* ========================= */

    useEffect(() => {
        const q = query(
            collection(db, "cases"),
            orderBy("createdAt", "desc"),
            limit(6)
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const mapped: CaseItem[] = snap.docs.map((doc) => {
                    const data = doc.data() as any;

                    return {
                        id: doc.id,
                        title: data.title ?? "Untitled Case",
                        client: data.clientName ?? data.client ?? "Unknown Client",
                        area: data.areaOfLaw ?? data.area ?? "General Law",
                        status: (data.status as CaseStatus) ?? "Open",
                        opened: data.createdAt?.toDate?.().toDateString(),
                    };
                });

                setCases(mapped);
                setLoadingCases(false);
            },
            (err) => {
                console.error("Error loading cases:", err);
                setLoadingCases(false);
            }
        );

        return () => unsub();
    }, []);

    /* ========================= */
    /* COMPUTED STATS            */
    /* ========================= */

    const stats = [
        { label: "Total Cases", value: statsData.cases, tag: "Caseload", icon: Gavel, trend: "12%" },
        { label: "Active Clients", value: statsData.clients, tag: "Clients", icon: Users, trend: "5%" },
        { label: "Judgments Recorded", value: statsData.judgments, tag: "Outcomes", icon: Scale, trend: "8%" },
        { label: "Documents in Library", value: statsData.docs, tag: "Knowledge", icon: BookOpen, trend: "3%", unit: "files" },
    ];

    const casesToDisplay = cases.length ? cases : mockCases;

    /* ========================= */
    /* RENDER                    */
    /* ========================= */

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex gap-8">

                {/* SIDEBAR */}
                <AdminSidebar />

                {/* MAIN CONTENT */}
                <main className="flex-1 space-y-8">

                    {/* HEADER */}
                    <AdminHeader />

                    {/* STATS */}
                    <AdminStats stats={stats} />

                    {/* CASES + UPLOADS */}
                    <AdminCasesAndUploads
                        casesToDisplay={casesToDisplay}
                        loadingCases={loadingCases}
                        uploads={uploads}
                    />

                    {/* QUICK ACTIONS */}
                    <AdminQuickActions />

                </main>
            </div>
        </div>
    );
}

/* ========================= */
/* SUB COMPONENTS (clean)    */
/* ========================= */

function AdminSidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-64 rounded-3xl bg-white/80 backdrop-blur border border-slate-200 shadow-lg p-6 space-y-6">
            <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1">
                    Admin
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                    UNIC Control Center
                </h2>
            </div>

            <nav className="space-y-1 text-sm">
                <SidebarItem label="Overview" icon={<FolderOpen className="w-4 h-4" />} active />
                <SidebarItem label="Cases" icon={<Gavel className="w-4 h-4" />} />
                <SidebarItem label="Judgments" icon={<Scale className="w-4 h-4" />} />
                <SidebarItem label="Library" icon={<BookOpen className="w-4 h-4" />} />
                <SidebarItem label="Uploads" icon={<Upload className="w-4 h-4" />} />
                <SidebarItem label="Team" icon={<Users className="w-4 h-4" />} />
            </nav>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-unicPurpleDark to-unicPurpleLite text-white p-4 shadow-xl">
                <p className="text-xs font-semibold mb-1 uppercase tracking-[0.2em] opacity-70">
                    Status
                </p>
                <p className="text-sm font-medium">
                    All systems operational.
                    <span className="block text-xs opacity-80">Firebase · Storage · Auth</span>
                </p>
            </div>
        </aside>
    );
}

function SidebarItem({
                         label,
                         icon,
                         active,
                     }: {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
}) {
    return (
        <button
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[13px] font-medium transition ${
                active
                    ? "bg-unicPurple text-white shadow-md shadow-unicPurple/40"
                    : "text-slate-600 hover:bg-slate-100"
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function AdminHeader() {
    return (
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1">
                    Admin Dashboard
                </p>
                <h1 className="text-2xl md:text-3xl font-serif text-unicPurpleDark">
                    Welcome back, <span className="font-semibold">Admin</span>.
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Monitor cases, judgments, and documents across UNIC Law Firm.
                </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/file-case"
                    className="inline-flex items-center gap-2 rounded-full bg-unicPurple text-white px-4 py-2 text-sm font-semibold shadow-md shadow-unicPurple/30 hover:bg-unicPurpleLite transition"
                >
                    <Gavel className="w-4 h-4" />
                    New Case
                </Link>
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 rounded-full border border-unicPurple/40 text-unicPurple px-4 py-2 text-sm font-semibold hover:bg-unicPurple/5 transition"
                >
                    <Upload className="w-4 h-4" />
                    Upload Document
                </Link>
            </div>
        </section>
    );
}

function AdminStats({ stats }: { stats: any[] }) {
    return (
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    whileHover={{
                        y: -6,
                        rotateX: 3,
                        rotateY: -3,
                        boxShadow: "0 25px 40px rgba(79, 70, 229, 0.18)",
                    }}
                    className="relative rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-5 flex flex-col gap-3 cursor-pointer transform-gpu"
                >
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-unicPurple/10 text-unicPurple p-2">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              {stat.tag}
            </span>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                        <p className="text-2xl font-semibold text-slate-900">
                            {stat.value}
                            {stat.unit && (
                                <span className="text-xs text-slate-400 font-normal ml-1">
                  {stat.unit}
                </span>
                            )}
                        </p>
                    </div>

                    {stat.trend && (
                        <p className="text-xs text-emerald-600 font-medium">
                            ▲ {stat.trend} this week
                        </p>
                    )}
                </motion.div>
            ))}
        </section>
    );
}

function AdminCasesAndUploads({
                                  casesToDisplay,
                                  loadingCases,
                                  uploads,
                              }: {
    casesToDisplay: CaseItem[];
    loadingCases: boolean;
    uploads: UploadItem[];
}) {
    return (
        <section className="grid lg:grid-cols-3 gap-6 items-start">

            {/* CASES */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="lg:col-span-2 rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-serif text-slate-900">
                            Active Cases
                        </h2>
                        <p className="text-xs text-slate-500">
                            Latest cases across all practice areas.
                        </p>
                    </div>
                    <Link
                        href="/admin/cases"
                        className="text-xs font-semibold text-unicPurple hover:text-unicPurpleLite inline-flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {loadingCases && (
                        <p className="text-xs text-slate-500">Loading cases…</p>
                    )}

                    {casesToDisplay.map((c) => (
                        <div
                            key={c.id}
                            className="rounded-2xl border border-slate-200 px-4 py-3 flex flex-col md:flex-row
              md:items-center md:justify-between gap-2 bg-slate-50/60"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                                <p className="text-xs text-slate-500">
                                    {c.client} {c.client && c.area && "•"} {c.area}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                                {c.opened && (
                                    <span className="text-[11px] rounded-full bg-slate-100 text-slate-600 px-2 py-1">
                    Opened: {c.opened}
                  </span>
                                )}
                                <StatusChip status={c.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* UPLOADS */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
            >
                <div>
                    <h2 className="text-lg md:text-xl font-serif text-slate-900">
                        Recent Uploads
                    </h2>
                    <p className="text-xs text-slate-500">
                        Latest documents added to the UNIC library.
                    </p>
                </div>

                <div className="space-y-3 text-sm">
                    {uploads.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-start gap-3 rounded-2xl border border-slate-200 px-3 py-3 bg-slate-50/60"
                        >
                            <div className="mt-1 rounded-xl bg-unicPurple/10 text-unicPurple p-1.5">
                                <FileText className="w-4 h-4" />
                            </div>

                            <div>
                                <p className="font-medium text-slate-900">{doc.title}</p>
                                <p className="text-[11px] text-slate-500">
                                    {doc.category} • {doc.size}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Uploaded by {doc.uploadedBy} ·{" "}
                                    {doc.createdAt?.toDate().toLocaleString()}
                                </p>

                                {doc.url && (
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        className="text-[11px] text-unicPurple hover:text-unicPurpleLite"
                                    >
                                        Open file →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    href="/library"
                    className="mt-1 text-xs font-semibold text-unicPurple hover:text-unicPurpleLite inline-flex items-center gap-1"
                >
                    Go to full library
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </motion.div>

        </section>
    );
}

function AdminQuickActions() {
    return (
        <section className="grid md:grid-cols-3 gap-5">
            {quickActions.map((action, i) => (
                <motion.button
                    key={action.label}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.4, delay: 0.03 * i }}
                    whileHover={{
                        y: -4,
                        scale: 1.02,
                        boxShadow: "0 18px 30px rgba(15, 23, 42, 0.25)",
                    }}
                    className="group text-left rounded-3xl bg-gradient-to-br from-white via-slate-50
          to-slate-100 border border-slate-200 px-5 py-4 flex flex-col gap-2 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-unicPurple/10 text-unicPurple p-2">
                            <action.icon className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-unicPurple transition" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                </motion.button>
            ))}
        </section>
    );
}

function StatusChip({ status }: { status: CaseStatus }) {
    const base =
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold";

    if (status === "Open")
        return (
            <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}>
        <Clock className="w-3 h-3" />
        Open
      </span>
        );

    if (status === "In Review")
        return (
            <span className={`${base} bg-sky-50 text-sky-700 border border-sky-200`}>
        <Scale className="w-3 h-3" />
        In Review
      </span>
        );

    return (
        <span className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200`}>
      <CheckCircle2 className="w-3 h-3" />
      Closed
    </span>
    );
}

/* ========================= */
/* MOCK DATA                 */
/* ========================= */

const mockCases: CaseItem[] = [
    {
        id: "1",
        title: "ABC Ltd v. XYZ PLC",
        client: "ABC Ltd",
        area: "Civil & Commercial Litigation",
        status: "In Review",
        opened: "Jan 15",
    },
    {
        id: "2",
        title: "John Doe v. State",
        client: "John Doe",
        area: "Criminal Defense",
        status: "Open",
        opened: "Jan 20",
    },
    {
        id: "3",
        title: "Estate of A.B. v. C.D.",
        client: "Estate of A.B.",
        area: "Family Law",
        status: "Closed",
        opened: "Dec 03",
    },
];

const quickActions = [
    {
        label: "Create New Case File",
        desc: "Open a new matter and assign it to counsel.",
        icon: Gavel,
    },
    {
        label: "Record Judgment",
        desc: "Log a final decision and link related documents.",
        icon: Scale,
    },
    {
        label: "Upload Legal Resource",
        desc: "Add books, digests, and precedents to the library.",
        icon: Upload,
    },
];

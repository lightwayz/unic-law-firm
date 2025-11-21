"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {Gavel, ArrowRight, Scale, Clock, CheckCircle2} from "lucide-react";
import Link from "next/link";

type CaseStatus = "Open" | "In Review" | "Closed";

interface CaseItem {
    id: string;
    title: string;
    client: string;
    area: string;
    status: CaseStatus;
    createdAt?: Timestamp;
}

const cardVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
};

export default function CasesPage() {
    const [cases, setCases] = useState<CaseItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "cases"), orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snap) => {
            const mapped = snap.docs.map((doc) => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    title: data.title ?? "Untitled Case",
                    client: data.clientName ?? data.client ?? "Unknown Client",
                    area: data.areaOfLaw ?? data.area ?? "General Law",
                    status: (data.status as CaseStatus) ?? "Open",
                    createdAt: data.createdAt,
                };
            });
            setCases(mapped);
        });

        return () => unsub();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-6 max-w-6xl mx-auto">
            {/* Title */}
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
                    Admin · Case Management
                </p>
                <h1 className="text-3xl font-serif text-unicPurpleDark">
                    All Case Files
                </h1>
                <p className="text-sm text-slate-500">
                    View every case opened across the firm.
                </p>
            </div>

            {/* List */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cases.map((c, i) => (
                    <motion.div
                        key={c.id}
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="rounded-xl bg-unicPurple/10 text-unicPurple p-2">
                                <Gavel className="w-5 h-5" />
                            </div>

                            <StatusChip status={c.status} />
                        </div>

                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-slate-900">{c.title}</p>
                            <p className="text-xs text-slate-500">
                                {c.client} • {c.area}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {c.createdAt
                                    ? c.createdAt.toDate().toDateString()
                                    : "No date"}
                            </p>
                        </div>

                        <Link
                            href={`/admin/cases/${c.id}`}
                            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-unicPurple hover:text-unicPurpleLite"
                        >
                            View details
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ===== Status Tag Component ===== */

function StatusChip({ status }: { status: CaseStatus }) {
    const base =
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold";

    if (status === "Open")
        return (
            <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}>
        <Clock className="w-3 h-3" /> Open
      </span>
        );

    if (status === "In Review")
        return (
            <span className={`${base} bg-sky-50 text-sky-700 border border-sky-200`}>
        <Scale className="w-3 h-3" /> In Review
      </span>
        );

    return (
        <span
            className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200`}
        >
      <CheckCircle2 className="w-3 h-3" /> Closed
    </span>
    );
}

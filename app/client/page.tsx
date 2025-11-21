"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    orderBy,
    query,
    onSnapshot,
    where,
} from "firebase/firestore";
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Gavel,
    FileText,
    Upload,
    Clock,
    CheckCircle2,
    Scale,
    ArrowRight,
} from "lucide-react";

const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
};

export default function ClientDashboard() {
    const [myCases, setMyCases] = useState<any[]>([]);
    const [uploads, setUploads] = useState<any[]>([]);
    const userId = "demo-user"; // Replace with Firebase Auth user.uid

    // Load user cases
    useEffect(() => {
        const q = query(
            collection(db, "cases"),
            where("clientId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            setMyCases(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
    }, []);

    // Load user uploads
    useEffect(() => {
        const q = query(
            collection(db, "library"),
            where("uploadedBy", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            setUploads(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-12 max-w-6xl mx-auto">
            <motion.h1
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="text-3xl font-serif text-unicPurpleDark mb-6"
            >
                Welcome to Your Client Portal
            </motion.h1>

            {/* CASES */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="rounded-3xl bg-white shadow border border-slate-200 p-6 mb-10"
            >
                <h2 className="text-xl font-serif text-slate-800 mb-3">Your Cases</h2>

                <div className="space-y-3">
                    {myCases.map((c) => (
                        <div
                            key={c.id}
                            className="rounded-2xl border px-4 py-3 bg-slate-50 flex justify-between"
                        >
                            <div>
                                <p className="font-medium text-slate-900">{c.title}</p>
                                <p className="text-xs text-slate-500">{c.area}</p>
                            </div>
                            <StatusChip status={c.status} />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* DOCUMENTS */}
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="rounded-3xl bg-white shadow border border-slate-200 p-6"
            >
                <h2 className="text-xl font-serif text-slate-800 mb-3">Your Documents</h2>

                <div className="space-y-3">
                    {uploads.map((u) => (
                        <div
                            key={u.id}
                            className="flex gap-3 rounded-2xl border px-4 py-3 bg-slate-50"
                        >
                            <FileText className="text-unicPurple w-5 h-5 mt-1" />
                            <div>
                                <p className="font-medium">{u.title}</p>
                                <p className="text-xs text-slate-500">
                                    {u.category} • {u.size}
                                </p>
                                <a
                                    href={u.url}
                                    target="_blank"
                                    className="text-xs text-unicPurple mt-1 inline-block hover:underline"
                                >
                                    View Document <ArrowRight className="inline w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="mt-4 inline-flex items-center gap-2 bg-unicPurple text-white px-4 py-2 rounded-xl">
                    <Upload className="w-4 h-4" />
                    Upload New Document
                </button>
            </motion.div>
        </div>
    );
}

function StatusChip({ status }: { status: "Open" | "In Review" | "Closed" }) {
    const base =
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold";
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
        <span
            className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-200`}
        >
      <CheckCircle2 className="w-3 h-3" />
      Closed
    </span>
    );
}

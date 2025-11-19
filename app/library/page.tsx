"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import LibraryUpload from "@/components/LibraryUpload";

type LibraryItem = {
    id: string;
    title: string;
    fileName: string;
    url: string;
    createdAt?: Timestamp;
};

export default function LibraryPage() {
    const [items, setItems] = useState<LibraryItem[]>([]);

    useEffect(() => {
        const q = query(
            collection(db, "libraryItems"),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            const docs: LibraryItem[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as any),
            }));
            setItems(docs);
        });
        return () => unsub();
    }, []);

    return (
        <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">UNIC Library & Archive</h1>
                    <p className="text-slate-300 text-sm max-w-xl mt-2">
                        A centralized, paperless repository of UNIC Law Firm&apos;s books,
                        materials, and internal resources.
                    </p>
                </div>
            </div>

            {/* Upload block (can later be restricted to team roles only) */}
            <LibraryUpload />

            <section className="space-y-3">
                <h2 className="font-semibold">Available Materials</h2>
                {items.length === 0 && (
                    <p className="text-sm text-slate-400">No materials uploaded yet.</p>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                    {items.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-slate-800 rounded-xl p-4 hover:bg-slate-900/60"
                        >
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-400">{item.fileName}</p>
                            {item.createdAt && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Added{" "}
                                    {item.createdAt.toDate().toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            )}
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
}

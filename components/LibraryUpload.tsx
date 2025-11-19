"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function LibraryUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [progress, setProgress] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const handleUpload = () => {
        if (!file || !title) {
            setMessage("Please provide a title and select a file.");
            return;
        }

        const storageRef = ref(storage, `library/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snap) => {
                const p = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setProgress(p);
            },
            (err) => {
                console.error(err);
                setMessage("Upload failed. Check console for details.");
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                await addDoc(collection(db, "libraryItems"), {
                    title,
                    fileName: file.name,
                    url,
                    createdAt: serverTimestamp(),
                });
                setMessage("Uploaded successfully.");
                setTitle("");
                setFile(null);
                setProgress(null);
            }
        );
    };

    return (
        <div className="border border-slate-800 rounded-xl p-4 space-y-3 bg-slate-900/40">
            <h2 className="font-semibold mb-2">Upload to UNIC Library</h2>
            <input
                type="text"
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Book or material title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="file"
                accept="application/pdf"
                className="text-xs"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {progress !== null && (
                <p className="text-xs text-slate-400">Uploading… {progress}%</p>
            )}
            <button
                onClick={handleUpload}
                className="rounded bg-unicGold px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-yellow-400"
            >
                Upload
            </button>
            {message && <p className="text-xs text-slate-300">{message}</p>}
        </div>
    );
}

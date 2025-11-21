import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file") as File;
        const category = form.get("category") as string;
        const uploadedBy = form.get("uploadedBy") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Upload to Vercel Blob
        const blob = await put(`unic-library/${file.name}`, file, {
            access: "public",
        });

        // Save metadata to Firestore
        await addDoc(collection(db, "library"), {
            title: file.name,
            url: blob.url,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            category,
            uploadedBy,
            createdAt: serverTimestamp(),
        });

        return NextResponse.json({ url: blob.url }, { status: 200 });
    } catch (e) {
        console.error("Upload failed", e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

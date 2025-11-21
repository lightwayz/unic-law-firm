// lib/vstorage.ts
import { put, list, del } from "@vercel/blob";

// Upload a file (USED in admin case manager + library)
export async function uploadToVercelStorage(file: File, path?: string) {
    const response = await put(path || `unic/${file.name}`, file, {
        access: "public",
        contentType: file.type, // ensures correct PDF, JPG, DOCX metadata
    });
    return response;
}

// List files (WILL BE USED in Library Dashboard)
export async function listVercelFiles(prefix = "unic/") {
    return list({ prefix });
}

// Delete a file (WILL BE USED in: Case Details → Delete Document)
export async function deleteVercelFile(url: string) {
    return await del(url);
}

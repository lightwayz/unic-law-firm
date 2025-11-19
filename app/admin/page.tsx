export default function AdminPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 space-y-4">
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-slate-300 text-sm max-w-2xl">
                This area will be restricted to UNIC team members.
                From here, you&apos;ll be able to manage cases, judgments, users, and
                library materials.
            </p>
        </main>
    );
}

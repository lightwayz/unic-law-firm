export default function FileCasePage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 space-y-6">
            <h1 className="text-3xl font-semibold mb-2">File a Case</h1>
            <p className="text-slate-300 max-w-2xl">
                Here we will build a guided workflow where clients can choose case type,
                fill in details, and upload supporting documents directly into UNIC&apos;s
                paperless system.
            </p>
            {/* Later: add form with Firestore + Storage integration */}
        </main>
    );
}

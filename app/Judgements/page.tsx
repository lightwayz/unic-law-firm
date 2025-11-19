const mockJudgments = [
    {
        id: "1",
        title: "ABC Ltd v. XYZ Plc",
        area: "Civil & Commercial Litigation",
        outcome: "Judgment for claimant",
        year: 2024,
    },
    {
        id: "2",
        title: "Doe v. State",
        area: "Criminal Law",
        outcome: "Acquittal",
        year: 2023,
    },
];

export default function JudgmentsPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-semibold mb-6">Judgments & Case Outcomes</h1>
            <p className="text-slate-300 mb-8 max-w-2xl">
                Explore selected judgments and outcomes across our practice areas.
                This will later be fully powered by Firestore with filters and search.
            </p>
            <div className="space-y-4">
                {mockJudgments.map((j) => (
                    <div
                        key={j.id}
                        className="border border-slate-800 rounded-xl p-4 flex flex-col gap-1"
                    >
                        <h2 className="font-semibold">{j.title}</h2>
                        <p className="text-xs text-slate-400">{j.area}</p>
                        <p className="text-sm">
              <span className="font-semibold text-unicGold">
                Outcome: {j.outcome}
              </span>{" "}
                            · {j.year}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}

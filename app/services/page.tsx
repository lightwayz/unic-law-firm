const practiceAreas = [
    { slug: "criminal-law", name: "Criminal Law" },
    { slug: "civil-litigation", name: "Civil & Commercial Litigation" },
    { slug: "employment-law", name: "Employment Law" },
    { slug: "intellectual-property", name: "Intellectual Property" },
    { slug: "family-law", name: "Family Law" },
];

import Link from "next/link";

export default function ServicesPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-semibold mb-6">Practice Areas</h1>
            <p className="text-slate-300 mb-8 max-w-2xl">
                Select the area of law that matches your case to see how UNIC Law Firm can assist.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
                {practiceAreas.map((area) => (
                    <Link
                        key={area.slug}
                        href={`/services/${area.slug}`}
                        className="border border-slate-800 rounded-xl p-4 hover:bg-slate-900"
                    >
                        <h2 className="font-semibold mb-1">{area.name}</h2>
                        <p className="text-xs text-slate-400">
                            Learn more about our expertise, typical cases, and recent judgments.
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}

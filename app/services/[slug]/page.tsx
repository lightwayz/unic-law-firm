import { notFound } from "next/navigation";

const areas: Record<
    string,
    { title: string; description: string }
> = {
    "criminal-law": {
        title: "Criminal Law",
        description: "Representation in criminal matters, from investigation to trial and appeal.",
    },
    "civil-litigation": {
        title: "Civil & Commercial Litigation",
        description:
            "Complex disputes involving contracts, corporate matters, and commercial transactions.",
    },
    "employment-law": {
        title: "Employment Law",
        description:
            "Matters involving wrongful termination, workplace discrimination, and labour disputes.",
    },
    "intellectual-property": {
        title: "Intellectual Property",
        description: "Trademark, copyright, patents, and protection of creative work.",
    },
    "family-law": {
        title: "Family Law",
        description:
            "Divorce, custody, maintenance, and related family law proceedings.",
    },
};

export default function ServiceDetailPage({
                                              params,
                                          }: {
    params: { slug: string };
}) {
    const data = areas[params.slug];
    if (!data) return notFound();

    return (
        <main className="mx-auto max-w-6xl px-4 py-12 space-y-6">
            <h1 className="text-3xl font-semibold">{data.title}</h1>
            <p className="text-slate-300 max-w-2xl">{data.description}</p>
            <div className="space-y-3 text-sm text-slate-300">
                <p>
                    On this page we will later show:
                </p>
                <ul className="list-disc list-inside">
                    <li>Sample judgments for {data.title}</li>
                    <li>Relevant books & materials in the UNIC library</li>
                    <li>Typical workflow and timeline</li>
                </ul>
            </div>
        </main>
    );
}

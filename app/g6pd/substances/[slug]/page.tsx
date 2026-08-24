import Link from "next/link";

const substances: Record<
  string,
  {
    name: string;
    category: string;
    evidence: string;
    explanation: string;
    sources: string[];
  }
> = {
  primaquine: {
    name: "Primaquine",
    category: "Medicine",
    evidence: "High concern",
    explanation:
      "Primaquine is an antimalarial medicine that has an established relationship with hemolysis in people with G6PD deficiency. The relevance depends on the specific clinical context and the person's G6PD status.",
    sources: [
      "Reviewed medical reference",
      "Official prescribing information",
    ],
  },

  "methylene-blue": {
    name: "Methylene Blue",
    category: "Medicine",
    evidence: "High concern",
    explanation:
      "Methylene blue can be clinically relevant in people with G6PD deficiency because of its relationship with oxidative stress and hemolysis.",
    sources: [
      "Reviewed medical reference",
      "Published clinical literature",
    ],
  },

  "fava-beans": {
    name: "Fava Beans",
    category: "Food",
    evidence: "Established association",
    explanation:
      "Fava beans are a well-known exposure associated with hemolysis in some people with G6PD deficiency.",
    sources: [
      "Reviewed medical reference",
      "Published scientific literature",
    ],
  },
};

export default async function SubstancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const substance = substances[slug];

  if (!substance) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">
          Substance not found
        </h1>

        <Link
          href="/g6pd"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to G6PD
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/g6pd"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to G6PD
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            {substance.category}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {substance.name}
          </h1>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Evidence assessment
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {substance.evidence}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Why is this relevant?
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              {substance.explanation}
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Sources
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
              {substance.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          This information is provided for education and reference. It is not
          a determination of whether this substance is appropriate for a
          particular individual.
        </div>
      </div>
    </main>
  );
}
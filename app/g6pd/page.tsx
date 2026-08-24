import Link from "next/link";

const substances = [
  {
    name: "Primaquine",
    slug: "primaquine",
    category: "Medicine",
  },
  {
    name: "Methylene Blue",
    slug: "methylene-blue",
    category: "Medicine",
  },
  {
    name: "Fava Beans",
    slug: "fava-beans",
    category: "Food",
  },
];

export default function G6PDPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Home
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Condition Guide
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            G6PD Deficiency
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            G6PD deficiency is an inherited condition affecting an enzyme that
            helps protect red blood cells from oxidative stress. Certain
            exposures can be relevant to people with the condition.
          </p>
        </div>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            What is G6PD deficiency?
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            This section will eventually contain reviewed educational content
            about G6PD deficiency, including the basic mechanism, terminology,
            and exposure categories.
          </p>

          <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            This application is for education and personal record-keeping. It
            does not diagnose conditions or provide individualized medical
            advice.
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">
            Explore substances
          </h2>

          <p className="mt-2 text-slate-600">
            Review information about substances that may be relevant to G6PD
            deficiency.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {substances.map((substance) => (
              <Link
                key={substance.slug}
                href={`/g6pd/substances/${substance.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"
              >
                <p className="text-sm text-slate-500">
                  {substance.category}
                </p>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {substance.name}
                </h3>

                <p className="mt-3 text-sm text-blue-600">
                  View evidence →
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
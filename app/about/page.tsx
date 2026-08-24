import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Genetic Health Education
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Understand your condition.
            <br />
            Explore the evidence.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A health education and personal reaction journal designed to help
            people understand genetic conditions and explore how substances
            may relate to them.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/g6pd"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore G6PD
            </Link>

            <Link
              href="/about"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              About the project
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
          <Feature
            title="Learn"
            description="Understand G6PD deficiency and the terminology used to describe it."
          />

          <Feature
            title="Explore"
            description="Search substances and review condition-specific evidence."
          />

          <Feature
            title="Track"
            description="Record personal observations without confusing them with scientific evidence."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 leading-7 text-slate-600">{description}</p>
    </div>
  );
}

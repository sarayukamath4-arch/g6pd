"use client";

import { useState } from "react";
import Link from "next/link";

const substances = [
  {
    name: "Primaquine",
    category: "Medicine",
    evidence: "Established evidence",
    level: "strong",
    description:
      "A medicine with a documented association with haemolysis in people with G6PD deficiency.",
  },
  {
    name: "Dapsone",
    category: "Medicine",
    evidence: "Established evidence",
    level: "strong",
    description:
      "An antimicrobial medicine associated with oxidative stress and haemolysis in G6PD deficiency.",
  },
  {
    name: "Fava beans",
    category: "Food",
    evidence: "Established evidence",
    level: "strong",
    description:
      "Fava beans are a well-known dietary exposure relevant to some people with G6PD deficiency.",
  },
  {
    name: "Aspirin",
    category: "Medicine",
    evidence: "Evidence varies",
    level: "limited",
    description:
      "Evidence and clinical recommendations can depend on dose and context.",
  },
  {
    name: "Vitamin C",
    category: "Supplement",
    evidence: "Limited evidence",
    level: "limited",
    description:
      "The relationship depends on dose and context; evidence should be interpreted carefully.",
  },
  {
    name: "Mothballs",
    category: "Chemical",
    evidence: "Established evidence",
    level: "strong",
    description:
      "Products containing naphthalene can create oxidative stress and are relevant to G6PD deficiency.",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = substances.filter((item) =>
    `${item.name} ${item.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">G</div>
          <div>
            <strong>GeneGuide</strong>
            <span>Personal health intelligence</span>
          </div>
        </div>

        <nav>
          <Link className="nav-link" href="/">⌂ Dashboard</Link>
          <Link className="nav-link" href="/learn">◈ Learn</Link>
          <Link className="nav-link active" href="/search">⌕ Substance search</Link>
          <Link className="nav-link" href="/scanner">▣ Label scanner</Link>
          <Link className="nav-link" href="/journal">✎ Reaction journal</Link>
        </nav>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">EVIDENCE DATABASE</p>
            <h1>Search substances</h1>
          </div>
          <div className="condition-pill">
            <span className="status-dot"></span>
            G6PD deficiency
          </div>
        </header>

        <section className="search-area">
          <p>
            Explore medicines, foods, supplements and chemicals and see what
            the available evidence says.
          </p>

          <div className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a medicine, food, ingredient..."
            />
            {query && (
              <button onClick={() => setQuery("")}>Clear</button>
            )}
          </div>

          <div className="search-meta">
            <span>{results.length} results</span>
            <span>Evidence reviewed for G6PD deficiency</span>
          </div>

          <div className="results-list">
            {results.map((item) => (
              <article className="substance-card" key={item.name}>
                <div className="substance-main">
                  <div className="substance-title">
                    <h2>{item.name}</h2>
                    <span className="category">{item.category}</span>
                  </div>

                  <p>{item.description}</p>
                </div>

                <div className="evidence-badge">
                  <span className={`evidence-dot ${item.level}`}></span>
                  {item.evidence}
                </div>
              </article>
            ))}

            {results.length === 0 && (
              <div className="empty-state">
                <strong>No substance found</strong>
                <p>
                  Try another search term. GeneGuide does not infer medical
                  conclusions from unknown substances.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
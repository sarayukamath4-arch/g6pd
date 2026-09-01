import Link from "next/link";

export default function Learn() {
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
          <Link className="nav-link active" href="/learn">◈ Learn</Link>
          <Link className="nav-link" href="/search">⌕ Substance search</Link>
          <Link className="nav-link" href="/scanner">▣ Label scanner</Link>
          <Link className="nav-link" href="/journal">✎ Reaction journal</Link>
        </nav>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">LEARN</p>
            <h1>G6PD deficiency</h1>
          </div>
          <div className="condition-pill">
            <span className="status-dot"></span>
            Condition overview
          </div>
        </header>

        <section className="learn-hero">
          <div>
            <p className="eyebrow">START HERE</p>
            <h2>What is G6PD deficiency?</h2>
            <p>
              G6PD deficiency is an inherited condition affecting an enzyme
              that helps protect red blood cells from oxidative stress.
            </p>
          </div>

          <div className="learn-stat">
            <strong>01</strong>
            <span>Condition<br />basics</span>
          </div>
        </section>

        <div className="lesson-grid">
          <article className="lesson-card">
            <span className="lesson-number">01</span>
            <h3>The basic mechanism</h3>
            <p>
              G6PD helps red blood cells produce molecules that protect them
              from oxidative damage. Reduced G6PD activity can make some
              people more vulnerable to haemolysis under certain conditions.
            </p>
            <span className="read-more">Read lesson →</span>
          </article>

          <article className="lesson-card">
            <span className="lesson-number">02</span>
            <h3>Why exposures matter</h3>
            <p>
              Certain medicines, foods, infections and chemicals can be
              relevant to people with G6PD deficiency. The relevance depends
              on the substance and the available evidence.
            </p>
            <span className="read-more">Read lesson →</span>
          </article>

          <article className="lesson-card">
            <span className="lesson-number">03</span>
            <h3>Evidence is not binary</h3>
            <p>
              A substance should not simply be labelled “safe” or “unsafe”.
              GeneGuide communicates the strength and uncertainty of the
              evidence instead.
            </p>
            <span className="read-more">Read lesson →</span>
          </article>
        </div>

        <section className="info-banner">
          <div className="info-icon">i</div>
          <div>
            <strong>Important distinction</strong>
            <p>
              Educational information describes what research says about a
              substance. Your journal records what happened to you. These are
              kept separate because a personal reaction does not prove
              causation.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

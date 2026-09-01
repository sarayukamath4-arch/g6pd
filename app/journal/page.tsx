"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Entry = {
  id: number;
  exposure: string;
  reaction: string;
  date: string;
  notes: string;
};

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [exposure, setExposure] = useState("");
  const [reaction, setReaction] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("geneguide-journal");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  function addEntry(e: React.FormEvent) {
    e.preventDefault();

    if (!exposure || !reaction || !date) return;

    const newEntry = {
      id: Date.now(),
      exposure,
      reaction,
      date,
      notes,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("geneguide-journal", JSON.stringify(updated));

    setExposure("");
    setReaction("");
    setDate("");
    setNotes("");
  }

  function deleteEntry(id: number) {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
    localStorage.setItem("geneguide-journal", JSON.stringify(updated));
  }

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
          <Link className="nav-link" href="/search">⌕ Substance search</Link>
          <Link className="nav-link" href="/scanner">▣ Label scanner</Link>
          <Link className="nav-link active" href="/journal">✎ Reaction journal</Link>
        </nav>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PERSONAL OBSERVATIONS</p>
            <h1>Reaction journal</h1>
          </div>

          <div className="privacy-pill">🔒 Private</div>
        </header>

        <div className="journal-layout">
          <section className="panel journal-form">
            <p className="eyebrow">NEW OBSERVATION</p>
            <h2>What happened?</h2>
            <p className="form-intro">
              Record what you observed. This does not determine what caused
              the reaction.
            </p>

            <form onSubmit={addEntry}>
              <label>
                Product or exposure
                <input
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value)}
                  placeholder="e.g. medication, food, cosmetic..."
                />
              </label>

              <label>
                Observed reaction
                <input
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  placeholder="e.g. fatigue, rash, headache..."
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label>
                Notes <span>(optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else you remember..."
                />
              </label>

              <button className="primary-button" type="submit">
                Save observation
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">YOUR HISTORY</p>
                <h2>{entries.length} observations</h2>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="empty-journal">
                <div>✎</div>
                <strong>No observations yet</strong>
                <p>
                  Add your first observation using the form. Your records
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="journal-entries">
                {entries.map((entry) => (
                  <article className="journal-entry" key={entry.id}>
                    <div className="entry-date">{entry.date}</div>

                    <div className="entry-content">
                      <strong>{entry.exposure}</strong>
                      <span>{entry.reaction}</span>
                      {entry.notes && <p>{entry.notes}</p>}
                    </div>

                    <button
                      className="delete-button"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="info-banner">
          <div className="info-icon">!</div>
          <div>
            <strong>Correlation ≠ causation</strong>
            <p>
              If the same ingredient appears across several observations,
              GeneGuide can highlight the pattern. It cannot determine that
              the ingredient caused your reaction.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
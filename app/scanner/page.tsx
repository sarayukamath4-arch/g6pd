"use client";

import { useState } from "react";
import Link from "next/link";

export default function Scanner() {
  const [scanned, setScanned] = useState(false);

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
          <Link className="nav-link active" href="/scanner">▣ Label scanner</Link>
          <Link className="nav-link" href="/journal">✎ Reaction journal</Link>
        </nav>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PRODUCT ANALYSIS</p>
            <h1>Label scanner</h1>
          </div>
        </header>

        <section className="scanner-layout">
          <div className="scanner-card">
            {!scanned ? (
              <>
                <div className="scanner-frame">
                  <div className="scan-corners">▣</div>
                </div>

                <h2>Scan a product label</h2>
                <p>
                  Photograph the ingredients panel and GeneGuide will extract
                  the ingredients for you to review.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setScanned(true)}
                >
                  Simulate label scan
                </button>

                <small>
                  MVP demonstration — OCR integration can be connected next.
                </small>
              </>
            ) : (
              <>
                <div className="scan-success">✓</div>
                <p className="eyebrow">SCAN COMPLETE</p>
                <h2>Ingredients detected</h2>

                <div className="ingredient-list">
                  <div>
                    <span>01</span>
                    <strong>Ascorbic acid</strong>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Citric acid</strong>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Sodium benzoate</strong>
                  </div>
                  <div>
                    <span>04</span>
                    <strong>Natural flavouring</strong>
                  </div>
                </div>

                <div className="review-warning">
                  <strong>Review before continuing</strong>
                  <p>
                    Scanned ingredients must be checked by the user before
                    GeneGuide analyses them.
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => setScanned(false)}
                >
                  Scan another label
                </button>
              </>
            )}
          </div>

          <div className="scanner-explanation">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>From label to evidence.</h2>

            <div className="step">
              <span>01</span>
              <div>
                <strong>Capture</strong>
                <p>Take a photo of the ingredients panel.</p>
              </div>
            </div>

            <div className="step">
              <span>02</span>
              <div>
                <strong>Review</strong>
                <p>Confirm that the extracted ingredients are correct.</p>
              </div>
            </div>

            <div className="step">
              <span>03</span>
              <div>
                <strong>Investigate</strong>
                <p>Compare identified substances with reviewed evidence.</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
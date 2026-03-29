import { useState } from "react";

const initialCards = [
  {
    id: 1,
    front: "What does Faraday's Law state?",
    back: "A changing magnetic flux through a closed loop induces an EMF.\nε = −dΦ/dt\n(The negative sign = Lenz's Law — the induced EMF opposes the change)",
    topic: "Electromagnetic Induction",
    color: "#6366f1",
  },
  {
    id: 2,
    front: "What is the Lorentz Force equation?",
    back: "F = q(E + v × B)\n• qE → force from electric field\n• q(v × B) → force from magnetic field (perpendicular to motion)",
    topic: "Lorentz Force",
    color: "#ec4899",
  },
  {
    id: 3,
    front: "How many of Maxwell's equations are there? Name them.",
    back: "4 equations:\n1. Gauss's Law for Electricity\n2. Gauss's Law for Magnetism\n3. Faraday's Law\n4. Ampere-Maxwell Law",
    topic: "Maxwell's Equations",
    color: "#f59e0b",
  },
  {
    id: 4,
    front: "What is the speed of electromagnetic waves in vacuum?",
    back: "c ≈ 2.998 × 10⁸ m/s\n\nDerived from Maxwell's equations:\nc = 1/√(μ₀ε₀)",
    topic: "Electromagnetic Waves",
    color: "#10b981",
  },
  {
    id: 5,
    front: "What is the SI unit of magnetic flux density?",
    back: "Tesla (T)\n1 T = 1 Wb/m² = 1 kg/(A·s²)\n\nSmaller: Gauss (G)\n1 T = 10,000 G",
    topic: "Magnetic Fields",
    color: "#38bdf8",
  },
];

export default function Flashcards() {
  const [cards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("browse"); // "browse" | "quiz"
  const [known, setKnown] = useState([]);
  const [review, setReview] = useState([]);
  const [done, setDone] = useState(false);

  const card = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  const next = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, cards.length - 1)), 150);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(i - 1, 0)), 150);
  };

  const handleKnew = () => {
    setKnown((k) => [...k, card.id]);
    if (currentIndex < cards.length - 1) next();
    else setDone(true);
  };
  const handleReview = () => {
    setReview((r) => [...r, card.id]);
    if (currentIndex < cards.length - 1) next();
    else setDone(true);
  };

  const reset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setKnown([]);
    setReview([]);
    setDone(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            🃏 Flashcards
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
            {cards.length} cards · Click card to flip
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["browse", "quiz"].map((m) => (
            <button
              key={m}
              className={`tab ${mode === m ? "active" : ""}`}
              onClick={() => { setMode(m); reset(); }}
              style={{ textTransform: "capitalize" }}
            >
              {m === "browse" ? "📖 Browse" : "🎯 Quiz"}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((currentIndex + 1) / cards.length) * 100}%`, background: `linear-gradient(90deg, #6366f1, #8b5cf6)`, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>

      {done ? (
        /* ── Results screen ──────────────────── */
        <div className="card fade-in" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Quiz Complete!
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", margin: "1.5rem 0" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", fontFamily: "'Space Grotesk', sans-serif" }}>{known.length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Got it ✅</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", fontFamily: "'Space Grotesk', sans-serif" }}>{review.length}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Need review 🔁</div>
            </div>
          </div>
          <button className="btn-primary" onClick={reset} style={{ padding: "0.75rem 2rem" }}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* ── Flashcard ──────────────────────── */}
          <div
            style={{
              perspective: 1000,
              height: 280,
              cursor: "pointer",
              marginBottom: "1.5rem",
            }}
            onClick={() => setFlipped(!flipped)}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: "var(--bg-card)",
                  border: `1px solid ${card.color}44`,
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 40px ${card.color}18`,
                }}
              >
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span className="badge badge-purple">{card.topic}</span>
                </div>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {currentIndex + 1} / {cards.length}
                </div>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                  {card.front}
                </p>
                <div style={{ position: "absolute", bottom: "1rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  Tap to flip 👆
                </div>
              </div>

              {/* Back */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: `linear-gradient(135deg, ${card.color}18, ${card.color}08)`,
                  border: `1px solid ${card.color}66`,
                  borderRadius: "1.25rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 40px ${card.color}22`,
                }}
              >
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ Answer</span>
                </div>
                <pre style={{
                  fontSize: "0.9rem", color: "var(--text-primary)", textAlign: "center",
                  margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif",
                }}>
                  {card.back}
                </pre>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="fade-in" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "1.25rem" }}>
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              style={{
                padding: "0.625rem 1.25rem", background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "0.75rem", color: "var(--text-secondary)", cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                opacity: currentIndex === 0 ? 0.5 : 1, fontSize: "0.9rem", transition: "all 0.2s",
              }}
            >
              ← Prev
            </button>

            {mode === "quiz" && flipped && (
              <>
                <button
                  onClick={handleReview}
                  style={{
                    padding: "0.625rem 1.25rem", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
                    borderRadius: "0.75rem", color: "#f59e0b", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                  }}
                >
                  🔁 Review
                </button>
                <button
                  onClick={handleKnew}
                  style={{
                    padding: "0.625rem 1.25rem", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
                    borderRadius: "0.75rem", color: "#10b981", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                  }}
                >
                  ✅ Got it
                </button>
              </>
            )}

            {(!flipped || mode === "browse") && (
              <button
                onClick={() => setFlipped(true)}
                style={{
                  padding: "0.625rem 1.5rem", background: "var(--accent-dim)", border: "1px solid rgba(99,102,241,0.35)",
                  borderRadius: "0.75rem", color: "var(--accent-light)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                }}
              >
                Show Answer
              </button>
            )}

            <button
              onClick={next}
              disabled={currentIndex === cards.length - 1}
              style={{
                padding: "0.625rem 1.25rem", background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "0.75rem", color: "var(--text-secondary)", cursor: currentIndex === cards.length - 1 ? "not-allowed" : "pointer",
                opacity: currentIndex === cards.length - 1 ? 0.5 : 1, fontSize: "0.9rem", transition: "all 0.2s",
              }}
            >
              Next →
            </button>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem" }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setFlipped(false); }}
                style={{
                  width: i === currentIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === currentIndex ? card.color : "var(--border)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
import { useState } from "react";
import api from "../../api/axios";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#38bdf8", "#a78bfa", "#fb923c", "#34d399"];

export default function Flashcards({ pdfText, projectId }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("browse"); // "browse" | "quiz"
  const [known, setKnown] = useState([]);
  const [review, setReview] = useState([]);
  const [done, setDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const card = cards[currentIndex];

  const generateCards = async () => {
    if (!pdfText) {
      setError("Please upload a PDF first to generate flashcards.");
      return;
    }
    setGenerating(true);
    setError("");
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setKnown([]);
    setReview([]);
    setDone(false);
    try {
      const res = await api.post("/ai/flashcards", { context: pdfText });
      const raw = res.data.cards;
      const colored = raw.map((c, i) => ({ ...c, id: i + 1, color: COLORS[i % COLORS.length] }));
      setCards(colored);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to generate flashcards. Try again.");
    } finally {
      setGenerating(false);
    }
  };

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

  // ── Empty / generate state ───────────────────────────────────────
  if (cards.length === 0 && !generating) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
        <div className="fade-in" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
            🃏 Flashcards
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
            AI-generated flashcards from your uploaded material
          </p>
        </div>

        <div
          className="card fade-in"
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            border: "2px dashed var(--border)",
            background: "rgba(99,102,241,0.03)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🃏</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
            No flashcards yet
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            {pdfText ? "Click below to generate 10 AI flashcards from your uploaded PDF." : "Upload a PDF first, then generate flashcards from it."}
          </p>
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>⚠️ {error}</p>
          )}
          <button
            className="btn-primary"
            onClick={generateCards}
            disabled={!pdfText}
            style={{ padding: "0.75rem 2rem", opacity: !pdfText ? 0.5 : 1 }}
          >
            ✨ Generate Flashcards from PDF
          </button>
        </div>
      </div>
    );
  }

  // ── Generating state ─────────────────────────────────────────────
  if (generating) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
        <div className="card fade-in" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🃏</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
            Generating Flashcards…
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
            AI is reading your material and creating cards…
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: "var(--accent-light)",
                  animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Cards available ──────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
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
          <button
            className="btn-ghost"
            onClick={generateCards}
            disabled={!pdfText || generating}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }}
          >
            🔄 Regenerate
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((currentIndex + 1) / cards.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2, transition: "width 0.4s ease" }} />
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
            style={{ perspective: 1000, height: 280, cursor: "pointer", marginBottom: "1.5rem" }}
            onClick={() => setFlipped(!flipped)}
          >
            <div
              style={{
                position: "relative", width: "100%", height: "100%",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                style={{
                  position: "absolute", inset: 0, backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden", background: "var(--bg-card)",
                  border: `1px solid ${card.color}44`, borderRadius: "1.25rem",
                  padding: "2rem", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
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
                  position: "absolute", inset: 0, backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
                  background: `linear-gradient(135deg, ${card.color}18, ${card.color}08)`,
                  border: `1px solid ${card.color}66`, borderRadius: "1.25rem",
                  padding: "2rem", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 40px ${card.color}22`,
                }}
              >
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ Answer</span>
                </div>
                <pre style={{ fontSize: "0.9rem", color: "var(--text-primary)", textAlign: "center", margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif" }}>
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
                  style={{ padding: "0.625rem 1.25rem", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "0.75rem", color: "#f59e0b", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  🔁 Review
                </button>
                <button
                  onClick={handleKnew}
                  style={{ padding: "0.625rem 1.25rem", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "0.75rem", color: "#10b981", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  ✅ Got it
                </button>
              </>
            )}

            {(!flipped || mode === "browse") && (
              <button
                onClick={() => setFlipped(true)}
                style={{ padding: "0.625rem 1.5rem", background: "var(--accent-dim)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "0.75rem", color: "var(--accent-light)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
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
                  width: i === currentIndex ? 20 : 8, height: 8, borderRadius: 4,
                  background: i === currentIndex ? card.color : "var(--border)",
                  border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
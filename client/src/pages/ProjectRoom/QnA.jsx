import { useState } from "react";

const mockQnA = [
  {
    question: "What does Faraday's Law state?",
    answer:
      "Faraday's Law states that a changing magnetic flux through a closed loop induces an electromotive force (EMF). Mathematically: ε = −dΦ/dt. The negative sign (Lenz's Law) means the induced EMF opposes the change in flux.",
    difficulty: "Medium",
    topic: "Electromagnetic Induction",
  },
  {
    question: "What is the SI unit of magnetic flux density?",
    answer:
      "The SI unit of magnetic flux density (B-field) is the Tesla (T). One Tesla equals one Weber per square meter (1 T = 1 Wb/m²). Smaller measurements are often expressed in Gauss (1 T = 10,000 G).",
    difficulty: "Easy",
    topic: "Magnetic Fields",
  },
  {
    question: "How many equations are in Maxwell's set, and what do they describe?",
    answer:
      "Maxwell's equations consist of 4 equations: (1) Gauss's Law for electricity — electric field lines originate from charges; (2) Gauss's Law for magnetism — no magnetic monopoles; (3) Faraday's Law — changing B-fields create E-fields; (4) Ampere-Maxwell Law — currents and changing E-fields create B-fields.",
    difficulty: "Hard",
    topic: "Maxwell's Equations",
  },
  {
    question: "What is the speed of electromagnetic waves in vacuum?",
    answer:
      "Electromagnetic waves travel at the speed of light c ≈ 2.998 × 10⁸ m/s in vacuum. Maxwell derived this from his equations: c = 1/√(μ₀ε₀), where μ₀ is the permeability and ε₀ is the permittivity of free space.",
    difficulty: "Easy",
    topic: "Electromagnetic Waves",
  },
  {
    question: "Explain the Lorentz Force and its components.",
    answer:
      "The Lorentz Force is the total electromagnetic force on a charged particle: F = q(E + v × B). The electric component qE acts parallel to the electric field. The magnetic component q(v × B) acts perpendicular to both the velocity and magnetic field, causing circular motion without doing work.",
    difficulty: "Hard",
    topic: "Lorentz Force",
  },
];

const difficultyColors = {
  Easy: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981" },
  Medium: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" },
  Hard: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#ef4444" },
};

export default function QnA() {
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState("All");
  const [generating, setGenerating] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [showAsk, setShowAsk] = useState(false);

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered =
    filter === "All" ? mockQnA : mockQnA.filter((q) => q.difficulty === filter);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div
        className="fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            ❓ Q&amp;A Bank
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
            {filtered.length} questions · Click to reveal answers
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onClick={() => setShowAsk(!showAsk)}
          >
            💬 Ask Custom
          </button>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: generating ? 0.7 : 1 }}
          >
            {generating ? "⏳ Generating..." : "✨ Generate More"}
          </button>
        </div>
      </div>

      {/* Custom question input */}
      {showAsk && (
        <div
          className="card fade-in"
          style={{ padding: "1.25rem", marginBottom: "1rem" }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
            Type your own question and the AI will answer from your material:
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              className="input-dark"
              placeholder="e.g. What is displacement current?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <button
              className="btn-primary"
              style={{ flexShrink: 0, padding: "0.625rem 1.25rem", fontSize: "0.85rem" }}
            >
              Ask AI
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div
        className="fade-in"
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        {difficulties.map((d) => (
          <button
            key={d}
            className={`tab ${filter === d ? "active" : ""}`}
            onClick={() => setFilter(d)}
            style={{ fontSize: "0.8rem" }}
          >
            {d}
            {d !== "All" && (
              <span
                style={{
                  marginLeft: "0.35rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "0.375rem",
                  background: difficultyColors[d]?.bg,
                  color: difficultyColors[d]?.text,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {mockQnA.filter((q) => q.difficulty === d).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Q&A List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map((item, i) => {
          const dc = difficultyColors[item.difficulty];
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className="card fade-in"
              style={{
                overflow: "hidden",
                cursor: "pointer",
                animationDelay: `${i * 0.07}s`,
                borderColor: isOpen ? "rgba(99,102,241,0.4)" : undefined,
              }}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {/* Question row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.125rem 1.5rem",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--accent-light)",
                    flexShrink: 0,
                  }}
                >
                  Q{i + 1}
                </div>

                <p
                  style={{
                    flex: 1,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.question}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  <span
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "0.375rem",
                      background: dc.bg,
                      border: `1px solid ${dc.border}`,
                      color: dc.text,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.difficulty}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "none",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Answer */}
              {isOpen && (
                <div
                  className="fade-in"
                  style={{
                    padding: "1rem 1.5rem 1.25rem",
                    borderTop: "1px solid var(--border)",
                    background: "rgba(99,102,241,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.625rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#10b981",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ✅ Answer
                    </span>
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "0.375rem",
                        background: "rgba(99,102,241,0.1)",
                        color: "var(--text-muted)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {item.topic}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
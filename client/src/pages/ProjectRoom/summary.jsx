import { useState } from "react";
import api from "../../api/axios";

const mockSummary = {
  title: "Physics — Electromagnetism",
  keyPoints: [
    "Electric fields arise from charges and exert forces on other charges in the vicinity.",
    "Magnetic fields are produced by moving charges (currents) and affect other moving charges.",
    "Faraday's Law states that a changing magnetic flux induces an electromotive force (EMF).",
    "Maxwell's equations unify electricity, magnetism, and optics into one consistent theory.",
    "Electromagnetic waves travel at the speed of light c ≈ 3×10⁸ m/s in vacuum.",
  ],
  sections: [
    {
      heading: "Electric Fields & Coulomb's Law",
      content:
        "Coulomb's Law describes the electrostatic force between two point charges. The electric field E at a point is defined as the force per unit positive charge. Field lines originate on positive charges and terminate on negative charges.",
      icon: "⚡",
      color: "#6366f1",
    },
    {
      heading: "Magnetic Fields & Lorentz Force",
      content:
        "A magnetic field B exerts a force on a moving charge given by F = qv × B (the Lorentz Force). Magnetic field lines form closed loops — there are no magnetic monopoles. The Tesla (T) is the SI unit for magnetic field strength.",
      icon: "🧲",
      color: "#ec4899",
    },
    {
      heading: "Faraday's Law of Induction",
      content:
        "A changing magnetic flux Φ through a loop induces an EMF: ε = −dΦ/dt. Lenz's Law states the induced current opposes the change that caused it. This is the principle behind transformers, generators, and induction motors.",
      icon: "🌀",
      color: "#10b981",
    },
    {
      heading: "Maxwell's Equations",
      content:
        "The four Maxwell's equations describe how electric and magnetic fields interact: Gauss's Law for electricity, Gauss's Law for magnetism, Faraday's Law, and Ampere-Maxwell Law. Together, they predict electromagnetic waves.",
      icon: "📐",
      color: "#f59e0b",
    },
  ],
};

export default function Summary() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  const handleCopy = () => {
    const text = mockSummary.keyPoints.join("\n") + "\n\n" +
      mockSummary.sections.map(s => `${s.heading}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          marginBottom: "1.5rem",
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
            📝 AI Summary
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
            Auto-generated from your uploaded PDF
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleCopy}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              color: copied ? "#10b981" : "var(--text-secondary)",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 500,
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: generating ? 0.7 : 1 }}
          >
            {generating ? "⏳ Generating..." : "✨ Regenerate"}
          </button>
        </div>
      </div>

      {generating && (
        <div
          className="card fade-in"
          style={{ padding: "3rem", textAlign: "center", marginBottom: "1.5rem" }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✨</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            AI is reading your material and generating a summary...
          </p>
          <div
            style={{
              height: 4,
              background: "var(--bg-hover)",
              borderRadius: 2,
              overflow: "hidden",
              marginTop: "1.5rem",
              maxWidth: 300,
              margin: "1.5rem auto 0",
            }}
          >
            <div
              className="shimmer"
              style={{ height: "100%", width: "100%", borderRadius: 2 }}
            />
          </div>
        </div>
      )}

      {generated && !generating && (
        <>
          {/* Key Points */}
          <div
            className="card fade-in"
            style={{ padding: "1.5rem", marginBottom: "1rem" }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--accent-light)",
                margin: "0 0 1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ⚡ Key Takeaways
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {mockSummary.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="fade-in"
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(99,102,241,0.2)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--accent-light)",
                      flexShrink: 0,
                      marginTop: "0.1rem",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section breakdowns */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {mockSummary.sections.map((section, i) => (
              <div
                key={i}
                className="card fade-in"
                style={{
                  overflow: "hidden",
                  cursor: "pointer",
                  animationDelay: `${i * 0.1 + 0.3}s`,
                  borderColor: activeSection === i ? section.color + "66" : undefined,
                }}
                onClick={() => setActiveSection(activeSection === i ? null : i)}
              >
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
                      width: 40,
                      height: 40,
                      borderRadius: "0.625rem",
                      background: section.color + "22",
                      border: `1px solid ${section.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {section.icon}
                  </div>
                  <h3
                    style={{
                      flex: 1,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {section.heading}
                  </h3>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      transition: "transform 0.2s",
                      transform: activeSection === i ? "rotate(180deg)" : "none",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </span>
                </div>

                {activeSection === i && (
                  <div
                    className="fade-in"
                    style={{
                      padding: "0 1.5rem 1.25rem",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "1rem",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.875rem",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>💡</span>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: 0 }}>
              Switch to the <strong style={{ color: "var(--accent-light)" }}>Q&amp;A</strong> or{" "}
              <strong style={{ color: "var(--accent-light)" }}>Flashcards</strong> tabs to test your
              knowledge on this material!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
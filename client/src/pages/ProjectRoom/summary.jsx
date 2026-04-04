import { useState } from "react";
import api from "../../api/axios";

const SECTION_COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#38bdf8"];

export default function Summary({ pdfText, projectId }) {
  const [summary, setSummary] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!pdfText) { setError("Please upload a PDF first."); return; }
    setGenerating(true);
    setSummary(null);
    setError("");
    setActiveSection(null);
    try {
      const res = await api.post("/ai/summary", { context: pdfText });
      // Attach colors to sections
      const raw = res.data.summary;
      if (raw.sections) {
        raw.sections = raw.sections.map((s, i) => ({ ...s, color: SECTION_COLORS[i % SECTION_COLORS.length] }));
      }
      setSummary(raw);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to generate summary. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    const text =
      summary.keyPoints.join("\n") +
      "\n\n" +
      summary.sections.map((s) => `${s.heading}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Empty state ──────────────────────────────────────────────────
  if (!summary && !generating) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
        <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              📝 AI Summary
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
              Auto-generated from your uploaded PDF
            </p>
          </div>
          <button className="btn-primary" onClick={handleGenerate} disabled={!pdfText} style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: !pdfText ? 0.5 : 1 }}>
            ✨ Generate Summary
          </button>
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>⚠️ {error}</p>}

        <div className="card fade-in" style={{ padding: "3rem 2rem", textAlign: "center", border: "2px dashed var(--border)", background: "rgba(99,102,241,0.03)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No summary yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            {pdfText ? "Click below to generate a detailed summary of your uploaded PDF." : "Upload a PDF first, then generate a summary."}
          </p>
          <button className="btn-primary" onClick={handleGenerate} disabled={!pdfText} style={{ padding: "0.75rem 2rem", opacity: !pdfText ? 0.5 : 1 }}>
            ✨ Generate Summary from PDF
          </button>
        </div>
      </div>
    );
  }

  // ── Generating state ─────────────────────────────────────────────
  if (generating) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
        <div className="card fade-in" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✨</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>Generating Summary…</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
            AI is reading your material and generating a summary…
          </p>
          <div style={{ height: 4, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden", maxWidth: 300, margin: "0 auto" }}>
            <div className="shimmer" style={{ height: "100%", width: "100%", borderRadius: 2 }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Summary available ────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            📝 {summary.title || "AI Summary"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>Auto-generated from your uploaded PDF</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleCopy}
            style={{ padding: "0.5rem 1rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.75rem", color: copied ? "#10b981" : "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s", fontWeight: 500 }}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button className="btn-primary" onClick={handleGenerate} disabled={generating} style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: generating ? 0.7 : 1 }}>
            {generating ? "⏳ Generating..." : "✨ Regenerate"}
          </button>
        </div>
      </div>

      {/* Key Points */}
      <div className="card fade-in" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--accent-light)", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          ⚡ Key Takeaways
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {(summary.keyPoints || []).map((point, i) => (
            <li key={i} className="fade-in" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", animationDelay: `${i * 0.1}s` }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-light)", flexShrink: 0, marginTop: "0.1rem" }}>
                {i + 1}
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section breakdowns */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {(summary.sections || []).map((section, i) => (
          <div
            key={i}
            className="card fade-in"
            style={{ overflow: "hidden", cursor: "pointer", animationDelay: `${i * 0.1 + 0.3}s`, borderColor: activeSection === i ? section.color + "66" : undefined }}
            onClick={() => setActiveSection(activeSection === i ? null : i)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.5rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: section.color + "22", border: `1px solid ${section.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                {section.icon}
              </div>
              <h3 style={{ flex: 1, fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                {section.heading}
              </h3>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", transition: "transform 0.2s", transform: activeSection === i ? "rotate(180deg)" : "none", display: "inline-block" }}>▼</span>
            </div>
            {activeSection === i && (
              <div className="fade-in" style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer tip */}
      <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", borderRadius: "0.75rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.1rem" }}>💡</span>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: 0 }}>
          Switch to the <strong style={{ color: "var(--accent-light)" }}>Q&amp;A</strong> or{" "}
          <strong style={{ color: "var(--accent-light)" }}>Flashcards</strong> tabs to test your knowledge!
        </p>
      </div>
    </div>
  );
}
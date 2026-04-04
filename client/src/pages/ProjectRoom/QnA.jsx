import { useState } from "react";
import api from "../../api/axios";

const difficultyColors = {
  Easy:   { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#10b981" },
  Medium: { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)",  text: "#f59e0b" },
  Hard:   { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)",   text: "#ef4444" },
};

export default function QnA({ pdfText, projectId }) {
  const [questions, setQuestions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState("All");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Custom question
  const [newQuestion, setNewQuestion] = useState("");
  const [showAsk, setShowAsk] = useState(false);
  const [askLoading, setAskLoading] = useState(false);

  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const filtered = filter === "All" ? questions : questions.filter((q) => q.difficulty === filter);

  const handleGenerate = async () => {
    if (!pdfText) { setError("Please upload a PDF first."); return; }
    setGenerating(true);
    setError("");
    setOpenIndex(null);
    try {
      const res = await api.post("/ai/qna", { context: pdfText });
      setQuestions(res.data.questions || []);
      setFilter("All");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to generate Q&A. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAskCustom = async () => {
    if (!newQuestion.trim() || askLoading) return;
    setAskLoading(true);
    try {
      const res = await api.post("/ai/chat", {
        message: newQuestion,
        context: pdfText || "No material uploaded. Answer based on general knowledge.",
      });
      const custom = {
        question: newQuestion,
        answer: res.data.reply,
        difficulty: "Medium",
        topic: "Custom",
      };
      setQuestions((prev) => [custom, ...prev]);
      setNewQuestion("");
      setShowAsk(false);
      setOpenIndex(0);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to answer question.");
    } finally {
      setAskLoading(false);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────
  if (questions.length === 0 && !generating) {
    return (
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
        <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              ❓ Q&amp;A Bank
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
              AI-generated exam-style questions from your material
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button style={{ padding: "0.5rem 1rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.75rem", color: "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500 }} onClick={() => setShowAsk(!showAsk)}>
              💬 Ask Custom
            </button>
            <button className="btn-primary" onClick={handleGenerate} disabled={generating || !pdfText} style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: !pdfText ? 0.5 : 1 }}>
              ✨ Generate Q&amp;A
            </button>
          </div>
        </div>

        {showAsk && (
          <div className="card fade-in" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>Ask any question — AI will answer from your material:</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input className="input-dark" placeholder="e.g. What is Newton's second law?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAskCustom()} />
              <button className="btn-primary" style={{ flexShrink: 0, padding: "0.625rem 1.25rem", fontSize: "0.85rem" }} onClick={handleAskCustom} disabled={askLoading || !newQuestion.trim()}>
                {askLoading ? "⏳" : "Ask AI"}
              </button>
            </div>
          </div>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>⚠️ {error}</p>}

        <div className="card fade-in" style={{ padding: "3rem 2rem", textAlign: "center", border: "2px dashed var(--border)", background: "rgba(99,102,241,0.03)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❓</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No questions yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            {pdfText ? "Generate exam-style Q&A from your uploaded PDF." : "Upload a PDF first, then generate Q&A."}
          </p>
          <button className="btn-primary" onClick={handleGenerate} disabled={!pdfText} style={{ padding: "0.75rem 2rem", opacity: !pdfText ? 0.5 : 1 }}>
            ✨ Generate Q&amp;A from PDF
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
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>❓</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>Generating Q&amp;A…</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>AI is creating exam-style questions from your material…</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-light)", animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Questions list ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            ❓ Q&amp;A Bank
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
            {filtered.length} questions · Click to reveal answers
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button style={{ padding: "0.5rem 1rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.75rem", color: "var(--text-secondary)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }} onClick={() => setShowAsk(!showAsk)}>
            💬 Ask Custom
          </button>
          <button className="btn-primary" onClick={handleGenerate} disabled={generating || !pdfText} style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", opacity: generating ? 0.7 : 1 }}>
            {generating ? "⏳ Generating..." : "✨ Regenerate"}
          </button>
        </div>
      </div>

      {/* Ask custom input */}
      {showAsk && (
        <div className="card fade-in" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
            Type your own question and the AI will answer from your material:
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input className="input-dark" placeholder="e.g. What is displacement current?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAskCustom()} />
            <button className="btn-primary" style={{ flexShrink: 0, padding: "0.625rem 1.25rem", fontSize: "0.85rem" }} onClick={handleAskCustom} disabled={askLoading || !newQuestion.trim()}>
              {askLoading ? "⏳ Thinking..." : "Ask AI"}
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>⚠️ {error}</p>}

      {/* Filter tabs */}
      <div className="fade-in" style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {difficulties.map((d) => (
          <button key={d} className={`tab ${filter === d ? "active" : ""}`} onClick={() => setFilter(d)} style={{ fontSize: "0.8rem" }}>
            {d}
            {d !== "All" && (
              <span style={{ marginLeft: "0.35rem", padding: "0.1rem 0.4rem", borderRadius: "0.375rem", background: difficultyColors[d]?.bg, color: difficultyColors[d]?.text, fontSize: "0.7rem", fontWeight: 600 }}>
                {questions.filter((q) => q.difficulty === d).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Q&A list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.map((item, i) => {
          const dc = difficultyColors[item.difficulty] || difficultyColors.Medium;
          const isOpen = openIndex === i;
          return (
            <div key={i} className="card fade-in" style={{ overflow: "hidden", cursor: "pointer", animationDelay: `${i * 0.07}s`, borderColor: isOpen ? "rgba(99,102,241,0.4)" : undefined }} onClick={() => setOpenIndex(isOpen ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.5rem" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-light)", flexShrink: 0 }}>
                  Q{i + 1}
                </div>
                <p style={{ flex: 1, fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>
                  {item.question}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "0.375rem", background: dc.bg, border: `1px solid ${dc.border}`, color: dc.text, fontSize: "0.7rem", fontWeight: 600 }}>
                    {item.difficulty}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>▼</span>
                </div>
              </div>
              {isOpen && (
                <div className="fade-in" style={{ padding: "1rem 1.5rem 1.25rem", borderTop: "1px solid var(--border)", background: "rgba(99,102,241,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ Answer</span>
                    <span style={{ padding: "0.15rem 0.5rem", borderRadius: "0.375rem", background: "rgba(99,102,241,0.1)", color: "var(--text-muted)", fontSize: "0.7rem" }}>{item.topic}</span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
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
import { useState, useRef } from "react";
import api from "../../api/axios";

const EXAMPLES = [
  "Solve: ∫ x² sin(x) dx",
  "Find the eigenvalues of [[1,2],[3,4]]",
  "Differentiate f(x) = x³e^x",
  "Solve the ODE: dy/dx + 2y = e^x",
];

const STEP_COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#38bdf8", "#a78bfa"];

export default function SumSolver({ pdfText, projectId }) {
  const [problem, setProblem] = useState("");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const handleSolve = async (text) => {
    const q = text || problem;
    if (!q.trim() || solving) return;
    setSolving(true);
    setSolution(null);
    setError("");
    setExpandedStep(null);
    try {
      const res = await api.post("/ai/solve", { problem: q });
      const raw = res.data.solution;
      // Assign colors to steps
      raw.steps = raw.steps.map((s, i) => ({ ...s, color: STEP_COLORS[i % STEP_COLORS.length] }));
      setSolution({ problem: q, ...raw });
      setExpandedStep(0);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to solve. Please try again.");
    } finally {
      setSolving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem" }}>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
          🧮 Problem Solver
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
          Type any math, physics, or chemistry problem — get step-by-step solutions
        </p>
      </div>

      {/* Input area */}
      <div
        className="fade-in card"
        style={{ padding: "1.25rem", marginBottom: "1.5rem", borderColor: problem ? "rgba(99,102,241,0.35)" : undefined }}
      >
        <textarea
          ref={textareaRef}
          className="input-dark"
          placeholder="Enter a problem, e.g: Solve ∫ x² sin(x) dx using integration by parts..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSolve(); } }}
          rows={3}
          style={{ resize: "none", marginBottom: "0.875rem", fontSize: "0.95rem", border: "none", background: "transparent", padding: "0", boxShadow: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setProblem(ex)}
                style={{ padding: "0.25rem 0.75rem", borderRadius: "2rem", background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                {ex.length > 28 ? ex.slice(0, 28) + "…" : ex}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            disabled={!problem.trim() || solving}
            onClick={() => handleSolve()}
            style={{ flexShrink: 0, padding: "0.625rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {solving ? (<><span className="spinner" /> Solving…</>) : "Solve →"}
          </button>
        </div>
      </div>

      {error && (
        <div className="card fade-in" style={{ padding: "1rem 1.25rem", marginBottom: "1.5rem", borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.05)" }}>
          <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Solving animation */}
      {solving && (
        <div className="card fade-in" style={{ padding: "2.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🧠</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
            Breaking down your problem step-by-step…
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {["Parsing", "Solving", "Verifying"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-light)", animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solution */}
      {solution && !solving && (
        <div className="fade-in">
          {/* Problem restatement */}
          <div style={{ padding: "1rem 1.25rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📌</span>
            <div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Problem</p>
              <p style={{ color: "var(--text-primary)", fontSize: "0.9rem", margin: 0, fontFamily: "monospace" }}>{solution.problem}</p>
            </div>
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.875rem" }}>
            Solution in {solution.steps.length} steps — click each to expand:
          </p>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {solution.steps.map((s, i) => {
              const isOpen = expandedStep === i;
              return (
                <div
                  key={i}
                  className="card"
                  style={{ overflow: "hidden", cursor: "pointer", borderColor: isOpen ? `${s.color}55` : undefined, transition: "all 0.2s" }}
                  onClick={() => setExpandedStep(isOpen ? null : i)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: `${s.color}20`, border: `1.5px solid ${s.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.step}
                    </div>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{s.title}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                  </div>
                  {isOpen && (
                    <div className="fade-in" style={{ padding: "0.875rem 1.25rem 1.25rem", borderTop: `1px solid ${s.color}30`, background: `${s.color}08` }}>
                      <pre style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif" }}>
                        {s.content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final answer */}
          {solution.finalAnswer && (
            <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "0.875rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem" }}>✅</span>
              <div>
                <p style={{ fontSize: "0.72rem", color: "#10b981", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Final Answer</p>
                <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", margin: 0, fontFamily: "monospace", fontWeight: 600 }}>{solution.finalAnswer}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button className="btn-primary" onClick={() => { setSolution(null); setProblem(""); }} style={{ fontSize: "0.85rem", padding: "0.625rem 1.25rem" }}>
              + New Problem
            </button>
            <button className="btn-ghost" onClick={() => setExpandedStep(expandedStep !== null ? null : 0)} style={{ fontSize: "0.85rem" }}>
              {expandedStep !== null ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

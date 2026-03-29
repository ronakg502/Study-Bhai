import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import Chat from "./chat";
import Summary from "./summary";
import QnA from "./QnA";
import Flashcards from "./Flashcards";
import SumSolver from "./SumSolver";

const tabs = [
  { id: "chat",       label: "AI Chat",   icon: "🤖", path: "" },
  { id: "summary",    label: "Summary",   icon: "📝", path: "summary" },
  { id: "qna",        label: "Q&A",       icon: "❓", path: "qna" },
  { id: "flashcards", label: "Flashcards",icon: "🃏", path: "flashcards" },
  { id: "solver",     label: "Solver",    icon: "🧮", path: "solver" },
];

// Mock project data (would come from API/state in real app)
const PROJECT_META = {
  1: { name: "Physics — Electromagnetism", icon: "⚡", color: "#6366f1" },
  2: { name: "Organic Chemistry",          icon: "🧪", color: "#10b981" },
  3: { name: "Data Structures",            icon: "🌳", color: "#f59e0b" },
  4: { name: "Linear Algebra",             icon: "📐", color: "#ec4899" },
};

export default function ProjectRoom() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { id }     = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploaded,  setUploaded]  = useState(false);

  const meta = PROJECT_META[id] || { name: `Project #${id}`, icon: "📁", color: "#6366f1" };

  // Determine active tab from URL segment
  const seg = location.pathname.split("/").pop();
  const currentTab = tabs.find((t) =>
    t.path === seg || (t.path === "" && seg === id)
  ) ?? tabs[0];

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}
    >
      {/* ── Top bar ─────────────────────────────── */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          padding: "0.75rem 1.5rem",
          display: "flex", alignItems: "center", gap: "1rem",
          borderBottom: "1px solid var(--border)",
          background: "rgba(10,13,20,0.9)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-ghost"
          style={{ padding: "0.4rem 0.875rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          ← Dashboard
        </button>

        {/* Project identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "0.625rem",
            background: `${meta.color}22`, border: `1px solid ${meta.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.05rem",
          }}>
            {meta.icon}
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.95rem", fontWeight: 700,
              color: "var(--text-primary)", margin: 0,
            }}>
              {meta.name}
            </h1>
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", margin: 0 }}>
              Project #{id} · {uploaded ? "1 PDF loaded" : "No PDFs yet"}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <label
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.45rem 1rem", borderRadius: "0.75rem",
              background: uploaded ? "rgba(16,185,129,0.12)" : "var(--bg-card)",
              border: `1px solid ${uploaded ? "rgba(16,185,129,0.4)" : "var(--border)"}`,
              color: uploaded ? "#10b981" : "var(--text-secondary)",
              fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleUpload} />
            {uploading ? "⏳ Uploading…" : uploaded ? "✅ PDF Ready" : "📎 Upload PDF"}
          </label>
          <button className="btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.82rem" }}>
            Share
          </button>
        </div>
      </header>

      {/* ── Tab navigation ─────────────────────── */}
      <div
        style={{
          display: "flex", gap: "0.25rem",
          padding: "0.625rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab?.id === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab ${isActive ? "active" : ""}`}
              onClick={() =>
                navigate(tab.path ? `/project/${id}/${tab.path}` : `/project/${id}`)
              }
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab content ───────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Routes>
          <Route index           element={<Chat />} />
          <Route path="summary"  element={<Summary />} />
          <Route path="qna"      element={<QnA />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="solver"   element={<SumSolver />} />
        </Routes>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "./chat";
import Summary from "./summary";
import QnA from "./QnA";
import Flashcards from "./Flashcards";
import SumSolver from "./SumSolver";

const tabs = [
  { id: "chat",       label: "AI Chat",       icon: "🤖", shortLabel: "Chat" },
  { id: "flashcards", label: "Flashcards",    icon: "🃏", shortLabel: "Flashcards" },
  { id: "qna",        label: "Q&A",           icon: "❓", shortLabel: "Q&A" },
  { id: "summary",    label: "Sum Maker",     icon: "📝", shortLabel: "Sum Maker" },
  { id: "solver",     label: "Sum Solver",    icon: "🧮", shortLabel: "Sum Solver" },
];

const COMPONENTS = {
  chat: Chat,
  flashcards: Flashcards,
  qna: QnA,
  summary: Summary,
  solver: SumSolver,
};

// Mock project data
const PROJECT_META = {
  1: { name: "Physics — Electromagnetism", icon: "⚡", color: "#6366f1" },
  2: { name: "Organic Chemistry",          icon: "🧪", color: "#10b981" },
  3: { name: "Data Structures",            icon: "🌳", color: "#f59e0b" },
  4: { name: "Linear Algebra",             icon: "📐", color: "#ec4899" },
};

export default function ProjectRoom() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [uploading, setUploading] = useState(false);
  const [uploaded,  setUploaded]  = useState(false);

  const meta = PROJECT_META[id] || { name: `Project #${id}`, icon: "📁", color: "#6366f1" };
  const ActiveComponent = COMPONENTS[activeTab];

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Bar ────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,13,20,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Row 1: Back + Project name + actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            padding: "0.75rem 1.5rem",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-ghost"
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              flexShrink: 0,
            }}
          >
            ← Back
          </button>

          {/* Project identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "0.5rem",
                background: `${meta.color}22`,
                border: `1px solid ${meta.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              {meta.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {meta.name}
              </h1>
              <p style={{ fontSize: "0.67rem", color: "var(--text-muted)", margin: 0 }}>
                {uploaded ? "✅ PDF loaded" : "No PDF yet"}
              </p>
            </div>
          </div>

          {/* Upload + Share */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.875rem",
                borderRadius: "0.625rem",
                background: uploaded ? "rgba(16,185,129,0.1)" : "var(--bg-card)",
                border: `1px solid ${uploaded ? "rgba(16,185,129,0.35)" : "var(--border)"}`,
                color: uploaded ? "#10b981" : "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleUpload} />
              {uploading ? "⏳ Uploading…" : uploaded ? "📄 PDF Ready" : "📎 Upload PDF"}
            </label>
          </div>
        </div>

        {/* Row 2: Tab pill toggle */}
        <div
          style={{
            padding: "0 1.5rem 0.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Pill container */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(10,13,20,0.7)",
              border: "1px solid var(--border)",
              borderRadius: "0.875rem",
              padding: "0.2rem",
              gap: "0.15rem",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.45rem 1rem",
                    borderRadius: "0.65rem",
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "transparent",
                    color: isActive ? "#fff" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.83rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.background = "var(--bg-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{tab.icon}</span>
                  <span>{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Tab content ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto" }} key={activeTab} className="fade-in">
        <ActiveComponent />
      </div>
    </div>
  );
}

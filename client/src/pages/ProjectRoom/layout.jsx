import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import Chat from "./chat";
import Summary from "./summary";
import QnA from "./QnA";
import Flashcards from "./Flashcards";

const tabs = [
  { id: "chat", label: "AI Chat", icon: "🤖", path: "" },
  { id: "summary", label: "Summary", icon: "📝", path: "summary" },
  { id: "qna", label: "Q&A", icon: "❓", path: "qna" },
  { id: "flashcards", label: "Flashcards", icon: "🃏", path: "flashcards" },
];

export default function ProjectRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const currentTab = tabs.find((t) => {
    const seg = location.pathname.split("/").pop();
    return t.path === seg || (t.path === "" && seg === id);
  });

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen mesh-bg"
      style={{ background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}
    >
      {/* Top bar */}
      <header
        className="glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0.875rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          borderBottom: "1px solid var(--border)",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          borderRadius: 0,
          background: "rgba(15,17,23,0.85)",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.75rem",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          ← Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "0.5rem",
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            ⚡
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Physics — Electromagnetism
            </h1>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
              Project #{id} · 3 materials
            </p>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Upload button */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.75rem",
              background: uploaded ? "rgba(16,185,129,0.15)" : "var(--bg-card)",
              border: `1px solid ${uploaded ? "rgba(16,185,129,0.4)" : "var(--border)"}`,
              color: uploaded ? "#10b981" : "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleUpload} />
            {uploading ? "⏳ Uploading..." : uploaded ? "✅ PDF Loaded" : "📎 Upload PDF"}
          </label>

          <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
            Share
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
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
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Routes>
          <Route index element={<Chat />} />
          <Route path="summary" element={<Summary />} />
          <Route path="qna" element={<QnA />} />
          <Route path="flashcards" element={<Flashcards />} />
        </Routes>
      </div>
    </div>
  );
}

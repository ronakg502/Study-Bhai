import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import api from "../../api/axios";
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

export default function ProjectRoom() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [activeTab, setActiveTab] = useState("chat");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pdfText, setPdfText] = useState("");       // extracted PDF text
  const [uploaded, setUploaded] = useState(false);
  const [pdfFileName, setPdfFileName] = useState(""); // original filename

  // Fetch real project metadata from Supabase
  const [meta, setMeta] = useState({ name: "Loading…", icon: "📁", color: "#6366f1" });

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setMeta({
          name: data.name,
          icon: data.icon || "📁",
          color: data.color || "#6366f1",
          description: data.description,
        });
      }
    };
    fetchProject();
  }, [id]);


  // ── Real file upload ───────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("File too large. Max 20 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/materials/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.text) {
        setPdfText(res.data.text);
        setUploaded(true);
        setPdfFileName(file.name);
      } else {
        setUploadError("Could not extract text from the PDF.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(
        err.response?.data?.error || "Upload failed. Make sure the server is running."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
          className="project-header-row1"
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
              <p style={{ fontSize: "0.67rem", color: uploaded ? "#10b981" : "var(--text-muted)", margin: 0, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {uploaded ? `📄 ${pdfFileName}` : "No PDF uploaded yet"}
              </p>
            </div>
          </div>

          {/* Upload + error */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            {uploadError && (
              <span style={{ fontSize: "0.72rem", color: "#ef4444", maxWidth: 200, textAlign: "right" }}>
                {uploadError}
              </span>
            )}
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
                cursor: uploading ? "wait" : "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              <input
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading ? "⏳ Uploading…" : uploaded ? "🔄 Change PDF" : "📎 Upload PDF"}
            </label>
          </div>
        </div>

        {/* Row 2: Tab pill toggle */}
        <div
          className="project-tabs-row"
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
      {/* All tabs are mounted at once; inactive ones are hidden with CSS.       */}
      {/* This keeps Chat state (message history) alive when switching tabs.     */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {tabs.map((tab) => {
          const TabComponent = COMPONENTS[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={isActive ? "fade-in" : ""}
              style={{ display: isActive ? "block" : "none" }}
            >
              <TabComponent pdfText={pdfText} projectId={id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

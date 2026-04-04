import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import api from "../api/axios";

// ── Project icons & colors palette ─────────────────────────────
const ICONS = ["⚡", "🧪", "🌳", "📐", "🔬", "🎨", "💻", "📊", "🚀", "🧬", "🎸", "🌍", "🧠", "⚗️", "🏛️", "🎭"];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#38bdf8", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#a855f7"];

const NAV = [
  { icon: "🏠", label: "Dashboard", key: "dashboard" },
  { icon: "📁", label: "Projects",  key: "projects" },
];

// ── ChatGPT-style "New Project" modal ──────────────────────────
function NewProjectModal({ open, onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1=name, 2=description, 3=customise
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("📚");
  const [color, setColor] = useState("#6366f1");
  const [creating, setCreating] = useState(false);
  const nameRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (open) { setStep(1); setName(""); setDesc(""); setIcon("📚"); setColor("#6366f1"); setCreating(false); }
  }, [open]);

  useEffect(() => {
    if (step === 1 && nameRef.current) nameRef.current.focus();
    if (step === 2 && descRef.current) descRef.current.focus();
  }, [step]);

  const handleNameKey = (e) => {
    if (e.key === "Enter" && name.trim()) { e.preventDefault(); setStep(2); }
  };
  const handleDescKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setStep(3); }
  };

  const handleCreate = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    await onCreate({ name: name.trim(), description: desc.trim(), icon, color });
    setCreating(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass fade-in-up"
        style={{
          borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: 580,
          margin: "1rem", position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: "0.75rem",
              background: `${color}22`, border: `1px solid ${color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            {icon}
          </div>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              New Study Project
            </h2>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Step {step} of 3 — {step === 1 ? "Name your project" : step === 2 ? "Describe it" : "Customise"}
            </p>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", padding: "0.25rem" }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: "1.75rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(step / 3) * 100}%`, background: `linear-gradient(90deg, #6366f1, #8b5cf6)`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="form-label">What are you studying?</label>
              <input
                ref={nameRef}
                className="input-dark"
                placeholder="e.g. Organic Chemistry, Machine Learning, History of Rome…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKey}
                style={{ fontSize: "1rem", padding: "0.875rem 1rem" }}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                Press <kbd style={{ background: "var(--bg-hover)", padding: "0.1rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.7rem", border: "1px solid var(--border)" }}>Enter</kbd> to continue
              </p>
            </div>

            {/* Quick suggestions */}
            <div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Popular topics:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Quantum Physics", "Machine Learning", "World History", "Calculus", "Biology", "Economics"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setName(s); setTimeout(() => setStep(2), 150); }}
                    style={{
                      padding: "0.35rem 0.875rem", borderRadius: "2rem",
                      background: "var(--bg-hover)", border: "1px solid var(--border)",
                      color: "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-light)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              style={{ width: "100%", padding: "0.875rem", fontSize: "0.95rem" }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Description */}
        {step === 2 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="form-label">Describe what you're covering <span style={{ color: "var(--text-muted)" }}>(optional)</span></label>
              <textarea
                ref={descRef}
                className="input-dark"
                placeholder="e.g. Focusing on reaction mechanisms, aldol condensation, and stereoisomers for my midterm exam…"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onKeyDown={handleDescKey}
                rows={3}
                style={{ resize: "none", fontSize: "0.9rem", lineHeight: 1.6 }}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                Press <kbd style={{ background: "var(--bg-hover)", padding: "0.1rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.7rem", border: "1px solid var(--border)" }}>Enter</kbd> to continue
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn-ghost" onClick={() => setStep(1)} style={{ flex: "0 0 auto" }}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 1, padding: "0.75rem" }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Customise */}
        {step === 3 && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Icon picker */}
            <div>
              <label className="form-label">Choose an icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    style={{
                      width: 40, height: 40, borderRadius: "0.625rem", fontSize: "1.15rem",
                      border: `1.5px solid ${icon === ic ? color : "var(--border)"}`,
                      background: icon === ic ? `${color}20` : "var(--bg-hover)",
                      cursor: "pointer", transition: "all 0.15s",
                      transform: icon === ic ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="form-label">Choose a color</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: c, border: `2.5px solid ${color === c ? "white" : "transparent"}`,
                      cursor: "pointer", transition: "all 0.15s",
                      boxShadow: color === c ? `0 0 12px ${c}` : "none",
                      transform: color === c ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div
              style={{
                padding: "1rem", borderRadius: "0.875rem",
                background: `${color}10`, border: `1px solid ${color}33`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "0.625rem",
                  background: `${color}25`, border: `1px solid ${color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.15rem",
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>{name}</div>
                  {desc && <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.1rem" }}>{desc.slice(0, 60)}{desc.length > 60 ? "…" : ""}</div>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn-ghost" onClick={() => setStep(2)} style={{ flex: "0 0 auto" }}>← Back</button>
              <button
                className="btn-primary"
                onClick={handleCreate}
                disabled={creating}
                style={{ flex: 1, padding: "0.875rem", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: creating ? 0.7 : 1 }}
              >
                {creating ? "⏳ Creating…" : "🚀 Create Project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  // Fetch user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Fetch projects from server API (uses service key — bypasses RLS)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      }
      setLoadingProjects(false);
    };
    fetchProjects();
  }, []);

  const handleCreate = async (proj) => {
    try {
      const res = await api.post("/projects", {
        name: proj.name,
        description: proj.description || "No description yet",
        color: proj.color,
        icon: proj.icon,
      });
      if (res.data) {
        setProjects((p) => [res.data, ...p]);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project. Make sure the server is running.");
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      // Also wipe associated chat messages
      await supabase.from("chat_messages").delete().eq("project_id", projectId);
      setProjects((p) => p.filter((proj) => proj.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Student";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Dynamic stats
  const STATS = [
    { label: "Projects", value: String(projects.length), icon: "📁", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
    { label: "Docs Uploaded", value: String(projects.reduce((s, p) => s + (p.docs || 0), 0)), icon: "📎", color: "#10b981", bg: "rgba(16,185,129,0.10)" },
    { label: "AI Chats", value: "—", icon: "🤖", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
    { label: "Flashcards", value: "—", icon: "🃏", color: "#ec4899", bg: "rgba(236,72,153,0.10)" },
  ];

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mesh-bg" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: -200, right: -150, background: "rgba(99,102,241,0.07)" }} />
      <div className="orb" style={{ width: 350, height: 350, bottom: -100, left: -100, background: "rgba(139,92,246,0.06)" }} />

      {/* ── Sidebar ────────────────────────────────── */}
      <aside
        style={{
          position: "fixed", top: 0, left: 0,
          width: 240, height: "100vh",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          padding: "1.25rem 0.875rem",
          display: "flex", flexDirection: "column",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0 0.25rem" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "0.625rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            }}>
              📚
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.05rem", fontWeight: 700,
              color: "var(--text-primary)",
            }}>
              Study Bhai
            </span>
          </div>
        </div>

        {/* New Project button */}
        <button
          className="btn-primary"
          onClick={() => setShowNew(true)}
          style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <span style={{ fontSize: "1.1rem" }}>＋</span> New Project
        </button>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {NAV.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${activeNav === item.key ? "active" : ""}`}
              onClick={() => setActiveNav(item.key)}
            >
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User card */}
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "0.875rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "0.625rem",
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.8rem", fontWeight: 700, color: "white", flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Free Plan</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none", border: "none", color: "var(--text-muted)",
              cursor: "pointer", fontSize: "0.9rem", padding: "0.2rem",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────── */}
      <main style={{ marginLeft: 240, padding: "2rem 2rem 4rem", minHeight: "100vh" }}>

        {/* Header */}
        <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.8rem", fontWeight: 800,
              color: "var(--text-primary)", margin: 0,
            }}>
              Good evening{user ? `, ${displayName.split(" ")[0]}` : ""} 👋
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
              Ready to conquer your studies today?
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative", width: 260 }}>
            <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>🔍</span>
            <input
              className="input-dark"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "2.25rem", fontSize: "0.875rem" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div
          className="fade-in"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ padding: "1.25rem", cursor: "default" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "0.75rem",
                  background: s.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.1rem",
                }}>
                  {s.icon}
                </div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, boxShadow: `0 0 8px ${s.color}`, marginTop: "0.4rem" }} />
              </div>
              <div style={{
                fontSize: "1.8rem", fontWeight: 800,
                fontFamily: "'Space Grotesk', sans-serif",
                color: "var(--text-primary)",
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Projects heading */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Your Projects
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", margin: "0.15rem 0 0" }}>
              {filtered.length} of {projects.length} projects
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)} style={{ fontSize: "0.85rem", padding: "0.5rem 1.1rem" }}>
            + New Project
          </button>
        </div>

        {/* Project grid */}
        {loadingProjects ? (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {[1,2,3,4].map((i) => (
              <div key={i} className="card shimmer" style={{ height: 180 }} />
            ))}
          </div>
        ) : filtered.length === 0 && search ? (
          <div
            className="fade-in"
            style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No projects match "{search}"</p>
            <p style={{ fontSize: "0.85rem" }}>Try a different keyword</p>
          </div>
        ) : projects.length === 0 ? (
          <div
            className="fade-in"
            style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-muted)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📂</div>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)" }}>No projects yet</p>
            <p style={{ fontSize: "0.85rem", marginBottom: "1.5rem" }}>Create your first study project to get started!</p>
            <button className="btn-primary" onClick={() => setShowNew(true)} style={{ padding: "0.75rem 2rem" }}>
              + Create First Project
            </button>
          </div>
        ) : (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {filtered.map((project, idx) => (
              <ProjectCard key={project.id} project={project} delay={idx * 0.07} onClick={() => navigate(`/project/${project.id}`)} onDelete={(e) => handleDelete(e, project.id)} />
            ))}

            {/* "New project" placeholder card */}
            <div
              className="card fade-in"
              onClick={() => setShowNew(true)}
              style={{
                padding: "1.5rem", cursor: "pointer",
                border: "1.5px dashed var(--border)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "0.75rem", minHeight: 160,
                background: "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-dim)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: "0.875rem",
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
              }}>＋</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>New Project</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Start studying something new</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
    </div>
  );
}

// ── Project Card ────────────────────────────────────────────────
function ProjectCard({ project, delay, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async (e) => {
    setDeleting(true);
    await onDelete(e);
    setDeleting(false);
  };

  // Format the date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem", cursor: "pointer",
        position: "relative", overflow: "hidden",
        borderColor: hovered ? `${project.color}55` : undefined,
        boxShadow: hovered ? `0 4px 30px ${project.color}18` : undefined,
        animationDelay: `${delay}s`,
        transition: "all 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Color accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${project.color}, transparent)`,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
        {/* Icon */}
        <div style={{
          width: 46, height: 46, borderRadius: "0.75rem",
          background: `${project.color}18`, border: `1px solid ${project.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.3rem", flexShrink: 0,
        }}>
          {project.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            {project.name}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {project.description}
          </p>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
              <span>Progress</span>
              <span style={{ color: project.color, fontWeight: 600 }}>{project.progress || 0}%</span>
            </div>
            <div style={{ height: 4, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${project.progress || 0}%`,
                background: `linear-gradient(90deg, ${project.color}, ${project.color}99)`,
                borderRadius: 2, transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>
      </div>

        <div style={{ marginTop: "1rem", paddingTop: "0.875rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Updated {formatDate(project.updated_at || project.created_at)}</span>
            {project.docs > 0 && (
              <span className="badge badge-purple">📎 {project.docs} doc{project.docs > 1 ? "s" : ""}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {hovered && (
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                title="Delete project"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#ef4444",
                  borderRadius: "0.5rem",
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.72rem",
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? "⏳" : "🗑 Delete"}
              </button>
            )}
          </div>
        </div>
    </div>
  );
}
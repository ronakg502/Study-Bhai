import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ── Project icons & colors palette ─────────────────────────────
const ICONS = ["⚡", "🧪", "🌳", "📐", "🔬", "🎨", "💻", "📊", "🚀", "🧬", "🎸", "🌍", "🧠", "⚗️", "🏛️", "🎭"];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#38bdf8", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#a855f7"];

const mockProjects = [
  { id: 1, name: "Physics — Electromagnetism", description: "Maxwell's equations, induction, and wave theory", lastUpdated: "2h ago", progress: 68, color: "#6366f1", icon: "⚡", docs: 3 },
  { id: 2, name: "Organic Chemistry", description: "Reaction mechanisms, functional groups, stereochemistry", lastUpdated: "1d ago", progress: 42, color: "#10b981", icon: "🧪", docs: 5 },
  { id: 3, name: "Data Structures", description: "Trees, graphs, dynamic programming and algorithms", lastUpdated: "3d ago", progress: 85, color: "#f59e0b", icon: "🌳", docs: 2 },
  { id: 4, name: "Linear Algebra", description: "Matrices, eigenvalues, and vector spaces", lastUpdated: "5d ago", progress: 30, color: "#ec4899", icon: "📐", docs: 1 },
];

const STATS = [
  { label: "Projects", value: "4", icon: "📁", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { label: "Hours Studied", value: "142", icon: "⏱️", color: "#10b981", bg: "rgba(16,185,129,0.10)" },
  { label: "AI Chats", value: "89", icon: "🤖", color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  { label: "Flashcards Made", value: "256", icon: "🃏", color: "#ec4899", bg: "rgba(236,72,153,0.10)" },
];

const NAV = [
  { icon: "🏠", label: "Dashboard", key: "dashboard" },
  { icon: "📁", label: "Projects", key: "projects" },
  { icon: "🤖", label: "AI Chat", key: "ai" },
  { icon: "🃏", label: "Flashcards", key: "flashcards" },
  { icon: "📊", label: "Analytics", key: "analytics" },
  { icon: "⚙️", label: "Settings", key: "settings" },
];

// ── ChatGPT-style "New Project" modal ──────────────────────────
function NewProjectModal({ open, onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1=name, 2=description, 3=customise
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("📚");
  const [color, setColor] = useState("#6366f1");
  const [typing, setTyping] = useState(false);
  const nameRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    if (open) { setStep(1); setName(""); setDesc(""); setIcon("📚"); setColor("#6366f1"); }
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

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim(), icon, color });
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
                style={{ flex: 1, padding: "0.875rem", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                🚀 Create Project
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
  const [projects, setProjects] = useState(mockProjects);
  const [showNew, setShowNew] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleCreate = (proj) => {
    const newProj = {
      id: Date.now(),
      name: proj.name,
      description: proj.description || "No description yet",
      lastUpdated: "just now",
      progress: 0,
      color: proj.color,
      icon: proj.icon,
      docs: 0,
    };
    setProjects((p) => [newProj, ...p]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Student";
  const initials = displayName.slice(0, 2).toUpperCase();

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen mesh-bg" style={{ background: "var(--bg-primary)" }}>
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
        {filtered.length === 0 ? (
          <div
            className="fade-in"
            style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No projects match "{search}"</p>
            <p style={{ fontSize: "0.85rem" }}>Try a different keyword</p>
          </div>
        ) : (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {filtered.map((project, idx) => (
              <ProjectCard key={project.id} project={project} delay={idx * 0.07} onClick={() => navigate(`/project/${project.id}`)} />
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
function ProjectCard({ project, delay, onClick }) {
  const [hovered, setHovered] = useState(false);

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
              <span style={{ color: project.color, fontWeight: 600 }}>{project.progress}%</span>
            </div>
            <div style={{ height: 4, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${project.progress}%`,
                background: `linear-gradient(90deg, ${project.color}, ${project.color}99)`,
                borderRadius: 2, transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "1rem", paddingTop: "0.875rem",
        borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Updated {project.lastUpdated}</span>
          {project.docs > 0 && (
            <span className="badge badge-purple">📎 {project.docs} doc{project.docs > 1 ? "s" : ""}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["Chat", "Notes", "Quiz"].map((t) => (
            <span key={t} style={{
              fontSize: "0.68rem", padding: "0.2rem 0.5rem",
              borderRadius: "0.35rem", background: "var(--bg-hover)",
              color: "var(--text-muted)", border: "1px solid var(--border)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
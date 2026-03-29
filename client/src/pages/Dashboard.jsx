import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockProjects = [
  {
    id: 1,
    name: "Physics — Electromagnetism",
    description: "Maxwell's equations, induction, and wave theory",
    lastUpdated: "2h ago",
    progress: 68,
    color: "#6366f1",
    icon: "⚡",
  },
  {
    id: 2,
    name: "Organic Chemistry",
    description: "Reaction mechanisms, functional groups, stereochemistry",
    lastUpdated: "1d ago",
    progress: 42,
    color: "#10b981",
    icon: "🧪",
  },
  {
    id: 3,
    name: "Data Structures",
    description: "Trees, graphs, dynamic programming algorithms",
    lastUpdated: "3d ago",
    progress: 85,
    color: "#f59e0b",
    icon: "🌳",
  },
  {
    id: 4,
    name: "Linear Algebra",
    description: "Matrices, eigenvalues, vector spaces",
    lastUpdated: "5d ago",
    progress: 30,
    color: "#ec4899",
    icon: "📐",
  },
];

const stats = [
  { label: "Projects", value: "4", icon: "📁", color: "#6366f1" },
  { label: "Hours Studied", value: "142", icon: "⏱️", color: "#10b981" },
  { label: "AI Chats", value: "89", icon: "🤖", color: "#f59e0b" },
  { label: "Flashcards", value: "256", icon: "🃏", color: "#ec4899" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <div
      className="min-h-screen mesh-bg"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Orbs */}
      <div
        className="orb"
        style={{ width: 600, height: 600, top: -200, right: -200, background: "rgba(99,102,241,0.07)" }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 240,
          height: "100vh",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 0.5rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "0.625rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              📚
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Study Bhai
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem", paddingTop: "0.5rem" }}>
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "📁", label: "Projects" },
            { icon: "🤖", label: "AI Chat" },
            { icon: "🃏", label: "Flashcards" },
            { icon: "📊", label: "Analytics" },
            { icon: "⚙️", label: "Settings" },
          ].map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "0.75rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            S
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Student
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Free Plan</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ marginLeft: 240, padding: "2rem", minHeight: "100vh" }}>
        {/* Header */}
        <div
          className="fade-in"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Good evening 👋
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
              Ready to hit the books?
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowNewProject(true)}
          >
            + New Project
          </button>
        </div>

        {/* Stats */}
        <div
          className="fade-in"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ padding: "1.25rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{stat.icon}</span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: stat.color,
                    boxShadow: `0 0 8px ${stat.color}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Projects heading */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Your Projects
          </h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {mockProjects.length} projects
          </span>
        </div>

        {/* Project grid */}
        <div
          className="fade-in"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}
        >
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="card"
              style={{
                padding: "1.5rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                borderColor: hoveredCard === project.id ? project.color + "66" : undefined,
                boxShadow: hoveredCard === project.id ? `0 0 20px ${project.color}22` : undefined,
              }}
              onMouseEnter={() => setHoveredCard(project.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {/* Top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${project.color}, transparent)`,
                }}
              />

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "0.75rem",
                    background: project.color + "22",
                    border: `1px solid ${project.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  {project.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    {project.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      margin: "0 0 1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Progress */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span>Progress</span>
                      <span style={{ color: project.color }}>{project.progress}%</span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "var(--bg-hover)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${project.progress}%`,
                          background: `linear-gradient(90deg, ${project.color}, ${project.color}aa)`,
                          borderRadius: 2,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Updated {project.lastUpdated}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Chat", "Notes", "Quiz"].map((tab) => (
                    <span
                      key={tab}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "0.375rem",
                        background: "var(--bg-hover)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* New Project Modal */}
      {showNewProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowNewProject(false)}
        >
          <div
            className="glass fade-in"
            style={{ borderRadius: "1.25rem", padding: "2rem", width: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 1.5rem" }}>
              New Project
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                className="input-dark"
                placeholder="Project name (e.g. Quantum Physics)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <input
                className="input-dark"
                placeholder="Description (optional)"
              />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setShowNewProject(false)}
                >
                  Create Project
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "0.625rem",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                  onClick={() => setShowNewProject(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden mesh-bg"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Orb decorations */}
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          top: -100,
          left: -100,
          background: "rgba(99,102,241,0.12)",
        }}
      />
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          bottom: -80,
          right: -80,
          background: "rgba(139,92,246,0.1)",
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          top: "40%",
          right: "15%",
          background: "rgba(56,189,248,0.07)",
        }}
      />

      {/* Card */}
      <div
        className="glass fade-in relative z-10 w-full"
        style={{
          maxWidth: 440,
          margin: "1rem",
          borderRadius: "1.5rem",
          padding: "2.5rem",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center mb-4"
            style={{
              width: 64,
              height: 64,
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
            }}
          >
            <span style={{ fontSize: "1.75rem" }}>📚</span>
          </div>
          <h1
            className="gradient-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Study Bhai
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Your AI-powered study companion
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input-dark"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 500,
                marginBottom: "0.4rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-dark"
            />
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", marginTop: "0.5rem" }}
            onClick={() => navigate("/dashboard")}
          >
            Sign In with Supabase
          </button>

          <button
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            marginTop: "1.5rem",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{ color: "var(--accent-light)", cursor: "pointer", fontWeight: 500 }}
          >
            Sign up free
          </span>
        </p>
      </div>
    </div>
  );
}
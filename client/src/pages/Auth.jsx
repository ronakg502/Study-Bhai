import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (form.password !== form.confirm) {
        setError("Passwords don't match.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (err) throw err;
        if (data.user) navigate("/dashboard");
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { display_name: form.name },
          },
        });
        if (err) throw err;
        if (data.user) {
          setSuccess("✅ Account created! Check your email to verify, or sign in now.");
          setMode("login");
          setForm({ name: "", email: form.email, password: "", confirm: "" });
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div
      className="min-h-screen mesh-bg flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background orbs */}
      <div className="orb" style={{ width: 550, height: 550, top: -150, left: -150, background: "rgba(99,102,241,0.10)" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -100, right: -100, background: "rgba(139,92,246,0.09)" }} />
      <div className="orb" style={{ width: 280, height: 280, top: "35%", right: "10%", background: "rgba(56,189,248,0.06)" }} />

      {/* Card */}
      <div
        className="glass fade-in relative z-10 w-full"
        style={{ maxWidth: 460, margin: "1rem", borderRadius: "1.75rem", padding: "2.5rem 2.75rem" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            className="float"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 68, height: 68, borderRadius: "1.25rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 40px rgba(99,102,241,0.45)",
              marginBottom: "1.25rem",
              fontSize: "1.85rem",
            }}
          >
            📚
          </div>
          <h1
            className="gradient-text"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.1rem", fontWeight: 800, margin: 0 }}
          >
            Study Bhai
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
            {mode === "login" ? "Welcome back! Sign in to continue 👋" : "Create your account to get started 🚀"}
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex", background: "rgba(10,13,20,0.6)", borderRadius: "0.875rem",
            padding: "0.25rem", marginBottom: "1.75rem", border: "1px solid var(--border)",
          }}
        >
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{
                flex: 1, padding: "0.55rem", borderRadius: "0.625rem", border: "none",
                background: mode === m ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: mode === m ? "white" : "var(--text-muted)",
                fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: mode === m ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="fade-in"
            style={{
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "0.75rem", padding: "0.75rem 1rem",
              color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div
            className="fade-in"
            style={{
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "0.75rem", padding: "0.75rem 1rem",
              color: "#6ee7b7", fontSize: "0.85rem", marginBottom: "1rem",
            }}
          >
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "signup" && (
            <div className="fade-in">
              <label className="form-label">Full Name</label>
              <input
                className="input-dark"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required={mode === "signup"}
              />
            </div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              className="input-dark"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              {mode === "login" && (
                <span
                  style={{ fontSize: "0.78rem", color: "var(--accent-light)", cursor: "pointer" }}
                >
                  Forgot password?
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                className="input-dark"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", background: "none", border: "none",
                  color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem",
                  padding: "0.25rem",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="fade-in">
              <label className="form-label">Confirm Password</label>
              <input
                className="input-dark"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                required
              />
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.875rem", fontSize: "1rem", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              mode === "login" ? "Sign In →" : "Create Account →"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider" style={{ margin: "1.5rem 0" }}>or</div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: "100%", padding: "0.875rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-light)",
            borderRadius: "0.75rem",
            color: "var(--text-primary)",
            fontSize: "0.9rem", fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-dim)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M43.611,20.083H42V20H24v8h11.303C33.654,32.657,29.332,36,24,36c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
            <path d="M6.306,14.691l6.571,4.819C14.655,15.108,19.001,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
            <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
            <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1.75rem" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
            style={{ color: "var(--accent-light)", cursor: "pointer", fontWeight: 600 }}
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
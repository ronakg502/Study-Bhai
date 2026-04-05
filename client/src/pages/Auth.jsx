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
  const [showConfirm, setShowConfirm] = useState(false);

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
        // Sign up — create account, then redirect user to login page
        const { error: signUpErr } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { display_name: form.name },
          },
        });
        if (signUpErr) throw signUpErr;

        // Don't auto-login — switch to login mode and show success
        const savedEmail = form.email;
        setForm({ name: "", email: savedEmail, password: "", confirm: "" });
        setMode("login");
        setSuccess("🎉 Account created! Please sign in with your credentials.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div className="orb" style={{ width: 600, height: 600, top: -200, left: -200, background: "rgba(99,102,241,0.09)" }} />
      <div className="orb" style={{ width: 450, height: 450, bottom: -150, right: -150, background: "rgba(139,92,246,0.08)" }} />
      <div className="orb" style={{ width: 300, height: 300, top: "40%", right: "8%", background: "rgba(56,189,248,0.05)" }} />

      {/* Card */}
      <div
        className="glass fade-in"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 440,
          margin: "1rem",
          borderRadius: "1.5rem",
          padding: "2.25rem 2.5rem",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            className="float"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 62,
              height: 62,
              borderRadius: "1.1rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 36px rgba(99,102,241,0.45)",
              marginBottom: "1rem",
              fontSize: "1.65rem",
            }}
          >
            📚
          </div>
          <h1
            className="gradient-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.9rem",
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Study Bhai
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.875rem" }}>
            {mode === "login" ? "Welcome back! Sign in to continue 👋" : "Join free and start studying smarter 🚀"}
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(10,13,20,0.6)",
            borderRadius: "0.875rem",
            padding: "0.25rem",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
          }}
        >
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "0.55rem",
                borderRadius: "0.625rem",
                border: "none",
                background: mode === m ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: mode === m ? "white" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: mode === m ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Success alert */}
        {success && (
          <div
            className="fade-in"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              color: "#6ee7b7",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {success}
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div
            className="fade-in"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              color: "#fca5a5",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
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
                <span style={{ fontSize: "0.78rem", color: "var(--accent-light)", cursor: "pointer" }}>
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
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem",
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
              <div style={{ position: "relative" }}>
                <input
                  className="input-dark"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  required
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    padding: "0.25rem",
                  }}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "1rem",
              marginTop: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              mode === "login" ? "Sign In →" : "Create Account & Start →"
            )}
          </button>
        </form>


        {/* Footer */}
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ color: "var(--accent-light)", cursor: "pointer", fontWeight: 600 }}
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
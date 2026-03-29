import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProjectRoom from "./pages/ProjectRoom/layout";

function ProtectedRoute({ children, user, loading }) {
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg-primary)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "1rem",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", margin: "0 auto 1rem",
            boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
            animation: "float 2s ease-in-out infinite",
          }}>
            📚
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading Study Bhai…</div>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            loading ? null : user ? <Navigate to="/dashboard" replace /> : <Auth />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/*"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ProjectRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

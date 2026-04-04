import { useState, useRef, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { supabase } from "../../lib/supabase";

const defaultSuggestions = [
  "Summarize the key concepts from the uploaded material",
  "Explain the most important topics in detail",
  "Give me a quiz based on this material",
  "List the main formulas and definitions",
];

const noDocSuggestions = [
  "What should I study for my exam?",
  "Help me create a study plan",
  "Explain a concept to me",
  "Give me tips for effective studying",
];

const WELCOME_MSG = {
  role: "ai",
  text: "Hi! I'm your AI study assistant 🤖\n\nUpload a PDF using the button above and ask me anything about it — I'll explain concepts, generate quizzes, create summaries, and more!",
};

const PDF_MSG = {
  role: "ai",
  text: "📄 PDF loaded successfully! I've read through your material.\n\nAsk me anything — I can explain concepts, generate quizzes, create summaries, highlight key points, and more!",
};

export default function Chat({ pdfText = "", projectId }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [clearingChat, setClearingChat] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Load saved history from Supabase on mount ───────────────────
  useEffect(() => {
    if (!projectId) return;

    const loadHistory = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, text, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        setChat(data.map((r) => ({ role: r.role, text: r.text })));
      } else {
        // No history — show welcome
        setChat([WELCOME_MSG]);
      }
      setHistoryLoaded(true);
    };

    loadHistory();
  }, [projectId]);

  // ── When PDF is uploaded → add a context message (don't overwrite history) ──
  useEffect(() => {
    if (!historyLoaded) return;
    if (pdfText) {
      setChat((prev) => {
        // Only add if last message isn't already the PDF message
        const last = prev[prev.length - 1];
        if (last?.text === PDF_MSG.text) return prev;
        return [...prev, PDF_MSG];
      });
    }
  }, [pdfText, historyLoaded]);

  const suggestions = pdfText ? defaultSuggestions : noDocSuggestions;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // ── Save a message to Supabase ─────────────────────────────────
  const saveMessage = useCallback(async (role, text) => {
    if (!projectId) return;
    await supabase.from("chat_messages").insert({ project_id: projectId, role, text });
  }, [projectId]);

  // ── Clear chat history ─────────────────────────────────────────
  const clearHistory = async () => {
    if (!projectId || clearingChat) return;
    setClearingChat(true);
    await supabase.from("chat_messages").delete().eq("project_id", projectId);
    setChat([WELCOME_MSG]);
    setClearingChat(false);
  };

  // ── Auto-resize textarea ───────────────────────────────────────
  const handleChange = (e) => {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const sendMessage = async (text) => {
    const userMsg = text || message;
    if (!userMsg.trim() || loading) return;

    const userEntry = { role: "user", text: userMsg };
    setChat((prev) => [...prev, userEntry]);
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    // Save user message
    await saveMessage("user", userMsg);

    try {
      const res = await api.post("/ai/chat", {
        message: userMsg,
        context: pdfText || "No study material uploaded yet. Help the student with general study advice.",
      });
      const aiEntry = { role: "ai", text: res.data.reply };
      setChat((prev) => [...prev, aiEntry]);
      // Save AI reply
      await saveMessage("ai", res.data.reply);
    } catch (err) {
      const errMsg =
        err?.response?.data?.error || err?.message || "Unknown error";
      const errEntry = {
        role: "ai",
        text: `⚠️ AI server error: ${errMsg}\n\nMake sure your server is running on port 5000.`,
      };
      setChat((prev) => [...prev, errEntry]);
      await saveMessage("ai", errEntry.text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 130px)",
        maxWidth: 780,
        margin: "0 auto",
        width: "100%",
        padding: "0 1rem",
      }}
    >
      {/* ── Messages area ─────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "1.5rem 0 1rem",
        }}
      >
        {/* History header */}
        {chat.length > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.625rem",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              💬 {chat.length - 1} message{chat.length - 1 !== 1 ? "s" : ""} in this session
            </span>
            <button
              onClick={clearHistory}
              disabled={clearingChat}
              style={{
                fontSize: "0.72rem",
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: clearingChat ? "not-allowed" : "pointer",
                opacity: clearingChat ? 0.5 : 1,
                padding: "0.2rem 0.5rem",
                borderRadius: "0.375rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {clearingChat ? "Clearing…" : "🗑 Clear history"}
            </button>
          </div>
        )}

        {chat.map((msg, i) =>
          msg.role === "ai" ? (
            <div
              key={i}
              className="fade-in"
              style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}
            >
              {/* AI avatar */}
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e2742, #2e3f6e)",
                  border: "1px solid var(--border-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem", flexShrink: 0, marginTop: "0.1rem",
                }}
              >
                🤖
              </div>
              <div
                style={{
                  flex: 1,
                  color: "var(--text-primary)",
                  fontSize: "0.93rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="fade-in" style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #5557e8, #7c3aed)",
                  color: "white",
                  borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
                  padding: "0.75rem 1.125rem",
                  maxWidth: "72%",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
                }}
              >
                {msg.text}
              </div>
            </div>
          )
        )}

        {/* Loading — AI typing indicator */}
        {loading && (
          <div className="fade-in" style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #1e2742, #2e3f6e)",
                border: "1px solid var(--border-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "0.75rem 0" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "var(--text-muted)",
                    animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips (first message only) ─────── */}
      {chat.length <= 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "0.875rem" }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "2rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent-light)";
                e.currentTarget.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "var(--bg-card)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ──────────────────────────────────── */}
      <div
        style={{
          paddingBottom: "1.25rem",
          position: "sticky",
          bottom: 0,
          background: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.625rem",
            alignItems: "flex-end",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "1.125rem",
            padding: "0.625rem 0.75rem 0.625rem 1rem",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Message Study Bhai... (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.91rem",
              resize: "none",
              lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
              maxHeight: 160,
              overflow: "auto",
              padding: "0.25rem 0",
            }}
          />

          {/* Send button */}
          <button
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            style={{
              width: 36, height: 36,
              borderRadius: "0.625rem",
              border: "none",
              background:
                loading || !message.trim()
                  ? "var(--bg-hover)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: loading || !message.trim() ? "var(--text-muted)" : "white",
              cursor: loading || !message.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", flexShrink: 0,
              transition: "all 0.2s",
              boxShadow: loading || !message.trim() ? "none" : "0 2px 12px rgba(99,102,241,0.35)",
            }}
          >
            {loading ? (
              <span
                style={{
                  width: 14, height: 14,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : ("↑")}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.68rem", color: "var(--text-muted)", margin: "0.5rem 0 0" }}>
          AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  );
}
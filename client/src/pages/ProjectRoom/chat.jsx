import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";

const suggestions = [
  "Explain Faraday's Law of Induction",
  "What is the difference between AC and DC?",
  "Summarize the key equations in electromagnetism",
  "Give me a quiz on Maxwell's equations",
];

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI study assistant 🤖 Upload a PDF and ask me anything about it — I'll explain concepts, generate quizzes, create summaries, and more!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || message;
    if (!userMsg.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: userMsg,
        context: "electromagnetism study material",
      });
      setChat((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Couldn't reach the AI server. Make sure your server is running and your OpenAI API key is set.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        maxWidth: 860,
        margin: "0 auto",
        width: "100%",
        padding: "1.5rem 1.5rem 0",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          paddingBottom: "1.5rem",
        }}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className="fade-in"
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: "0.75rem",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #6366f1, #ec4899)"
                    : "linear-gradient(135deg, #1c2333, #2a3550)",
                border: "1px solid var(--border)",
              }}
            >
              {msg.role === "user" ? "S" : "🤖"}
            </div>

            <div
              className={msg.role === "user" ? "chat-user" : "chat-ai"}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div
            className="fade-in"
            style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1c2333, #2a3550)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
              }}
            >
              🤖
            </div>
            <div
              className="chat-ai"
              style={{ display: "flex", gap: "0.3rem", alignItems: "center", padding: "1rem 1.25rem" }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    animation: `float 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {chat.length <= 1 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "2rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.color = "var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.color = "var(--text-secondary)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          paddingBottom: "1.5rem",
          background: "var(--bg-primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.75rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            alignItems: "flex-end",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about your material... (Enter to send)"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              resize: "none",
              lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
              maxHeight: 120,
              overflow: "auto",
            }}
          />
          <button
            className="btn-primary"
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.85rem",
              opacity: loading || !message.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            {loading ? "..." : "Send →"}
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}
        >
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
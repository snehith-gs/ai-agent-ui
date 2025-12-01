import React, { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  session_id: string;
  reply: string;
  history: ChatMessage[];
  // we also get sources from RAG but we’ll ignore them for now
};

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const prevMessages = [...messages, userMsg];

    setMessages(prevMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const body: any = {
        message: userMsg.content,
        use_rag: true,
      };
      if (sessionId) {
        body.session_id = sessionId;
      }

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data: ChatResponse = await res.json();

      setSessionId(data.session_id);
      // backend already returns full history; we can trust history
      setMessages(data.history);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <h1 style={styles.title}>AI Agent Lab – Chat</h1>

        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              Start chatting with your AI agent…
            </div>
          )}
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...(m.role === "user" ? styles.userMsg : styles.assistantMsg),
              }}
            >
              <div style={styles.msgRole}>
                {m.role === "user" ? "You" : "Agent"}
              </div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something…"
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>

        {sessionId && (
          <div style={styles.sessionInfo}>
            Session: <code>{sessionId}</code>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#e5e7eb",
    padding: "16px",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "800px",
    background: "#020617",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
  },
  title: {
    marginBottom: "12px",
    fontSize: "20px",
    fontWeight: 600,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    borderRadius: "8px",
    padding: "8px",
    background: "#020617",
    border: "1px solid #1e293b",
  },
  message: {
    padding: "8px 10px",
    borderRadius: "8px",
    marginBottom: "8px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
  },
  userMsg: {
    background: "#1d4ed8",
    marginLeft: "auto",
  },
  assistantMsg: {
    background: "#111827",
    marginRight: "auto",
  },
  msgRole: {
    fontSize: "11px",
    opacity: 0.7,
    marginBottom: "4px",
  },
  form: {
    display: "flex",
    marginTop: "8px",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    background: "#020617",
    color: "#e5e7eb",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#22c55e",
    color: "#020617",
    fontWeight: 600,
  },
  error: {
    marginTop: "6px",
    color: "#f97316",
    fontSize: "13px",
  },
  emptyState: {
    textAlign: "center",
    fontSize: "13px",
    opacity: 0.7,
    marginTop: "12px",
  },
  sessionInfo: {
    marginTop: "6px",
    fontSize: "11px",
    opacity: 0.7,
  },
};

export default App;

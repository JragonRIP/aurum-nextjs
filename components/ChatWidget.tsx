"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const WELCOME: ChatMessage = {
  role: "model",
  content:
    "Hi — I'm the Aurum Auto Detail assistant. Are you looking for an interior detail, exterior detail, or a full detail?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      // Drop the local welcome bubble — Gemini history must start with a user turn.
      const apiMessages = nextMessages.slice(1);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || "Request failed.");
      }

      setMessages((prev) => [...prev, { role: "model", content: data.reply! }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.35)] bg-zinc-950/95 shadow-[0_0_40px_rgba(0,0,0,0.85)] backdrop-blur-md"
          role="dialog"
          aria-label="Aurum Auto Detail chat"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Aurum Assistant</p>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[rgba(201,168,76,0.8)]">
                Ask about detailing
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[rgba(201,168,76,0.2)] text-zinc-50"
                      : "bg-zinc-900 text-zinc-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm text-zinc-400">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-zinc-800/80 p-3"
          >
            {error && (
              <p className="mb-2 text-xs text-red-400" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={2000}
                placeholder="Ask a question…"
                disabled={loading}
                className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.45)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-[rgba(201,168,76,0.9)] px-3 py-2 text-sm font-medium text-zinc-950 transition hover:bg-[#d1b35a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(201,168,76,0.55)] bg-zinc-950 text-[rgba(201,168,76,0.95)] shadow-[0_0_28px_rgba(201,168,76,0.25)] transition hover:scale-105 hover:bg-zinc-900 hover:shadow-[0_0_36px_rgba(201,168,76,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(201,168,76,0.8)]"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? (
          <span className="text-lg leading-none">✕</span>
        ) : (
          <ChatIcon />
        )}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H7l-4 3V11.5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

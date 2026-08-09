"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { parseChatReply } from "@/lib/aurum-knowledge";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const WELCOME: ChatMessage = {
  role: "model",
  content:
    "Hi — I'm the Aurum Auto Detail assistant. Are you looking for an interior detail, exterior detail, or a full detail?",
};

const TIP_DELAY_MS = 1400;
const TIP_HOLD_MS = 5000;
const TIP_SLIDE_MS = 550;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [tipShown, setTipShown] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const tipPlayedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  // Lock body scroll while chat is open on mobile
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Expand FAB into a label pill, hold 5s, then collapse back
  useEffect(() => {
    if (open) {
      setTipShown(false);
      tipPlayedRef.current = true;
      return;
    }

    if (tipPlayedRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tipPlayedRef.current = true;
      return;
    }

    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setTipShown(true);
      }, TIP_DELAY_MS)
    );

    timers.push(
      window.setTimeout(() => {
        setTipShown(false);
      }, TIP_DELAY_MS + TIP_HOLD_MS)
    );

    timers.push(
      window.setTimeout(() => {
        tipPlayedRef.current = true;
      }, TIP_DELAY_MS + TIP_HOLD_MS + TIP_SLIDE_MS)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [open]);

  function openQuoteCalculator() {
    setOpen(false);
    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("aurum:open-quote", { detail: { id: "quote" } })
      );
      document
        .getElementById("quote")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

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
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-end p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))] sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pr-[max(1rem,env(safe-area-inset-right))]"
      style={{ touchAction: "manipulation" }}
    >
      {open && (
        <div
          className="pointer-events-auto mb-3 flex w-full flex-col overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.35)] bg-zinc-950 shadow-[0_0_40px_rgba(0,0,0,0.85)] md:bg-zinc-950/95 md:backdrop-blur-md"
          style={{
            maxWidth: "min(100%, clamp(20rem, 92vw, 22rem))",
            height:
              "min(32rem, calc(100dvh - 5.5rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px)))",
            maxHeight:
              "calc(100dvh - 5.5rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Aurum Auto Detail chat"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 px-4 py-3">
            <div className="min-w-0">
              <p className="text-base font-semibold text-zinc-50 sm:text-sm">
                Aurum Assistant
              </p>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[rgba(201,168,76,0.8)] sm:text-[0.65rem]">
                Ask about detailing
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl text-lg text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100 active:bg-zinc-800"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3 [-webkit-overflow-scrolling:touch]"
          >
            {messages.map((message, index) => {
              const parsed =
                message.role === "model"
                  ? parseChatReply(message.content)
                  : { text: message.content, showQuoteButton: false };

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] space-y-2.5 rounded-2xl px-3.5 py-2.5 text-base leading-relaxed break-words sm:text-sm ${
                      message.role === "user"
                        ? "bg-[rgba(201,168,76,0.2)] text-zinc-50"
                        : "bg-zinc-900 text-zinc-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{parsed.text}</p>
                    {parsed.showQuoteButton ? (
                      <button
                        type="button"
                        onClick={openQuoteCalculator}
                        className="metallic-gold inline-flex w-full touch-manipulation items-center justify-center rounded-full px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
                      >
                        <span>Open quote calculator</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-zinc-900 px-3.5 py-2.5 text-base text-zinc-400 sm:text-sm">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-zinc-800/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3"
          >
            {error && (
              <p className="mb-2 text-sm text-red-400 sm:text-xs" role="alert">
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
                enterKeyHint="send"
                autoComplete="off"
                autoCorrect="on"
                placeholder="Ask a question…"
                disabled={loading}
                // text-base (16px) prevents iOS Safari zoom on focus
                className="max-h-28 min-h-[2.75rem] flex-1 touch-manipulation resize-none rounded-xl border border-zinc-800 bg-black/40 px-3 py-2.5 text-base leading-snug text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.45)] disabled:opacity-60 sm:min-h-[2.5rem] sm:text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 min-w-[4.25rem] touch-manipulation items-center justify-center rounded-xl bg-[rgba(201,168,76,0.9)] px-3 text-base font-medium text-zinc-950 transition hover:bg-[#d1b35a] active:bg-[#c4a84e] disabled:cursor-not-allowed disabled:opacity-50 sm:h-auto sm:min-w-0 sm:py-2 sm:text-sm"
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
        className={`chat-fab-btn pointer-events-auto touch-manipulation ${
          !open && tipShown ? "is-expanded" : ""
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {!open ? (
          <span className="chat-fab-label" aria-hidden={!tipShown}>
            Have a Question? Ask AI
          </span>
        ) : null}
        <span className="chat-fab-icon" aria-hidden="true">
          {open ? <span className="text-lg leading-none">✕</span> : <ChatIcon />}
        </span>
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

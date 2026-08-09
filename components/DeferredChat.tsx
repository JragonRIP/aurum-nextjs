"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(
  () =>
    import("@/components/ChatWidget").then((mod) => ({
      default: mod.ChatWidget,
    })),
  { ssr: false }
);

/** Loads the chat widget after first paint so it never blocks landing. */
export function DeferredChat() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;

    const show = () => {
      if (!cancelled) setMounted(true);
    };

    const timeoutId = window.setTimeout(show, 1200);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(show, { timeout: 2000 });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  // Always render the same null on server + first client paint (avoids hydration mismatch).
  if (!mounted) return null;
  return <ChatWidget />;
}

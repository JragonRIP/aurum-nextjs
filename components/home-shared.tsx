"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

export function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    el.classList.add("opacity-0", "translate-y-6");
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function FadeSection({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useFadeInOnScroll();
  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-[clamp(5.5rem,4.5rem+3vw,7rem)] transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </section>
  );
}

export function ShinyCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    el.style.setProperty("--shine-x", `${x}px`);
    el.style.setProperty("--shine-y", `${y}px`);
    el.style.setProperty("--shine-opacity", "1");
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--shine-opacity", "0");
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden ${className}`}
      style={
        {
          "--shine-x": "50%",
          "--shine-y": "50%",
          "--shine-opacity": "0",
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={
          {
            background:
              "radial-gradient(220px circle at var(--shine-x) var(--shine-y), rgba(201, 168, 76, 0.2), rgba(201, 168, 76, 0.08) 26%, transparent 65%)",
            opacity: "var(--shine-opacity)",
          } as CSSProperties
        }
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30 aurum-shimmer"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

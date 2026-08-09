"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// No `loading` UI here — a skeleton on the client while SSR sends real HTML
// causes a hydration mismatch / Next.js error overlay.
const HomeBelowFold = dynamic(() => import("@/components/HomeBelowFold"));

const SCROLL_GAIN = 0.28;
const LERP_FOLLOW = 0.38;
const LERP_SETTLE = 0.5;
const MAX_OFFSET = 8;

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = pillRef.current;
    if (!el) return;

    let lastScrollY = window.scrollY;
    let current = 0;
    let target = 0;
    let rafId = 0;
    let running = true;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      // Move opposite to scroll (scroll down → pill drifts up)
      target -= delta * SCROLL_GAIN;
      if (target > MAX_OFFSET) target = MAX_OFFSET;
      else if (target < -MAX_OFFSET) target = -MAX_OFFSET;
    };

    const tick = () => {
      if (!running) return;

      // Follow the opposing scroll nudge
      current += (target - current) * LERP_FOLLOW;
      // Strong magnetic pull back to rest position
      target += (0 - target) * LERP_SETTLE;

      if (Math.abs(current) < 0.05 && Math.abs(target) < 0.05) {
        current = 0;
        target = 0;
        el.style.transform = "translate3d(0, 0, 0)";
      } else {
        el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, []);

  return (
    <div id="top" className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* Floating pill nav */}
      <header
        className="sticky top-0 z-30 flex justify-center pointer-events-none"
        style={{
          paddingInline: "var(--page-pad-x)",
          paddingTop: "max(0.85rem, env(safe-area-inset-top))",
        }}
      >
        <div
          ref={pillRef}
          className="pointer-events-auto w-full max-w-3xl will-change-transform"
        >
          <div
            className="pill-float relative flex w-full items-center justify-between gap-2 rounded-full border border-zinc-700/60 bg-zinc-950/90 shadow-[0_4px_12px_rgba(0,0,0,0.35),0_18px_40px_rgba(0,0,0,0.55)] transition-shadow duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4),0_22px_48px_rgba(0,0,0,0.6)] sm:gap-4"
            style={{
              paddingInline: "var(--nav-pad-x)",
              paddingBlock: "var(--nav-pad-y)",
            }}
          >
          <a href="#top" className="flex shrink-0 items-center self-center">
            <img
              src="/logo-horizontal.webp"
              alt="Aurum Auto Detail"
              className="fluid-logo"
            />
          </a>
          <nav className="hidden items-center gap-[clamp(1rem,0.6rem+1.5vw,1.75rem)] text-sm text-zinc-300 md:flex">
            <a href="#services" className="transition-colors hover:text-[rgba(201,168,76,0.95)]">
              Services
            </a>
            <a href="#results" className="transition-colors hover:text-[rgba(201,168,76,0.95)]">
              Results
            </a>
            <a href="#about" className="transition-colors hover:text-[rgba(201,168,76,0.95)]">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-[rgba(201,168,76,0.95)]">
              Contact
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#contact"
              className="metallic-gold hidden rounded-full px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] sm:inline-flex"
            >
              <span>Request a Detail</span>
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-zinc-200 md:hidden"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? (
                <span className="text-lg leading-none" aria-hidden>
                  ×
                </span>
              ) : (
                <span className="flex flex-col gap-1" aria-hidden>
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                  <span className="block h-0.5 w-4 rounded-full bg-current" />
                </span>
              )}
            </button>
          </div>

          {mobileNavOpen ? (
            <div
              id="mobile-nav-menu"
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_16px_40px_rgba(0,0,0,0.75)] md:hidden"
            >
              <nav className="flex flex-col px-4 py-2 text-base text-zinc-100">
                <a
                  href="#services"
                  className="min-h-12 touch-manipulation border-b border-zinc-800/80 py-3.5 transition-colors hover:text-[rgba(201,168,76,0.95)]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#results"
                  className="min-h-12 touch-manipulation border-b border-zinc-800/80 py-3.5 transition-colors hover:text-[rgba(201,168,76,0.95)]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Results
                </a>
                <a
                  href="#about"
                  className="min-h-12 touch-manipulation border-b border-zinc-800/80 py-3.5 transition-colors hover:text-[rgba(201,168,76,0.95)]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="min-h-12 touch-manipulation border-b border-zinc-800/80 py-3.5 transition-colors hover:text-[rgba(201,168,76,0.95)]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Contact
                </a>
                <a
                  href="#contact"
                  className="my-3 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-[rgba(201,168,76,0.45)] bg-[rgba(201,168,76,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(201,168,76,0.98)]"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Request a Detail
                </a>
              </nav>
            </div>
          ) : null}
          </div>
        </div>
      </header>

      <main
        className="page-shell pb-[clamp(3rem,2rem+3vw,4.5rem)]"
        style={{ paddingTop: "var(--page-pad-y)" }}
      >
        {/* Hero — visible immediately (no fade-in delay) */}
        <section
          className="relative flex flex-col items-start justify-center"
          style={{
            minHeight: "var(--hero-min-h)",
            gap: "var(--content-gap)",
            paddingBottom: "clamp(2.5rem, 1.5rem + 3vw, 5rem)",
          }}
        >
          <div className="pointer-events-none absolute -top-24 bottom-0 left-0 right-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(24,24,27,1),_black_60%)]" />
          <div
            className="grid w-full items-center"
            style={{
              gap: "var(--content-gap)",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 18.5rem), 1fr))",
            }}
          >
            <div
              className="max-w-xl"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(1.1rem, 0.85rem + 1vw, 1.5rem)",
              }}
            >
              <p className="text-[clamp(0.62rem,0.55rem+0.25vw,0.75rem)] font-semibold uppercase tracking-[0.28em] text-[rgba(201,168,76,0.85)]">
                Hermansville, Michigan · Upper Peninsula
              </p>
              <h1 className="font-display type-display font-semibold text-zinc-50">
                Upper Peninsula&apos;s
                <span className="mt-1 block font-medium tracking-[0.06em] text-[rgba(201,168,76,0.88)]">
                  Luxury Auto Detailing
                </span>
              </h1>
              <p className="type-lead max-w-lg text-zinc-400">
                Mobile or in-garage service tailored to your schedule. We come to you in
                Hermansville and across the U.P. for meticulous, high-end detailing that
                makes your vehicle feel better than new.
              </p>
              <div className="flex flex-col items-start gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
                <a
                  href="#contact"
                  className="metallic-gold inline-flex w-full max-w-sm touch-manipulation items-center justify-center rounded-full px-7 py-[clamp(0.75rem,0.65rem+0.4vw,0.9rem)] text-sm font-semibold tracking-[0.15em] min-[480px]:w-auto"
                >
                  <span>Book a Detail</span>
                </a>
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[rgba(201,168,76,0.78)]">
                  Limited slots each week
                </span>
              </div>
            </div>
            <div className="hero-media relative overflow-hidden border border-[rgba(201,168,76,0.35)] bg-zinc-950/70 shadow-[0_0_45px_rgba(201,168,76,0.25)]">
              <Image
                src="/porche-detail-tire.webp"
                alt="Detailed vehicle wheel and side profile"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_55%)]" />
            </div>
          </div>
          <div className="grid-highlights mt-[clamp(1rem,0.5rem+1.5vw,1.5rem)] w-full text-xs text-zinc-400">
            <div className="rounded-[var(--radius-xl)] border border-zinc-800 bg-zinc-950/50 p-[clamp(0.9rem,0.7rem+0.8vw,1rem)]">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                MOBILE & GARAGE
              </p>
              <p className="mt-2 text-sm text-zinc-200">We come to you</p>
              <p className="mt-1">
                Drive-in or on-site service for daily drivers, trucks, classics, and more.
              </p>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-zinc-800 bg-zinc-950/50 p-[clamp(0.9rem,0.7rem+0.8vw,1rem)]">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                HAND FINISHED
              </p>
              <p className="mt-2 text-sm text-zinc-200">No rushed volume jobs</p>
              <p className="mt-1">
                Every vehicle is treated like it&apos;s my own, with careful hand work.
              </p>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-zinc-800 bg-zinc-950/50 p-[clamp(0.9rem,0.7rem+0.8vw,1rem)]">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                LOCALLY BUILT
              </p>
              <p className="mt-2 text-sm text-zinc-200">Upper Peninsula proud</p>
              <p className="mt-1">
                Independently owned Hermansville business serving the U.P. community.
              </p>
            </div>
          </div>
        </section>

        {/* Everything below the fold loads in a separate chunk after first paint */}
        <HomeBelowFold />
      </main>
    </div>
  );
}

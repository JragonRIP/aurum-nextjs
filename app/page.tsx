"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

function useFadeInOnScroll() {
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
      { threshold: 0.2 }
    );

    el.classList.add("opacity-0", "translate-y-6");
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}

function FadeSection({
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
      className={`transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </section>
  );
}

function ShinyCard({
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
        className="pointer-events-none absolute inset-0 z-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
        style={
          {
            background:
              "linear-gradient(115deg, transparent 22%, rgba(201, 168, 76, 0.18) 42%, rgba(201, 168, 76, 0.08) 50%, transparent 72%)",
            backgroundSize: "220% 220%",
            animation: "aurumShimmer 6s ease-in-out infinite",
          } as CSSProperties
        }
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Aurum Auto Detail logo"
              className="h-14 w-auto max-w-full [mask-image:radial-gradient(ellipse_at_center,black_72%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_72%,transparent_100%)] md:h-20 lg:h-24"
            />
            <span className="sr-only">Aurum Auto Detail</span>
          </a>
          <nav className="hidden gap-8 text-sm text-zinc-300 md:flex">
            <a href="#services" className="hover:text-[rgba(201,168,76,0.95)] transition-colors">
              Services
            </a>
            <a href="#pricing" className="hover:text-[rgba(201,168,76,0.95)] transition-colors">
              Pricing
            </a>
            <a href="#about" className="hover:text-[rgba(201,168,76,0.95)] transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-[rgba(201,168,76,0.95)] transition-colors">
              Contact
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.07)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[rgba(201,168,76,0.95)] shadow-[0_0_25px_rgba(201,168,76,0.15)] transition hover:bg-[rgba(201,168,76,0.14)] md:text-[0.7rem]"
          >
            Request a Detail
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-20">
        {/* Hero */}
        <FadeSection
          className="relative flex min-h-[70vh] flex-col items-start justify-center gap-10 pb-20 pt-10 md:min-h-[80vh]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(24,24,27,1),_black_60%)]" />
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
              Hermansville, Michigan · Upper Peninsula
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
              Premium Auto Detailing
              <span className="block text-zinc-400">in the Upper Peninsula</span>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
              Mobile or in-garage service tailored to your schedule. We come to you in
              Hermansville and across the U.P. for meticulous, high-end detailing that
              makes your vehicle feel better than new.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-[rgba(201,168,76,0.96)] px-7 py-3 text-sm font-medium tracking-[0.15em] text-black shadow-[0_0_35px_rgba(201,168,76,0.55)] transition hover:bg-[#d1b35a]"
              >
                Book a Detail
              </a>
              <span className="text-xs text-zinc-500">
                Limited slots each week · Fully insured
              </span>
            </div>
          </div>
          <div className="mt-6 grid w-full gap-4 text-xs text-zinc-400 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                MOBILE & GARAGE
              </p>
              <p className="mt-2 text-sm text-zinc-200">We come to you</p>
              <p className="mt-1">
                Drive-in or on-site service for daily drivers, trucks, classics, and more.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                HAND FINISHED
              </p>
              <p className="mt-2 text-sm text-zinc-200">No rushed volume jobs</p>
              <p className="mt-1">
                Every vehicle is treated like it&apos;s my own, with careful hand work.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-[rgba(201,168,76,0.85)]">
                LOCALLY BUILT
              </p>
              <p className="mt-2 text-sm text-zinc-200">Upper Peninsula proud</p>
              <p className="mt-1">
                Independently owned Hermansville business serving the U.P. community.
              </p>
            </div>
          </div>
        </FadeSection>

        {/* Services & Pricing */}
        <FadeSection
          id="services"
          className="border-t border-zinc-900/80 pt-12 md:pt-16"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
                Services
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
                Signature Detailing Packages
              </h2>
              <p className="mt-3 max-w-md text-sm text-zinc-400">
                Transparent pricing ranges based on vehicle size and condition. Every
                package includes careful prep, quality products, and a perfectionist&apos;s
                eye for the details.
              </p>
            </div>
          </div>

          <div
            id="pricing"
            className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3"
          >
            {/* Exterior Detail */}
            <ShinyCard className="flex flex-col justify-between rounded-3xl border border-[rgba(201,168,76,0.4)] bg-zinc-950/60 p-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">
                  Exterior Detail
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.75)]">
                  $80–$120
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>Pre-rinse & foam soak</li>
                  <li>Hand wash with premium shampoo</li>
                  <li>Thorough rinse to remove residue</li>
                  <li>Tire and wheel clean & shine</li>
                  <li>Gentle hand dry with soft towels</li>
                </ul>
              </div>
              <p className="mt-5 text-xs text-zinc-500">
                Ideal for maintaining a glossy, cared-for exterior between full
                details.
              </p>
            </ShinyCard>

            {/* Interior Detail */}
            <ShinyCard className="flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">
                  Interior Detail
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.75)]">
                  $110–$150
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>Floor mat wash and refresh</li>
                  <li>Full interior vacuum</li>
                  <li>All surface cleanse (dash, doors, console)</li>
                  <li>Deep clean seats (cloth or leather-safe)</li>
                  <li>Clean all windows (interior & exterior)</li>
                </ul>
              </div>
              <p className="mt-5 text-xs text-zinc-500">
                Perfect for families, commuters, and anyone wanting a fresh, reset
                cabin.
              </p>
            </ShinyCard>

            {/* Full Detail */}
            <ShinyCard className="flex flex-col justify-between rounded-3xl border border-[rgba(201,168,76,0.75)] bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_55%),_rgb(9,9,11)] p-6 shadow-[0_0_55px_rgba(201,168,76,0.55)]">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">
                  Full Detail
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.9)]">
                  $300–$350
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                  <li>Everything in Exterior Detail</li>
                  <li>Everything in Interior Detail</li>
                  <li>Undercarriage rinse</li>
                  <li>Glass rain repellent treatment</li>
                  <li>Deodorizer throughout cabin</li>
                  <li>Door jamb deep clean</li>
                </ul>
              </div>
              <p className="mt-5 text-xs text-[rgba(249,250,251,0.85)]">
                The full reset. Recommended for new-to-you vehicles, pre-sale prep, or
                a once-a-year deep clean.
              </p>
            </ShinyCard>
          </div>
        </FadeSection>

        {/* Add-Ons */}
        <FadeSection
          id="addons"
          className="mt-14 border-t border-zinc-900/80 pt-12 md:mt-16 md:pt-16"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
                Add-Ons
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
                Fine-Tune Your Detail
              </h2>
              <p className="mt-3 max-w-md text-sm text-zinc-400">
                Customize your service with focused add-ons to tackle problem areas or
                upgrade protection. Priced as ranges based on vehicle size and
                condition.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 text-sm text-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Wax and Sealant", price: "$30–$40" },
              { name: "Engine Bay Cleaning", price: "$40–$50" },
              { name: "Glass Rain Repellent", price: "$10–$20" },
              { name: "Undercarriage Rinse", price: "$10–$20" },
              { name: "Bug or Sap Removal", price: "$5–$10" },
              { name: "Pet Hair Removal", price: "$15–$20" },
              { name: "Steam Clean Seat/Carpet", price: "$25–$40" },
              { name: "Child Car Seat Clean", price: "$10" },
              { name: "Deodorizer", price: "$5" },
              { name: "Door Jamb Deep Clean", price: "$10–$15" },
            ].map((item) => (
              <ShinyCard
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3"
              >
                <span className="text-sm text-zinc-100">{item.name}</span>
                <span className="text-xs font-medium text-[rgba(201,168,76,0.9)]">
                  {item.price}
                </span>
              </ShinyCard>
            ))}
          </div>
        </FadeSection>

        {/* About */}
        <FadeSection
          id="about"
          className="mt-14 border-t border-zinc-900/80 pt-12 md:mt-16 md:pt-16"
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
                About Aurum
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
                Built From the Ground Up
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300">
                <p>
                  At 16, I started Aurum Auto Detail with nothing but a pressure washer,
                  a dream, and a refusal to work for anyone else. What began as a side
                  hustle in Hermansville has grown into a licensed LLC serving the Upper
                  Peninsula.
                </p>
                <p>
                  Every detail I do is personal — this isn&apos;t a job to me, it&apos;s the
                  foundation of something bigger. I&apos;m building a reputation one
                  vehicle at a time, and I&apos;m not interested in shortcuts.
                </p>
                <p>
                  When you choose Aurum, you&apos;re not hiring a corporation. You&apos;re
                  supporting a young entrepreneur who takes more pride in your vehicle
                  than most shops twice the size. Your car leaves cleaner, crisper, and
                  cared for in a way you can feel.
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.15),_transparent_55%),_rgb(9,9,11)] p-6 text-sm text-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[rgba(201,168,76,0.9)]">
                    OWNER / OPERATOR
                  </p>
                  <p className="mt-2 text-base text-zinc-50">Aurum Auto Detail</p>
                  <p className="text-xs text-zinc-400">
                    Hermansville, Michigan · Upper Peninsula
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                Every appointment is booked, executed, and quality-checked by the same
                person: the owner. That means no &quot;shop lottery&quot; or mystery crews —
                just consistent, high-end work.
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-zinc-400">
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                    Service Area
                  </dt>
                  <dd className="mt-1 text-zinc-200">
                    Hermansville and surrounding U.P. communities
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                    Vehicles
                  </dt>
                  <dd className="mt-1 text-zinc-200">
                    Daily drivers, trucks, SUVs, classics, weekend builds
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </FadeSection>

        {/* Contact */}
        <FadeSection
          id="contact"
          className="mt-14 border-t border-zinc-900/80 pt-12 md:mt-16 md:pt-16"
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
                Contact
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
                Request a Detail
              </h2>
              <p className="mt-3 max-w-md text-sm text-zinc-400">
                Tell me about your vehicle, where you&apos;re located, and what you&apos;re
                looking for. I&apos;ll follow up to confirm availability, pricing, and
                options that fit your schedule.
              </p>
              <p className="mt-4 text-xs text-zinc-500">
                This form is a request — your appointment is confirmed once you receive a
                reply and booking time.
              </p>
              <div className="mt-5 space-y-1 text-sm text-zinc-300">
                <p>
                  Phone:{" "}
                  <a
                    href="tel:9062900302"
                    className="text-[rgba(201,168,76,0.9)] transition hover:text-[#d1b35a]"
                  >
                    906-290-0302
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:aurumautodetail906@gmail.com"
                    className="text-[rgba(201,168,76,0.9)] transition hover:text-[#d1b35a]"
                  >
                    aurumautodetail906@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <form
              action="https://formsubmit.co/aurumautodetail906@gmail.com"
              method="POST"
              className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.85)]"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="New Aurum Detail Request" />
              <input
                type="hidden"
                name="_next"
                value="http://localhost:3000/success"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)]"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium text-zinc-300"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)]"
                    placeholder="Best number to reach you"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="vehicle"
                  className="text-xs font-medium text-zinc-300"
                >
                  Vehicle Type
                </label>
                <input
                  id="vehicle"
                  name="vehicle"
                  type="text"
                  className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)]"
                  placeholder="Year, make, model (e.g. 2020 Ford F-150)"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="service"
                  className="text-xs font-medium text-zinc-300"
                >
                  Service Requested
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option>Exterior Detail</option>
                  <option>Interior Detail</option>
                  <option>Full Detail</option>
                  <option>Exterior + Add-Ons</option>
                  <option>Interior + Add-Ons</option>
                  <option>Custom Request</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-medium text-zinc-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)]"
                  placeholder="Share your location, preferred dates, and any concerns (pets, stains, etc.)."
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[rgba(201,168,76,0.96)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_40px_rgba(201,168,76,0.55)] transition hover:bg-[#d1b35a]"
              >
                Request a Detail
              </button>
            </form>
          </div>
        </FadeSection>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80 bg-black/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.35em] text-[rgba(201,168,76,0.95)]"
              style={{ letterSpacing: "0.35em" }}
            >
              AURUM AUTO DETAIL
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Premium Detailing. Upper Peninsula Proud.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                Phone
              </p>
              <p className="mt-1 text-zinc-300">906-290-0302</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                Email
              </p>
              <p className="mt-1 text-zinc-300">aurumautodetail906@gmail.com</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                Aurum Auto Detail
              </p>
              <img
                src="/logo.png"
                alt="Aurum Auto Detail logo"
                className="mt-2 h-12 w-auto [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)]"
              />
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes aurumShimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

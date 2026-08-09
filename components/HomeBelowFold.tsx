"use client";

import Image from "next/image";
import { FadeSection, ShinyCard } from "@/components/home-shared";
import { QuoteCalculatorLauncher, QuoteProvider } from "@/components/QuoteCalculator";

type TransformationPair = {
  id: number;
  before?: string;
  after?: string;
  vehicle?: string;
};

const transformationPairs: TransformationPair[] = [
  {
    id: 1,
    before: "/ford-1-before-rot.webp",
    after: "/ford-1-after-rot.webp",
    vehicle: "Ford Interior",
  },
  {
    id: 2,
    before: "/ford-2-before-rot.webp",
    after: "/ford-2-after-rot.webp",
    vehicle: "Ford Rear Interior",
  },
];

const addOns = [
  { name: "Wax and Sealant", price: "$40–$50" },
  { name: "Engine Bay Cleaning", price: "$40–$50" },
  { name: "Glass Rain Repellent", price: "$25" },
  { name: "Undercarriage Rinse", price: "$10" },
  { name: "Bug or Sap Removal", price: "$50" },
  { name: "Pet Hair Removal", price: "$50" },
  { name: "Steam Clean Seat/Carpet", price: "$25–$40" },
  { name: "Child Car Seat Clean", price: "$10–$30" },
  { name: "Deodorizer", price: "$10" },
  { name: "Door Jamb Deep Clean", price: "$25–$30" },
];

export default function HomeBelowFold() {
  return (
    <QuoteProvider>
    <>
      {/* Services & Pricing */}
      <FadeSection
        id="services"
        className="section-pad border-t border-zinc-900/80"
      >
        <div className="flex flex-col gap-[clamp(1.25rem,1rem+1vw,2rem)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
              Services
            </p>
            <h2 className="type-h2 mt-3 font-semibold text-zinc-50">
              Signature Detailing Packages
            </h2>
            <p className="type-body mt-3 max-w-md text-zinc-400">
              Transparent pricing ranges based on vehicle size and condition. Every
              package includes careful prep, quality products, and a perfectionist&apos;s
              eye for the details.
            </p>
          </div>
        </div>

        <div id="pricing" className="grid-packages mt-[clamp(1.5rem,1rem+1.5vw,2.5rem)]">
          <ShinyCard className="flex flex-col justify-between rounded-[var(--radius-2xl)] border border-[rgba(201,168,76,0.4)] bg-zinc-950/60 fluid-card-pad shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <div>
              <h3 className="type-h3 font-semibold text-zinc-50">Exterior Detail</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.75)]">
                $80–$120
              </p>
              <ul className="type-body mt-4 space-y-2 text-zinc-300">
                <li>Pre-rinse & foam soak</li>
                <li>Hand wash with premium shampoo</li>
                <li>Thorough rinse to remove residue</li>
                <li>Tire and wheel clean & shine</li>
                <li>Gentle hand dry with soft towels</li>
              </ul>
            </div>
            <p className="mt-5 text-xs text-zinc-500">
              Ideal for maintaining a glossy, cared-for exterior between full details.
            </p>
          </ShinyCard>

          <ShinyCard className="flex flex-col justify-between rounded-[var(--radius-2xl)] border border-zinc-800 bg-zinc-950/60 fluid-card-pad shadow-[0_0_35px_rgba(0,0,0,0.8)]">
            <div>
              <h3 className="type-h3 font-semibold text-zinc-50">Interior Detail</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.75)]">
                $110–$150
              </p>
              <ul className="type-body mt-4 space-y-2 text-zinc-300">
                <li>Floor mat wash and refresh</li>
                <li>Full interior vacuum</li>
                <li>All surface cleanse (dash, doors, console)</li>
                <li>Deep clean seats (cloth or leather-safe)</li>
                <li>Clean all windows (interior & exterior)</li>
              </ul>
            </div>
            <p className="mt-5 text-xs text-zinc-500">
              Perfect for families, commuters, and anyone wanting a fresh, reset cabin.
            </p>
          </ShinyCard>

          <ShinyCard className="flex flex-col justify-between rounded-[var(--radius-2xl)] border border-[rgba(201,168,76,0.75)] bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.18),_transparent_55%),_rgb(9,9,11)] fluid-card-pad shadow-[0_0_55px_rgba(201,168,76,0.55)]">
            <div>
              <h3 className="type-h3 font-semibold text-zinc-50">Full Detail</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[rgba(201,168,76,0.9)]">
                $300–$350
              </p>
              <ul className="type-body mt-4 space-y-2 text-zinc-200">
                <li>Everything in Exterior Detail</li>
                <li>Everything in Interior Detail</li>
                <li>Undercarriage rinse</li>
                <li>Glass rain repellent treatment</li>
                <li>Deodorizer throughout cabin</li>
                <li>Door jamb deep clean</li>
              </ul>
            </div>
            <p className="mt-5 text-xs text-[rgba(249,250,251,0.85)]">
              The full reset. Recommended for new-to-you vehicles, pre-sale prep, or a
              once-a-year deep clean.
            </p>
          </ShinyCard>
        </div>

        <div className="mt-[clamp(2rem,1.25rem+2vw,3rem)]">
          <QuoteCalculatorLauncher id="quote" />
        </div>
      </FadeSection>

      {/* Add-Ons */}
      <FadeSection
        id="addons"
        className="section-gap section-pad border-t border-zinc-900/80"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
            Add-Ons
          </p>
          <h2 className="type-h2 mt-3 font-semibold text-zinc-50">
            Fine-Tune Your Detail
          </h2>
          <p className="type-body mt-3 max-w-md text-zinc-400">
            Customize your service with focused add-ons to tackle problem areas or
            upgrade protection. Priced as ranges based on vehicle size and condition.
          </p>
        </div>

        <div className="grid-addons mt-[clamp(1.5rem,1rem+1.5vw,2rem)] text-zinc-200">
          {addOns.map((item) => (
            <ShinyCard
              key={item.name}
              className="flex min-h-[3rem] items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-zinc-800 bg-zinc-950/60 px-4 py-3.5"
            >
              <span className="type-body min-w-0 leading-snug text-zinc-100">
                {item.name}
              </span>
              <span className="shrink-0 text-xs font-medium text-[rgba(201,168,76,0.9)]">
                {item.price}
              </span>
            </ShinyCard>
          ))}
        </div>
      </FadeSection>

      {/* Before & After */}
      <FadeSection
        id="results"
        className="section-gap section-pad border-t border-zinc-900/80"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
            Results
          </p>
          <h2 className="type-h2 mt-3 font-semibold text-zinc-50">
            Before & After
          </h2>
          <p className="type-body mt-3 max-w-2xl text-zinc-400">
            Real transformations from Upper Peninsula vehicles. See the difference
            professional detailing makes, from heavily used interiors to refreshed,
            clean finishes you can feel every time you get in.
          </p>
        </div>

        <div className="mt-[clamp(1.5rem,1rem+1.5vw,2rem)] rounded-[var(--radius-2xl)] border border-zinc-800 bg-zinc-950/65 p-[clamp(0.9rem,0.65rem+1vw,1.5rem)] shadow-[0_0_35px_rgba(0,0,0,0.75)]">
          {transformationPairs.map((pair, index) => (
            <div
              key={pair.id}
              className={`${index > 0 ? "mt-[clamp(1.25rem,1rem+1vw,1.5rem)] border-t border-zinc-800 pt-[clamp(1.25rem,1rem+1vw,1.5rem)]" : ""}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgba(201,168,76,0.85)]">
                  Set {pair.id}
                </p>
                {pair.vehicle ? (
                  <p className="text-xs text-zinc-400">{pair.vehicle}</p>
                ) : null}
              </div>

              <div className="grid-results">
                <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[rgba(201,168,76,0.35)] bg-black/40">
                  {pair.before ? (
                    <div className="results-media relative w-full">
                      <Image
                        src={pair.before}
                        alt={`Set ${pair.id} before detail`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="results-media flex items-center justify-center px-4 text-center text-sm text-zinc-500">
                      Before image coming soon
                    </div>
                  )}
                  <div className="border-t border-zinc-800 bg-zinc-950/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300">
                    Before
                  </div>
                </div>

                <div className="overflow-hidden rounded-[var(--radius-xl)] border border-zinc-800 bg-black/40">
                  {pair.after ? (
                    <div className="results-media relative w-full">
                      <Image
                        src={pair.after}
                        alt={`Set ${pair.id} after detail`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="results-media flex items-center justify-center px-4 text-center text-sm text-zinc-500">
                      After image coming soon
                    </div>
                  )}
                  <div className="border-t border-zinc-800 bg-zinc-950/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[rgba(201,168,76,0.9)]">
                    After
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* About */}
      <FadeSection
        id="about"
        className="section-gap section-pad border-t border-zinc-900/80"
      >
        <div className="grid-split items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
              About Aurum
            </p>
            <h2 className="type-h2 mt-3 font-semibold text-zinc-50">
              Built From the Ground Up
            </h2>
            <div className="type-body mt-4 space-y-4 text-zinc-300">
              <p>
                At 16, I started Aurum Auto Detail with nothing but a pressure washer, a
                dream, and a refusal to work for anyone else. What began as a side hustle
                in Hermansville has grown into a licensed LLC serving the Upper Peninsula.
              </p>
              <p>
                Every detail I do is personal — this isn&apos;t a job to me, it&apos;s the
                foundation of something bigger. I&apos;m building a reputation one vehicle
                at a time, and I&apos;m not interested in shortcuts.
              </p>
              <p>
                When you choose Aurum, you&apos;re not hiring a corporation. You&apos;re
                supporting a young entrepreneur who takes more pride in your vehicle than
                most shops twice the size. Your car leaves cleaner, crisper, and cared for
                in a way you can feel.
              </p>
            </div>
          </div>
          <div className="space-y-4 rounded-[var(--radius-2xl)] border border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.15),_transparent_55%),_rgb(9,9,11)] fluid-card-pad type-body text-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
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
            <p className="mt-2 text-zinc-300">
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
        className="section-gap section-pad border-t border-zinc-900/80"
      >
        <div className="grid-split items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(201,168,76,0.85)]">
              Contact
            </p>
            <h2 className="type-h2 mt-3 font-semibold text-zinc-50">
              Request a Detail
            </h2>
            <p className="type-body mt-3 max-w-md text-zinc-400">
              Tell me about your vehicle, where you&apos;re located, and what you&apos;re
              looking for. I&apos;ll follow up to confirm availability, pricing, and options
              that fit your schedule.
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              This form is a request — your appointment is confirmed once you receive a
              reply and booking time.
            </p>
            <div className="type-body mt-5 space-y-1 text-zinc-300">
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
                  className="break-all text-[rgba(201,168,76,0.9)] transition hover:text-[#d1b35a] sm:break-normal"
                >
                  aurumautodetail906@gmail.com
                </a>
              </p>
            </div>

            <div className="mt-[clamp(1.5rem,1rem+1.5vw,2rem)]">
              <QuoteCalculatorLauncher id="quote-contact" compact />
            </div>
          </div>

          <form
            id="contact-form"
            action="https://formsubmit.co/aurumautodetail906@gmail.com"
            method="POST"
            className="space-y-4 rounded-[var(--radius-2xl)] border border-zinc-800 bg-zinc-950/70 fluid-card-pad shadow-[0_0_40px_rgba(0,0,0,0.85)]"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Aurum Detail Request" />
            <input
              type="hidden"
              name="_next"
              value="https://aurum-nextjs.vercel.app/success"
            />
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 11rem), 1fr))",
              }}
            >
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-medium text-zinc-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)] sm:py-2 sm:text-sm"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-medium text-zinc-300">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)] sm:py-2 sm:text-sm"
                  placeholder="Best number to reach you"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="vehicle" className="text-xs font-medium text-zinc-300">
                Vehicle Type
              </label>
              <input
                id="vehicle"
                name="vehicle"
                type="text"
                className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)] sm:py-2 sm:text-sm"
                placeholder="Year, make, model (e.g. 2020 Ford F-150)"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="service" className="text-xs font-medium text-zinc-300">
                Service Requested
              </label>
              <select
                id="service"
                name="service"
                className="w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)] sm:py-2 sm:text-sm"
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
              <label htmlFor="message" className="text-xs font-medium text-zinc-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none ring-0 transition focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.5)] sm:py-2 sm:text-sm"
                placeholder="Share your location, preferred dates, and any concerns (pets, stains, etc.)."
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-[rgba(201,168,76,0.96)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_40px_rgba(201,168,76,0.55)] transition hover:bg-[#d1b35a] active:bg-[#c4a84e]"
            >
              Request a Detail
            </button>
          </form>
        </div>
      </FadeSection>

      {/* Footer */}
      <footer className="section-gap border-t border-zinc-900/80 bg-black/95">
        <div
          className="mx-auto flex max-w-6xl flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between"
          style={{
            paddingInline: "var(--page-pad-x)",
            paddingBottom:
              "max(var(--fab-clearance), calc(env(safe-area-inset-bottom) + 3.5rem))",
          }}
        >
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
              <a
                href="tel:9062900302"
                className="mt-1 block touch-manipulation text-zinc-300 transition hover:text-[rgba(201,168,76,0.95)]"
              >
                906-290-0302
              </a>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                Email
              </p>
              <a
                href="mailto:aurumautodetail906@gmail.com"
                className="mt-1 block break-all touch-manipulation text-zinc-300 transition hover:text-[rgba(201,168,76,0.95)] sm:break-normal"
              >
                aurumautodetail906@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                Aurum Auto Detail
              </p>
              <img
                src="/logo.webp"
                alt="Aurum Auto Detail logo"
                className="mt-2 h-12 w-auto [mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_74%,transparent_100%)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
    </QuoteProvider>
  );
}

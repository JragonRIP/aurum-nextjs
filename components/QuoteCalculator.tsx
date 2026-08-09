"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ADD_ONS,
  FULL_INCLUDED_IDS,
  PACKAGES,
  buildQuoteMessage,
  calculateQuote,
  formServiceValue,
  formatMilesLabel,
  getFreePromoAddOnId,
  travelFee,
  type AddOnId,
  type PackageId,
  type VehicleSize,
} from "@/lib/quote-pricing";

type QuoteState = {
  step: number;
  name: string;
  phone: string;
  packageId: PackageId | null;
  vehicleSize: VehicleSize | null;
  selectedAddOns: AddOnId[];
  miles: number;
};

type QuoteContextValue = QuoteState & {
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setPackageId: (v: PackageId) => void;
  setVehicleSize: (v: VehicleSize) => void;
  toggleAddOn: (id: AddOnId) => void;
  setMiles: (v: number) => void;
  next: () => void;
  back: () => void;
  goToStep: (s: number) => void;
  totalSteps: number;
  progress: number;
  applyToContactForm: () => void;
};

const TOTAL_STEPS = 6;

const QuoteContext = createContext<QuoteContextValue | null>(null);

const fieldClass =
  "w-full rounded-xl border border-zinc-800 bg-black/40 px-3 py-3 text-base text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-[rgba(201,168,76,0.9)] focus:ring-1 focus:ring-[rgba(201,168,76,0.45)] sm:py-2.5 sm:text-sm";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [packageId, setPackageIdState] = useState<PackageId | null>(null);
  const [vehicleSize, setVehicleSize] = useState<VehicleSize | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [miles, setMiles] = useState(0);

  const setPackageId = useCallback((id: PackageId) => {
    setPackageIdState(id);
    setSelectedAddOns((prev) => {
      const withoutIncluded = prev.filter((a) => !FULL_INCLUDED_IDS.includes(a));
      if (id === "full") {
        return Array.from(new Set([...withoutIncluded, ...FULL_INCLUDED_IDS]));
      }
      return withoutIncluded;
    });
  }, []);

  const toggleAddOn = useCallback(
    (id: AddOnId) => {
      const included =
        packageId === "full" && FULL_INCLUDED_IDS.includes(id);
      if (included) return;
      setSelectedAddOns((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [packageId]
  );

  const next = useCallback(() => {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const goToStep = useCallback((s: number) => {
    setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, s)));
  }, []);

  const applyToContactForm = useCallback(() => {
    if (!packageId || !vehicleSize || !name.trim()) return;

    const estimate = calculateQuote({
      packageId,
      vehicleSize,
      selectedAddOns,
      miles,
    });

    const nameEl = document.getElementById("name") as HTMLInputElement | null;
    const phoneEl = document.getElementById("phone") as HTMLInputElement | null;
    const vehicleEl = document.getElementById(
      "vehicle"
    ) as HTMLInputElement | null;
    const serviceEl = document.getElementById(
      "service"
    ) as HTMLSelectElement | null;
    const messageEl = document.getElementById(
      "message"
    ) as HTMLTextAreaElement | null;

    if (nameEl) nameEl.value = name.trim();
    if (phoneEl) phoneEl.value = phone.trim();
    if (vehicleEl) {
      vehicleEl.value =
        vehicleSize === "sedan"
          ? "Sedan / Coupe"
          : "SUV / Truck / Van / Other";
    }
    if (serviceEl) {
      const paidCount = estimate.paidAddOnLabels.filter(
        (l) => !l.includes("(FREE promo)")
      ).length;
      serviceEl.value = formServiceValue(packageId, paidCount);
    }
    if (messageEl) {
      messageEl.value = buildQuoteMessage({
        name: name.trim(),
        phone: phone.trim(),
        packageId,
        vehicleSize,
        miles,
        estimate,
      });
    }

    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => messageEl?.focus(), 450);
  }, [packageId, vehicleSize, name, phone, selectedAddOns, miles]);

  const value = useMemo<QuoteContextValue>(
    () => ({
      step,
      name,
      phone,
      packageId,
      vehicleSize,
      selectedAddOns,
      miles,
      setName,
      setPhone,
      setPackageId,
      setVehicleSize,
      toggleAddOn,
      setMiles,
      next,
      back,
      goToStep,
      totalSteps: TOTAL_STEPS,
      progress: ((step + 1) / TOTAL_STEPS) * 100,
      applyToContactForm,
    }),
    [
      step,
      name,
      phone,
      packageId,
      vehicleSize,
      selectedAddOns,
      miles,
      setPackageId,
      toggleAddOn,
      next,
      back,
      goToStep,
      applyToContactForm,
    ]
  );

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}

function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}

const STEP_LABELS = [
  "Your info",
  "Package",
  "Vehicle",
  "Add-ons",
  "Distance",
  "Your quote",
];

export function QuoteCalculator({
  id = "quote",
  compact = false,
  onClose,
}: {
  id?: string;
  compact?: boolean;
  onClose?: () => void;
}) {
  const q = useQuote();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [q.step]);

  const canContinue = (() => {
    if (q.step === 0) return q.name.trim().length > 1;
    if (q.step === 1) return q.packageId !== null;
    if (q.step === 2) return q.vehicleSize !== null;
    return true;
  })();

  const estimate =
    q.packageId && q.vehicleSize
      ? calculateQuote({
          packageId: q.packageId,
          vehicleSize: q.vehicleSize,
          selectedAddOns: q.selectedAddOns,
          miles: q.miles,
        })
      : null;

  return (
    <div
      ref={panelRef}
      id={id}
      className={`scroll-mt-[clamp(5.5rem,4.5rem+3vw,7rem)] rounded-[var(--radius-2xl)] border border-zinc-800 bg-zinc-950/70 shadow-[0_0_40px_rgba(0,0,0,0.75)] ${
        compact ? "p-[clamp(1rem,0.85rem+0.6vw,1.25rem)]" : "p-[clamp(1rem,0.75rem+1.2vw,2rem)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[rgba(201,168,76,0.85)] sm:text-xs sm:tracking-[0.3em]">
            Quote calculator
          </p>
          <h3 className="type-h3 mt-2 font-semibold tracking-tight text-zinc-50">
            Build your estimate
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Step {q.step + 1} of {q.totalSteps}
            <span className="text-zinc-600"> · </span>
            {STEP_LABELS[q.step]}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-xl text-lg text-zinc-500 transition hover:bg-zinc-900 hover:text-zinc-200"
            aria-label="Close quote calculator"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-900 sm:mt-5"
        role="progressbar"
        aria-valuenow={Math.round(q.progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quote calculator progress"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#b8892d,#f3d56a,#c9962a)] transition-[width] duration-300 ease-out"
          style={{ width: `${q.progress}%` }}
        />
      </div>

      <div className="mt-5 sm:mt-6">
        {q.step === 0 && (
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <label htmlFor={`${id}-name`} className="text-xs font-medium text-zinc-300">
                Name <span className="text-[rgba(201,168,76,0.8)]">*</span>
              </label>
              <input
                id={`${id}-name`}
                value={q.name}
                onChange={(e) => q.setName(e.target.value)}
                className={fieldClass}
                placeholder="Your name"
                autoComplete="name"
                enterKeyHint="next"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${id}-phone`} className="text-xs font-medium text-zinc-300">
                Phone <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                id={`${id}-phone`}
                value={q.phone}
                onChange={(e) => q.setPhone(e.target.value)}
                type="tel"
                className={fieldClass}
                placeholder="Best number to reach you"
                autoComplete="tel"
                enterKeyHint="done"
              />
            </div>
          </div>
        )}

        {q.step === 1 && (
          <div className="grid gap-3">
            {(Object.keys(PACKAGES) as PackageId[]).map((pkgId) => {
              const pkg = PACKAGES[pkgId];
              const selected = q.packageId === pkgId;
              return (
                <button
                  key={pkgId}
                  type="button"
                  onClick={() => q.setPackageId(pkgId)}
                  className={`touch-manipulation rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-[rgba(201,168,76,0.75)] bg-[rgba(201,168,76,0.12)]"
                      : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                  }`}
                >
                  <p className="text-base font-semibold text-zinc-50 sm:text-sm">
                    {pkg.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[rgba(201,168,76,0.85)]">
                    ${pkg.low}–${pkg.high}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {q.step === 2 && (
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => q.setVehicleSize("sedan")}
              className={`touch-manipulation rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99] ${
                q.vehicleSize === "sedan"
                  ? "border-[rgba(201,168,76,0.75)] bg-[rgba(201,168,76,0.12)]"
                  : "border-zinc-800 bg-black/30 hover:border-zinc-700"
              }`}
            >
              <p className="text-base font-semibold text-zinc-50 sm:text-sm">
                Sedan / Coupe
              </p>
              <p className="mt-1 text-xs text-zinc-400">Lower end of listed ranges</p>
            </button>
            <button
              type="button"
              onClick={() => q.setVehicleSize("other")}
              className={`touch-manipulation rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99] ${
                q.vehicleSize === "other"
                  ? "border-[rgba(201,168,76,0.75)] bg-[rgba(201,168,76,0.12)]"
                  : "border-zinc-800 bg-black/30 hover:border-zinc-700"
              }`}
            >
              <p className="text-base font-semibold text-zinc-50 sm:text-sm">
                SUV / Truck / Van / Other
              </p>
              <p className="mt-1 text-xs text-zinc-400">Higher end of listed ranges</p>
            </button>
          </div>
        )}

        {q.step === 3 && (
          <div className="space-y-3">
            {q.packageId !== "full" ? (
              <div className="px-1 text-center">
                {(() => {
                  const billableCount = q.selectedAddOns.length;
                  const freeId = getFreePromoAddOnId(
                    q.packageId,
                    q.vehicleSize,
                    q.selectedAddOns
                  );
                  const freeLabel = freeId
                    ? ADD_ONS.find((a) => a.id === freeId)?.label
                    : null;

                  if (freeLabel) {
                    return (
                      <p className="text-sm font-bold leading-snug tracking-wide text-[rgba(201,168,76,0.95)]">
                        You get one free — {freeLabel}
                      </p>
                    );
                  }
                  if (billableCount === 2) {
                    return (
                      <p className="text-sm font-bold tracking-wide text-[rgba(201,168,76,0.95)]">
                        Add one more to get one free
                      </p>
                    );
                  }
                  if (billableCount === 1) {
                    return (
                      <p className="text-sm font-bold tracking-wide text-[rgba(201,168,76,0.95)]">
                        Add 2 more to get one free
                      </p>
                    );
                  }
                  return (
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[rgba(201,168,76,0.95)]">
                      Buy 2 Get 1 Free
                    </p>
                  );
                })()}
              </div>
            ) : null}
            <div className="grid gap-2">
              {ADD_ONS.map((addOn) => {
                const included =
                  q.packageId === "full" && addOn.includedInFull;
                const selected = q.selectedAddOns.includes(addOn.id);
                const freePromoId = getFreePromoAddOnId(
                  q.packageId,
                  q.vehicleSize,
                  q.selectedAddOns
                );
                const isFreePromo = selected && freePromoId === addOn.id;
                const priceLabel =
                  addOn.low === addOn.high
                    ? `$${addOn.low}`
                    : `$${addOn.low}–$${addOn.high}`;

                return (
                  <button
                    key={addOn.id}
                    type="button"
                    disabled={included}
                    onClick={() => q.toggleAddOn(addOn.id)}
                    className={`flex min-h-[3.25rem] touch-manipulation items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.99] ${
                      included
                        ? "metallic-gold cursor-default"
                        : isFreePromo
                          ? "metallic-gold"
                          : selected
                            ? "border-[rgba(201,168,76,0.65)] bg-[rgba(201,168,76,0.1)]"
                            : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className={`min-w-0 flex-1 text-sm leading-snug ${
                        included || isFreePromo
                          ? "font-semibold text-zinc-950"
                          : "text-zinc-100"
                      }`}
                    >
                      {addOn.label}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {included ? (
                        <span className="rounded-full bg-black/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-zinc-950">
                          Included
                        </span>
                      ) : isFreePromo ? (
                        <span className="rounded-full bg-black/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-zinc-950">
                          Free
                        </span>
                      ) : (
                        <span
                          className={`text-xs ${selected ? "text-[rgba(201,168,76,0.95)]" : "text-zinc-500"}`}
                        >
                          {priceLabel}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {q.step === 4 && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-zinc-400">
              How far are you from Hermansville? First 10 miles are free, then $10 per
              additional 10 miles.
            </p>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
              <label
                htmlFor={`${id}-miles`}
                className="text-sm font-medium text-zinc-200"
              >
                Travel distance
              </label>
              <div className="sm:text-right">
                <p className="font-display text-2xl font-semibold text-[rgba(201,168,76,0.95)]">
                  {formatMilesLabel(q.miles)}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {travelFee(q.miles) > 0
                    ? `+$${travelFee(q.miles)} travel fee`
                    : "No travel fee"}
                </p>
              </div>
            </div>
            <input
              id={`${id}-miles`}
              type="range"
              min={0}
              max={60}
              step={1}
              value={q.miles}
              onChange={(e) => q.setMiles(Number(e.target.value))}
              className="aurum-range w-full"
            />
            <div className="flex justify-between text-[0.65rem] uppercase tracking-[0.16em] text-zinc-600">
              <span>0 mi</span>
              <span>60+ mi</span>
            </div>
          </div>
        )}

        {q.step === 5 && estimate && q.packageId && q.vehicleSize && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[rgba(201,168,76,0.35)] bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.12),_transparent_55%),_rgb(9,9,11)] p-4 sm:p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[rgba(201,168,76,0.85)] sm:text-xs">
                Estimated quote
              </p>
              <p className="mt-2 font-display text-[clamp(1.75rem,1.35rem+1.8vw,2.25rem)] font-semibold tracking-tight text-zinc-50">
                ${estimate.low}–${estimate.high}
                {q.miles >= 60 ? "+" : ""}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                This is an informal estimate only — not a final or guaranteed price.
                Final pricing depends on vehicle condition and a quick confirmation.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-zinc-500">
                <li>
                  Package: {PACKAGES[q.packageId].label} (${estimate.packageAmount})
                </li>
                {estimate.addOnsAmount > 0 && (
                  <li>Add-ons: ${estimate.addOnsAmount}</li>
                )}
                {estimate.freePromoLabel && (
                  <li>
                    Promo free add-on: {estimate.freePromoLabel} (saves $
                    {estimate.freePromoSavings})
                  </li>
                )}
                <li>
                  Travel ({formatMilesLabel(q.miles)}): ${estimate.travelAmount}
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={q.applyToContactForm}
              className="metallic-gold inline-flex w-full touch-manipulation items-center justify-center rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <span>Request this quote</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-900 pt-4">
        <button
          type="button"
          onClick={q.back}
          disabled={q.step === 0}
          className="min-h-11 touch-manipulation rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 transition hover:text-zinc-100 disabled:invisible"
        >
          Back
        </button>
        {q.step < q.totalSteps - 1 ? (
          <button
            type="button"
            onClick={q.next}
            disabled={!canContinue}
            className="min-h-11 touch-manipulation rounded-full border border-[rgba(201,168,76,0.45)] bg-[rgba(201,168,76,0.1)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(201,168,76,0.95)] transition hover:bg-[rgba(201,168,76,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={() => q.goToStep(0)}
            className="min-h-11 touch-manipulation rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-300"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}

/** Closed by default — shows a prominent CTA, then mounts the calculator. */
export function QuoteCalculatorLauncher({
  id = "quote",
  compact = false,
}: {
  id?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      // Default chat CTA targets the main services calculator only
      if (detail?.id && detail.id !== id) return;
      if (!detail?.id && id !== "quote") return;
      setOpen(true);
    };
    window.addEventListener("aurum:open-quote", onOpen);
    return () => window.removeEventListener("aurum:open-quote", onOpen);
  }, [id]);

  useEffect(() => {
    if (!open) return;
    wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  if (!open) {
    return (
      <div
        id={id}
        className="scroll-mt-[clamp(5.5rem,4.5rem+3vw,7rem)] overflow-hidden rounded-[var(--radius-2xl)] border border-[rgba(201,168,76,0.35)] bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.14),_transparent_55%),_rgb(9,9,11)] p-[clamp(1.15rem,0.85rem+1.2vw,2rem)] text-center shadow-[0_0_40px_rgba(0,0,0,0.75)]"
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[rgba(201,168,76,0.85)] sm:text-xs sm:tracking-[0.3em]">
          Instant estimate
        </p>
        <h3 className="type-h2 mt-3 font-display font-semibold tracking-tight text-zinc-50">
          Get a quick quote
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          Answer a few questions for a ballpark range based on package, vehicle size,
          add-ons, and travel distance.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="metallic-gold mt-6 inline-flex w-full max-w-xs touch-manipulation items-center justify-center rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] sm:w-auto"
        >
          <span>Open quote calculator</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="scroll-mt-[clamp(5.5rem,4.5rem+3vw,7rem)]">
      <QuoteCalculator
        id={id}
        compact={compact}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

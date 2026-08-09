export type PackageId = "exterior" | "interior" | "full";
export type VehicleSize = "sedan" | "other";

export type AddOnId =
  | "wax-sealant"
  | "engine-bay"
  | "glass-rain"
  | "undercarriage"
  | "bug-sap"
  | "pet-hair"
  | "steam-clean"
  | "child-seat"
  | "deodorizer"
  | "door-jamb";

export const PACKAGES: Record<
  PackageId,
  { label: string; low: number; high: number; formValue: string }
> = {
  exterior: {
    label: "Exterior Detail",
    low: 80,
    high: 120,
    formValue: "Exterior Detail",
  },
  interior: {
    label: "Interior Detail",
    low: 110,
    high: 150,
    formValue: "Interior Detail",
  },
  full: {
    label: "Full Detail",
    low: 300,
    high: 350,
    formValue: "Full Detail",
  },
};

export const ADD_ONS: {
  id: AddOnId;
  label: string;
  low: number;
  high: number;
  includedInFull: boolean;
}[] = [
  { id: "wax-sealant", label: "Wax and Sealant", low: 40, high: 50, includedInFull: false },
  { id: "engine-bay", label: "Engine Bay Cleaning", low: 40, high: 50, includedInFull: false },
  { id: "glass-rain", label: "Glass Rain Repellent", low: 25, high: 25, includedInFull: true },
  { id: "undercarriage", label: "Undercarriage Rinse", low: 10, high: 10, includedInFull: true },
  { id: "bug-sap", label: "Bug or Sap Removal", low: 50, high: 50, includedInFull: false },
  { id: "pet-hair", label: "Pet Hair Removal", low: 50, high: 50, includedInFull: false },
  { id: "steam-clean", label: "Steam Clean Seat/Carpet", low: 25, high: 40, includedInFull: false },
  { id: "child-seat", label: "Child Car Seat Clean", low: 10, high: 30, includedInFull: false },
  { id: "deodorizer", label: "Deodorizer", low: 10, high: 10, includedInFull: true },
  { id: "door-jamb", label: "Door Jamb Deep Clean", low: 25, high: 30, includedInFull: true },
];

export const FULL_INCLUDED_IDS = ADD_ONS.filter((a) => a.includedInFull).map(
  (a) => a.id
);

/** First 10 miles free, then $10 per additional 10 miles. */
export function travelFee(miles: number): number {
  const m = Math.max(0, Math.min(60, miles));
  if (m <= 10) return 0;
  return Math.ceil((m - 10) / 10) * 10;
}

export function formatMilesLabel(miles: number): string {
  if (miles >= 60) return "60+ miles";
  return `${miles} mile${miles === 1 ? "" : "s"}`;
}

export type QuoteInput = {
  packageId: PackageId;
  vehicleSize: VehicleSize;
  selectedAddOns: AddOnId[];
  miles: number;
};

export type QuoteEstimate = {
  packageAmount: number;
  addOnsAmount: number;
  travelAmount: number;
  low: number;
  high: number;
  paidAddOnLabels: string[];
  includedLabels: string[];
  freePromoAddOnId: AddOnId | null;
  freePromoLabel: string | null;
  freePromoSavings: number;
};

/** With Exterior/Interior: select 3+ add-ons, pay for 2 — cheapest of the set is free. */
export function getFreePromoAddOnId(
  packageId: PackageId | null,
  vehicleSize: VehicleSize | null,
  selectedAddOns: AddOnId[]
): AddOnId | null {
  if (!packageId || packageId === "full" || !vehicleSize) return null;

  const useLow = vehicleSize === "sedan";

  const billable = selectedAddOns
    .map((id) => {
      const addOn = ADD_ONS.find((a) => a.id === id);
      if (!addOn) return null;
      return {
        id,
        amount: useLow ? addOn.low : addOn.high,
      };
    })
    .filter((x): x is { id: AddOnId; amount: number } => x !== null);

  if (billable.length < 3) return null;

  billable.sort((a, b) => a.amount - b.amount || a.id.localeCompare(b.id));
  return billable[0].id;
}

export function calculateQuote(input: QuoteInput): QuoteEstimate {
  const pkg = PACKAGES[input.packageId];
  const useLow = input.vehicleSize === "sedan";
  const packageAmount = useLow ? pkg.low : pkg.high;

  const includedSet = new Set(
    input.packageId === "full" ? FULL_INCLUDED_IDS : []
  );

  const freePromoAddOnId = getFreePromoAddOnId(
    input.packageId,
    input.vehicleSize,
    input.selectedAddOns
  );

  let addOnsAmount = 0;
  let freePromoSavings = 0;
  let freePromoLabel: string | null = null;
  const paidAddOnLabels: string[] = [];
  const includedLabels: string[] = [];

  for (const id of input.selectedAddOns) {
    const addOn = ADD_ONS.find((a) => a.id === id);
    if (!addOn) continue;
    if (includedSet.has(id)) {
      includedLabels.push(addOn.label);
      continue;
    }
    const amount = useLow ? addOn.low : addOn.high;
    if (id === freePromoAddOnId) {
      freePromoLabel = addOn.label;
      freePromoSavings = amount;
      paidAddOnLabels.push(`${addOn.label} (FREE promo)`);
      continue;
    }
    addOnsAmount += amount;
    paidAddOnLabels.push(addOn.label);
  }

  const travelAmount = travelFee(input.miles);
  const subtotal = packageAmount + addOnsAmount + travelAmount;

  // Modest condition buffer — not vague, not a hard quote
  const buffer =
    input.packageId === "full" ? 35 : input.packageId === "interior" ? 25 : 20;

  return {
    packageAmount,
    addOnsAmount,
    travelAmount,
    low: subtotal,
    high: subtotal + buffer,
    paidAddOnLabels,
    includedLabels,
    freePromoAddOnId,
    freePromoLabel,
    freePromoSavings,
  };
}

export function buildQuoteMessage(args: {
  name: string;
  phone: string;
  packageId: PackageId;
  vehicleSize: VehicleSize;
  miles: number;
  estimate: QuoteEstimate;
}): string {
  const pkg = PACKAGES[args.packageId].label;
  const size =
    args.vehicleSize === "sedan" ? "Sedan / Coupe" : "SUV / Truck / Other";
  const lines = [
    `Quote calculator request from ${args.name}.`,
    args.phone ? `Phone: ${args.phone}` : "Phone: (not provided)",
    `Package: ${pkg}`,
    `Vehicle size: ${size}`,
    `Travel distance: ${formatMilesLabel(args.miles)} (fee $${args.estimate.travelAmount})`,
  ];
  if (args.estimate.includedLabels.length) {
    lines.push(`Included with Full: ${args.estimate.includedLabels.join(", ")}`);
  }
  if (args.estimate.freePromoLabel) {
    lines.push(
      `Promo (buy 2 add-ons, get 1 free): ${args.estimate.freePromoLabel} FREE (saves $${args.estimate.freePromoSavings})`
    );
  }
  if (args.estimate.paidAddOnLabels.length) {
    lines.push(`Add-ons: ${args.estimate.paidAddOnLabels.join(", ")}`);
  } else {
    lines.push("Add-ons: none");
  }
  lines.push(
    `Estimated quote range: $${args.estimate.low}–$${args.estimate.high}${args.miles >= 60 ? "+" : ""} (estimate only — not a final price).`
  );
  return lines.join("\n");
}

export function formServiceValue(
  packageId: PackageId,
  paidAddOnCount: number
): string {
  if (paidAddOnCount === 0) return PACKAGES[packageId].formValue;
  if (packageId === "exterior") return "Exterior + Add-Ons";
  if (packageId === "interior") return "Interior + Add-Ons";
  return "Full Detail";
}

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(Number(amount) || 0);
}

export function formatGrams(grams: number) {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)}kg`;
  }
  return `${grams}g`;
}

// Price is always stored per base unit (gram, or unit) -- this converts to
// whatever unit the grade displays as (kg vs g, or the unit label itself).
export function pricePerDisplayUnit(pricePerBaseUnit: number, displayUnit: string) {
  return displayUnit === "kg" ? pricePerBaseUnit * 1000 : pricePerBaseUnit;
}

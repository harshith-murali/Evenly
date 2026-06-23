export function formatMoney(cents: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(cents / 100);
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}

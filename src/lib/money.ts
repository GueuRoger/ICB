export function formatMoney(amount: number, symbol: string) {
  const digits = amount >= 10000 ? amount.toLocaleString("en-US") : String(Math.round(amount));
  return `${symbol}${digits}`;
}

export function formatCartTotal(amount: number, symbol: string) {
  return `${symbol}${Math.round(amount).toLocaleString("en-US")}`;
}

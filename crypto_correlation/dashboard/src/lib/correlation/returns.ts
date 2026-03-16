export function logReturns(prices: number[]): number[] {
  if (prices.length < 2) return [];
  const out: number[] = [];
  for (let i = 1; i < prices.length; i += 1) {
    const prev = prices[i - 1];
    const current = prices[i];
    if (prev <= 0 || current <= 0) continue;
    out.push(Math.log(current / prev));
  }
  return out;
}

import { pearson } from "@/lib/correlation/pearson";

export function rollingCorrelation(base: number[], symbol: number[], window: number): number[] {
  const n = Math.min(base.length, symbol.length);
  if (window < 3 || n < window) return [];

  const out: number[] = [];
  for (let i = window; i <= n; i += 1) {
    const bSlice = base.slice(i - window, i);
    const sSlice = symbol.slice(i - window, i);
    out.push(pearson(bSlice, sSlice).r);
  }

  return out;
}

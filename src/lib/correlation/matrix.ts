import { Matrix } from "ml-matrix";
import { pearson } from "@/lib/correlation/pearson";
import { spearman } from "@/lib/correlation/spearman";
import { kendall } from "@/lib/correlation/kendall";
import type { CorrelationMethod } from "@/types/correlation";

export function buildCorrelationMatrix(series: Record<string, number[]>, method: CorrelationMethod): number[][] {
  const symbols = Object.keys(series);
  const n = symbols.length;
  const matrix = Matrix.zeros(n, n);

  const fn: (a: number[], b: number[]) => number = {
    pearson: (a: number[], b: number[]) => pearson(a, b).r,
    spearman,
    kendall,
  }[method];

  for (let i = 0; i < n; i += 1) {
    matrix.set(i, i, 1);
    for (let j = i + 1; j < n; j += 1) {
      const s1 = series[symbols[i]];
      const s2 = series[symbols[j]];
      const len = Math.min(s1.length, s2.length);
      const v = len < 3 ? 0 : fn(s1.slice(-len), s2.slice(-len));
      matrix.set(i, j, v);
      matrix.set(j, i, v);
    }
  }

  return matrix.to2DArray();
}

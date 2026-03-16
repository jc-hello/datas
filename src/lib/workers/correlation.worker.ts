import { expose } from "comlink";
import { pearson } from "@/lib/correlation/pearson";
import { spearman } from "@/lib/correlation/spearman";
import { kendall } from "@/lib/correlation/kendall";
import { logReturns } from "@/lib/correlation/returns";
import type { CorrelationMethod } from "@/types/correlation";

const worker = {
  computeMatrix(priceMap: Record<string, number[]>, method: CorrelationMethod) {
    const symbols = Object.keys(priceMap);
    const returns = Object.fromEntries(symbols.map((s) => [s, logReturns(priceMap[s])]));
    const fn = {
      pearson: (a: number[], b: number[]) => pearson(a, b).r,
      spearman,
      kendall,
    }[method];

    const matrix: Record<string, Record<string, number>> = {};

    for (const s1 of symbols) {
      matrix[s1] = {};
      for (const s2 of symbols) {
        matrix[s1][s2] = s1 === s2 ? 1 : fn(returns[s1], returns[s2]);
      }
    }

    return matrix;
  },
};

expose(worker);

import { expose } from "comlink";
import { pearson } from "@/lib/correlation/pearson";
import { spearman } from "@/lib/correlation/spearman";
import { kendall } from "@/lib/correlation/kendall";
import { logReturns } from "@/lib/correlation/returns";
import type { CorrelationMethod } from "@/types/correlation";

type WorkerApi = {
  computeMatrix: (
    priceMap: Record<string, number[]>,
    method: CorrelationMethod,
  ) => Record<string, Record<string, number>>;
};

const workerApi: WorkerApi = {
  computeMatrix(priceMap, method) {
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
        if (s1 === s2) {
          matrix[s1][s2] = 1;
          continue;
        }
        const a = returns[s1];
        const b = returns[s2];
        const n = Math.min(a.length, b.length);
        matrix[s1][s2] = n < 3 ? 0 : fn(a.slice(-n), b.slice(-n));
      }
    }

    return matrix;
  },
};

expose(workerApi);

import { pearson } from "@/lib/correlation/pearson";

function rankArray(values: number[]): number[] {
  const indexed = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = new Array(values.length).fill(0);

  for (let i = 0; i < indexed.length; i += 1) {
    let j = i;
    while (j + 1 < indexed.length && indexed[j + 1].value === indexed[i].value) j += 1;

    const avgRank = (i + j + 2) / 2;
    for (let k = i; k <= j; k += 1) {
      ranks[indexed[k].index] = avgRank;
    }
    i = j;
  }

  return ranks;
}

export function spearman(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;
  return pearson(rankArray(x.slice(0, n)), rankArray(y.slice(0, n))).r;
}

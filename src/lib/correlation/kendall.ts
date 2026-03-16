export function kendall(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;

  let concordant = 0;
  let discordant = 0;
  let tiesX = 0;
  let tiesY = 0;

  for (let i = 0; i < n - 1; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = Math.sign(x[j] - x[i]);
      const dy = Math.sign(y[j] - y[i]);

      if (dx === 0) tiesX += 1;
      if (dy === 0) tiesY += 1;

      if (dx !== 0 && dy !== 0) {
        if (dx === dy) concordant += 1;
        else discordant += 1;
      }
    }
  }

  const denom = Math.sqrt((concordant + discordant + tiesX) * (concordant + discordant + tiesY));
  if (denom === 0) return 0;
  return (concordant - discordant) / denom;
}

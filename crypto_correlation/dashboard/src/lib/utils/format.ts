export function formatCorr(v: number | null): string {
  if (v === null || Number.isNaN(v)) return "--";
  return v.toFixed(4);
}

export function formatPValue(v: number | null): string {
  if (v === null || Number.isNaN(v)) return "--";
  if (v < 0.0001) return "<0.0001";
  return v.toFixed(4);
}

export function corrColor(v: number | null): string {
  if (v === null) return "text-[var(--text-muted)]";
  if (v >= 0.7) return "text-[var(--corr-strong-pos)] font-semibold";
  if (v >= 0.3) return "text-[var(--corr-mod-pos)]";
  if (v >= -0.3) return "text-[var(--text-primary)]";
  if (v >= -0.7) return "text-[var(--corr-mod-neg)]";
  return "text-[var(--corr-strong-neg)] font-semibold";
}

export function regimeLabel(r: string): { label: string; cls: string } {
  return (
    {
      trending: { label: "▲ TRENDING WITH", cls: "text-[var(--corr-strong-pos)]" },
      moderate: { label: "◆ MODERATE", cls: "text-[var(--corr-mod-pos)]" },
      decorrelated: { label: "● DECOUPLED", cls: "text-[var(--text-dim)]" },
      diverging: { label: "▼ DIVERGING", cls: "text-[var(--corr-strong-neg)]" },
    }[r] ?? { label: r, cls: "text-[var(--text-dim)]" }
  );
}

export function trendArrow(delta: number): { sym: string; cls: string } {
  if (delta > 0.05) return { sym: "↑", cls: "text-[var(--success)]" };
  if (delta < -0.05) return { sym: "↓", cls: "text-[var(--error)]" };
  return { sym: "→", cls: "text-[var(--text-dim)]" };
}

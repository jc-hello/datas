import type { SymbolCorrelation } from "@/types/correlation";

export function RegimeAlert({ data }: { data: SymbolCorrelation[] }) {
  const diverging = data.filter((d) => d.regime === "diverging").slice(0, 3);
  if (!diverging.length) return null;

  return (
    <div className="border border-[var(--corr-strong-neg)] bg-[var(--bg-panel)] px-3 py-2 text-xs text-[var(--corr-strong-neg)]">
      REGIME ALERT: {diverging.map((d) => d.symbol).join(", ")} showing strong divergence.
    </div>
  );
}

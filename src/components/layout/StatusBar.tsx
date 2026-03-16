import type { CorrelationResponse } from "@/types/correlation";

export function StatusBar({ data }: { data: CorrelationResponse | undefined }) {
  const hitRate = data?.cacheHit ? "HIT" : "MISS";
  const age = data ? Math.max(0, Math.round((Date.now() - data.computedAt) / 1000)) : 0;

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 border-t border-[var(--border)] px-3 py-2 text-[10px] text-[var(--text-dim)]">
      <div>CACHE: {hitRate}</div>
      <div>SYMBOLS: {data?.symbols.length ?? 0}</div>
      <div>LAST UPDATE: {age}s ago</div>
      <div>▶</div>
    </div>
  );
}

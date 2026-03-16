import type { CorrelationResponse } from "@/types/correlation";
import { TerminalPanel } from "@/components/ui/TerminalPanel";

interface ExchangeComparisonRow {
  symbol: string;
  values: Record<string, number | null>;
  delta: number;
}

function buildRows(data: CorrelationResponse[]): ExchangeComparisonRow[] {
  const map = new Map<string, Record<string, number | null>>();

  for (const block of data) {
    for (const row of block.symbols.slice(0, 80)) {
      const existing = map.get(row.symbol) ?? {};
      existing[block.exchange] = row.pearson;
      map.set(row.symbol, existing);
    }
  }

  return [...map.entries()]
    .map(([symbol, values]) => {
      const arr = Object.values(values).filter((v): v is number => typeof v === "number");
      const delta = arr.length ? Math.max(...arr) - Math.min(...arr) : 0;
      return { symbol, values, delta };
    })
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 10);
}

export function ExchangeComparison({ data }: { data: CorrelationResponse[] }) {
  if (data.length < 2) return null;
  const rows = buildRows(data);

  return (
    <TerminalPanel title="EXCHANGE COMPARISON">
      <div className="space-y-1 text-xs">
        {rows.map((row) => (
          <div key={row.symbol} className="grid grid-cols-[80px_1fr_50px] gap-2 border-b border-[var(--border)] pb-1">
            <span>{row.symbol}</span>
            <span className="text-[var(--text-dim)]">
              {Object.entries(row.values)
                .map(([k, v]) => `${k}:${v?.toFixed(2) ?? "--"}`)
                .join("  ")}
            </span>
            <span>{row.delta.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </TerminalPanel>
  );
}

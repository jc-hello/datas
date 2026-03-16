import type { CorrelationResponse } from "@/types/correlation";
import { TerminalPanel } from "@/components/ui/TerminalPanel";

export function SummaryPanel({ data }: { data: CorrelationResponse | undefined }) {
  const count = data?.symbols.length ?? 0;
  const avg =
    data && count
      ? data.symbols.reduce((sum, item) => sum + Math.abs(item.pearson ?? 0), 0) / Math.max(count, 1)
      : 0;
  const sig = data?.symbols.filter((item) => item.significant).length ?? 0;

  return (
    <TerminalPanel title="SUMMARY">
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>SYMBOLS: {count}</div>
        <div>AVG |R|: {avg.toFixed(3)}</div>
        <div>SIGNIFICANT: {sig}</div>
      </div>
    </TerminalPanel>
  );
}

"use client";

import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import type { SymbolCorrelation } from "@/types/correlation";
import { CorrelationBadge } from "@/components/ui/CorrelationBadge";
import { SparklineCell } from "@/components/dashboard/SparklineCell";
import { formatPValue, regimeLabel, trendArrow } from "@/lib/utils/format";
import { useVirtualTable } from "@/hooks/useVirtualTable";

const COLUMNS = [
  "#",
  "SYMBOL",
  "PEARSON",
  "SPEARMAN",
  "KENDALL",
  "ROLL",
  "TREND",
  "Δ",
  "P-VAL",
  "SIG",
  "BARS",
  "REGIME",
];

const ROW_CLASS = "grid grid-cols-[30px_120px_90px_90px_90px_70px_90px_60px_70px_40px_60px_180px] items-center gap-2 border-b border-[var(--border)] px-2 py-1 text-xs";

const CorrelationRow = memo(function CorrelationRow({
  row,
  rank,
  style,
}: {
  row: SymbolCorrelation;
  rank: number;
  style: CSSProperties;
}) {
  const regime = regimeLabel(row.regime);
  const arrow = trendArrow(row.trendDelta);

  return (
    <div className={ROW_CLASS} style={style}>
      <span>{rank + 1}</span>
      <span>{row.symbol}</span>
      <CorrelationBadge value={row.pearson} />
      <CorrelationBadge value={row.spearman} />
      <CorrelationBadge value={row.kendall} />
      <CorrelationBadge value={row.rolling} />
      <SparklineCell data={row.rollingHistory} />
      <span className={arrow.cls}>
        {arrow.sym} {row.trendDelta.toFixed(2)}
      </span>
      <span>{formatPValue(row.pValue)}</span>
      <span>{row.significant ? "Y" : "N"}</span>
      <span>{row.candleCount}</span>
      <span className={regime.cls}>{regime.label}</span>
    </div>
  );
});

export function CorrelationTable({ data, filter }: { data: SymbolCorrelation[]; filter: string }) {
  const rows = useMemo(
    () => data.filter((row) => row.symbol.toUpperCase().includes(filter.trim().toUpperCase())),
    [data, filter],
  );

  const { parentRef, virtualizer } = useVirtualTable(rows.length, 34);

  return (
    <div className="border border-[var(--border)]">
      <div className={`${ROW_CLASS} sticky top-0 z-10 border-b border-[var(--border-bright)] bg-black/40 text-[10px] text-[var(--text-dim)]`}>
        {COLUMNS.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>

      <div ref={parentRef} className="h-[560px] overflow-auto">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <CorrelationRow
              key={virtualRow.key}
              rank={virtualRow.index}
              row={rows[virtualRow.index]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

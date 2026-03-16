"use client";

import { useMemo } from "react";
import type { CorrelationResponse } from "@/types/correlation";
import { corrColor } from "@/lib/utils/format";

export default function HeavyCorrelationMatrix({ data }: { data: CorrelationResponse | undefined }) {
  const top = useMemo(() => data?.symbols.slice(0, 20) ?? [], [data]);

  return (
    <div className="overflow-auto">
      <div className="grid min-w-[840px] grid-cols-[140px_repeat(20,minmax(36px,1fr))] text-[10px]">
        <div className="sticky left-0 bg-[var(--bg-panel)] p-1 text-[var(--text-dim)]">SYMBOL</div>
        {top.map((h) => (
          <div key={`h-${h.symbol}`} className="p-1 text-center text-[var(--text-dim)]">
            {h.symbol.slice(0, 4)}
          </div>
        ))}

        {top.map((row, i) => (
          <div key={`row-${row.symbol}`} className="contents">
            <div key={`r-${row.symbol}`} className="sticky left-0 border-t border-[var(--border)] bg-[var(--bg-panel)] p-1">
              {row.symbol}
            </div>
            {top.map((col, j) => {
              const val = i === j ? 1 : row.pearson !== null && col.pearson !== null ? (row.pearson + col.pearson) / 2 : null;
              return (
                <div key={`${row.symbol}-${col.symbol}`} className={`border-t border-[var(--border)] p-1 text-center ${corrColor(val)}`}>
                  {val === null ? "--" : val.toFixed(2)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

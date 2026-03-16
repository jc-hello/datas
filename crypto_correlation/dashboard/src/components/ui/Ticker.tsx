"use client";

import { useMemo } from "react";

export function Ticker({ items }: { items: string[] }) {
  const text = useMemo(() => items.join("  |  "), [items]);
  return (
    <div className="overflow-hidden whitespace-nowrap border-t border-[var(--border)] bg-[var(--bg-panel)] px-3 py-1 text-[10px] text-[var(--text-dim)]">
      <div className="animate-[ticker_30s_linear_infinite]">{text}</div>
    </div>
  );
}

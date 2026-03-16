"use client";

import { useDashboardStore } from "@/stores/dashboard.store";

const OPTIONS = ["1m", "5m", "15m", "1h", "4h", "1d"];

export function TimeframeSelector() {
  const { timeframe, setTimeframe, limit, setLimit } = useDashboardStore();

  return (
    <div className="space-y-2">
      <div>
        <div className="text-[10px] text-[var(--text-dim)]">TF</div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full border border-[var(--border)] bg-black px-2 py-1 text-xs"
        >
          {OPTIONS.map((tf) => (
            <option key={tf} value={tf}>
              {tf}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="text-[10px] text-[var(--text-dim)]">LIMIT</div>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full border border-[var(--border)] bg-black px-2 py-1 text-xs"
        >
          {[100, 200, 300, 500].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

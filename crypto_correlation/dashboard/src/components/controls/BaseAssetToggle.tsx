"use client";

import { useDashboardStore } from "@/stores/dashboard.store";

export function BaseAssetToggle() {
  const { base, setBase } = useDashboardStore();

  return (
    <div className="space-y-1">
      <div className="text-[10px] text-[var(--text-dim)]">BASE</div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {(["BTC", "ETH"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setBase(value)}
            className={`border px-2 py-1 ${base === value ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)]"}`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

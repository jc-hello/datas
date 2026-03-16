"use client";

import { useDashboardStore } from "@/stores/dashboard.store";
import { EXCHANGES } from "@/types/exchange";

export function ExchangeSelector() {
  const { exchange, setExchange, exchanges, toggleExchange } = useDashboardStore();

  return (
    <div className="space-y-2">
      <label className="text-[10px] text-[var(--text-dim)]">EXCH</label>
      <select
        value={exchange}
        onChange={(e) => setExchange(e.target.value as typeof exchange)}
        className="w-full border border-[var(--border)] bg-black px-2 py-1 text-xs"
      >
        {EXCHANGES.map((id) => (
          <option key={id} value={id}>
            {id.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="space-y-1 text-[11px]">
        {EXCHANGES.map((id) => (
          <label key={id} className="flex items-center gap-2">
            <input type="checkbox" checked={exchanges.includes(id)} onChange={() => toggleExchange(id)} />
            {id}
          </label>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard.store";

export function SymbolSearch() {
  const { symbolFilter, setSymbolFilter } = useDashboardStore();

  return (
    <div className="space-y-1">
      <div className="text-[10px] text-[var(--text-dim)]">FILTER</div>
      <div className="flex items-center gap-1 border border-[var(--border)] px-2 py-1">
        <Search className="size-3 text-[var(--text-dim)]" />
        <input
          value={symbolFilter}
          onChange={(e) => setSymbolFilter(e.target.value.toUpperCase())}
          placeholder="SYMBOL"
          className="w-full bg-transparent text-xs outline-none"
        />
      </div>
    </div>
  );
}

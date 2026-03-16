"use client";

import type { CorrelationMethod } from "@/types/correlation";
import { useDashboardStore } from "@/stores/dashboard.store";

const METHODS: CorrelationMethod[] = ["pearson", "spearman", "kendall"];

export function MethodToggle() {
  const { methods, setMethods } = useDashboardStore();

  const toggle = (method: CorrelationMethod) => {
    const next = methods.includes(method) ? methods.filter((m) => m !== method) : [...methods, method];
    setMethods(next.length ? next : ["pearson"]);
  };

  return (
    <div className="space-y-1">
      <div className="text-[10px] text-[var(--text-dim)]">METHOD</div>
      <div className="space-y-1 text-[11px]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={methods.length === 3}
            onChange={(e) => setMethods(e.target.checked ? [...METHODS] : ["pearson"])}
          />
          ALL
        </label>
        {METHODS.map((method) => (
          <label key={method} className="flex items-center gap-2">
            <input type="checkbox" checked={methods.includes(method)} onChange={() => toggle(method)} />
            {method.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  );
}

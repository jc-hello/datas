"use client";

import { useMemo } from "react";
import { useExchangeStatus } from "@/hooks/useExchangeStatus";
import { StatusDot } from "@/components/ui/StatusDot";

export function TopBar() {
  const { data } = useExchangeStatus();
  const now = useMemo(() => new Date().toLocaleTimeString(), []);

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2 text-xs">
      <div className="flex items-center gap-4">
        {(data ?? []).map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <StatusDot status={item.online ? "online" : "offline"} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <div className="text-[var(--text-dim)]">
        {now} [LIVE <StatusDot status="online" />]
      </div>
    </div>
  );
}

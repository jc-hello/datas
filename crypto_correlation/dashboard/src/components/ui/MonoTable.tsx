import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function MonoTable({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("w-full text-xs tracking-wide", className)}>
      <div className="grid border-b border-[var(--border)] bg-black/20 px-2 py-1 text-[10px] uppercase text-[var(--text-dim)]">
        {children}
      </div>
    </div>
  );
}

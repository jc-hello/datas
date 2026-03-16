import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function TerminalPanel({
  title,
  right,
  className,
  children,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("border border-[var(--border)] bg-[var(--bg-panel)]", className)}>
      <header className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2 text-xs text-[var(--text-dim)]">
        <span>{title}</span>
        {right}
      </header>
      <div className="p-2">{children}</div>
    </section>
  );
}

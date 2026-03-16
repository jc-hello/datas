import { cn } from "@/lib/utils/cn";

export function StatusDot({ status = "offline" }: { status?: "online" | "offline" | "degraded" }) {
  const cls = {
    online: "bg-[var(--success)]",
    offline: "bg-[var(--error)]",
    degraded: "bg-[var(--warning)]",
  }[status];

  return <span className={cn("inline-block size-2 rounded-full", cls)} />;
}

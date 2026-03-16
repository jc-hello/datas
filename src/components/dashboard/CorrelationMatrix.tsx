"use client";

import dynamic from "next/dynamic";
import { useDashboardStore } from "@/stores/dashboard.store";
import type { CorrelationResponse } from "@/types/correlation";

const HeavyMatrix = dynamic(() => import("@/components/dashboard/HeavyCorrelationMatrix"), {
  loading: () => <div className="h-48 animate-pulse bg-black/20" />,
  ssr: false,
});

export function CorrelationMatrix({ data }: { data: CorrelationResponse | undefined }) {
  const { matrixExpanded, setMatrixExpanded } = useDashboardStore();

  return (
    <div className="space-y-2">
      <button
        onClick={() => setMatrixExpanded(!matrixExpanded)}
        className="border border-[var(--border)] px-3 py-1 text-xs hover:bg-[var(--bg-hover)]"
      >
        {matrixExpanded ? "▲ HIDE MATRIX" : "▼ SHOW FULL CORRELATION MATRIX"}
      </button>
      {matrixExpanded ? <HeavyMatrix data={data} /> : null}
    </div>
  );
}

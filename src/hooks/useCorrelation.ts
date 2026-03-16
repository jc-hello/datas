"use client";

import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { CorrelationResponse } from "@/types/correlation";
import { useDashboardStore } from "@/stores/dashboard.store";
import { staleTimeForTimeframe } from "@/lib/utils/timeframe";

const BATCH_SIZE = 50;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export function useCorrelation() {
  const { exchange, base, timeframe, symbols, methods, limit, rollingWindow } = useDashboardStore();
  const staleTime = staleTimeForTimeframe(timeframe);

  return useQuery({
    queryKey: ["correlation", exchange, base, timeframe, limit, rollingWindow, symbols.join(","), methods.join(",")],
    queryFn: async () => {
      const res = await fetch("/api/correlation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchange, base, symbols, timeframe, limit, rollingWindow, methods }),
      });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as CorrelationResponse;
    },
    staleTime,
    gcTime: staleTime * 2,
    refetchInterval: staleTime,
    refetchIntervalInBackground: false,
    enabled: symbols.length > 0,
  });
}

export function useCorrelationBatched(allSymbols: string[]) {
  const { exchange, base, timeframe, methods, limit, rollingWindow } = useDashboardStore();
  const [loadedCount, setLoadedCount] = useState(BATCH_SIZE);
  const symbolSlice = useMemo(() => allSymbols.slice(0, loadedCount), [allSymbols, loadedCount]);

  const queries = useQueries({
    queries: chunk(symbolSlice, BATCH_SIZE).map((batch) => ({
      queryKey: ["corr-batch", exchange, base, timeframe, methods.join(","), limit, rollingWindow, batch.join(",")],
      queryFn: async () => {
        const res = await fetch("/api/correlation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exchange, base, symbols: batch, timeframe, limit, rollingWindow, methods }),
        });
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()) as CorrelationResponse;
      },
      staleTime: staleTimeForTimeframe(timeframe),
    })),
  });

  const loadMore = () => setLoadedCount((count) => Math.min(count + BATCH_SIZE, allSymbols.length));

  return {
    queries,
    loadMore,
    hasMore: loadedCount < allSymbols.length,
  };
}

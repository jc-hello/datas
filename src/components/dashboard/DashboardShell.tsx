"use client";

import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { CorrelationResponse } from "@/types/correlation";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useCorrelation } from "@/hooks/useCorrelation";
import { useSymbols } from "@/hooks/useSymbols";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { CorrelationTable } from "@/components/dashboard/CorrelationTable";
import { CorrelationMatrix } from "@/components/dashboard/CorrelationMatrix";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { RegimeAlert } from "@/components/dashboard/RegimeAlert";
import { ExchangeComparison } from "@/components/dashboard/ExchangeComparison";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Ticker } from "@/components/ui/Ticker";

export function DashboardShell() {
  const { exchange, exchanges, base, timeframe, limit, rollingWindow, methods, symbols, setSymbols, symbolFilter } =
    useDashboardStore();

  const symbolsQuery = useSymbols(exchange);

  useEffect(() => {
    if (!symbolsQuery.data?.length) return;
    if (symbols.length > 0) return;
    setSymbols(symbolsQuery.data.slice(0, 200));
  }, [symbolsQuery.data, setSymbols, symbols.length]);

  const correlation = useCorrelation();

  const compareQueries = useQueries({
    queries: exchanges.map((id) => ({
      queryKey: ["compare", id, base, timeframe, methods.join(",")],
      queryFn: async () => {
        const activeSymbols = (symbolsQuery.data ?? []).slice(0, 50);
        const res = await fetch("/api/correlation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exchange: id,
            base,
            symbols: activeSymbols,
            timeframe,
            limit,
            rollingWindow,
            methods,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()) as CorrelationResponse;
      },
      staleTime: 300_000,
      enabled: exchanges.length > 1,
    })),
  });

  const compareData = useMemo(
    () => compareQueries.flatMap((q) => (q.data ? [q.data] : [])),
    [compareQueries],
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <TopBar />
      <div className="grid grid-cols-1 gap-3 p-3 xl:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <SummaryPanel data={correlation.data} />
          <RegimeAlert data={correlation.data?.symbols ?? []} />
          <TerminalPanel title="CORRELATION TABLE">
            <CorrelationTable data={correlation.data?.symbols ?? []} filter={symbolFilter} />
          </TerminalPanel>
        </div>

        <Sidebar />
      </div>

      <div className="space-y-3 px-3 pb-3">
        <TerminalPanel title="MATRIX HEATMAP">
          <CorrelationMatrix data={correlation.data} />
        </TerminalPanel>
        <ExchangeComparison data={compareData} />
      </div>

      <StatusBar data={correlation.data} />
      <Ticker
        items={[
          `EXCHANGE ${exchange.toUpperCase()}`,
          `BASE ${base}`,
          `TF ${timeframe}`,
          `SYMBOLS ${correlation.data?.symbols.length ?? 0}`,
          `CACHE ${correlation.data?.cacheHit ? "HIT" : "MISS"}`,
        ]}
      />
    </div>
  );
}

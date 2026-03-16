"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExchangeStatus } from "@/types/exchange";

export function useExchangeStatus() {
  return useQuery({
    queryKey: ["exchange-status"],
    queryFn: async () => {
      const res = await fetch("/api/exchanges");
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as ExchangeStatus[];
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
}

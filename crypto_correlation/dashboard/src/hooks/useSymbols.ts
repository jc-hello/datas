"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExchangeId } from "@/types/exchange";

export function useSymbols(exchange: ExchangeId) {
  return useQuery({
    queryKey: ["symbols", exchange],
    queryFn: async () => {
      const res = await fetch(`/api/symbols?exchange=${exchange}`);
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as string[];
    },
    staleTime: 3_600_000,
    gcTime: 7_200_000,
  });
}

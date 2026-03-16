"use client";

import { useMemo } from "react";
import { useCorrelation } from "@/hooks/useCorrelation";

export function useRollingCorr() {
  const { data, ...rest } = useCorrelation();

  const rollingBySymbol = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const row of data?.symbols ?? []) {
      map[row.symbol] = row.rollingHistory;
    }
    return map;
  }, [data]);

  return {
    ...rest,
    rollingBySymbol,
  };
}

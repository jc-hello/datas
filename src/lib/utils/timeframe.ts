const TIMEFRAME_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1d": 86_400_000,
};

export function timeframeToMs(timeframe: string): number {
  return TIMEFRAME_MS[timeframe] ?? TIMEFRAME_MS["1h"];
}

export function staleTimeForTimeframe(timeframe: string): number {
  return {
    "1m": 30_000,
    "5m": 60_000,
    "15m": 120_000,
    "1h": 300_000,
    "4h": 900_000,
    "1d": 3_600_000,
  }[timeframe] ?? 300_000;
}

export function cacheTtlForTimeframe(timeframe: string): number {
  return {
    "1m": 60_000,
    "5m": 120_000,
    "15m": 180_000,
    "1h": 300_000,
    "4h": 900_000,
    "1d": 3_600_000,
  }[timeframe] ?? 300_000;
}

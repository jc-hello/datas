import ccxt from "ccxt";
import type { OhlcvCandle } from "@/types/ohlcv";
import { timeframeToMs } from "@/lib/utils/timeframe";
import { logReturns } from "@/lib/correlation/returns";

type CcxtExchange = {
  id: string;
  fetchOHLCV: (symbol: string, timeframe: string, since?: number, limit?: number) => Promise<number[][]>;
};

const MIN_CANDLES = 50;

export async function fetchOHLCV(
  exchange: CcxtExchange,
  symbol: string,
  timeframe: string,
  limit: number,
): Promise<OhlcvCandle[] | null> {
  const tfMs = timeframeToMs(timeframe);
  const safeLimit = Math.max(50, Math.min(limit, exchange.id === "okx" ? 500 : limit));
  const since = Date.now() - safeLimit * tfMs;

  const fetchOnce = async (): Promise<OhlcvCandle[] | null> => {
    const ohlcv = (await exchange.fetchOHLCV(symbol, timeframe, since, safeLimit)) as OhlcvCandle[];
    return ohlcv.length >= MIN_CANDLES ? ohlcv : null;
  };

  try {
    return await fetchOnce();
  } catch (error) {
    if (error instanceof ccxt.NetworkError || error instanceof ccxt.RequestTimeout) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        return await fetchOnce();
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function extractCloses(ohlcv: OhlcvCandle[]): Map<number, number> {
  return new Map(ohlcv.map(([ts, , , , close]) => [ts, close]));
}

export function alignAndReturn(base: Map<number, number>, symbol: Map<number, number>): [number[], number[]] {
  const commonTs = [...base.keys()].filter((ts) => symbol.has(ts)).sort((a, b) => a - b);
  const basePrices = commonTs.map((ts) => base.get(ts) ?? 0);
  const symbolPrices = commonTs.map((ts) => symbol.get(ts) ?? 0);
  return [logReturns(basePrices), logReturns(symbolPrices)];
}

import type { CorrelationRequest, CorrelationResponse, SymbolCorrelation } from "@/types/correlation";
import type { ExchangeId } from "@/types/exchange";
import { correlationCache } from "@/lib/cache/correlation-cache";
import { ohlcvCache } from "@/lib/cache/ohlcv-cache";
import { ensureMarkets } from "@/lib/ccxt/client";
import { alignAndReturn, extractCloses, fetchOHLCV } from "@/lib/ccxt/fetcher";
import { baseSymbol, normalizeSymbolForExchange } from "@/lib/ccxt/symbols";
import { buildCorrelationMatrix } from "@/lib/correlation/matrix";
import { kendall } from "@/lib/correlation/kendall";
import { pearson } from "@/lib/correlation/pearson";
import { rollingCorrelation } from "@/lib/correlation/rolling";
import { spearman } from "@/lib/correlation/spearman";
import { cacheTtlForTimeframe, timeframeToMs } from "@/lib/utils/timeframe";

function sanitizeLimit(limit: number, exchange: ExchangeId): number {
  const max = exchange === "okx" ? 500 : 1000;
  return Math.max(50, Math.min(limit || 500, max));
}

function computeRegime(latest: number | null): SymbolCorrelation["regime"] {
  if (latest === null) return "decorrelated";
  if (latest >= 0.65) return "trending";
  if (latest >= 0.3) return "moderate";
  if (latest <= -0.3) return "diverging";
  return "decorrelated";
}

async function fetchCachedOHLCV(
  exchangeId: ExchangeId,
  symbol: string,
  timeframe: string,
  limit: number,
): Promise<number[][] | null> {
  const key = `ohlcv:${exchangeId}:${symbol}:${timeframe}:${limit}`;
  const cached = ohlcvCache.get(key);
  if (cached) return cached;

  const exchange = await ensureMarkets(exchangeId);
  const raw = await fetchOHLCV(exchange, symbol, timeframe, limit);
  if (!raw) return null;

  ohlcvCache.set(key, raw, cacheTtlForTimeframe(timeframe));
  return raw;
}

export async function computeCorrelation(payload: CorrelationRequest): Promise<CorrelationResponse> {
  const safeLimit = sanitizeLimit(payload.limit, payload.exchange);
  const safeRolling = Math.max(10, Math.min(payload.rollingWindow || 24, Math.floor(safeLimit / 2)));

  const cacheKey = `corr:${payload.exchange}:${payload.base}:${payload.timeframe}:${safeLimit}:${safeRolling}:${payload.methods.sort().join(",")}:${payload.symbols.sort().join(",")}:${payload.includeMatrix ? "1" : "0"}`;
  const cached = correlationCache.get(cacheKey);
  if (cached) {
    return { ...cached, cacheHit: true };
  }

  const exchange = await ensureMarkets(payload.exchange);
  const base = baseSymbol(payload.base, payload.exchange);
  const baseCandles = await fetchCachedOHLCV(payload.exchange, base, payload.timeframe, safeLimit);

  if (!baseCandles) {
    throw new Error(`Base symbol data unavailable: ${base}`);
  }

  const markets = exchange.markets ?? {};
  const filteredSymbols = payload.symbols
    .map((s) => normalizeSymbolForExchange(payload.exchange, s))
    .filter((s) => s !== base && Boolean(markets[s]))
    .slice(0, 220);

  const baseCloses = extractCloses(baseCandles as [number, number, number, number, number, number][]);
  const baseReturnsForMatrix: Record<string, number[]> = {};

  const settled = await Promise.allSettled(
    filteredSymbols.map(async (symbol) => {
      const candles = await fetchCachedOHLCV(payload.exchange, symbol, payload.timeframe, safeLimit);
      return { symbol, candles };
    }),
  );

  const symbols: SymbolCorrelation[] = [];
  const dataQuality: Record<string, "ok" | "sparse" | "missing"> = {};

  for (const item of settled) {
    if (item.status === "rejected") continue;
    const { symbol, candles } = item.value;

    if (!candles || candles.length < 50) {
      dataQuality[symbol] = "missing";
      symbols.push({
        symbol,
        pearson: null,
        spearman: null,
        kendall: null,
        rolling: null,
        rollingHistory: [],
        pValue: null,
        significant: false,
        regime: "decorrelated",
        trendDelta: 0,
        candleCount: candles?.length ?? 0,
      });
      continue;
    }

    const symbolCloses = extractCloses(candles as [number, number, number, number, number, number][]);
    const [baseReturns, symbolReturns] = alignAndReturn(baseCloses, symbolCloses);
    const n = Math.min(baseReturns.length, symbolReturns.length);

    if (n < 30) {
      dataQuality[symbol] = "sparse";
      symbols.push({
        symbol,
        pearson: null,
        spearman: null,
        kendall: null,
        rolling: null,
        rollingHistory: [],
        pValue: null,
        significant: false,
        regime: "decorrelated",
        trendDelta: 0,
        candleCount: candles.length,
      });
      continue;
    }

    dataQuality[symbol] = "ok";
    const alignedBase = baseReturns.slice(-n);
    const alignedSym = symbolReturns.slice(-n);

    const pear = payload.methods.includes("pearson") ? pearson(alignedBase, alignedSym) : { r: null, pValue: null };
    const spear = payload.methods.includes("spearman") ? spearman(alignedBase, alignedSym) : null;
    const kend = payload.methods.includes("kendall") ? kendall(alignedBase, alignedSym) : null;

    const rolling = rollingCorrelation(alignedBase, alignedSym, safeRolling);
    const latestRolling = rolling.length ? rolling[rolling.length - 1] : null;
    const mid = rolling.length > 1 ? rolling[Math.floor(rolling.length / 2)] : latestRolling;
    const trendDelta = latestRolling !== null && mid !== null ? latestRolling - mid : 0;

    baseReturnsForMatrix[symbol] = alignedSym;

    symbols.push({
      symbol,
      pearson: pear.r,
      spearman: spear,
      kendall: kend,
      rolling: latestRolling,
      rollingHistory: rolling.slice(-40),
      pValue: pear.pValue,
      significant: pear.pValue !== null ? pear.pValue < 0.05 : false,
      regime: computeRegime(latestRolling),
      trendDelta,
      candleCount: candles.length,
    });
  }

  symbols.sort((a, b) => Math.abs(b.pearson ?? 0) - Math.abs(a.pearson ?? 0));

  const result: CorrelationResponse = {
    base: payload.base,
    exchange: payload.exchange,
    timeframe: payload.timeframe,
    computedAt: Date.now(),
    candlesUsed: baseCandles.length,
    symbols,
    matrix:
      payload.includeMatrix && Object.keys(baseReturnsForMatrix).length > 1
        ? buildCorrelationMatrix(baseReturnsForMatrix, payload.methods[0] ?? "pearson")
        : undefined,
    cacheHit: false,
    dataQuality,
  };

  const ttl = Math.floor(timeframeToMs(payload.timeframe) / 2);
  correlationCache.set(cacheKey, result, Math.max(ttl, 30_000));

  return result;
}

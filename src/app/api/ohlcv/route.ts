import { NextRequest, NextResponse } from "next/server";
import { ohlcvCache } from "@/lib/cache/ohlcv-cache";
import { ensureMarkets } from "@/lib/ccxt/client";
import { fetchOHLCV } from "@/lib/ccxt/fetcher";
import { cacheTtlForTimeframe } from "@/lib/utils/timeframe";
import type { ExchangeId } from "@/types/exchange";

export const runtime = "nodejs";

function toExchangeId(raw: string | null): ExchangeId {
  if (raw === "okx" || raw === "bybit" || raw === "hyperliquid") return raw;
  return "binance";
}

export async function GET(req: NextRequest) {
  const exchange = toExchangeId(req.nextUrl.searchParams.get("exchange"));
  const symbol = req.nextUrl.searchParams.get("symbol");
  const timeframe = req.nextUrl.searchParams.get("tf") ?? "1h";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 500);

  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  const safeLimit = Math.max(50, Math.min(exchange === "okx" ? 500 : 1000, limit));
  const key = `ohlcv:${exchange}:${symbol}:${timeframe}:${safeLimit}`;
  const cached = ohlcvCache.get(key);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Cache": "HIT",
      },
    });
  }

  const ex = await ensureMarkets(exchange);
  const candles = await fetchOHLCV(ex, symbol, timeframe, safeLimit);

  if (!candles) {
    return NextResponse.json({ error: "No OHLCV data" }, { status: 404 });
  }

  ohlcvCache.set(key, candles, cacheTtlForTimeframe(timeframe));
  return NextResponse.json(candles, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      "X-Cache": "MISS",
      "X-Computed-At": Date.now().toString(),
    },
  });
}

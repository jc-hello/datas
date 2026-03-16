import { NextRequest, NextResponse } from "next/server";
import { symbolCache } from "@/lib/cache/ohlcv-cache";
import { ensureMarkets } from "@/lib/ccxt/client";
import { listPerpSymbols } from "@/lib/ccxt/symbols";
import { TOP_200_SYMBOLS, toPerpSymbol } from "@/lib/utils/symbols-list";
import type { ExchangeId } from "@/types/exchange";

export const runtime = "nodejs";

function toExchangeId(raw: string | null): ExchangeId {
  if (raw === "okx" || raw === "bybit" || raw === "hyperliquid") return raw;
  return "binance";
}

export async function GET(req: NextRequest) {
  const exchange = toExchangeId(req.nextUrl.searchParams.get("exchange"));
  const cacheKey = `symbols:${exchange}`;
  const cached = symbolCache.get(cacheKey);

  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    const ex = await ensureMarkets(exchange);
    const symbols = listPerpSymbols(exchange, ex.markets ?? {});
    symbolCache.set(cacheKey, symbols, 3_600_000);

    return NextResponse.json(symbols, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch {
    const fallback = TOP_200_SYMBOLS.map((s) => toPerpSymbol(s, exchange));
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
        "X-Cache": "FALLBACK",
      },
    });
  }
}

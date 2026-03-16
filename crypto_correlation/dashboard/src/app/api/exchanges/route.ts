import { NextResponse } from "next/server";
import { EXCHANGES } from "@/types/exchange";
import { ensureMarkets, getExchangeMetadata } from "@/lib/ccxt/client";
import { exchangeStatusCache } from "@/lib/cache/ohlcv-cache";

export const runtime = "nodejs";

export async function GET() {
  const statuses = await Promise.all(
    EXCHANGES.map(async (id) => {
      const key = `ex-status:${id}`;
      const cached = exchangeStatusCache.get(key);
      if (cached && Date.now() - cached.updatedAt < 30_000) {
        const meta = getExchangeMetadata(id);
        return {
          id,
          name: meta.name,
          online: cached.online,
          marketsLoaded: true,
          quoteAsset: meta.quote,
          updatedAt: cached.updatedAt,
        };
      }

      try {
        await ensureMarkets(id);
        exchangeStatusCache.set(key, { online: true, updatedAt: Date.now() }, 60_000);
        const meta = getExchangeMetadata(id);
        return {
          id,
          name: meta.name,
          online: true,
          marketsLoaded: true,
          quoteAsset: meta.quote,
          updatedAt: Date.now(),
        };
      } catch {
        exchangeStatusCache.set(key, { online: false, updatedAt: Date.now() }, 30_000);
        const meta = getExchangeMetadata(id);
        return {
          id,
          name: meta.name,
          online: false,
          marketsLoaded: false,
          quoteAsset: meta.quote,
          updatedAt: Date.now(),
        };
      }
    }),
  );

  return NextResponse.json(statuses, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
      "X-Computed-At": Date.now().toString(),
    },
  });
}
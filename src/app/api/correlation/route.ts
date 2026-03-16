import { NextRequest, NextResponse } from "next/server";
import type { CorrelationRequest } from "@/types/correlation";
import { computeCorrelation } from "@/lib/correlation/compute";

export const runtime = "nodejs";

function safePayload(input: unknown): CorrelationRequest {
  const body = (input ?? {}) as Partial<CorrelationRequest>;
  return {
    exchange: body.exchange ?? "binance",
    base: body.base ?? "BTC",
    symbols: Array.isArray(body.symbols) ? body.symbols : [],
    timeframe: body.timeframe ?? "1h",
    limit: Number(body.limit ?? 500),
    rollingWindow: Number(body.rollingWindow ?? 24),
    methods: Array.isArray(body.methods) && body.methods.length ? body.methods : ["pearson", "spearman", "kendall"],
    includeMatrix: Boolean(body.includeMatrix),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = safePayload(await req.json());
    const data = await computeCorrelation(body);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "X-Cache": data.cacheHit ? "HIT" : "MISS",
        "X-Computed-At": data.computedAt.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "correlation compute failed",
      },
      { status: 500 },
    );
  }
}

import { NextRequest } from "next/server";
import { computeCorrelation } from "@/lib/correlation/compute";
import type { CorrelationMethod } from "@/types/correlation";
import type { ExchangeId } from "@/types/exchange";
import { staleTimeForTimeframe } from "@/lib/utils/timeframe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const exchange = (search.get("exchange") as ExchangeId) ?? "binance";
  const base = (search.get("base") as "BTC" | "ETH") ?? "BTC";
  const timeframe = search.get("timeframe") ?? "1h";
  const limit = Number(search.get("limit") ?? 500);
  const rollingWindow = Number(search.get("rollingWindow") ?? 24);
  const symbols = (search.get("symbols") ?? "").split(",").filter(Boolean);
  const methods = ((search.get("methods") ?? "pearson,spearman,kendall").split(",") as CorrelationMethod[]).filter(Boolean);

  const encoder = new TextEncoder();
  const staleMs = staleTimeForTimeframe(timeframe);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      let cancelled = false;
      const signal = req.signal;
      signal.addEventListener("abort", () => {
        cancelled = true;
        controller.close();
      });

      while (!cancelled) {
        try {
          const result = await computeCorrelation({
            exchange,
            base,
            symbols,
            timeframe,
            limit,
            rollingWindow,
            methods,
            includeMatrix: false,
          });
          send(result);
        } catch (error) {
          send({ error: error instanceof Error ? error.message : "stream compute failed" });
        }

        await new Promise((resolve) => setTimeout(resolve, staleMs));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

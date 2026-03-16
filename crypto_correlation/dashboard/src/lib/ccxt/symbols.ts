import type { ExchangeId } from "@/types/exchange";
import { quoteAssetForExchange } from "@/lib/ccxt/client";

type MarketLike = {
  quote?: string;
  active?: boolean;
  swap?: boolean;
  future?: boolean;
  contract?: boolean;
};

function normalizeHyperliquid(symbol: string): string {
  if (symbol.includes(":USDC")) return symbol;
  if (symbol.endsWith("/USDC")) return `${symbol}:USDC`;
  return symbol;
}

export function normalizeSymbolForExchange(exchange: ExchangeId, symbol: string): string {
  if (exchange === "hyperliquid") return normalizeHyperliquid(symbol);
  return symbol;
}

export function listPerpSymbols(exchange: ExchangeId, markets: Record<string, MarketLike>): string[] {
  const quote = quoteAssetForExchange(exchange);
  return Object.keys(markets)
    .filter((s) => {
      const market = markets[s];
      if (!market || !market.active) return false;
      if (market.quote !== quote) return false;
      return Boolean(market.swap || market.future || market.contract);
    })
    .map((s) => normalizeSymbolForExchange(exchange, s))
    .sort();
}

export function baseSymbol(base: "BTC" | "ETH", exchange: ExchangeId): string {
  const quote = quoteAssetForExchange(exchange);
  if (exchange === "hyperliquid") return `${base}/${quote}:${quote}`;
  return `${base}/${quote}`;
}

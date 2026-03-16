import ccxt from "ccxt";
import type { ExchangeId } from "@/types/exchange";

type CcxtExchange = {
  id: string;
  markets?: Record<string, { active?: boolean; quote?: string; swap?: boolean; future?: boolean; contract?: boolean }>;
  loadMarkets: () => Promise<unknown>;
  fetchOHLCV: (symbol: string, timeframe: string, since?: number, limit?: number) => Promise<number[][]>;
};

const instances = new Map<ExchangeId, CcxtExchange>();
const marketLoadState = new Set<ExchangeId>();

const EXCHANGE_CONFIG: Record<ExchangeId, object> = {
  binance: { options: { defaultType: "future" }, enableRateLimit: true },
  okx: { options: { defaultType: "swap" }, enableRateLimit: true },
  bybit: { options: { defaultType: "linear" }, enableRateLimit: true },
  hyperliquid: { enableRateLimit: true },
};

export async function getExchange(id: ExchangeId): Promise<CcxtExchange> {
  if (!instances.has(id)) {
    const ExchangeClass = ccxt[id] as unknown as new (config: object) => CcxtExchange;
    const ex = new ExchangeClass({ ...EXCHANGE_CONFIG[id], timeout: 10_000 });
    instances.set(id, ex);
  }
  return instances.get(id)!;
}

export async function ensureMarkets(id: ExchangeId): Promise<CcxtExchange> {
  const ex = await getExchange(id);
  if (!marketLoadState.has(id)) {
    await ex.loadMarkets();
    marketLoadState.add(id);
  }
  return ex;
}

export function quoteAssetForExchange(id: ExchangeId): "USDT" | "USDC" {
  return id === "hyperliquid" ? "USDC" : "USDT";
}

export function getExchangeMetadata(id: ExchangeId): { id: ExchangeId; name: string; quote: "USDT" | "USDC" } {
  const names: Record<ExchangeId, string> = {
    binance: "BINANCE",
    okx: "OKX",
    bybit: "BYBIT",
    hyperliquid: "HYPERLIQUID",
  };
  return { id, name: names[id], quote: quoteAssetForExchange(id) };
}

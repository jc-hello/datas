import type { ExchangeId } from "@/types/exchange";

type ExchangeClient = {
  id: string;
  loadMarkets: () => Promise<unknown>;
  fetchOHLCV: (symbol: string, timeframe: string, since?: number, limit?: number) => Promise<number[][]>;
};

export interface ExchangeWithMeta {
  id: ExchangeId;
  client: ExchangeClient;
  quoteAsset: "USDT" | "USDC";
}

export interface OhlcvQuery {
  exchange: ExchangeId;
  symbol: string;
  timeframe: string;
  limit: number;
}

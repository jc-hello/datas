export const EXCHANGES = ["binance", "okx", "bybit", "hyperliquid"] as const;

export type ExchangeId = (typeof EXCHANGES)[number];

export interface ExchangeStatus {
  id: ExchangeId;
  name: string;
  online: boolean;
  marketsLoaded: boolean;
  quoteAsset: "USDT" | "USDC";
  updatedAt: number;
}

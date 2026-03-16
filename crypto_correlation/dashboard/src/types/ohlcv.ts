export type OhlcvCandle = [
  timestamp: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
];

export interface OhlcvResponse {
  exchange: string;
  symbol: string;
  timeframe: string;
  limit: number;
  candles: OhlcvCandle[];
  cacheHit: boolean;
  fetchedAt: number;
}

import type { ExchangeId } from "@/types/exchange";

export type CorrelationMethod = "pearson" | "spearman" | "kendall";
export type BaseAsset = "BTC" | "ETH";

export interface CorrelationRequest {
  exchange: ExchangeId;
  base: BaseAsset;
  symbols: string[];
  timeframe: string;
  limit: number;
  rollingWindow: number;
  methods: CorrelationMethod[];
  includeMatrix?: boolean;
}

export type DataQuality = "ok" | "sparse" | "missing";

export interface SymbolCorrelation {
  symbol: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
  rolling: number | null;
  rollingHistory: number[];
  pValue: number | null;
  significant: boolean;
  regime: "trending" | "moderate" | "decorrelated" | "diverging";
  trendDelta: number;
  candleCount: number;
}

export interface CorrelationResponse {
  base: BaseAsset;
  exchange: ExchangeId;
  timeframe: string;
  computedAt: number;
  candlesUsed: number;
  symbols: SymbolCorrelation[];
  matrix?: number[][];
  cacheHit: boolean;
  dataQuality: Record<string, DataQuality>;
}

import type { CorrelationResponse } from "@/types/correlation";
import { TTLCache } from "@/lib/cache/ohlcv-cache";

export const correlationCache = new TTLCache<CorrelationResponse>(300);

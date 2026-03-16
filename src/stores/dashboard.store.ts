import { create } from "zustand";
import type { BaseAsset, CorrelationMethod } from "@/types/correlation";
import type { ExchangeId } from "@/types/exchange";

interface DashboardState {
  exchange: ExchangeId;
  exchanges: ExchangeId[];
  base: BaseAsset;
  timeframe: string;
  limit: number;
  rollingWindow: number;
  methods: CorrelationMethod[];
  symbols: string[];
  symbolFilter: string;
  matrixExpanded: boolean;
  setExchange: (exchange: ExchangeId) => void;
  toggleExchange: (exchange: ExchangeId) => void;
  setBase: (base: BaseAsset) => void;
  setTimeframe: (timeframe: string) => void;
  setLimit: (limit: number) => void;
  setMethods: (methods: CorrelationMethod[]) => void;
  setSymbols: (symbols: string[]) => void;
  setSymbolFilter: (value: string) => void;
  setRollingWindow: (value: number) => void;
  setMatrixExpanded: (value: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  exchange: "binance",
  exchanges: ["binance", "okx", "bybit", "hyperliquid"],
  base: "BTC",
  timeframe: "1h",
  limit: 500,
  rollingWindow: 24,
  methods: ["pearson", "spearman", "kendall"],
  symbols: [],
  symbolFilter: "",
  matrixExpanded: false,
  setExchange: (exchange) => set({ exchange }),
  toggleExchange: (exchange) =>
    set((state) => ({
      exchanges: state.exchanges.includes(exchange)
        ? state.exchanges.filter((item) => item !== exchange)
        : [...state.exchanges, exchange],
    })),
  setBase: (base) => set({ base }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setLimit: (limit) => set({ limit }),
  setMethods: (methods) => set({ methods }),
  setSymbols: (symbols) => set({ symbols }),
  setSymbolFilter: (symbolFilter) => set({ symbolFilter }),
  setRollingWindow: (rollingWindow) => set({ rollingWindow }),
  setMatrixExpanded: (matrixExpanded) => set({ matrixExpanded }),
}));

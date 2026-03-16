"use client";

import { wrap } from "comlink";
import type { CorrelationMethod } from "@/types/correlation";

type WorkerApi = {
  computeMatrix: (
    priceMap: Record<string, number[]>,
    method: CorrelationMethod,
  ) => Promise<Record<string, Record<string, number>>>;
};

let workerInstance: ReturnType<typeof wrap<WorkerApi>> | null = null;

export function getCorrelationWorker(): ReturnType<typeof wrap<WorkerApi>> {
  if (!workerInstance) {
    const worker = new Worker(new URL("../../workers/correlation.worker.ts", import.meta.url), {
      type: "module",
    });
    workerInstance = wrap<WorkerApi>(worker);
  }
  return workerInstance;
}

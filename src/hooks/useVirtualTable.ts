"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function useVirtualTable(count: number, rowHeight = 36) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  return { parentRef, virtualizer };
}

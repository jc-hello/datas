"use client";

import { memo } from "react";
import { useInView } from "react-intersection-observer";
import { Line, LineChart, ResponsiveContainer } from "recharts";

function MiniSparkline({ data }: { data: number[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((value, index) => ({ index, value }))}>
        <Line type="monotone" dataKey="value" stroke="var(--accent)" dot={false} strokeWidth={1} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SparklineCellRaw({ data }: { data: number[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="h-6 w-20">
      {inView && data.length ? <MiniSparkline data={data} /> : <div className="mt-3 h-px bg-[var(--border)]" />}
    </div>
  );
}

export const SparklineCell = memo(SparklineCellRaw);

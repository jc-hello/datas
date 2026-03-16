import { corrColor, formatCorr } from "@/lib/utils/format";

export function CorrelationBadge({ value }: { value: number | null }) {
  return <span className={corrColor(value)}>{formatCorr(value)}</span>;
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-3 text-xs text-[var(--text-dim)]">
      <div className="mb-2 h-8 animate-pulse border border-[var(--border)] bg-[var(--bg-panel)]" />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_280px]">
        <div className="h-[620px] animate-pulse border border-[var(--border)] bg-[var(--bg-panel)]" />
        <div className="h-[620px] animate-pulse border border-[var(--border)] bg-[var(--bg-panel)]" />
      </div>
    </div>
  );
}

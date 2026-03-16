"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4 text-sm">
      <div className="max-w-xl border border-[var(--error)] bg-[var(--bg-panel)] p-4">
        <div className="mb-2 text-[var(--error)]">SYSTEM ERROR</div>
        <pre className="mb-4 whitespace-pre-wrap text-xs text-[var(--text-dim)]">{error.message}</pre>
        <button onClick={reset} className="border border-[var(--border)] px-3 py-1 text-xs hover:bg-[var(--bg-hover)]">
          RETRY
        </button>
      </div>
    </div>
  );
}

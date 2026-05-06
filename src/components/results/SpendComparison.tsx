import type { SpendBreakdown } from "@/types/audit";
import { formatDollars } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface SpendComparisonProps {
  breakdown: SpendBreakdown[];
  totalCurrent: number;
  totalOptimized: number;
}

export function SpendComparison({ breakdown, totalCurrent, totalOptimized }: SpendComparisonProps) {
  if (totalCurrent === 0) return null;

  const totalSavings = totalCurrent - totalOptimized;
  const hasSavings = totalSavings > 0;
  const optimizedPct = Math.max(4, (totalOptimized / totalCurrent) * 100);

  return (
    <section aria-label="Spend comparison" className="rounded-xl border border-border bg-card overflow-hidden card-glow">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Spend Comparison</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly current vs optimized</p>
        </div>
        {hasSavings && (
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">You save</p>
            <p className="text-base font-bold text-emerald-400 tabular-nums">
              {formatDollars(totalSavings)}/mo
            </p>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Overall stacked bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Current:{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {formatDollars(totalCurrent)}/mo
              </span>
            </span>
            <span className="text-muted-foreground">
              Optimized:{" "}
              <span className={cn("font-semibold tabular-nums", hasSavings ? "text-emerald-400" : "text-foreground")}>
                {formatDollars(totalOptimized)}/mo
              </span>
            </span>
          </div>
          <div
            role="img"
            aria-label={`Spend reduced from ${formatDollars(totalCurrent)} to ${formatDollars(totalOptimized)} per month`}
            className="relative h-3 rounded-full bg-muted overflow-hidden"
          >
            {/* Baseline (current) */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20" aria-hidden="true" />
            {/* Optimized portion */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/60 transition-all duration-700"
              style={{ width: `${optimizedPct}%` }}
            />
          </div>
        </div>

        {/* Per-tool breakdown */}
        {breakdown.length > 0 && (
          <ul role="list" className="space-y-3">
            {breakdown.map((item) => {
              const sharePct = totalCurrent > 0 ? (item.currentMonthlySpend / totalCurrent) * 100 : 0;
              const savedPct =
                item.currentMonthlySpend > 0
                  ? (item.optimizedMonthlySpend / item.currentMonthlySpend) * 100
                  : 100;
              const hasSaving = item.monthlySavings > 0;

              return (
                <li key={item.instanceId}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className="text-base leading-none">{item.toolEmoji}</span>
                      <span className="text-muted-foreground font-medium">{item.toolName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <span
                        className={cn(
                          "font-medium",
                          hasSaving ? "line-through text-muted-foreground/40" : "text-foreground"
                        )}
                      >
                        {formatDollars(item.currentMonthlySpend)}
                      </span>
                      {hasSaving && (
                        <>
                          <span aria-hidden="true" className="text-muted-foreground/30 text-[10px]">→</span>
                          <span className="text-emerald-400 font-semibold">
                            {formatDollars(item.optimizedMonthlySpend)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    {/* Share of total */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full bg-white/8"
                      style={{ width: `${sharePct}%` }}
                    />
                    {/* Optimized share */}
                    {hasSaving && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/55 transition-all duration-500"
                        style={{ width: `${sharePct * (savedPct / 100)}%` }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}


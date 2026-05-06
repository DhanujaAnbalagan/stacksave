"use client";

import { cn } from "@/lib/utils";
import { AI_TOOL_MAP } from "@/data/constants";
import type { ToolEntry } from "@/types/audit";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";

interface SpendSummaryProps {
  tools: ToolEntry[];
  totalMonthlySpend: number;
  totalSeats: number;
}

const SAVINGS_ESTIMATE_RATE = 0.25; // pre-audit estimate; real report will be precise

export function SpendSummary({
  tools,
  totalMonthlySpend,
  totalSeats,
}: SpendSummaryProps) {
  const annualSpend = totalMonthlySpend * 12;
  const estimatedSavings = totalMonthlySpend * SAVINGS_ESTIMATE_RATE;
  const annualSavings = estimatedSavings * 12;
  const hasData = totalMonthlySpend > 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden card-glow sticky top-6">
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Spend Summary
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Updates live as you enter tools
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Tools tracked */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Tools tracked</span>
            <span className="text-xs font-semibold text-foreground">
              {tools.length}
            </span>
          </div>
          <Progress
            value={Math.min((tools.length / 8) * 100, 100)}
            className="h-1.5"
          />
        </div>

        <Separator className="bg-border" />

        {/* Total monthly */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" />
              Monthly spend
            </div>
            <span
              className={cn(
                "text-base font-bold tabular-nums transition-colors",
                hasData ? "text-foreground" : "text-muted-foreground/40"
              )}
            >
              ${totalMonthlySpend.toFixed(0)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" />
              Annual spend
            </div>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                hasData ? "text-foreground" : "text-muted-foreground/40"
              )}
            >
              ${annualSpend.toFixed(0)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              Total seats
            </div>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                hasData ? "text-foreground" : "text-muted-foreground/40"
              )}
            >
              {totalSeats}
            </span>
          </div>
        </div>

        {/* Estimated savings */}
        {hasData && (
          <>
            <Separator className="bg-border" />
            <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  Est. savings potential
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-300 tabular-nums">
                  ${estimatedSavings.toFixed(0)}
                  <span className="text-xs font-normal text-emerald-400/70 ml-1">
                    /mo
                  </span>
                </p>
                <p className="text-xs text-emerald-400/70 mt-0.5">
                  ~${annualSavings.toFixed(0)} per year
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                Pre-audit estimate. Your actual report will show exact figures.
              </p>
            </div>
          </>
        )}

        {/* Per-tool breakdown */}
        {tools.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                Breakdown
              </p>
              {tools.map((entry) => {
                const tool = AI_TOOL_MAP[entry.toolId];
                const spend = parseFloat(entry.monthlySpend) || 0;
                const pct =
                  totalMonthlySpend > 0
                    ? (spend / totalMonthlySpend) * 100
                    : 0;
                return (
                  <div key={entry.instanceId} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{tool?.emoji}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {tool?.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-foreground tabular-nums shrink-0">
                        ${spend.toFixed(0)}
                      </span>
                    </div>
                    <Progress value={pct} className="h-0.5" />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {tools.length === 0 && (
          <div className="text-center py-4">
            <BarChart3 className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/50">
              Add AI tools above to see your spend summary
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


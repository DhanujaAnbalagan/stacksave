"use client";

import type { Recommendation, RecommendationType } from "@/types/audit";
import { formatDollars } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  TrendingDown,
  GitMerge,
  Trash2,
  Zap,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface RecommendationCardProps {
  rec: Recommendation;
}

// ─── Type config (label, icon, colour tokens) ───────────────────

type TypeStyle = {
  label: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  accent: string; // top-border gradient class
};

const TYPE_STYLE: Record<RecommendationType, TypeStyle> = {
  downgrade: {
    label: "Downgrade",
    Icon: TrendingDown,
    color: "text-amber-400",
    bg: "bg-amber-500/6",
    border: "border-amber-500/20",
    accent: "via-amber-500/40",
  },
  consolidate: {
    label: "Consolidate",
    Icon: GitMerge,
    color: "text-blue-400",
    bg: "bg-blue-500/6",
    border: "border-blue-500/20",
    accent: "via-blue-500/40",
  },
  eliminate: {
    label: "Remove",
    Icon: Trash2,
    color: "text-rose-400",
    bg: "bg-rose-500/6",
    border: "border-rose-500/20",
    accent: "via-rose-500/40",
  },
  optimize: {
    label: "Optimize",
    Icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-500/6",
    border: "border-violet-500/20",
    accent: "via-violet-500/40",
  },
  keep: {
    label: "Optimized",
    Icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/15",
    accent: "via-emerald-500/30",
  },
};

const CONFIDENCE_STYLE = {
  high: "text-emerald-400 border-emerald-500/25 bg-emerald-500/8",
  medium: "text-amber-400 border-amber-500/25 bg-amber-500/8",
  low: "text-muted-foreground border-border bg-muted/40",
} as const;

// ─── Component ──────────────────────────────────────────────────

export function RecommendationCard({ rec }: RecommendationCardProps) {
  const [open, setOpen] = useState(rec.type !== "keep");
  const s = TYPE_STYLE[rec.type];
  const { Icon } = s;
  const hasSavings = rec.estimatedMonthlySavings > 0;

  return (
    <article
      id={`rec-${rec.instanceId}`}
      className={cn(
        "rounded-xl border overflow-hidden",
        "transition-shadow duration-200 hover:shadow-sm",
        s.border,
        s.bg
      )}
    >
      {/* Top accent line */}
      {rec.type !== "keep" && (
        <div
          aria-hidden="true"
          className={cn(
            "h-px bg-gradient-to-r from-transparent to-transparent",
            s.accent
          )}
        />
      )}

      {/* Header — always visible, acts as accordion toggle */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`rec-body-${rec.instanceId}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-4 sm:px-5 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
      >
        <div className="flex items-start gap-3">
          {/* Tool emoji */}
          <span className="text-xl leading-none shrink-0 mt-0.5" aria-hidden="true">
            {rec.toolEmoji}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              {/* Left: tool name + badge + current plan */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold text-foreground leading-none">
                    {rec.toolName}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-semibold",
                      "uppercase tracking-wider px-1.5 py-0.5 rounded-full border leading-none",
                      s.color,
                      s.bg,
                      s.border
                    )}
                  >
                    <Icon className="w-2.5 h-2.5" aria-hidden="true" />
                    {s.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-none">
                  {rec.currentPlan} · {formatDollars(rec.currentMonthlySpend)}/mo
                </p>
              </div>

              {/* Right: savings + chevron */}
              <div className="flex items-center gap-2.5 shrink-0">
                {hasSavings && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 tabular-nums leading-tight">
                      −{formatDollars(rec.estimatedMonthlySavings)}/mo
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5">
                      {formatDollars(rec.estimatedAnnualSavings)}/yr
                    </p>
                  </div>
                )}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "w-4 h-4 text-muted-foreground/60 shrink-0 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Expandable body */}
      <div
        id={`rec-body-${rec.instanceId}`}
        role="region"
        aria-labelledby={`rec-${rec.instanceId}`}
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-white/5 space-y-4">
            {/* Recommended action */}
            <div className="pt-3">
              <p className={cn("text-[10px] font-semibold uppercase tracking-widest mb-1.5", s.color)}>
                Recommended action
              </p>
              <p className="text-sm font-medium text-foreground leading-snug">{rec.action}</p>
            </div>

            {/* Reasoning */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                Why this saves money
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{rec.reasoning}</p>
            </div>

            {/* Footer: confidence + related tool */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                  CONFIDENCE_STYLE[rec.confidence]
                )}
              >
                {rec.confidence === "high" ? "High" : rec.confidence === "medium" ? "Medium" : "Low"} confidence
              </span>
              {rec.relatedToolName && (
                <span className="text-[10px] text-muted-foreground/50">
                  in favour of {rec.relatedToolName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SmartCTAProps {
  monthlySavings: number;
  annualSavings: number;
}

export function SmartCTA({ monthlySavings, annualSavings }: SmartCTAProps) {
  // Tier 1: Already optimal (< $5/mo savings)
  if (monthlySavings < 5) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Your stack is already reasonably optimized
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            No significant savings were found. Your current plan choices are well-matched
            to your team size and use case. Revisit this audit as your team grows or your
            AI usage patterns change.
          </p>
        </div>
      </div>
    );
  }

  // Tier 2: Moderate savings ($5–$499/mo)
  if (monthlySavings < 500) {
    return (
      <div className={cn(
        "rounded-xl border border-amber-500/20 bg-amber-500/6 p-5 sm:p-6 space-y-3"
      )}>
        <div>
          <p className="text-sm font-semibold text-foreground">
            ${Math.round(monthlySavings)}/mo in identified savings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            These optimizations are straightforward — no vendor negotiations required.
            Most teams implement all recommendations within a sprint.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/audit">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              Refine your inputs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Tier 3: High savings (≥ $500/mo)
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/8 p-5 sm:p-6 space-y-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-8 right-6 w-32 h-20 bg-primary/15 blur-3xl pointer-events-none" />
      <div className="relative flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0">
          <PhoneCall className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            ${Math.round(annualSavings).toLocaleString()}/year is worth a conversation
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Savings at this scale often require vendor negotiation, consolidation planning,
            and phased rollout. Our team can help you implement every recommendation and
            track actual realized savings month-over-month.
          </p>
        </div>
      </div>
      <div className="relative flex flex-col sm:flex-row gap-2">
        <Button
          id="smart-cta-talk"
          className="gradient-brand text-white border-0 gap-2 shadow-lg shadow-primary/20 hover:opacity-90"
        >
          Talk to StackSave
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Link href="/audit">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            Refine audit inputs
          </Button>
        </Link>
      </div>
    </div>
  );
}


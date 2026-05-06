"use client";

import type { SavedReport } from "@/lib/audit-engine/reports";
import { ResultsHeader } from "./ResultsHeader";
import { SavingsHero } from "./SavingsHero";
import { SpendComparison } from "./SpendComparison";
import { AISummary } from "./AISummary";
import { RecommendationCard } from "./RecommendationCard";
import { LeadCapture } from "./LeadCapture";
import { SmartCTA } from "./SmartCTA";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface ReportViewProps {
  report: SavedReport;
}

export function ReportView({ report }: ReportViewProps) {
  const { result } = report;
  const router = useRouter();

  const actionRecs = result.recommendations.filter((r) => r.type !== "keep");
  const keepRecs = result.recommendations.filter((r) => r.type === "keep");

  return (
    <div className="min-h-screen bg-background">
      <ResultsHeader
        generatedAt={result.generatedAt}
        onRestart={() => router.push("/audit")}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Savings headline + metric cards */}
        <SavingsHero result={result} />

        <Separator className="bg-border mb-8" />

        <div className="space-y-6">
          {/* Tier-based next-step CTA */}
          <SmartCTA
            monthlySavings={result.totalMonthlySavings}
            annualSavings={result.totalAnnualSavings}
          />

          {/* Deterministic analysis paragraph */}
          <AISummary result={result} />

          {/* Visual spend comparison */}
          <SpendComparison
            breakdown={result.breakdown}
            totalCurrent={result.totalCurrentMonthlySpend}
            totalOptimized={result.totalOptimizedMonthlySpend}
          />

          {/* Optimization recommendations */}
          {actionRecs.length > 0 && (
            <section aria-label="Optimization recommendations">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Recommendations
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {actionRecs.length} action{actionRecs.length !== 1 ? "s" : ""} identified · tap to expand
                  </p>
                </div>
                {result.totalMonthlySavings > 0 && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full tabular-nums">
                    Save ${Math.round(result.totalMonthlySavings)}/mo
                  </span>
                )}
              </div>
              <div className="space-y-2.5">
                {actionRecs.map((rec) => (
                  <RecommendationCard key={rec.instanceId} rec={rec} />
                ))}
              </div>
            </section>
          )}

          {/* Already optimized tools — collapsed by default, lower visual weight */}
          {keepRecs.length > 0 && (
            <section aria-label="Already optimized tools">
              <h3 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2.5 px-0.5">
                No action needed
              </h3>
              <div className="space-y-2">
                {keepRecs.map((rec) => (
                  <RecommendationCard key={rec.instanceId} rec={rec} />
                ))}
              </div>
            </section>
          )}

          {/* Lead capture — shown after the value is clear */}
          <LeadCapture reportId={report.id} totalSavings={result.totalAnnualSavings} />
        </div>
      </main>
    </div>
  );
}


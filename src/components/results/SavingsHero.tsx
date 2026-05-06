import type { AuditResult } from "@/types/audit";
import { formatDollars, formatPercent } from "@/lib/utils/format";
import { TrendingDown, DollarSign, Calendar, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsHeroProps {
  result: AuditResult;
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass: string;
  bgClass: string;
}

function MetricCard({ icon: Icon, label, value, colorClass, bgClass }: MetricCardProps) {
  return (
    <div className={cn("rounded-xl border p-4 text-center space-y-1.5", bgClass)}>
      <Icon className={cn("w-4 h-4 mx-auto", colorClass)} aria-hidden="true" />
      <p className={cn("text-lg sm:text-xl font-bold tabular-nums leading-none", colorClass)}>
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground leading-none">{label}</p>
    </div>
  );
}

export function SavingsHero({ result }: SavingsHeroProps) {
  const {
    totalAnnualSavings,
    totalMonthlySavings,
    totalCurrentMonthlySpend,
    savingsPercentage,
    toolCount,
  } = result;

  const isAlreadyOptimal = totalMonthlySavings < 5;

  const metrics: MetricCardProps[] = [
    {
      icon: DollarSign,
      label: "Monthly savings",
      value: formatDollars(totalMonthlySavings),
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/8 border-emerald-500/20",
    },
    {
      icon: Calendar,
      label: "Annual savings",
      value: formatDollars(totalAnnualSavings),
      colorClass: "text-primary",
      bgClass: "bg-primary/8 border-primary/20",
    },
    {
      icon: DollarSign,
      label: "Current spend",
      value: `${formatDollars(totalCurrentMonthlySpend)}/mo`,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500/8 border-amber-500/20",
    },
    {
      icon: ArrowDown,
      label: "Reduction",
      value: formatPercent(savingsPercentage),
      colorClass: "text-violet-400",
      bgClass: "bg-violet-500/8 border-violet-500/20",
    },
  ];

  return (
    <section aria-labelledby="results-heading" className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-28 blur-3xl pointer-events-none opacity-50",
          isAlreadyOptimal ? "bg-emerald-500/15" : "bg-primary/15"
        )}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="text-center space-y-4 relative">
        {/* Icon badge */}
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 mb-1">
          {isAlreadyOptimal ? (
            <DollarSign className="w-6 h-6 text-emerald-400" />
          ) : (
            <TrendingDown className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Headline */}
        {isAlreadyOptimal ? (
          <>
            <h1 id="results-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your stack is{" "}
              <span className="text-gradient">well-optimized</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              No significant savings found. Your plan choices match your team size and usage patterns well.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" aria-hidden="true" />
              {formatDollars(totalCurrentMonthlySpend)}/mo across {toolCount} tool{toolCount !== 1 ? "s" : ""}
            </div>
          </>
        ) : (
          <>
            <h1 id="results-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              You could save{" "}
              <span className="text-gradient">{formatDollars(totalAnnualSavings)}/year</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {totalAnnualSavings >= 1000
                ? "Significant optimization opportunities detected. Implementing all recommendations frees up meaningful budget."
                : "These targeted changes reduce your AI spend without affecting team capability."}
            </p>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-8">
              {metrics.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}


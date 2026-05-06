"use client";

import { useAuditForm } from "@/lib/audit-engine/useAuditForm";
import type { ToolId } from "@/types/audit";
import { AuditHeader } from "./AuditHeader";
import { ToolSelector } from "./ToolSelector";
import { ToolCard } from "./ToolCard";
import { TeamInfoForm } from "./TeamInfoForm";
import { SpendSummary } from "./SpendSummary";
import { AuditCTA } from "./AuditCTA";
import { Separator } from "@/components/ui/separator";
import { PackageOpen } from "lucide-react";

export function AuditForm() {
  const {
    state,
    errors,
    hydrated,
    totalMonthlySpend,
    totalSeats,
    addTool,
    removeTool,
    updateTool,
    updateTeamInfo,
    handleSubmit,
    resetForm,
  } = useAuditForm();

  if (!hydrated) {
    // Prevent hydration mismatch from localStorage
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <AuditHeader />

        <Separator className="bg-border mb-8" />

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 pb-20">
          {/* ─── Left column: form ─── */}
          <div className="space-y-8 min-w-0 pb-20 lg:pb-0">
            {/* Step 1: Tool selection */}
            <section aria-labelledby="step-tools-heading">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-6 rounded-full gradient-brand text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
                  1
                </span>
                <h2
                  id="step-tools-heading"
                  className="text-sm font-semibold text-foreground"
                >
                  Select your AI tools
                </h2>
              </div>
              <ToolSelector
                selectedTools={state.tools}
                onAdd={(toolId: ToolId) => addTool(toolId)}
              />
            </section>

            {/* Tool entry cards */}
            {state.tools.length > 0 && (
              <section aria-label="Tool details">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-6 rounded-full gradient-brand text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
                    2
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">
                    Enter your spend details
                  </h2>
                </div>
                <div className="space-y-4">
                  {state.tools.map((entry, index) => (
                    <ToolCard
                      key={entry.instanceId}
                      entry={entry}
                      index={index}
                      errors={errors.tools[entry.instanceId] ?? {}}
                      onUpdate={updateTool}
                      onRemove={removeTool}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state when no tools selected */}
            {state.tools.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center">
                <PackageOpen className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground/60">
                  Select tools above to add spend details
                </p>
              </div>
            )}

            {/* Step 3: Team info */}
            <section aria-labelledby="step-team-heading">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-6 rounded-full gradient-brand text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
                  {state.tools.length > 0 ? "3" : "2"}
                </span>
                <h2
                  id="step-team-heading"
                  className="text-sm font-semibold text-foreground"
                >
                  Tell us about your team
                </h2>
              </div>
              <TeamInfoForm
                teamInfo={state.teamInfo}
                errors={errors.teamInfo}
                onUpdate={updateTeamInfo}
              />
            </section>

            {/* CTA */}
            <AuditCTA
              onSubmit={handleSubmit}
              onReset={resetForm}
              hasTools={state.tools.length > 0}
            />
          </div>

          {/* ─── Right column: sticky summary ─── */}
          <aside aria-label="Spend summary" className="hidden lg:block">
            <SpendSummary
              tools={state.tools}
              totalMonthlySpend={totalMonthlySpend}
              totalSeats={totalSeats}
            />
          </aside>
        </div>

        {/* Mobile summary bar — fixed to bottom, safe-area aware */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Monthly spend</p>
              <p className="text-base font-bold text-foreground tabular-nums">
                ${totalMonthlySpend.toFixed(0)}
              </p>
            </div>
            {totalMonthlySpend > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Est. savings</p>
                <p className="text-base font-bold text-emerald-400 tabular-nums">
                  ~${Math.round(totalMonthlySpend * 0.25)}/mo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


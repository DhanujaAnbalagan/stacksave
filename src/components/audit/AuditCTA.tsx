"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuditCTAProps {
  onSubmit: () => string | false;
  onReset: () => void;
  hasTools: boolean;
}

export function AuditCTA({ onSubmit, onReset, hasTools }: AuditCTAProps) {
  const [loading, setLoading] = useState(false);
  const [validationFailed, setValidationFailed] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    setValidationFailed(false);
    await new Promise((r) => setTimeout(r, 700));
    const id = onSubmit();
    setLoading(false);
    if (id) {
      router.push(`/results/${id}`);
    } else {
      setValidationFailed(true);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4 card-glow relative overflow-hidden">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-20 bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative text-center space-y-2">
        <h3 className="text-base font-semibold text-foreground">
          Ready to see your savings?
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {hasTools
            ? "Generate your personalized AI spend report with optimization recommendations."
            : "Add at least one AI tool above, then generate your report."}
        </p>
        {validationFailed && (
          <p className="text-xs text-destructive font-medium">
            Please fix the errors above before generating your report.
          </p>
        )}
      </div>

      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          id="generate-audit-report"
          type="button"
          disabled={loading || !hasTools}
          onClick={handleClick}
          className="gradient-brand text-white border-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:opacity-90 transition-all gap-2 h-10 px-6 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your stack…
            </>
          ) : (
            <>
              Generate Audit Report
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {hasTools && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        )}
      </div>

      <p className="relative text-[11px] text-muted-foreground/50 text-center">
        Analysis runs locally in your browser · No data leaves your device
      </p>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AuditResult } from "@/types/audit";
import { generateAuditSummary } from "@/app/actions/ai";

interface AISummaryProps {
  result: AuditResult;
}

export function AISummary({ result }: AISummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const text = await generateAuditSummary(result);
        setSummary(text);
      } catch (err) {
        console.error("Failed to load AI summary:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [result]);

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 relative overflow-hidden group">
      {/* Decorative background sparkle */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">AI Audit Summary</h2>
      </div>

      <div className="relative min-h-[80px]">
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm italic">Analyzing your stack for strategic insights...</p>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-wrap">
            {summary}
          </p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-primary/10">
        <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-primary/40" />
          Powered by Anthropic Claude 3.5 Sonnet
        </p>
      </div>
    </Card>
  );
}

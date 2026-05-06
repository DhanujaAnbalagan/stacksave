import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export function AuditHeader() {
  return (
    <div className="relative py-12 sm:py-16">
      {/* Top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-primary/8 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Stack<span className="text-primary">Save</span>
              </span>
            </Link>
            <span className="text-border">/</span>
            <Badge
              variant="outline"
              className="gap-1.5 text-xs border-primary/30 bg-primary/5 text-primary"
            >
              <Sparkles className="w-3 h-3" />
              Free Audit
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Run Your{" "}
              <span className="text-gradient">AI Spend Audit</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Tell us which AI tools your team uses and what you&apos;re paying.
              We&apos;ll analyze your stack for overspending, idle seats, and
              cheaper alternatives — then generate a prioritized savings report.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground/70">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Takes 3 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
              Data stays in your browser
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


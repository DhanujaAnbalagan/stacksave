import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl border border-primary/20 bg-card overflow-hidden p-10 sm:p-14">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 relative">
            Ready to stop overpaying for AI?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 relative max-w-lg mx-auto">
            Run your first AI spend audit in under 5 minutes. No credit card,
            no engineering work, no fluff — just savings.
          </p>
          <Button
            id="cta-bottom-primary"
            size="lg"
            className="gradient-brand text-white border-0 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:opacity-90 transition-all gap-2 h-12 px-8 relative"
          >
            Run Free AI Spend Audit
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60 relative">
            Trusted by 500+ teams · Takes less than 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}


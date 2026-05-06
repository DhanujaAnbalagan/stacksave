import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "OpenAI API",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 gradient-hero overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8">
          <Badge
            variant="outline"
            className="gap-2 px-4 py-1.5 text-xs border-primary/30 bg-primary/5 text-primary"
          >
            <Sparkles className="w-3 h-3" />
            AI Spend Intelligence for Engineering Teams
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Stop bleeding budget on{" "}
          <span className="text-gradient">AI tools you&apos;re&nbsp;not using.</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          StackSave analyzes your team&apos;s AI subscriptions — ChatGPT, Claude, Cursor,
          Copilot and more — then surfaces exactly where you&apos;re overspending and what
          to do about it.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link href="/audit">
            <Button
              id="hero-cta-primary"
              size="lg"
              className="gradient-brand text-white border-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:opacity-90 transition-all gap-2 h-12 px-8 w-full sm:w-auto"
            >
              Run Free AI Spend Audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              id="hero-cta-secondary"
              size="lg"
              variant="outline"
              className="h-12 px-8 border-border hover:bg-accent text-foreground w-full sm:w-auto"
            >
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Tool logos pill row */}
        <div className="flex flex-wrap justify-center gap-2">
          {AI_TOOLS.map((tool) => (
            <span
              key={tool}
              className="text-xs text-muted-foreground bg-muted/60 border border-border px-3 py-1.5 rounded-full"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-xs text-muted-foreground/60">
          Trusted by 500+ engineering teams · No credit card required
        </p>
      </div>
    </section>
  );
}


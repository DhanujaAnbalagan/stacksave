import { LinkIcon, ScanSearch, Rocket } from "lucide-react";

const STEPS = [
  {
    id: 1,
    icon: LinkIcon,
    title: "Connect your AI tools",
    description:
      "Link your billing accounts in under two minutes. We support ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, and 90+ more — no engineering work required.",
  },
  {
    id: 2,
    icon: ScanSearch,
    title: "We audit your spend",
    description:
      "StackSave scans usage patterns, idle seats, overlapping tools, and tier mismatches. You get a prioritized report of every dollar being wasted.",
  },
  {
    id: 3,
    icon: Rocket,
    title: "Act on recommendations",
    description:
      "Accept our one-click suggestions or use the detailed breakdown to negotiate better contracts. Track your realized savings in real-time from your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            From messy bills to clarity{" "}
            <span className="text-gradient">in minutes</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            No lengthy onboarding. No professional services. Just plug in and
            start saving.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  id={`step-${step.id}`}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-brand text-white text-[10px] font-bold flex items-center justify-center shadow-md shadow-primary/30">
                      {step.id}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


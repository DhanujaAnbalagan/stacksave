import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart3, Lightbulb, TrendingDown } from "lucide-react";

const FEATURES = [
  {
    id: "spend-analysis",
    icon: BarChart3,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    title: "AI Spend Analysis",
    description:
      "Connect your billing accounts once. StackSave automatically pulls in usage data across ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and OpenAI API — giving you a single unified view of every dollar spent.",
    stats: "100+ integrations",
  },
  {
    id: "smart-recommendations",
    icon: Lightbulb,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    title: "Smart Recommendations",
    description:
      "Our AI compares your actual usage patterns against subscription tiers and competing tools. You get actionable, ranked suggestions — not generic advice — so you know exactly which switch saves the most.",
    stats: "Avg. 34% cost reduction",
  },
  {
    id: "savings-insights",
    icon: TrendingDown,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    title: "Annual Savings Insights",
    description:
      "See projected 12-month savings before making any changes. Track realized savings month-over-month and share a beautiful report with your CFO or engineering leadership — zero spreadsheet work.",
    stats: "$12K avg. annual savings",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything your team needs to{" "}
            <span className="text-gradient">spend smarter</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Purpose-built for engineering teams that run on AI tools and need
            visibility into where their budget is going.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                id={`feature-card-${feature.id}`}
                className="card-glow bg-card border-border relative overflow-hidden"
              >
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <CardHeader className="pb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs font-medium text-primary">
                      {feature.stats}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}


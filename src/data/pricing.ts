import type { ToolId } from "@/types/audit";

// ─── Plan tier pricing ─────────────────────────────────────────
// monthlyPrice = null means variable / enterprise custom pricing
// isPerSeat = price multiplies by seat count

export interface PlanPricing {
  planId: string;
  planName: string;
  monthlyPrice: number | null;
  isPerSeat: boolean;
  tier: "free" | "individual" | "team" | "enterprise" | "api";
}

export interface ToolPricingConfig {
  toolId: ToolId;
  name: string;
  emoji: string;
  /** Used to detect overlapping tools — same group = competing */
  competingGroup: "chat" | "coding" | "api" | "search";
  plans: PlanPricing[];
}

export const TOOL_PRICING: Record<ToolId, ToolPricingConfig> = {
  chatgpt: {
    toolId: "chatgpt",
    name: "ChatGPT",
    emoji: "🤖",
    competingGroup: "chat",
    plans: [
      { planId: "free",       planName: "Free",       monthlyPrice: 0,   isPerSeat: false, tier: "free"       },
      { planId: "plus",       planName: "Plus",        monthlyPrice: 20,  isPerSeat: false, tier: "individual" },
      { planId: "team",       planName: "Team",        monthlyPrice: 25,  isPerSeat: true,  tier: "team"       },
      { planId: "enterprise", planName: "Enterprise",  monthlyPrice: null, isPerSeat: true, tier: "enterprise" },
    ],
  },
  claude: {
    toolId: "claude",
    name: "Claude",
    emoji: "🧠",
    competingGroup: "chat",
    plans: [
      { planId: "free",       planName: "Free",       monthlyPrice: 0,   isPerSeat: false, tier: "free"       },
      { planId: "pro",        planName: "Pro",         monthlyPrice: 20,  isPerSeat: false, tier: "individual" },
      { planId: "team",       planName: "Team",        monthlyPrice: 25,  isPerSeat: true,  tier: "team"       },
      { planId: "enterprise", planName: "Enterprise",  monthlyPrice: null, isPerSeat: true, tier: "enterprise" },
    ],
  },
  cursor: {
    toolId: "cursor",
    name: "Cursor",
    emoji: "⚡",
    competingGroup: "coding",
    plans: [
      { planId: "hobby",    planName: "Hobby",    monthlyPrice: 0,  isPerSeat: false, tier: "free"       },
      { planId: "pro",      planName: "Pro",      monthlyPrice: 20, isPerSeat: true,  tier: "individual" },
      { planId: "business", planName: "Business", monthlyPrice: 40, isPerSeat: true,  tier: "team"       },
    ],
  },
  "github-copilot": {
    toolId: "github-copilot",
    name: "GitHub Copilot",
    emoji: "🐙",
    competingGroup: "coding",
    plans: [
      { planId: "individual", planName: "Individual", monthlyPrice: 10, isPerSeat: true, tier: "individual" },
      { planId: "business",   planName: "Business",   monthlyPrice: 19, isPerSeat: true, tier: "team"       },
      { planId: "enterprise", planName: "Enterprise", monthlyPrice: 39, isPerSeat: true, tier: "enterprise" },
    ],
  },
  gemini: {
    toolId: "gemini",
    name: "Gemini",
    emoji: "✨",
    competingGroup: "chat",
    plans: [
      { planId: "free",       planName: "Free",      monthlyPrice: 0,   isPerSeat: false, tier: "free"       },
      { planId: "advanced",   planName: "Advanced",  monthlyPrice: 20,  isPerSeat: false, tier: "individual" },
      { planId: "business",   planName: "Business",  monthlyPrice: 24,  isPerSeat: true,  tier: "team"       },
      { planId: "enterprise", planName: "Enterprise", monthlyPrice: null, isPerSeat: true, tier: "enterprise" },
    ],
  },
  "openai-api": {
    toolId: "openai-api",
    name: "OpenAI API",
    emoji: "🔌",
    competingGroup: "api",
    plans: [
      { planId: "payg",       planName: "Pay-as-you-go",      monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "tier1",      planName: "Tier 1 ($0–$100)",   monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "tier2",      planName: "Tier 2 ($100–$500)", monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "enterprise", planName: "Enterprise",         monthlyPrice: null, isPerSeat: false, tier: "enterprise" },
    ],
  },
  "anthropic-api": {
    toolId: "anthropic-api",
    name: "Anthropic API",
    emoji: "🔬",
    competingGroup: "api",
    plans: [
      { planId: "payg",       planName: "Pay-as-you-go", monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "build",      planName: "Build Tier",    monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "scale",      planName: "Scale Tier",    monthlyPrice: null, isPerSeat: false, tier: "api" },
      { planId: "enterprise", planName: "Enterprise",    monthlyPrice: null, isPerSeat: false, tier: "enterprise" },
    ],
  },
  windsurf: {
    toolId: "windsurf",
    name: "Windsurf",
    emoji: "🌊",
    competingGroup: "coding",
    plans: [
      { planId: "free",  planName: "Free",  monthlyPrice: 0,  isPerSeat: false, tier: "free"       },
      { planId: "pro",   planName: "Pro",   monthlyPrice: 15, isPerSeat: false, tier: "individual" },
      { planId: "teams", planName: "Teams", monthlyPrice: 35, isPerSeat: true,  tier: "team"       },
    ],
  },
  "perplexity": {
    toolId: "perplexity",
    name: "Perplexity",
    emoji: "🌐",
    competingGroup: "search",
    plans: [
      { planId: "pro",        planName: "Pro",        monthlyPrice: 20,   isPerSeat: true,  tier: "individual" },
      { planId: "enterprise", planName: "Enterprise", monthlyPrice: null, isPerSeat: true,  tier: "enterprise" },
    ],
  },
  "you-com": {
    toolId: "you-com",
    name: "You.com",
    emoji: "🔍",
    competingGroup: "search",
    plans: [
      { planId: "pro", planName: "Pro", monthlyPrice: 20, isPerSeat: true, tier: "individual" },
    ],
  },
};

/** Resolve the list price for a tool/plan/seat combination */
export function getListPrice(toolId: ToolId, planId: string, seats: number): number | null {
  const config = TOOL_PRICING[toolId];
  const plan = config?.plans.find((p) => p.planId === planId);
  if (!plan || plan.monthlyPrice === null) return null;
  return plan.isPerSeat ? plan.monthlyPrice * seats : plan.monthlyPrice;
}

/** Get the cheapest non-free plan for a tool */
export function getCheapestPaidPlan(toolId: ToolId): PlanPricing | null {
  const config = TOOL_PRICING[toolId];
  return (
    config?.plans.find((p) => p.monthlyPrice !== null && p.monthlyPrice > 0) ?? null
  );
}


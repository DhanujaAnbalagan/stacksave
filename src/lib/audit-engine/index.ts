/**
 * StackSave Audit Engine
 *
 * Deterministic, financially-grounded recommendation logic.
 * No randomness — every saving is calculated from real plan pricing.
 */

import type {
  AuditFormState,
  AuditResult,
  Recommendation,
  SpendBreakdown,
  ToolEntry,
  ToolId,
} from "@/types/audit";
import { TOOL_PRICING, getListPrice } from "@/data/pricing";
import { parseSeatsInput, parseSpendInput, teamSizeToNumber } from "@/lib/utils/format";

// ─── Helpers (mapped to shared utils) ─────────────────────────
const parseSeats = parseSeatsInput;
const parseSpend = parseSpendInput;
const teamSizeNumber = teamSizeToNumber;

// ─── Per-tool plan downgrade rules ────────────────────────────

type DowngradeRule = {
  fromPlanId: string;
  toPlanId: string;
  toPlanName: string;
  /** Returns monthly savings (positive = save money), or null if not applicable */
  compute: (seats: number, teamSize: number) => { savings: number; reasoning: string } | null;
};

const DOWNGRADE_RULES: Partial<Record<ToolId, DowngradeRule[]>> = {
  chatgpt: [
    {
      fromPlanId: "team",
      toPlanId: "plus",
      toPlanName: "ChatGPT Plus",
      compute: (seats) => {
        if (seats > 3) return null; // Team makes sense for 4+ users
        const teamCost = 25 * seats;
        const plusCost = 20 * seats; // each person gets their own Plus
        const savings = teamCost - plusCost;
        if (savings <= 0) return null;
        return {
          savings,
          reasoning: `Collaborative workspace features (SSO, shared history, and admin controls) generally do not justify the $25/seat premium for very small teams. With only ${seats} user${seats > 1 ? "s" : ""}, individual ChatGPT Plus accounts ($20/user) deliver identical AI capabilities for $${plusCost}/mo — saving your team $${savings}/mo.`,
        };
      },
    },
    {
      fromPlanId: "enterprise",
      toPlanId: "team",
      toPlanName: "ChatGPT Team",
      compute: (seats, teamSize) => {
        if (teamSize > 30) return null;
        // Enterprise is ~$60/seat (public estimate) vs Team $25/seat
        const savings = 35 * seats;
        return {
          savings,
          reasoning: `Enterprise pricing (est. ~$60/seat) is designed for 50+ seat organizations with compliance and audit requirements. With ${seats} seat${seats > 1 ? "s" : ""} and a team of ${teamSize || "unknown"}, the ChatGPT Team plan at $25/seat delivers equivalent capabilities at a fraction of the cost.`,
        };
      },
    },
  ],
  claude: [
    {
      fromPlanId: "team",
      toPlanId: "pro",
      toPlanName: "Claude Pro",
      compute: (seats) => {
        if (seats > 3) return null;
        const teamCost = 25 * seats;
        const proCost = 20 * seats;
        const savings = teamCost - proCost;
        if (savings <= 0) return null;
        return {
          savings,
          reasoning: `Claude Team ($25/seat) adds shared workspace features that are rarely fully utilized by teams of this size. Switching ${seats} user${seats > 1 ? "s" : ""} to individual Claude Pro accounts ($20/user) saves $${savings}/mo while maintaining the same model access and priority usage limits.`,
        };
      },
    },
    {
      fromPlanId: "enterprise",
      toPlanId: "team",
      toPlanName: "Claude Team",
      compute: (seats, teamSize) => {
        if (teamSize > 30) return null;
        const savings = 35 * seats;
        return {
          savings,
          reasoning: `Claude Enterprise pricing (est. ~$60/seat) is built for large-scale deployments with SAML SSO, audit logs, and dedicated support SLAs. For a team of ${teamSize || seats}, the Claude Team plan at $25/seat provides equivalent daily capabilities.`,
        };
      },
    },
  ],
  cursor: [
    {
      fromPlanId: "business",
      toPlanId: "pro",
      toPlanName: "Cursor Pro",
      compute: (seats) => {
        if (seats > 10) return null;
        const savings = 20 * seats; // Business $40 vs Pro $20
        return {
          savings,
          reasoning: `Cursor Business ($40/seat) adds centralized billing and admin controls, which matter at scale. With ${seats} seat${seats > 1 ? "s" : ""}, Cursor Pro ($20/seat) provides identical AI code completion and Chat capabilities — saving $${savings}/mo.`,
        };
      },
    },
  ],
  "github-copilot": [
    {
      fromPlanId: "business",
      toPlanId: "individual",
      toPlanName: "GitHub Copilot Individual",
      compute: (seats) => {
        if (seats > 3) return null; // Business org controls justify cost at 4+
        const savings = 9 * seats; // Business $19 vs Individual $10
        return {
          savings,
          reasoning: `GitHub Copilot Business ($19/seat) adds org-wide policy enforcement and audit logs — features that matter when managing 4+ developers. With ${seats} seat${seats > 1 ? "s" : ""}, Individual plans ($10/seat) deliver the same AI completions and chat for $${savings}/mo less.`,
        };
      },
    },
    {
      fromPlanId: "enterprise",
      toPlanId: "business",
      toPlanName: "GitHub Copilot Business",
      compute: (seats) => {
        const savings = 20 * seats; // Enterprise $39 vs Business $19
        return {
          savings,
          reasoning: `GitHub Copilot Enterprise ($39/seat) adds Copilot Workspace and custom fine-tuning — features typically used by 50+ seat engineering orgs. Copilot Business ($19/seat) covers PR summaries, code completions, and org controls for most teams, saving $${savings}/mo.`,
        };
      },
    },
  ],
  gemini: [
    {
      fromPlanId: "business",
      toPlanId: "advanced",
      toPlanName: "Gemini Advanced",
      compute: (seats) => {
        if (seats > 2) return null;
        const teamCost = 24 * seats;
        const advancedCost = 20; // Individual, not per-seat
        const savings = teamCost - advancedCost;
        if (savings <= 0) return null;
        return {
          savings,
          reasoning: `Gemini Business is $24/seat/mo. With ${seats} seat${seats > 1 ? "s" : ""}, a single Gemini Advanced account ($20/mo) is sufficient if this is primarily personal use, saving $${savings}/mo.`,
        };
      },
    },
    {
      fromPlanId: "enterprise",
      toPlanId: "business",
      toPlanName: "Gemini Business",
      compute: (seats, teamSize) => {
        if (teamSize > 20) return null;
        const savings = 26 * seats; // Enterprise est. ~$50 vs Business $24
        return {
          savings,
          reasoning: `Gemini Enterprise pricing is designed for organizations needing DLP controls and dedicated support. For teams under 20, Gemini Business ($24/seat) covers all standard collaboration and AI features, saving approximately $${savings}/mo.`,
        };
      },
    },
  ],
  windsurf: [
    {
      fromPlanId: "teams",
      toPlanId: "pro",
      toPlanName: "Windsurf Pro",
      compute: (seats) => {
        if (seats > 4) return null;
        const teamsCost = 35 * seats;
        const proCost = 15 * seats; // Per person on Pro
        const savings = teamsCost - proCost;
        if (savings <= 0) return null;
        return {
          savings,
          reasoning: `Windsurf Teams ($35/seat) adds centralized admin and billing controls. With ${seats} seat${seats > 1 ? "s" : ""}, individual Windsurf Pro accounts ($15/seat) provide the same AI-powered coding features, saving $${savings}/mo.`,
        };
      },
    },
  ],
};

// ─── API usage optimization rules ─────────────────────────────

function analyzeApiEntry(entry: ToolEntry): Pick<Recommendation, "type" | "title" | "action" | "reasoning" | "estimatedMonthlySavings" | "confidence"> | null {
  const spend = parseSpend(entry.monthlySpend);
  if (spend < 50) return null; // Low spend, no optimization needed

  if (spend > 500) {
    const savings = Math.round(spend * 0.22);
    return {
      type: "optimize",
      title: "High API spend — usage review recommended",
      action: `Implement caching + batching to reduce spend by ~22%`,
      reasoning: `Your ${TOOL_PRICING[entry.toolId]?.name} spend of $${spend}/mo is significant. Implementing semantic caching (reusing responses for similar queries), request batching, and prompt compression typically reduces API costs by 20–25% without changing output quality. At this spend level the investment in optimization tooling pays back within the first month.`,
      estimatedMonthlySavings: savings,
      confidence: "medium",
    };
  }

  if (spend > 150) {
    const savings = Math.round(spend * 0.15);
    return {
      type: "optimize",
      title: "Moderate API spend — caching opportunity",
      action: `Add response caching to cut spend by ~15%`,
      reasoning: `At $${spend}/mo on ${TOOL_PRICING[entry.toolId]?.name}, basic response caching for repeated queries can reduce token consumption by 15–20%. Tools like GPTCache or a simple Redis-based semantic cache are straightforward to integrate and typically pay for themselves within weeks.`,
      estimatedMonthlySavings: savings,
      confidence: "medium",
    };
  }

  return null;
}

// ─── Overlap detection ─────────────────────────────────────────

interface OverlapGroup {
  group: "chat" | "coding" | "api" | "search";
  entries: ToolEntry[];
}

function detectOverlaps(entries: ToolEntry[]): OverlapGroup[] {
  const groups: Record<string, ToolEntry[]> = { chat: [], coding: [], api: [], search: [] };
  for (const entry of entries) {
    const config = TOOL_PRICING[entry.toolId];
    if (config) groups[config.competingGroup].push(entry);
  }
  return Object.entries(groups)
    .filter(([, e]) => e.length > 1)
    .map(([group, entries]) => ({ group: group as "chat" | "coding" | "api" | "search", entries }));
}

function buildOverlapRecommendations(overlaps: OverlapGroup[]): Map<string, Recommendation> {
  const map = new Map<string, Recommendation>();

  for (const overlap of overlaps) {
    // Sort by spend descending — keep highest spend tool, eliminate the other
    const sorted = [...overlap.entries].sort(
      (a, b) => parseSpend(b.monthlySpend) - parseSpend(a.monthlySpend)
    );
    // The first entry is kept; the rest are flagged for elimination
    const [keeper, ...redundant] = sorted;

    for (const entry of redundant) {
      const tool = TOOL_PRICING[entry.toolId];
      const keeperTool = TOOL_PRICING[keeper.toolId];
      const spend = parseSpend(entry.monthlySpend);
      const savings = spend;

      const groupLabel =
        overlap.group === "chat" ? "general-purpose AI assistant" :
        overlap.group === "coding" ? "AI coding assistant" :
        "AI API provider";

      map.set(entry.instanceId, {
        instanceId: entry.instanceId,
        toolId: entry.toolId,
        toolName: tool?.name ?? entry.toolId,
        toolEmoji: tool?.emoji ?? "🛠️",
        currentPlan: entry.plan,
        currentMonthlySpend: spend,
        type: "consolidate",
        title: `Consolidate with ${keeperTool?.name}`,
        action: `Replace ${tool?.name} with ${keeperTool?.name} for all ${groupLabel} tasks`,
        reasoning: `Your team uses both ${tool?.name} and ${keeperTool?.name}, which are directly competing ${groupLabel}s with overlapping capabilities. ${keeperTool?.name} is your higher-spend tool ($${parseSpend(keeper.monthlySpend)}/mo) and likely the team's primary choice — consolidating eliminates $${savings}/mo in duplicate ${tool?.name} costs.`,
        estimatedMonthlySavings: savings,
        estimatedAnnualSavings: savings * 12,
        confidence: spend > 0 ? "high" : "low",
        relatedInstanceId: keeper.instanceId,
        relatedToolName: keeperTool?.name,
      });
    }
  }

  return map;
}

// ─── Main engine ───────────────────────────────────────────────

export function runAuditEngine(state: AuditFormState): AuditResult | null {
  if (!state.tools || state.tools.length === 0) return null;

  const { tools, teamInfo } = state;
  const teamSize = teamSizeNumber(teamInfo.teamSize);

  // Build overlap recommendations first (keyed by instanceId)
  const overlaps = detectOverlaps(tools);
  const overlapRecs = buildOverlapRecommendations(overlaps);

  const recommendations: Recommendation[] = [];
  const breakdown: SpendBreakdown[] = [];

  for (const entry of tools) {
    // const tool = AI_TOOL_MAP[entry.toolId]; // Unused but kept for reference if needed
    const pricingConfig = TOOL_PRICING[entry.toolId];
    const seats = parseSeats(entry.seats);
    const spend = parseSpend(entry.monthlySpend);

    // 1. Check overlap recommendation first
    if (overlapRecs.has(entry.instanceId)) {
      const rec = overlapRecs.get(entry.instanceId)!;
      recommendations.push(rec);
      breakdown.push({
        instanceId: entry.instanceId,
        toolId: entry.toolId,
        toolName: pricingConfig?.name ?? entry.toolId,
        toolEmoji: pricingConfig?.emoji ?? "🛠️",
        currentMonthlySpend: spend,
        monthlySavings: rec.estimatedMonthlySavings,
        optimizedMonthlySpend: Math.max(0, spend - rec.estimatedMonthlySavings),
      });
      continue;
    }

    // 2. API tools: check usage optimization
    if (pricingConfig?.competingGroup === "api") {
      const apiRec = analyzeApiEntry(entry);
      if (apiRec) {
        recommendations.push({
          instanceId: entry.instanceId,
          toolId: entry.toolId,
          toolName: pricingConfig.name,
          toolEmoji: pricingConfig.emoji,
          currentPlan: entry.plan,
          currentMonthlySpend: spend,
          estimatedAnnualSavings: apiRec.estimatedMonthlySavings * 12,
          ...apiRec,
        });
        breakdown.push({
          instanceId: entry.instanceId,
          toolId: entry.toolId,
          toolName: pricingConfig.name,
          toolEmoji: pricingConfig.emoji,
          currentMonthlySpend: spend,
          monthlySavings: apiRec.estimatedMonthlySavings,
          optimizedMonthlySpend: Math.max(0, spend - apiRec.estimatedMonthlySavings),
        });
        continue;
      }
    }

    // 3. Subscription tools: apply downgrade rules
    const rules = DOWNGRADE_RULES[entry.toolId] ?? [];
    const matchingRule = rules.find((r) => r.fromPlanId === entry.plan);
    const currentPlanObj = pricingConfig?.plans.find((p) => p.planId === entry.plan);

    if (matchingRule) {
      const result = matchingRule.compute(seats, teamSize);
      if (result && result.savings > 0) {
        const listCurrentCost = getListPrice(entry.toolId, entry.plan, seats);
        // Use the higher of entered spend or calculated list price to be conservative
        const effectiveSpend = listCurrentCost != null ? Math.max(spend, listCurrentCost) : spend;
        recommendations.push({
          instanceId: entry.instanceId,
          toolId: entry.toolId,
          toolName: pricingConfig?.name ?? entry.toolId,
          toolEmoji: pricingConfig?.emoji ?? "🛠️",
          currentPlan: currentPlanObj?.planName ?? entry.plan,
          currentMonthlySpend: effectiveSpend,
          type: "downgrade",
          title: `Switch to ${matchingRule.toPlanName}`,
          action: `Downgrade from ${currentPlanObj?.planName ?? entry.plan} to ${matchingRule.toPlanName}`,
          reasoning: result.reasoning,
          estimatedMonthlySavings: result.savings,
          estimatedAnnualSavings: result.savings * 12,
          confidence: "high",
          suggestedPlan: matchingRule.toPlanId,
        });
        breakdown.push({
          instanceId: entry.instanceId,
          toolId: entry.toolId,
          toolName: pricingConfig?.name ?? entry.toolId,
          toolEmoji: pricingConfig?.emoji ?? "🛠️",
          currentMonthlySpend: effectiveSpend,
          monthlySavings: result.savings,
          optimizedMonthlySpend: Math.max(0, effectiveSpend - result.savings),
        });
        continue;
      }
    }

    // 4. No savings found — already optimal
    recommendations.push({
      instanceId: entry.instanceId,
      toolId: entry.toolId,
      toolName: pricingConfig?.name ?? entry.toolId,
      toolEmoji: pricingConfig?.emoji ?? "🛠️",
      currentPlan: currentPlanObj?.planName ?? entry.plan,
      currentMonthlySpend: spend,
      type: "keep",
      title: "Already on the right plan",
      action: "No action needed",
      reasoning: `${pricingConfig?.name ?? entry.toolId} is correctly sized for your usage. The current ${currentPlanObj?.planName ?? entry.plan} plan is cost-effective for ${seats} seat${seats > 1 ? "s" : ""} — no downgrade opportunity exists without reducing capability.`,
      estimatedMonthlySavings: 0,
      estimatedAnnualSavings: 0,
      confidence: "high",
    });
    breakdown.push({
      instanceId: entry.instanceId,
      toolId: entry.toolId,
      toolName: pricingConfig?.name ?? entry.toolId,
      toolEmoji: pricingConfig?.emoji ?? "🛠️",
      currentMonthlySpend: spend,
      monthlySavings: 0,
      optimizedMonthlySpend: spend,
    });
  }

  // ─── Aggregate totals ──────────────────────────────────────
  const totalCurrentMonthlySpend = breakdown.reduce((s, b) => s + b.currentMonthlySpend, 0);
  const totalMonthlySavings = breakdown.reduce((s, b) => s + b.monthlySavings, 0);
  const totalOptimizedMonthlySpend = Math.max(0, totalCurrentMonthlySpend - totalMonthlySavings);

  return {
    totalCurrentMonthlySpend,
    totalCurrentAnnualSpend: totalCurrentMonthlySpend * 12,
    totalOptimizedMonthlySpend,
    totalOptimizedAnnualSpend: totalOptimizedMonthlySpend * 12,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsPercentage:
      totalCurrentMonthlySpend > 0
        ? Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)
        : 0,
    recommendations,
    breakdown,
    teamInfo,
    toolCount: tools.length,
    generatedAt: new Date().toISOString(),
  };
}


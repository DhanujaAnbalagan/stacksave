/**
 * Audit Engine Tests — StackSave
 *
 * Tests validate the core business logic of the recommendation engine.
 * All savings figures are derived from real plan pricing in pricing.ts.
 */

import { describe, it, expect } from "vitest";
import { runAuditEngine } from "@/lib/audit-engine";
import type { AuditFormState, ToolEntry } from "@/types/audit";

// ─── Test data factory ──────────────────────────────────────────

function makeEntry(
  toolId: ToolEntry["toolId"],
  plan: string,
  monthlySpend: string,
  seats = "1"
): ToolEntry {
  return {
    instanceId: `${toolId}-${Math.random().toString(36).slice(2, 7)}`,
    toolId,
    plan,
    monthlySpend,
    seats,
  };
}

function makeState(
  tools: ToolEntry[],
  teamSize = "6-15",
  useCase: AuditFormState["teamInfo"]["useCase"] = "coding"
): AuditFormState {
  return { tools, teamInfo: { teamSize, useCase } };
}

// ─── 1. Empty / edge-case inputs ───────────────────────────────

describe("runAuditEngine — edge cases", () => {
  it("returns null when no tools are provided", () => {
    const state = makeState([]);
    expect(runAuditEngine(state)).toBeNull();
  });

  it("handles zero monthly spend without throwing", () => {
    const state = makeState([makeEntry("chatgpt", "plus", "0")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.totalCurrentMonthlySpend).toBe(0);
    expect(result!.totalMonthlySavings).toBe(0);
  });

  it("clamps negative spend to 0", () => {
    const state = makeState([makeEntry("cursor", "pro", "-50", "3")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.totalCurrentMonthlySpend).toBeGreaterThanOrEqual(0);
  });

  it("treats non-numeric seats as 1", () => {
    const entry = makeEntry("github-copilot", "individual", "10");
    entry.seats = "abc"; // invalid
    const result = runAuditEngine(makeState([entry]));
    expect(result).not.toBeNull();
    // Should not throw; recommendation should be "keep" (Individual plan with 1 seat is optimal)
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("returns a generatedAt ISO timestamp", () => {
    const state = makeState([makeEntry("cursor", "pro", "20")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(() => new Date(result!.generatedAt)).not.toThrow();
    expect(new Date(result!.generatedAt).getFullYear()).toBeGreaterThan(2020);
  });
});

// ─── 2. Downgrade recommendations ──────────────────────────────

describe("runAuditEngine — plan downgrade rules", () => {
  it("flags ChatGPT Team for 1 user → recommends Plus ($5 saving)", () => {
    const state = makeState([makeEntry("chatgpt", "team", "25", "1")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.toolId).toBe("chatgpt");
    expect(rec.estimatedMonthlySavings).toBe(5); // $25 Team - $20 Plus
    expect(rec.estimatedAnnualSavings).toBe(60);  // $5 × 12
    expect(rec.suggestedPlan).toBe("plus");
  });

  it("flags ChatGPT Team for 3 users → recommends Plus ($15/mo saving)", () => {
    const state = makeState([makeEntry("chatgpt", "team", "75", "3")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe(15); // ($25-$20) × 3
    expect(rec.estimatedAnnualSavings).toBe(180);
  });

  it("does NOT downgrade ChatGPT Team when seats ≥ 4", () => {
    const state = makeState([makeEntry("chatgpt", "team", "100", "4")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    // At 4 seats, Team plan is appropriate — no downgrade
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("flags Cursor Business for 5 seats → recommends Pro ($100/mo saving)", () => {
    const state = makeState([makeEntry("cursor", "business", "200", "5")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe(100); // ($40-$20) × 5
    expect(rec.estimatedAnnualSavings).toBe(1200);
    expect(rec.suggestedPlan).toBe("pro");
  });

  it("does NOT downgrade Cursor Business when seats > 10", () => {
    const state = makeState([makeEntry("cursor", "business", "480", "12")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    // Admin controls justify Business at 12 seats
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("flags GitHub Copilot Business for 2 seats → recommends Individual ($18/mo saving)", () => {
    const state = makeState([makeEntry("github-copilot", "business", "38", "2")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe(18); // ($19-$10) × 2
    expect(rec.suggestedPlan).toBe("individual");
  });

  it("flags GitHub Copilot Enterprise → recommends Business (saves $20/seat)", () => {
    const state = makeState([makeEntry("github-copilot", "enterprise", "195", "5")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe(100); // ($39-$19) × 5
    expect(rec.suggestedPlan).toBe("business");
  });

  it("flags Windsurf Teams for 3 users → recommends Pro ($60/mo saving)", () => {
    const state = makeState([makeEntry("windsurf", "teams", "105", "3")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe(60); // ($35-$15) × 3
  });

  it("does NOT downgrade Windsurf Teams when seats > 4", () => {
    const state = makeState([makeEntry("windsurf", "teams", "175", "5")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.recommendations[0].type).toBe("keep");
  });
});

// ─── 3. Enterprise overkill for small teams ────────────────────

describe("runAuditEngine — enterprise overkill detection", () => {
  it("flags ChatGPT Enterprise for a small team (≤30) → recommends Team plan", () => {
    const state = makeState(
      [makeEntry("chatgpt", "enterprise", "300", "5")],
      "2-5"
    );
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.suggestedPlan).toBe("team");
    // Enterprise ~$60/seat vs Team $25/seat = $35/seat savings × 5 seats = $175
    expect(rec.estimatedMonthlySavings).toBe(175);
  });

  it("does NOT downgrade ChatGPT Enterprise for a large team (>30)", () => {
    const state = makeState(
      [makeEntry("chatgpt", "enterprise", "1800", "30")],
      "51-200"
    );
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    // teamSizeNumber("51-200") = 200 > 30 threshold
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("flags Claude Enterprise for small team → recommends Team plan", () => {
    const state = makeState(
      [makeEntry("claude", "enterprise", "120", "2")],
      "2-5"
    );
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("downgrade");
    expect(rec.suggestedPlan).toBe("team");
    expect(rec.estimatedMonthlySavings).toBe(70); // $35 × 2 seats
  });
});

// ─── 4. Already-optimized stack ────────────────────────────────

describe("runAuditEngine — already optimized stacks", () => {
  it("produces 'keep' for GitHub Copilot Individual with 1 seat", () => {
    const state = makeState([makeEntry("github-copilot", "individual", "10")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.recommendations[0].type).toBe("keep");
    expect(result!.totalMonthlySavings).toBe(0);
  });

  it("produces 'keep' for Cursor Pro at any seat count within rule limits", () => {
    const state = makeState([makeEntry("cursor", "pro", "60", "3")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("produces 'keep' for ChatGPT free plan", () => {
    const state = makeState([makeEntry("chatgpt", "free", "0")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.recommendations[0].type).toBe("keep");
    expect(result!.savingsPercentage).toBe(0);
  });

  it("returns savingsPercentage=0 when no savings exist", () => {
    // Use tools from different groups on optimal plans — no overlap, no downgrade
    const state = makeState([
      makeEntry("github-copilot", "individual", "10"),
      makeEntry("chatgpt", "plus", "20"), // chat group — different from coding
    ]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    expect(result!.totalMonthlySavings).toBe(0);
    expect(result!.savingsPercentage).toBe(0);
  });
});

// ─── 5. Overlap consolidation ──────────────────────────────────

describe("runAuditEngine — overlap / consolidation detection", () => {
  it("flags Cursor + GitHub Copilot as overlapping coding tools", () => {
    const cursor = makeEntry("cursor", "pro", "80", "4");
    const copilot = makeEntry("github-copilot", "business", "20", "4"); // lower spend

    const state = makeState([cursor, copilot]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const consolidateRec = result!.recommendations.find((r) => r.type === "consolidate");
    expect(consolidateRec).toBeDefined();
    // Lower-spend tool (copilot) should be flagged for consolidation
    expect(consolidateRec!.toolId).toBe("github-copilot");
    // Savings = copilot's monthly spend
    expect(consolidateRec!.estimatedMonthlySavings).toBe(20);
  });

  it("flags ChatGPT + Claude as overlapping chat tools", () => {
    const chatgpt = makeEntry("chatgpt", "plus", "20");
    const claude = makeEntry("claude", "pro", "40"); // higher spend → kept

    const state = makeState([chatgpt, claude]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const consolidateRec = result!.recommendations.find((r) => r.type === "consolidate");
    expect(consolidateRec).toBeDefined();
    expect(consolidateRec!.toolId).toBe("chatgpt"); // lower spend is eliminated
    expect(consolidateRec!.estimatedMonthlySavings).toBe(20);
    expect(consolidateRec!.estimatedAnnualSavings).toBe(240);
  });

  it("consolidates three coding tools — eliminates two lowest-spend ones", () => {
    const cursor = makeEntry("cursor", "pro", "100", "5");     // highest → kept
    const copilot = makeEntry("github-copilot", "business", "40", "2"); // mid
    const windsurf = makeEntry("windsurf", "pro", "15");       // lowest

    const state = makeState([cursor, copilot, windsurf]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const consolidateRecs = result!.recommendations.filter((r) => r.type === "consolidate");
    expect(consolidateRecs.length).toBe(2); // copilot + windsurf flagged

    const totalConsolidateSavings = consolidateRecs.reduce(
      (sum, r) => sum + r.estimatedMonthlySavings,
      0
    );
    expect(totalConsolidateSavings).toBe(55); // $40 + $15
  });
});

// ─── 6. API optimization recommendations ───────────────────────

describe("runAuditEngine — API usage optimization", () => {
  it("does NOT flag OpenAI API with low spend (< $50)", () => {
    const state = makeState([makeEntry("openai-api", "payg", "30")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();
    // Low spend — no optimization warranted
    expect(result!.recommendations[0].type).toBe("keep");
  });

  it("flags OpenAI API with moderate spend ($150-$500) → ~15% savings", () => {
    const state = makeState([makeEntry("openai-api", "tier2", "200")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("optimize");
    expect(rec.estimatedMonthlySavings).toBe(30); // round(200 × 0.15)
  });

  it("flags OpenAI API with high spend (> $500) → ~22% savings", () => {
    const state = makeState([makeEntry("openai-api", "tier2", "1000")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    const rec = result!.recommendations[0];
    expect(rec.type).toBe("optimize");
    expect(rec.estimatedMonthlySavings).toBe(220); // round(1000 × 0.22)
  });
});

// ─── 7. Totals and annual math ──────────────────────────────────

describe("runAuditEngine — aggregate calculations", () => {
  it("sums monthly and annual spend correctly across multiple tools", () => {
    const state = makeState([
      makeEntry("chatgpt", "team", "75", "3"),   // spend: $75 (list: $75), saves $15
      makeEntry("cursor", "business", "200", "5"), // spend: $200 (list: $200), saves $100
    ]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    expect(result!.totalCurrentMonthlySpend).toBe(275);
    expect(result!.totalCurrentAnnualSpend).toBe(3300);
    expect(result!.totalMonthlySavings).toBe(115);
    expect(result!.totalAnnualSavings).toBe(1380);
  });

  it("calculates savingsPercentage correctly", () => {
    // $100 spend, $25 savings = 25%
    const state = makeState([makeEntry("cursor", "business", "100", "5")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    // List cost = $40 × 5 = $200; savings = $20 × 5 = $100
    // Effective spend = max(entered $100, list $200) = $200
    // Savings% = round(100/200 × 100) = 50%
    expect(result!.savingsPercentage).toBe(50);
  });

  it("totalOptimizedMonthlySpend = current - savings", () => {
    const state = makeState([makeEntry("chatgpt", "team", "25", "1")]);
    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    expect(result!.totalOptimizedMonthlySpend).toBe(
      result!.totalCurrentMonthlySpend - result!.totalMonthlySavings
    );
    expect(result!.totalOptimizedAnnualSpend).toBe(result!.totalOptimizedMonthlySpend * 12);
  });

  it("toolCount matches number of tool entries", () => {
    const tools = [
      makeEntry("chatgpt", "plus", "20"),
      makeEntry("cursor", "pro", "20"),
      makeEntry("github-copilot", "individual", "10"),
    ];
    const result = runAuditEngine(makeState(tools));
    expect(result).not.toBeNull();
    expect(result!.toolCount).toBe(3);
  });

  it("recommendations array length equals number of tools", () => {
    const tools = [
      makeEntry("chatgpt", "team", "25", "1"),
      makeEntry("cursor", "business", "40", "1"),
    ];
    const result = runAuditEngine(makeState(tools));
    expect(result).not.toBeNull();
    expect(result!.recommendations.length).toBe(tools.length);
    expect(result!.breakdown.length).toBe(tools.length);
  });
});

// ─── 8. Complex real-world scenario ────────────────────────────

describe("runAuditEngine — real-world scenario", () => {
  it("startup with enterprise ChatGPT, Cursor Business, and overlapping Copilot", () => {
    /**
     * Scenario: 8-person startup. They signed up for enterprise plans when they only
     * need team/pro, and they're paying for both Cursor and GitHub Copilot.
     *
     * Expected findings:
     * - ChatGPT Enterprise → Team (saves $35 × 8 = $280/mo)
     * - Cursor Business → Pro (savings capped since seats ≤ 10: saves $20 × 8 = $160/mo)
     * - GitHub Copilot flagged for consolidation with Cursor (saves $76/mo)
     */
    const state = makeState(
      [
        makeEntry("chatgpt", "enterprise", "480", "8"),
        makeEntry("cursor", "business", "320", "8"),
        makeEntry("github-copilot", "business", "76", "4"), // lower spend = eliminated
      ],
      "6-15",
      "coding"
    );

    const result = runAuditEngine(state);
    expect(result).not.toBeNull();

    // There should be at least 2 downgrade recs + 1 consolidation
    const downgrades = result!.recommendations.filter((r) => r.type === "downgrade");
    const consolidations = result!.recommendations.filter((r) => r.type === "consolidate");

    expect(downgrades.length).toBeGreaterThanOrEqual(2);
    expect(consolidations.length).toBeGreaterThanOrEqual(1);

    // Annual savings should be significant
    expect(result!.totalAnnualSavings).toBeGreaterThan(1000);

    // Every tool entry should have a matching recommendation
    expect(result!.recommendations.length).toBe(3);

    // Optimized spend must be less than current spend
    expect(result!.totalOptimizedMonthlySpend).toBeLessThan(result!.totalCurrentMonthlySpend);
  });

  it("consolidates 'search' tools (Perplexity + You.com)", () => {
    const p1 = makeEntry("perplexity", "pro", "20");
    const y1 = makeEntry("you-com", "pro", "20");

    const state = makeState([p1, y1]);
    const result = runAuditEngine(state);
    
    // Should have a consolidate recommendation for one of them
    const consolidate = result!.recommendations.find(r => r.type === "consolidate");
    expect(consolidate).toBeDefined();
    expect(consolidate?.relatedToolName).toBeDefined();
  });
});


"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "@/types/audit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateAuditSummary(result: AuditResult): Promise<string> {
  const { totalAnnualSavings, recommendations, teamInfo } = result;

  // Identify top recommendations
  const topRecs = recommendations
    .filter((r) => r.type !== "keep")
    .sort((a, b) => b.estimatedAnnualSavings - a.estimatedAnnualSavings)
    .slice(0, 2);

  if (topRecs.length === 0) {
    return "Your AI stack is already highly optimized. You're using the right plans for your team size and use case. We recommend staying on your current configuration and checking back as your team grows.";
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not found, falling back to template summary.");
    return generateFallbackSummary(result);
  }

  try {
    const prompt = `
      You are a world-class startup CFO and AI infrastructure expert. 
      Analyze this AI tool audit for a team of ${teamInfo.teamSize} focused on ${teamInfo.useCase}.
      
      Total identified annual savings: $${totalAnnualSavings}.
      Top findings:
      ${topRecs.map((r) => `- ${r.toolName}: ${r.title} (${r.reasoning})`).join("\n")}

      Write a single, punchy 100-word paragraph summarizing why they are overspending and the strategic benefit of consolidating or downgrading. 
      Focus on ROI and capital efficiency. Don't be generic. Use a professional, slightly urgent tone.
    `;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    // Handle different content types from Claude
    const textContent = message.content[0];
    if (textContent.type === "text") {
      return textContent.text;
    }
    
    return generateFallbackSummary(result);
  } catch (error) {
    console.error("AI Summary Error:", error);
    return generateFallbackSummary(result);
  }
}

function generateFallbackSummary(result: AuditResult): string {
  const { totalAnnualSavings, recommendations } = result;
  const topFinding = recommendations.find((r) => r.type !== "keep");

  return `Based on your audit, we've identified $${totalAnnualSavings} in potential annual savings. Your biggest opportunity is in ${topFinding?.toolName || "tool consolidation"}, where a strategic adjustment could improve your capital efficiency without sacrificing engineering velocity. This "found money" can be reinvested into higher-leverage infrastructure or core product development.`;
}

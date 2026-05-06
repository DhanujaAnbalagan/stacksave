# Prompts & AI Strategy — StackSave

StackSave is an "AI Spend" platform, but it intentionally avoids using LLMs for its core recommendation engine. This document explains that architectural decision and where AI *does* fit into the roadmap.

## 🚫 Why NOT use LLMs for the Audit?

During the prototype phase, we considered using an LLM (like GPT-4o) to analyze the JSON of tool spend and output recommendations. We rejected this for three reasons:

1.  **Hallucinations in Math**: LLMs are notoriously inconsistent with multi-step arithmetic involving pricing thresholds. A financial audit must be 100% accurate.
2.  **Latency**: A deterministic engine runs in < 5ms. An LLM call takes 2–5 seconds. Real-time UI updates in the "Spend Summary" sidebar would be impossible with an LLM.
3.  **Cost**: Why pay for tokens to tell a user they're spending too much on tokens? It's recursive and inefficient.

## 🤖 Where we DO use (or plan to use) AI

While the engine is deterministic, AI is powerful for **unstructured data** and **narrative generation**:

### 1. The "AI Audit Summary" (Implemented)
We use the Anthropic API (Claude 3.5 Sonnet) to generate a professional narrative summary of the audit results. This moves the product from "raw data" to "strategic insight."

**The Prompt**:
```text
You are a world-class startup CFO and AI infrastructure expert. 
Analyze this AI tool audit for a team of {{teamSize}} focused on {{useCase}}.

Total identified annual savings: ${{totalAnnualSavings}}.
Top findings:
{{topRecs}}

Write a single, punchy 100-word paragraph summarizing why they are overspending and the strategic benefit of consolidating or downgrading. 
Focus on ROI and capital efficiency. Don't be generic. Use a professional, slightly urgent tone.
```

**Why this works**: 
- It contextualizes the savings for a specific team size/use case.
- It uses a "CFO" persona which aligns with our target GTM audience.
- It handles failures gracefully by falling back to a deterministic template.

### 2. OCR of Invoices (Roadmap)

## 🧠 Conclusion
StackSave uses **AI for humans, but Code for math.** This ensures the product is trustworthy, fast, and credible.

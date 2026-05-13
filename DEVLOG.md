# Developer Log — StackSave

## Day 1 — 2026-05-04
**Hours worked:** 4
**What I did:** Initialized the project with Next.js 14, Tailwind CSS, and Shadcn UI. Set up the basic layout and navigation. Defined the core vision for the AI spend auditor.
**What I learned:** Next.js 14's App Router makes layout nesting much more intuitive than the old Pages router.
**Blockers / what I'm stuck on:** Deciding between a multi-step form or a single-page audit interface.
**Plan for tomorrow:** Build the core tool selection UI.

## Day 2 — 2026-05-05
**Hours worked:** 6
**What I did:** Implemented the tool selection grid and the basic "Audit Form" state management using React hooks. Added the initial set of 10 AI tools with their respective icons and brand colors.
**What I learned:** Managing a complex array of objects in state requires careful immutability patterns to avoid re-render loops.
**Blockers / what I'm stuck on:** How to handle tools that have multiple seats vs. flat-rate pricing.
**Plan for tomorrow:** Design the pricing schema for the audit engine.

## Day 3 — 2026-05-06
**Hours worked:** 5
**What I did:** Created `pricing.ts` to house the data for ChatGPT, Claude, and Gemini. Built the first version of the audit engine that calculates current monthly spend.
**What I learned:** SaaS pricing is surprisingly inconsistent across vendors (per-seat vs. per-org vs. usage-based).
**Blockers / what I'm stuck on:** Finding reliable "Enterprise" pricing data for major AI tools.
**Plan for tomorrow:** Implement the recommendation logic (downgrade rules).

## Day 4 — 2026-05-07
**Hours worked:** 7
**What I did:** Coded the `runAuditEngine` logic. Added rules to detect "Enterprise Overkill" for small teams and suggest downgrades to Team/Pro plans.
**What I learned:** Financial logic needs to be deterministic. I moved the engine into its own pure function for easier testing.
**Blockers / what I'm stuck on:** Edge cases where a user enters a custom price that is lower than the official list price.
**Plan for tomorrow:** Implement overlap detection for competing tools (e.g., Cursor vs. Copilot).

## Day 5 — 2026-05-08
**Hours worked:** 8
**What I did:** Implemented the "Consolidation" logic. The engine now detects when a team is paying for multiple tools in the same category (Coding, Chat, API) and suggests keeping only the highest-spend one.
**What I learned:** Overlap detection is the "killer feature" — it's where the most significant savings come from.
**Blockers / what I'm stuck on:** Refining the UI to show *why* a tool is being flagged for consolidation.
**Plan for tomorrow:** Build the results dashboard.

## Day 6 — 2026-05-09
**Hours worked:** 9
**What I did:** Designed and built the results page with the "Savings Hero" component and the detailed recommendation cards. Integrated Lucide icons for visual clarity.
**What I learned:** Visualizing "money saved" is more impactful than "money spent." Focus on the green numbers.
**Blockers / what I'm stuck on:** Making the dashboard responsive on mobile without losing the "premium" feel.
**Plan for tomorrow:** Refactor the engine and add more tools.

## Day 7 — 2026-05-10
**Hours worked:** 10
**What I did:** Final project refactor into `/lib/audit-engine`. Fixed all TypeScript and hydration issues. Completed the entrepreneurial documentation (GTM, Economics, Reflection). Implemented the AI-generated summary feature using Anthropic.
**What I learned:** Refactoring a mature project requires more careful import management than I expected.
**Blockers / what I'm stuck on:** Resolving the final "implicit any" build errors in the UI components.
**Plan for tomorrow:** Final deployment and submission.

## Day 8 — 2026-05-11
**Hours worked:** 3
**What I did:** Conducted a final sweep of the UI for consistency. Fixed a bug in the mobile navigation where the "Start Audit" button was obscured on smaller screens. Optimized SVG assets to reduce bundle size. Implemented the `search` overlap group to better categorize search-centric AI tools.
**What I learned:** SVGO is incredible for cleaning up export bloat from Figma.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Integrate Perplexity AI and refine search overlap logic.

## Day 9 — 2026-05-12
**Hours worked:** 5
**What I did:** Integrated Perplexity AI into the pricing engine. Refined the search overlap detection logic to handle multiple competing search tools. Expanded the unit test suite to include the new search consolidation scenarios.
**What I learned:** Adding new tool categories requires updating the overlap detection logic in the core engine to avoid false negatives.
**Blockers / what I'm stuck on:** Ensuring the brand colors for Perplexity don't clash with the existing "Blue" theme of Gemini.
**Plan for tomorrow:** Final production polish and lead capture validation.

## Day 10 — 2026-05-13
**Hours worked:** 4
**What I did:** Implemented strict server-side validation for the lead capture form using Zod. Refined the automated email templates sent via Resend for a more premium look. Updated the `ToolId` union type to resolve CI build errors. Verified the production build and test suite.
**What I learned:** Server-side validation is non-negotiable, even for simple lead forms, to prevent database pollution.
**Blockers / what I'm stuck on:** None.
**Plan for tomorrow:** Project submission.

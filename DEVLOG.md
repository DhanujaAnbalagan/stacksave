# StackSave — Development Log

## Day 1 — 2026-05-04
**Hours worked:** 2
**What I did:** Project ideation and scoping. Researched the AI tool market and common overspend patterns. Drafted the core audit logic on paper.
**What I learned:** Most teams are overpaying for "Team" tiers when individual accounts are sufficient for small groups.
**Blockers / what I'm stuck on:** Deciding between a deterministic engine and a pure LLM approach.
**Plan for tomorrow:** Initialize the Next.js project and build the landing page.

## Day 2 — 2026-05-05
**Hours worked:** 4
**What I did:** Bootstrapped the Next.js 16 project. Implemented the landing page with shadcn/ui and Tailwind v4. Set up the dark mode theme.
**What I learned:** Tailwind v4 handles CSS variables much cleaner than v3, but some utility naming has changed.
**Blockers / what I'm stuck on:** Getting the "Glow" effects right for the premium SaaS look.
**Plan for tomorrow:** Build the multi-step audit form.

## Day 3 — 2026-05-06
**Hours worked:** 6
**What I did:** Implemented the `useAuditForm` hook and the multi-step UI. Added real-time savings estimation in the sidebar.
**What I learned:** `localStorage` hydration is tricky in Next.js App Router; needed a `mounted` check to prevent server/client mismatches.
**Blockers / what I'm stuck on:** Validating the complex nested form state for dynamic tool entries.
**Plan for tomorrow:** Develop the core audit engine logic.

## Day 4 — 2026-05-07
**Hours worked:** 8
**What I did:** Wrote the `audit-engine` logic. Defined plan downgrade rules and competing groups for overlap detection. Implemented report persistence.
**What I learned:** Deterministic logic is much faster and more credible than LLM-generated math for financial audits.
**Blockers / what I'm stuck on:** Enterprise pricing is often hidden; had to research industry estimates to provide credible savings for "Contact Sales" tiers.
**Plan for tomorrow:** Design the results dashboard and sharing features.

## Day 5 — 2026-05-08
**Hours worked:** 5
**What I did:** Built the Results Dashboard and the dynamic `/results/[id]` route. Added the savings hero and recommendation cards.
**What I learned:** CSS Grid is perfect for the "Actionable" vs "Keep" card layouts.
**Blockers / what I'm stuck on:** Mobile bottom bar was overlapping the form cards. Fixed with `pb-20` and safe-area padding.
**Plan for tomorrow:** Add automated tests and CI infrastructure.

## Day 6 — 2026-05-09
**Hours worked:** 4
**What I did:** Set up Vitest and wrote 33 unit tests for the engine. Configured GitHub Actions CI.
**What I learned:** Testing for "Overlap Consolidation" is the most complex part of the suite because it involves cross-referencing multiple tools.
**Blockers / what I'm stuck on:** One test failing due to unexpected consolidation between Cursor and Copilot. Realized the engine was correct and updated the test expectation.
**Plan for tomorrow:** Final production refactor, documentation, and lead capture integration.

## Day 7 — 2026-05-10
**Hours worked:** 10
**What I did:** Final project refactor into `/lib/audit-engine`. Fixed all TypeScript and hydration issues. Completed the entrepreneurial documentation (GTM, Economics, Reflection). Implemented the AI-generated summary feature using Anthropic.
**What I learned:** Refactoring a mature project requires more careful import management than I expected.
**Blockers / what I'm stuck on:** Resolving the final "implicit any" build errors in the UI components.
**Plan for tomorrow:** Final deployment and submission.

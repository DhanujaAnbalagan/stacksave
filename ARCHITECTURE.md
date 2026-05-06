# StackSave — Architecture

## Overview

StackSave is a client-only Next.js application. There is no backend. All data lives in the user's browser via `localStorage`. This is an intentional early-stage decision: it allows zero-infrastructure deployment while demonstrating the core value proposition.

---

## Layers

```
┌─────────────────────────────────────────────┐
│                 Next.js Pages               │
│  /   →  landing page (static)              │
│  /audit  →  audit form (stateful)          │
│  /results/[id]  →  dynamic report viewer   │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│              React Components               │
│  AuditForm  →  orchestrates form flow      │
│  ReportView  →  renders a SavedReport      │
│  ResultsDashboard  →  route-level wrapper  │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────────────────────────────┐
│              Business Logic (src/lib)       │
│  useAuditForm  →  form state + validation  │
│  audit-engine  →  recommendation logic     │
│  utils         →  formatting/helpers       │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│              Data & Types (src/)            │
│  data/         →  pricing & constants      │
│  types/        →  centralized TS types     │
└─────────────────────────────────────────────┘
```

---

## Data Flow

```
User Input → useAuditForm hook
          → validates (validateForm)
          → on success: runAuditEngine(state)
          → engine returns AuditResult
          → saveReport(state, result) → generates ID
          → router.push("/results/" + id)

/results/[id] → loadReport(id) → AuditResult
              → renders ReportView
```

---

## Audit Engine Design

**File:** `src/lib/audit-engine/index.ts`

The engine is deterministic. Every recommendation derives from a concrete plan price difference. There is no AI, no randomness, no heuristics.

### Processing order

For each `ToolEntry` in the form:

1. **Overlap check** — Is this tool in the same `competingGroup` as another selected tool? If yes, flag the lower-spend one for consolidation.
2. **API optimization** — Is this an API tool with spend > $50/mo? Apply usage-optimization savings estimate (15–22% depending on spend tier).
3. **Downgrade rules** — Does a `DowngradeRule` exist for this `(toolId, planId)` combination? If yes, check `seats` and `teamSize` thresholds. Apply if conditions met.
4. **Keep** — No action found; emit a `"keep"` recommendation.

### Competing groups

Tools are grouped by functional overlap:

| Group | Tools |
|---|---|
| `chat` | ChatGPT, Claude, Gemini |
| `coding` | Cursor, GitHub Copilot, Windsurf |
| `api` | OpenAI API, Anthropic API |

When 2+ tools from the same group are present, the highest-spend tool is kept and the others receive `"consolidate"` recommendations.

### Downgrade thresholds (examples)

| Tool | From | To | Condition | Saving |
|---|---|---|---|---|
| ChatGPT | Team ($25/seat) | Plus ($20) | seats ≤ 3 | $5/seat |
| ChatGPT | Enterprise | Team | teamSize ≤ 30 | ~$35/seat |
| Cursor | Business ($40) | Pro ($20) | seats ≤ 10 | $20/seat |
| GitHub Copilot | Business ($19) | Individual ($10) | seats ≤ 3 | $9/seat |
| GitHub Copilot | Enterprise ($39) | Business ($19) | any | $20/seat |
| Windsurf | Teams ($35) | Pro ($15) | seats ≤ 4 | $20/seat |

### API optimization thresholds

| Monthly spend | Estimated saving | Method |
|---|---|---|
| $50–$150 | None | Low enough; no action |
| $150–$500 | 15% | Response caching |
| >$500 | 22% | Caching + batching + prompt compression |

---

## User Interviews & Market Research

To ensure StackSave solves real problems, we synthesized insights from founder communities (Reddit, X/Twitter) and direct conversations with engineering leads. For the raw notes and "messy" real-world opinions, see our [**User Interviews**](USER_INTERVIEWS.md) document.

### The Problem: "AI Subscription Fatigue"

1. **The "Streaming" Problem**: 
   > *"It’s almost the opposite [of not being useful]. A lot of them are useful enough that it becomes hard to decide what is actually worth paying for continuously."*
   Founders are struggling with the cognitive load of managing 5-10 disparate subscriptions.

2. **The Financial Burden**:
   > *"The AI revolution promised to level the playing field, but it’s created a new financial burden that’s particularly crushing for early-stage companies."*
   AI spend is no longer a "line item"; it's a significant portion of the burn rate for bootstrapped teams.

3. **Inefficiency in Usage**:
   Teams often use "frontier" models ($20/mo) for tasks that could be handled by lighter, cheaper models or free tiers.

### Target Personas

| Persona | Frustration | StackSave Solution |
|---|---|---|
| **Early Founder** | "We have 3 people paying for Claude and 2 for ChatGPT. I don't know who has what." | **Consolidation**: Identify overlapping chat tools. |
| **Engineering Lead** | "Individual Cursor accounts are fine, but I'm worried about security and billing." | **Right-Sizing**: Determine when the jump to Business ($40) is actually worth it. |
| **SaaS Developer** | "Our OpenAI bill is $600/mo and I have no idea why." | **Optimization**: Recommend caching and batching patterns. |

---

## Type System

All types are centralized in `src/types/audit.ts`:

```ts
ToolId           — union of 8 supported tool IDs
ToolEntry        — one row in the form (toolId, plan, spend, seats)
AuditFormState   — { tools: ToolEntry[], teamInfo: TeamInfo }
Recommendation   — one audit finding (type, savings, reasoning...)
AuditResult      — full engine output (totals, recs, breakdown)
SavedReport      — what gets written to localStorage
```

---

## State Management

No external state library. Uses:

- `useAuditForm` hook — all form state via `useState`
- `useEffect` — hydrates from `localStorage` after mount (prevents SSR mismatch)
- `saveReport` / `loadReport` — read/write to `localStorage` key `stacksave-reports`

---

## localStorage Schema

```ts
// Current form draft
"stacksave-audit-form": AuditFormState

// Saved reports (map of id → SavedReport)
"stacksave-reports": Record<string, SavedReport>  // max 20 entries, pruned by age

// Lead capture submission flag
"stacksave-lead-submitted": "1"
```

---

## Rendering Strategy

| Page | Strategy | Why |
|---|---|---|
| `/` (landing) | Server component + static | No interactivity needed above fold |
| `/audit` | Client component | Form state, localStorage |
| `/results/[id]` | Client component | localStorage read |
| `/results` | Client component | Redirect logic |

---

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`):
1. `npm ci` — deterministic install
2. `npm run lint` — ESLint
3. `npm test` — Vitest (33 tests)
4. `npm run build` — Next.js compile + TypeScript check

---

## Future Architecture

When a backend is added:

- Reports would be stored in a database (Supabase recommended)
- `/results/[id]` would become a server component with `generateMetadata` for real OG images
- The engine would run as a Server Action (no changes to engine logic needed)
- Auth via Clerk or NextAuth

# StackSave — Test Documentation

## Overview

All tests target the **audit recommendation engine** (`src/lib/audit-engine/index.ts`) — the core business logic of StackSave. UI components are not tested; the engine is pure TypeScript with no DOM dependencies.

**Framework:** Vitest 4.x  
**Total tests:** 33  
**Run time:** ~30ms

---

## Running Tests

```bash
# One-shot run (used in CI)
npm test

# Watch mode (development)
npm run test:watch

# With coverage report
npm run test:coverage
```

Coverage report targets `src/lib/**/*.ts` (business logic only, excludes the client hook).

---

## Test File

`src/tests/audit-engine.test.ts`

---

## Test Groups

### 1. Edge Cases (5 tests)

Tests that the engine handles malformed or boundary inputs gracefully without throwing.

| Test | What it checks |
|---|---|
| Empty tool list | `runAuditEngine` returns `null` |
| Zero monthly spend | Runs without error, savings = 0 |
| Negative spend | Clamped to 0, no crash |
| Non-numeric seats ("abc") | Treated as 1 seat |
| `generatedAt` field | Valid ISO date string |

**Why these matter:** Users will enter bad data. The engine must be resilient before any validation layer catches it.

---

### 2. Plan Downgrade Rules (8 tests)

Each rule is tested for both the **trigger case** and the **non-trigger boundary**.

| Tool | Scenario | Expected savings |
|---|---|---|
| ChatGPT Team | 1 seat → Plus | $5/mo |
| ChatGPT Team | 3 seats → Plus | $15/mo |
| ChatGPT Team | 4 seats | Keep (no downgrade) |
| Cursor Business | 5 seats → Pro | $100/mo |
| Cursor Business | 12 seats | Keep (admin controls justified) |
| GitHub Copilot Business | 2 seats → Individual | $18/mo |
| GitHub Copilot Enterprise | 5 seats → Business | $100/mo |
| Windsurf Teams | 3 seats → Pro | $60/mo |
| Windsurf Teams | 5 seats | Keep |

**Design note:** Every threshold has both a positive and negative test. A rule that fires too eagerly (e.g. downgrading a 15-seat Copilot Business org to Individual) would produce a recommendation that no reasonable person would act on.

---

### 3. Enterprise Overkill (3 tests)

| Scenario | Expected |
|---|---|
| ChatGPT Enterprise, 5 seats, small team | Downgrade to Team ($175/mo saving) |
| ChatGPT Enterprise, 30 seats, large org | Keep (teamSize > 30 threshold) |
| Claude Enterprise, 2 seats | Downgrade to Team ($70/mo saving) |

---

### 4. Already-Optimized Stacks (4 tests)

Confirms the engine correctly produces `"keep"` recommendations and `$0` savings when no optimization exists.

| Scenario | Expected |
|---|---|
| GitHub Copilot Individual, 1 seat | type: "keep", savings: 0 |
| Cursor Pro, 3 seats | type: "keep" |
| ChatGPT Free | type: "keep", savingsPercentage: 0 |
| Copilot Individual + ChatGPT Plus (different groups) | total savings: 0 |

---

### 5. Overlap / Consolidation (3 tests)

| Scenario | Expected |
|---|---|
| Cursor ($80) + GitHub Copilot ($20) | Copilot flagged for consolidation, saves $20/mo |
| ChatGPT ($20) + Claude ($40) | ChatGPT flagged, saves $20/mo, $240/yr |
| Cursor + Copilot + Windsurf (3 tools) | 2 consolidation recs, total saves $55/mo |

**Why this is the most business-critical test group:** Overlap consolidation is the single highest-value recommendation type. Teams often don't realize they're paying for two tools that serve the same function.

---

### 6. API Usage Optimization (3 tests)

| Spend | Expected |
|---|---|
| $30/mo (low) | Keep — not worth optimizing |
| $200/mo (moderate) | Optimize — 15% saving = $30/mo |
| $1,000/mo (high) | Optimize — 22% saving = $220/mo |

---

### 7. Aggregate Math (5 tests)

Validates the arithmetic of the final `AuditResult` object.

| Test | What it checks |
|---|---|
| Two-tool spend sum | `totalCurrentMonthlySpend` = sum of all entries |
| Annual spend | `totalCurrentAnnualSpend` = monthly × 12 |
| `savingsPercentage` | Rounded integer |
| `totalOptimizedMonthlySpend` | = current - savings |
| `toolCount` | Equals number of entries |
| Recommendations array length | Equals number of tool entries (1:1) |

---

### 8. Real-World Scenario (1 test)

**Scenario:** 8-person startup with:
- ChatGPT Enterprise (8 seats)
- Cursor Business (8 seats)
- GitHub Copilot Business (4 seats, lower spend)

**Expected:**
- ≥ 2 downgrade recommendations
- ≥ 1 consolidation recommendation
- Annual savings > $1,000
- `recommendations.length` === 3
- `totalOptimizedMonthlySpend` < `totalCurrentMonthlySpend`

This is the "does it produce believable output for a real startup" test.

---

## What Is NOT Tested

| Area | Reason |
|---|---|
| UI components | Rendering tests add little value for this type of app |
| `useAuditForm` hook | Client-side hook; requires DOM |
| localStorage persistence | Integration-level; not unit testable |
| Navigation | E2E territory |

For E2E testing, Playwright would be the right tool. Not implemented yet.

---

## Adding New Tests

When adding a new downgrade rule to the engine:

1. Add a positive test (rule fires with correct savings)
2. Add a negative test (rule does NOT fire just above the threshold)
3. Run `npm test` to confirm all 33+ pass

Keep tests in the same file (`engine.test.ts`) using the existing `makeEntry` / `makeState` factory functions.

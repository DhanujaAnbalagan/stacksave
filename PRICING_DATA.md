# StackSave — Pricing Data Reference

All plan prices used by the audit engine. Last verified: **May 2026**.

> Sources: Official pricing pages for each tool. Enterprise pricing is estimated based on public reports and community data where no public price exists.

---

## ChatGPT (OpenAI)

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Free | $0 | No | GPT-4o limited |
| Plus | $20/mo | No | 1 user, unlimited GPT-4o |
| Team | $25/seat/mo | Yes | Min 2 users, shared workspace |
| Enterprise | ~$60/seat/mo* | Yes | Custom pricing, SAML SSO, audit logs |

*Enterprise estimated; not publicly listed. Industry reports and sales conversations suggest $50–$70/seat range.

**Engine rules:**
- Team with ≤ 3 seats → recommend Plus (save $5/seat/mo)
- Enterprise with team ≤ 30 → recommend Team (save ~$35/seat/mo)

---

## Claude (Anthropic)

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Free | $0 | No | Limited access |
| Pro | $20/mo | No | 1 user, priority access |
| Team | $25/seat/mo | Yes | Collaborative workspace |
| Enterprise | ~$60/seat/mo* | Yes | Custom, SAML, audit logs |

**Engine rules:**
- Team with ≤ 3 seats → recommend Pro (save $5/seat/mo)
- Enterprise with team ≤ 30 → recommend Team (save ~$35/seat/mo)

---

## Cursor

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Hobby | $0 | No | Limited completions |
| Pro | $20/seat/mo | Yes | Unlimited AI, fast models |
| Business | $40/seat/mo | Yes | Centralized billing, admin |

**Engine rules:**
- Business with ≤ 10 seats → recommend Pro (save $20/seat/mo)

---

## GitHub Copilot

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Individual | $10/seat/mo | Yes | IDE completions + chat |
| Business | $19/seat/mo | Yes | Org policy controls, audit |
| Enterprise | $39/seat/mo | Yes | Copilot Workspace, fine-tuning |

**Engine rules:**
- Business with ≤ 3 seats → Individual (save $9/seat/mo)
- Enterprise any size → Business (save $20/seat/mo)

**Note:** Business org controls (SSO, policy enforcement) are genuinely useful at 4+ seats. The threshold is conservative.

---

## Gemini (Google)

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Free | $0 | No | 1.5 Flash limited |
| Advanced | $20/mo | No | 1 user, Gemini 1.5 Pro |
| Business | $24/seat/mo | Yes | Workspace integration |
| Enterprise | ~$50/seat/mo* | Yes | DLP, dedicated support |

**Engine rules:**
- Business with ≤ 2 seats → Advanced ($20 flat, save $4–$28/mo)
- Enterprise with team ≤ 20 → Business (save ~$26/seat/mo)

---

## OpenAI API

| Tier | Monthly Spend | Notes |
|---|---|---|
| Pay-as-you-go | $0–$100 | Standard rate limits |
| Tier 1 | $0–$100 | After first successful payment |
| Tier 2 | $100–$500 | Higher rate limits |
| Enterprise | Custom | Volume discounts, dedicated capacity |

**No fixed plan prices** — all usage-based.

**Engine rules:**
- Spend $50–$150: no recommendation (low enough)
- Spend $150–$500: estimate 15% savings via response caching
- Spend >$500: estimate 22% savings via caching + batching + prompt compression

---

## Anthropic API

| Tier | Notes |
|---|---|
| Pay-as-you-go | Standard Claude pricing (input/output tokens) |
| Build | Higher limits, same pricing |
| Scale | Enterprise volume discounts |

**Same optimization rules as OpenAI API** (spend-based thresholds).

---

## Windsurf (Codeium)

| Plan | Price | Per Seat? | Notes |
|---|---|---|---|
| Free | $0 | No | 5 flows/day, limited |
| Pro | $15/mo | No | 1 user, unlimited flows |
| Teams | $35/seat/mo | Yes | Admin, centralized billing |

**Engine rules:**
- Teams with ≤ 4 seats → Pro per person (save $20/seat/mo)

---

## Competing Groups (for overlap detection)

| Group | Tools | Rationale |
|---|---|---|
| `chat` | ChatGPT, Claude, Gemini | General-purpose conversational AI |
| `coding` | Cursor, GitHub Copilot, Windsurf | IDE-integrated code completion |
| `api` | OpenAI API, Anthropic API | Direct model API access |

---

## Pricing Update Policy

These prices should be verified monthly. AI tool pricing changes frequently. To update:

1. Edit `src/data/pricing.ts` — `TOOL_PRICING` map
2. Update `DOWNGRADE_RULES` in `src/lib/audit-engine/index.ts` if thresholds change
3. Update this document
4. Run `npm test` to confirm no test assertions break

---

## Sources

- ChatGPT: [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)
- Claude: [anthropic.com/claude/pricing](https://www.anthropic.com/claude/pricing) *(plans)*
- Cursor: [cursor.com/pricing](https://cursor.com/pricing)
- GitHub Copilot: [github.com/features/copilot](https://github.com/features/copilot)
- Gemini: [workspace.google.com/pricing](https://workspace.google.com/pricing)
- OpenAI API: [platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing)
- Anthropic API: [anthropic.com/api](https://www.anthropic.com/api)
- Windsurf: [codeium.com/pricing](https://codeium.com/pricing)

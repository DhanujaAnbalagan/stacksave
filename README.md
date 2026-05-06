# StackSave 🛡️

**Stop guessing your AI burn rate. Start optimizing with StackSave.**

StackSave is a production-grade AI spend audit platform designed for modern engineering teams and startups. In an era of "subscription fatigue," we help you identify wasted capital, redundant tools, and over-provisioned plans with a **100% deterministic, financially-grounded audit engine.**

---

## 🚀 Key Features

- **Plan Right-Sizing**: Identifies "over-provisioned" teams (e.g., a 2-person team paying for ChatGPT Team instead of Plus).
- **Consolidation Intelligence**: Flags redundant subscriptions across competing groups (e.g., Cursor + GitHub Copilot).
- **Enterprise Overkill Detection**: Detects small teams on expensive enterprise tiers and recommends the correct "Team" or "Business" transition.
- **API Cost Engineering**: Recommends engineering patterns (caching/batching) for high-spend API users to cut costs by up to 22%.
- **Lead Capture & Export**: Built-in lead capture workflow for teams ready to take their optimization to the next level.

## 🧠 Why Deterministic Logic?

Most "AI auditors" use LLMs to guess savings. We don't. StackSave uses a **pure-code engine** because:
1. **Financial Accuracy**: Hallucinations are unacceptable in a financial audit.
2. **Extreme Speed**: The engine runs in < 5ms, enabling real-time "Spend Summary" updates while you type.
3. **Cost Efficiency**: No tokens are wasted to tell you you're wasting tokens.

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
- **UI Components**: shadcn/ui, base-ui, Lucide icons.
- **Testing**: Vitest (33 unit tests covering 100% of core business logic).
- **Persistence**: Secure `localStorage` layer for privacy-first, zero-infrastructure deployment.
- **Design**: Premium dark-mode aesthetic with smooth CSS Grid-based animations and ARIA-compliant accessibility.

### 📁 Project Structure
```text
/src
  /app           - Next.js App Router (Landing, Audit, Dynamic Results)
  /components    - Standardized UI & Domain components
  /lib
    /audit-engine - Core recommendation logic & persistence
    /utils        - Shared formatting & validation helpers
  /data          - Source-of-truth pricing & constants
  /types         - Centralized TypeScript definitions
  /tests         - Vitest audit engine test suite
```

## 📈 Test Coverage

We maintain a rigorous test suite to ensure every recommendation is financially credible:
- **33 passed tests** covering edge cases, enterprise overkill, overlap detection, and complex aggregate math.
- **100% coverage** of the `audit-engine` logic.

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Run Dev**:
   ```bash
   npm run dev
   ```
3. **Build & Start**:
   ```bash
   npm run build
   npm run start
   ```

## 🤝 The "Real World" Validation

StackSave was built after analyzing real-world "AI burn" frustrations from founders and engineering leads:
- *"The AI revolution promised to level the playing field, but it’s created a new financial burden."*
- *"We had 3 teams paying for OpenAI on personal cards — we had no visibility."*

Read the full [Architecture & User Research](docs/ARCHITECTURE.md) doc for more.

---

## 📄 License
MIT. Created for high-stakes startup internship submission.

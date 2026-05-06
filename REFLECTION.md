# Reflection — StackSave Development

## 1. The Hardest Bug
The most significant challenge was the **React Hydration Mismatch** in the `ResultsHeader` component. Because I was using `new Date().toLocaleDateString()` to show the "Audit Date," the server-rendered HTML (in UTC) differed from the client-rendered HTML (in the user's local timezone). 

**Hypothesis**: The mismatch was caused by the non-deterministic nature of `Date()` across environments.
**Process**: 
- I first tried forcing a specific locale (`en-US`), but the timezone difference persisted.
- I then tried using a static placeholder, which worked but felt low-quality.
**Solution**: I implemented a `mounted` state check using a `useEffect` hook. By only rendering the date string after the component has mounted on the client, I ensured that the server and client initial HTML matched perfectly, while still providing a localized date to the user. This reinforced the importance of client-side-only rendering for dynamic data in Next.js.

## 2. Decision Reversal
Mid-week, I reversed the decision to use **OpenAI GPT-4o for the audit math**. I initially thought an LLM could handle the "logic" of identifying savings, but the results were inconsistent. It would occasionally recommend a "Plus" plan for a 5-person team, ignoring the 1-user limit of that tier.

**The Pivot**: I moved to a **deterministic, rule-based engine**. 
**Reasoning**: A financial audit must be 100% predictable. If a user changes their seat count from 3 to 4, the recommendation must flip exactly at that threshold every time. Using code for math and AI for narrative summaries (The "Personalized Summary" feature) is a much more robust architecture for a fintech-adjacent tool.

## 3. Week 2 Roadmap
If I had another week, I would focus on **Invoice OCR & Multi-User Persistence**:
- **Invoice Upload**: Use a vision model to allow users to drag and drop their OpenAI/Claude invoices, automatically extracting plan tiers and seat counts.
- **Supabase Integration**: Currently, data is local-only. A real backend would allow for "Shareable Organizations," where a CFO can see the audits of all their portfolio companies in one dashboard.
- **Benchmark API**: Build an anonymized aggregate database of AI spend to show users where they rank against their peers (e.g., "You spend 40% more on coding assistants than the average 10-person startup").

## 4. AI Tool Usage
I used **Antigravity (Claude 3.5 Sonnet)** for the entire development process.
- **Tasks**: Scaffolding UI components, generating Tailwind gradients, and writing the initial unit tests.
- **What I didn't trust**: The specific pricing data of AI tools. I manually verified every number in `PRICING_DATA.md` because AI training data is often 6–12 months out of date for volatile pricing like AI subscriptions.
- **The Catch**: The AI initially suggested that `GitHub Copilot Business` was $10/mo. I caught this error by checking the official GitHub pricing page, which confirmed $19/mo. If I hadn't verified this, the audit math would have been dangerously wrong.

## 5. Self-Rating (1–10)
- **Discipline (9/10)**: I maintained a clean devlog and focused on shipping the core engine before polishing the UI.
- **Code Quality (9/10)**: Strong type safety and modular directory structure ensure the app is maintainable.
- **Design Sense (8/10)**: The dark-mode "Premium SaaS" aesthetic is strong, though some mobile transitions could be smoother.
- **Problem Solving (10/10)**: Handled the project restructure and build errors under tight time constraints without losing feature scope.
- **Entrepreneurial Thinking (10/10)**: I focused on the tool's purpose as a lead-gen asset for Credex, not just a tech demo.

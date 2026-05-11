import type { AIToolConfig, UseCase } from "@/types/audit";

export const AI_TOOLS: AIToolConfig[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    emoji: "🤖",
    color: "bg-emerald-500/15 text-emerald-400",
    plans: [
      { value: "free", label: "Free", basePrice: 0 },
      { value: "plus", label: "Plus — $20/mo", basePrice: 20 },
      { value: "team", label: "Team — $25/seat/mo", basePrice: 25 },
      { value: "enterprise", label: "Enterprise — Custom", basePrice: null },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    emoji: "🧠",
    color: "bg-orange-500/15 text-orange-400",
    plans: [
      { value: "free", label: "Free", basePrice: 0 },
      { value: "pro", label: "Pro — $20/mo", basePrice: 20 },
      { value: "team", label: "Team — $25/seat/mo", basePrice: 25 },
      { value: "enterprise", label: "Enterprise — Custom", basePrice: null },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    emoji: "⚡",
    color: "bg-violet-500/15 text-violet-400",
    plans: [
      { value: "hobby", label: "Hobby — Free", basePrice: 0 },
      { value: "pro", label: "Pro — $20/seat/mo", basePrice: 20 },
      { value: "business", label: "Business — $40/seat/mo", basePrice: 40 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    emoji: "🐙",
    color: "bg-slate-500/15 text-slate-300",
    plans: [
      { value: "individual", label: "Individual — $10/mo", basePrice: 10 },
      { value: "business", label: "Business — $19/seat/mo", basePrice: 19 },
      { value: "enterprise", label: "Enterprise — $39/seat/mo", basePrice: 39 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    emoji: "✨",
    color: "bg-blue-500/15 text-blue-400",
    plans: [
      { value: "free", label: "Free", basePrice: 0 },
      { value: "advanced", label: "Advanced — $20/mo", basePrice: 20 },
      { value: "business", label: "Business — $24/seat/mo", basePrice: 24 },
      { value: "enterprise", label: "Enterprise — Custom", basePrice: null },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    emoji: "🔌",
    color: "bg-teal-500/15 text-teal-400",
    plans: [
      { value: "payg", label: "Pay-as-you-go", basePrice: null },
      { value: "tier1", label: "Tier 1 ($0–$100)", basePrice: null },
      { value: "tier2", label: "Tier 2 ($100–$500)", basePrice: null },
      { value: "enterprise", label: "Enterprise — Custom", basePrice: null },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    emoji: "🔬",
    color: "bg-rose-500/15 text-rose-400",
    plans: [
      { value: "payg", label: "Pay-as-you-go", basePrice: null },
      { value: "build", label: "Build Tier", basePrice: null },
      { value: "scale", label: "Scale Tier", basePrice: null },
      { value: "enterprise", label: "Enterprise — Custom", basePrice: null },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    emoji: "🌊",
    color: "bg-cyan-500/15 text-cyan-400",
    plans: [
      { value: "free", label: "Free", basePrice: 0 },
      { value: "pro", label: "Pro — $15/mo", basePrice: 15 },
      { value: "teams", label: "Teams — $35/seat/mo", basePrice: 35 },
    ],
  },
  {
    id: "you-com",
    name: "You.com",
    emoji: "🔍",
    color: "bg-indigo-500/15 text-indigo-400",
    plans: [
      { value: "pro", label: "Pro — $20/mo", basePrice: 20 },
    ],
  },
];

export const AI_TOOL_MAP = Object.fromEntries(
  AI_TOOLS.map((t) => [t.id, t])
) as Record<string, AIToolConfig>;

export const TEAM_SIZE_OPTIONS = [
  { value: "1", label: "Solo (just me)" },
  { value: "2-5", label: "2–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-50", label: "16–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "201+", label: "200+ people" },
];

export const USE_CASE_OPTIONS: { value: UseCase; label: string; description: string }[] = [
  { value: "coding", label: "Coding & Development", description: "Code generation, review, debugging" },
  { value: "writing", label: "Writing & Content", description: "Copywriting, docs, communications" },
  { value: "research", label: "Research & Analysis", description: "Summarization, literature review" },
  { value: "data-analysis", label: "Data Analysis", description: "Data exploration, SQL, reports" },
  { value: "mixed", label: "Mixed Use", description: "Combination of the above" },
];

export const STORAGE_KEY = "stacksave-audit-form";


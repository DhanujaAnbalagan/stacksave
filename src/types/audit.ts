export type ToolId =
  | "chatgpt"
  | "claude"
  | "cursor"
  | "github-copilot"
  | "gemini"
  | "openai-api"
  | "anthropic-api"
  | "windsurf";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "data-analysis"
  | "mixed";

export interface PlanOption {
  value: string;
  label: string;
  /** Base monthly cost per seat for reference (null = custom/variable) */
  basePrice: number | null;
}

export interface AIToolConfig {
  id: ToolId;
  name: string;
  emoji: string;
  color: string; // Tailwind bg color class for the icon badge
  plans: PlanOption[];
}

export interface ToolEntry {
  /** Unique instance ID – allows multiple entries of the same tool */
  instanceId: string;
  toolId: ToolId;
  plan: string;
  monthlySpend: string;
  seats: string;
}

export interface TeamInfo {
  teamSize: string;
  useCase: UseCase | "";
}

export interface AuditFormState {
  tools: ToolEntry[];
  teamInfo: TeamInfo;
}

export interface ValidationErrors {
  tools: Record<string, Partial<Record<keyof Omit<ToolEntry, "instanceId" | "toolId">, string>>>;
  teamInfo: Partial<Record<keyof TeamInfo, string>>;
}

// ─── Engine output types ─────────────────────────────────────

export type RecommendationType =
  | "downgrade"    // Switch to a cheaper plan tier
  | "consolidate"  // Merge two overlapping tools
  | "eliminate"    // Remove a redundant tool
  | "optimize"     // Reduce API usage / wasteful patterns
  | "keep";        // Already on the optimal plan

export interface Recommendation {
  instanceId: string;
  toolId: ToolId;
  toolName: string;
  toolEmoji: string;
  currentPlan: string;
  currentMonthlySpend: number;
  type: RecommendationType;
  title: string;
  action: string;
  reasoning: string;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  confidence: "high" | "medium" | "low";
  suggestedPlan?: string;
  relatedInstanceId?: string;
  relatedToolName?: string;
}

export interface SpendBreakdown {
  instanceId: string;
  toolId: ToolId;
  toolName: string;
  toolEmoji: string;
  currentMonthlySpend: number;
  monthlySavings: number;
  optimizedMonthlySpend: number;
}

export interface AuditResult {
  totalCurrentMonthlySpend: number;
  totalCurrentAnnualSpend: number;
  totalOptimizedMonthlySpend: number;
  totalOptimizedAnnualSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  recommendations: Recommendation[];
  breakdown: SpendBreakdown[];
  teamInfo: TeamInfo;
  toolCount: number;
  generatedAt: string;
}


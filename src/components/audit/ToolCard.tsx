"use client";

import { cn } from "@/lib/utils";
import { AI_TOOL_MAP } from "@/data/constants";
import type { ToolEntry, ValidationErrors, PlanOption } from "@/types/audit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, DollarSign, Users } from "lucide-react";

interface ToolCardProps {
  entry: ToolEntry;
  index: number;
  errors: ValidationErrors["tools"][string];
  onUpdate: (
    instanceId: string,
    field: keyof Omit<ToolEntry, "instanceId" | "toolId">,
    value: string
  ) => void;
  onRemove: (instanceId: string) => void;
}

export function ToolCard({
  entry,
  index,
  errors = {},
  onUpdate,
  onRemove,
}: ToolCardProps) {
  const tool = AI_TOOL_MAP[entry.toolId];
  if (!tool) return null;

  return (
    <div
      id={`tool-card-${entry.instanceId}`}
      className="relative rounded-xl border border-border bg-card p-5 space-y-4 card-glow group"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-xl" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
              tool.color
            )}
          >
            {tool.emoji}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{tool.name}</p>
            <p className="text-xs text-muted-foreground">
              Tool #{index + 1}
            </p>
          </div>
        </div>
        <button
          type="button"
          id={`remove-tool-${entry.instanceId}`}
          onClick={() => onRemove(entry.instanceId)}
          aria-label={`Remove ${tool.name}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Plan */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`plan-${entry.instanceId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            Plan
          </Label>
          <Select
            value={entry.plan}
            onValueChange={(val) => onUpdate(entry.instanceId, "plan", val as string)}
          >
            <SelectTrigger
              id={`plan-${entry.instanceId}`}
              className={cn(
                "w-full h-9 text-sm",
                errors.plan && "border-destructive ring-1 ring-destructive/30"
              )}
              aria-invalid={!!errors.plan}
              aria-describedby={errors.plan ? `plan-error-${entry.instanceId}` : undefined}
            >
              <SelectValue placeholder="Select plan…">
                {tool.plans.find((p: PlanOption) => p.value === entry.plan)?.label ?? "Select plan…"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tool.plans.map((plan) => (
                <SelectItem key={plan.value} value={plan.value}>
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.plan && (
            <p
              id={`plan-error-${entry.instanceId}`}
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.plan}
            </p>
          )}
        </div>

        {/* Monthly Spend */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`spend-${entry.instanceId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            Monthly Spend
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id={`spend-${entry.instanceId}`}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={entry.monthlySpend}
              onChange={(e) =>
                onUpdate(entry.instanceId, "monthlySpend", e.target.value)
              }
              aria-invalid={!!errors.monthlySpend}
              aria-describedby={
                errors.monthlySpend
                  ? `spend-error-${entry.instanceId}`
                  : undefined
              }
              className={cn(
                "w-full h-9 rounded-lg border bg-transparent pl-7 pr-3 text-sm text-foreground outline-none transition-colors",
                "placeholder:text-muted-foreground/50",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.monthlySpend
                  ? "border-destructive ring-1 ring-destructive/30"
                  : "border-input hover:border-border/80"
              )}
            />
          </div>
          {errors.monthlySpend && (
            <p
              id={`spend-error-${entry.instanceId}`}
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.monthlySpend}
            </p>
          )}
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label
            htmlFor={`seats-${entry.instanceId}`}
            className="text-xs font-medium text-muted-foreground"
          >
            Seats / Users
          </Label>
          <div className="relative">
            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              id={`seats-${entry.instanceId}`}
              type="number"
              min="1"
              step="1"
              placeholder="1"
              value={entry.seats}
              onChange={(e) =>
                onUpdate(entry.instanceId, "seats", e.target.value)
              }
              aria-invalid={!!errors.seats}
              aria-describedby={
                errors.seats ? `seats-error-${entry.instanceId}` : undefined
              }
              className={cn(
                "w-full h-9 rounded-lg border bg-transparent pl-7 pr-3 text-sm text-foreground outline-none transition-colors",
                "placeholder:text-muted-foreground/50",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.seats
                  ? "border-destructive ring-1 ring-destructive/30"
                  : "border-input hover:border-border/80"
              )}
            />
          </div>
          {errors.seats && (
            <p
              id={`seats-error-${entry.instanceId}`}
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.seats}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


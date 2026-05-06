"use client";

import { cn } from "@/lib/utils";
import { AI_TOOLS } from "@/data/constants";
import type { ToolId, ToolEntry } from "@/types/audit";
import { Check, Plus } from "lucide-react";

interface ToolSelectorProps {
  selectedTools: ToolEntry[];
  onAdd: (toolId: ToolId) => void;
}

export function ToolSelector({ selectedTools, onAdd }: ToolSelectorProps) {
  const selectedIds = selectedTools.map((t) => t.toolId);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground mb-1">
          Which AI tools does your team use?
        </h2>
        <p className="text-xs text-muted-foreground">
          Select all that apply. You can add a tool multiple times for different
          teams or cost centers.
        </p>
      </div>

      <div
        role="group"
        aria-label="AI tool selection"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {AI_TOOLS.map((tool) => {
          const isSelected = selectedIds.includes(tool.id);
          return (
            <button
              key={tool.id}
              id={`tool-select-${tool.id}`}
              type="button"
              onClick={() => onAdd(tool.id)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-150 outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                isSelected
                  ? "border-primary/50 bg-primary/8 shadow-[0_0_0_1px_oklch(0.72_0.2_264/20%)]"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/60"
              )}
            >
              {/* Selected badge */}
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full gradient-brand flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}

              {/* Icon */}
              <span
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0",
                  tool.color
                )}
              >
                {tool.emoji}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-tight">
                  {tool.name}
                </p>
                {!isSelected && (
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 flex items-center gap-0.5">
                    <Plus className="w-2.5 h-2.5" />
                    Add
                  </p>
                )}
                {isSelected && (
                  <p className="text-[10px] text-primary/80 mt-0.5">
                    {selectedIds.filter((id) => id === tool.id).length} added ·
                    click to add more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


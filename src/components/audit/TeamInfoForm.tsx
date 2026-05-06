"use client";

import { cn } from "@/lib/utils";
import { TEAM_SIZE_OPTIONS, USE_CASE_OPTIONS } from "@/data/constants";
import type { TeamInfo, ValidationErrors, UseCase } from "@/types/audit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users2 } from "lucide-react";

interface TeamInfoFormProps {
  teamInfo: TeamInfo;
  errors: ValidationErrors["teamInfo"];
  onUpdate: <K extends keyof TeamInfo>(field: K, value: TeamInfo[K]) => void;
}

export function TeamInfoForm({ teamInfo, errors, onUpdate }: TeamInfoFormProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-5 card-glow">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users2 className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Team Information
          </h2>
          <p className="text-xs text-muted-foreground">
            Help us tailor your recommendations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Team size */}
        <div className="space-y-1.5">
          <Label
            htmlFor="team-size"
            className="text-xs font-medium text-muted-foreground"
          >
            Team Size <span className="text-destructive ml-0.5">*</span>
          </Label>
          <Select
            value={teamInfo.teamSize}
            onValueChange={(val) => onUpdate("teamSize", val as string)}
          >
            <SelectTrigger
              id="team-size"
              className={cn(
                "w-full h-9 text-sm",
                errors.teamSize &&
                  "border-destructive ring-1 ring-destructive/30"
              )}
              aria-invalid={!!errors.teamSize}
              aria-describedby={errors.teamSize ? "team-size-error" : undefined}
            >
              <SelectValue placeholder="How big is your team?">
                {TEAM_SIZE_OPTIONS.find((o) => o.value === teamInfo.teamSize)?.label ?? "How big is your team?"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teamSize && (
            <p
              id="team-size-error"
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.teamSize}
            </p>
          )}
        </div>

        {/* Primary use case */}
        <div className="space-y-1.5">
          <Label
            htmlFor="use-case"
            className="text-xs font-medium text-muted-foreground"
          >
            Primary Use Case <span className="text-destructive ml-0.5">*</span>
          </Label>
          <Select
            value={teamInfo.useCase}
            onValueChange={(val) => onUpdate("useCase", val as UseCase)}
          >
            <SelectTrigger
              id="use-case"
              className={cn(
                "w-full h-9 text-sm",
                errors.useCase &&
                  "border-destructive ring-1 ring-destructive/30"
              )}
              aria-invalid={!!errors.useCase}
              aria-describedby={errors.useCase ? "use-case-error" : undefined}
            >
              <SelectValue placeholder="How does your team use AI?">
                {USE_CASE_OPTIONS.find((o) => o.value === teamInfo.useCase)?.label ?? "How does your team use AI?"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {USE_CASE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.useCase && (
            <p
              id="use-case-error"
              role="alert"
              className="text-[11px] text-destructive"
            >
              {errors.useCase}
            </p>
          )}
        </div>
      </div>

      {/* Use case description cards */}
      {teamInfo.useCase && (
        <div className="pt-1">
          {USE_CASE_OPTIONS.filter((o) => o.value === teamInfo.useCase).map((opt) => (
            <p key={opt.value} className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
              <span className="font-medium text-foreground">{opt.label}:</span>{" "}
              {opt.description}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}


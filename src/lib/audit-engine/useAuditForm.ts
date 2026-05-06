"use client";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import type {
  AuditFormState,
  ToolEntry,
  TeamInfo,
  ValidationErrors,
  ToolId,
} from "@/types/audit";
import { STORAGE_KEY, AI_TOOLS } from "@/data/constants";
import { runAuditEngine } from "@/lib/audit-engine";
import { saveReport } from "./reports";

const DEFAULT_STATE: AuditFormState = {
  tools: [],
  teamInfo: {
    teamSize: "",
    useCase: "",
  },
};

function loadFromStorage(): AuditFormState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as AuditFormState;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: AuditFormState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage not available – silently ignore
  }
}

function validateForm(state: AuditFormState): ValidationErrors {
  const errors: ValidationErrors = { tools: {}, teamInfo: {} };

  state.tools.forEach((entry) => {
    const toolErrors: ValidationErrors["tools"][string] = {};
    if (!entry.plan) toolErrors.plan = "Please select a plan";
    if (entry.monthlySpend === "") {
      toolErrors.monthlySpend = "Enter your monthly spend";
    } else if (isNaN(Number(entry.monthlySpend)) || Number(entry.monthlySpend) < 0) {
      toolErrors.monthlySpend = "Enter a valid amount";
    }
    if (entry.seats === "") {
      toolErrors.seats = "Enter number of seats";
    } else if (!Number.isInteger(Number(entry.seats)) || Number(entry.seats) < 1) {
      toolErrors.seats = "Enter a valid number";
    }
    if (Object.keys(toolErrors).length > 0) {
      errors.tools[entry.instanceId] = toolErrors;
    }
  });

  if (!state.teamInfo.teamSize) errors.teamInfo.teamSize = "Please select team size";
  if (!state.teamInfo.useCase) errors.teamInfo.useCase = "Please select a use case";

  return errors;
}

function hasErrors(errors: ValidationErrors): boolean {
  return (
    Object.keys(errors.tools).length > 0 ||
    Object.keys(errors.teamInfo).length > 0
  );
}

export function useAuditForm() {
  const [state, setState] = useState<AuditFormState>(DEFAULT_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({ tools: {}, teamInfo: {} });
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setState(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage on every state change (after hydration)
  useEffect(() => {
    if (hydrated) saveToStorage(state);
  }, [state, hydrated]);

  // ── Tool helpers ──────────────────────────────────────────

  const addTool = useCallback((toolId: ToolId) => {
    const toolConfig = AI_TOOLS.find((t) => t.id === toolId);
    if (!toolConfig) return;
    const entry: ToolEntry = {
      instanceId: nanoid(8),
      toolId,
      plan: toolConfig.plans[0]?.value ?? "",
      monthlySpend: "",
      seats: "1",
    };
    setState((prev) => ({ ...prev, tools: [...prev.tools, entry] }));
  }, []);

  const removeTool = useCallback((instanceId: string) => {
    setState((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.instanceId !== instanceId),
    }));
    setErrors((prev) => {
      const next = { ...prev.tools };
      delete next[instanceId];
      return { ...prev, tools: next };
    });
  }, []);

  const updateTool = useCallback(
    (instanceId: string, field: keyof Omit<ToolEntry, "instanceId" | "toolId">, value: string) => {
      setState((prev) => ({
        ...prev,
        tools: prev.tools.map((t) =>
          t.instanceId === instanceId ? { ...t, [field]: value } : t
        ),
      }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev.tools[instanceId]) return prev;
        const next = { ...prev.tools[instanceId] };
        delete next[field];
        return { ...prev, tools: { ...prev.tools, [instanceId]: next } };
      });
    },
    []
  );

  // ── Team info helpers ─────────────────────────────────────

  const updateTeamInfo = useCallback(
    <K extends keyof TeamInfo>(field: K, value: TeamInfo[K]) => {
      setState((prev) => ({
        ...prev,
        teamInfo: { ...prev.teamInfo, [field]: value },
      }));
      setErrors((prev) => {
        const next = { ...prev.teamInfo };
        delete next[field];
        return { ...prev, teamInfo: next };
      });
    },
    []
  );

  // ── Computed values ────────────────────────────────────────

  const totalMonthlySpend = state.tools.reduce((sum, t) => {
    const spend = parseFloat(t.monthlySpend);
    return sum + (isNaN(spend) ? 0 : spend);
  }, 0);

  const totalSeats = state.tools.reduce((sum, t) => {
    const seats = parseInt(t.seats, 10);
    return sum + (isNaN(seats) ? 0 : seats);
  }, 0);

  // ── Submit ────────────────────────────────────────────────

  const handleSubmit = useCallback((): string | false => {
    const validation = validateForm(state);
    setErrors(validation);
    setSubmitted(true);
    if (!hasErrors(validation)) {
      const result = runAuditEngine(state);
      if (!result) return false;
      const id = saveReport(state, result);
      return id;
    }
    return false;
  }, [state]);

  const resetForm = useCallback(() => {
    setState(DEFAULT_STATE);
    setErrors({ tools: {}, teamInfo: {} });
    setSubmitted(false);
    saveToStorage(DEFAULT_STATE);
  }, []);

  return {
    state,
    errors,
    submitted,
    hydrated,
    totalMonthlySpend,
    totalSeats,
    addTool,
    removeTool,
    updateTool,
    updateTeamInfo,
    handleSubmit,
    resetForm,
  };
}


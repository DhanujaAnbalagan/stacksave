/**
 * Report persistence layer.
 * All reports live in localStorage under REPORTS_STORAGE_KEY.
 */
import { nanoid } from "nanoid";
import type { AuditFormState, AuditResult } from "@/types/audit";

export const REPORTS_STORAGE_KEY = "stacksave-reports";

export interface SavedReport {
  id: string;
  createdAt: string;
  formState: AuditFormState;
  result: AuditResult;
}

type ReportsMap = Record<string, SavedReport>;

function loadReports(): ReportsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReportsMap) : {};
  } catch {
    return {};
  }
}

function saveReports(reports: ReportsMap) {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // localStorage unavailable – silently ignore
  }
}

/**
 * Persist a completed audit and return its unique ID.
 * At most 20 reports are kept; oldest is pruned first.
 */
export function saveReport(formState: AuditFormState, result: AuditResult): string {
  const id = nanoid(10);
  const report: SavedReport = {
    id,
    createdAt: new Date().toISOString(),
    formState,
    result: { ...result, generatedAt: new Date().toISOString() },
  };

  const reports = loadReports();
  reports[id] = report;

  // Prune to 20 most recent
  const entries = Object.values(reports).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const pruned: ReportsMap = {};
  entries.slice(0, 20).forEach((r) => { pruned[r.id] = r; });

  saveReports(pruned);
  return id;
}

/** Load a single report by ID. Returns null if not found. */
export function loadReport(id: string): SavedReport | null {
  const reports = loadReports();
  return reports[id] ?? null;
}

/** List all saved reports, newest first. */
export function listReports(): SavedReport[] {
  const reports = loadReports();
  return Object.values(reports).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Delete a report by ID. */
export function deleteReport(id: string) {
  const reports = loadReports();
  delete reports[id];
  saveReports(reports);
}


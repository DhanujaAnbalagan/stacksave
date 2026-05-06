/**
 * Shared formatting and validation utilities.
 * Pure functions — no React, no side effects.
 */

/** Format a number as a USD dollar amount with no cents (e.g. $1,234) */
export function formatDollars(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

/** Format a number as a dollar amount per month (e.g. $1,234/mo) */
export function formatDollarsPerMonth(value: number): string {
  return `${formatDollars(value)}/mo`;
}

/** Format a number as a dollar amount per year (e.g. $14,808/yr) */
export function formatDollarsPerYear(value: number): string {
  return `${formatDollars(value)}/yr`;
}

/** Parse a user-entered spend string into a non-negative number. Returns 0 on invalid input. */
export function parseSpendInput(raw: string): number {
  const n = parseFloat(raw);
  return isNaN(n) || n < 0 ? 0 : n;
}

/** Parse a user-entered seats string into a positive integer. Returns 1 on invalid input. */
export function parseSeatsInput(raw: string): number {
  const n = parseInt(raw, 10);
  return isNaN(n) || n < 1 ? 1 : n;
}

/** Map a teamSize string like "6-15" to a representative upper-bound number. */
export function teamSizeToNumber(teamSize: string): number {
  const map: Record<string, number> = {
    "1": 1,
    "2-5": 5,
    "6-15": 15,
    "16-50": 50,
    "51-200": 200,
  };
  return map[teamSize] ?? 999;
}

/** Returns true if an email address is plausibly valid (basic format check). */
export function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".") && email.length > 5;
}

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format a savings percentage as a string (e.g. "42%") */
export function formatPercent(value: number): string {
  return `${Math.round(clamp(value, 0, 100))}%`;
}

/** Convert an ISO date string to a human-readable format (e.g. "May 10, 2026") */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}


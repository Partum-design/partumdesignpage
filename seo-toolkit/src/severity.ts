import type { Severity } from "./types.js";

export const SEVERITY_ORDER: Severity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "opportunity",
];

export function compareSeverity(a: Severity, b: Severity): number {
  return SEVERITY_ORDER.indexOf(a) - SEVERITY_ORDER.indexOf(b);
}

/**
 * Rough heuristic combining impact/scope/confidence into a severity band.
 * Human judgement in the audit skills should override this when context demands.
 */
export function estimateSeverity(params: {
  impact: 1 | 2 | 3 | 4 | 5;
  scope: 1 | 2 | 3 | 4 | 5;
  confidence: 1 | 2 | 3 | 4 | 5;
}): Severity {
  const score =
    params.impact * 0.5 + params.scope * 0.3 + params.confidence * 0.2;
  if (score >= 4.2) return "critical";
  if (score >= 3.2) return "high";
  if (score >= 2.2) return "medium";
  if (score >= 1.2) return "low";
  return "opportunity";
}

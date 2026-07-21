export type Severity = "critical" | "high" | "medium" | "low" | "opportunity";

export type EvidenceCategory =
  | "confirmed"
  | "hypothesis"
  | "recommendation"
  | "unavailable";

export interface Finding {
  url: string;
  date: string;
  tool: string;
  category: EvidenceCategory;
  evidence: string;
  impact: string;
  severity: Severity;
  fix: string;
  validationMethod: string;
}

export interface CrawledPage {
  url: string;
  statusCode: number;
  redirectedTo?: string;
  depth: number;
  contentType?: string;
  discoveredFrom?: string;
  inSitemap: boolean;
}

export interface PageMetadata {
  url: string;
  title?: string;
  metaDescription?: string;
  h1: string[];
  h2: string[];
  h3: string[];
  canonical?: string;
  robotsMeta?: string;
  xRobotsTag?: string;
  wordCount: number;
  images: { src: string; alt: string | null }[];
  internalLinks: string[];
  externalLinks: string[];
}

export interface JsonLdBlock {
  url: string;
  raw: string;
  parsed: unknown;
  valid: boolean;
  errors: string[];
  types: string[];
}

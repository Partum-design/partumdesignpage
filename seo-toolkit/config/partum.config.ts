import "dotenv/config";

export interface CrawlConfig {
  startUrl: string;
  maxPages: number;
  maxDepth: number;
  concurrency: number;
  delayMs: number;
  userAgent: string;
  outputDir: string;
  includeSubdomains: boolean;
  excludePatterns: string[];
  device: "mobile" | "desktop";
}

/**
 * Central config. Override any field via env vars or by editing this file directly —
 * never hardcode secrets here, those live in .env (gitignored).
 */
export const partumConfig: CrawlConfig = {
  startUrl: process.env.SITE_URL ?? "https://www.partumdesign.com.mx/",
  maxPages: Number(process.env.SEO_MAX_PAGES ?? 50),
  maxDepth: Number(process.env.SEO_MAX_DEPTH ?? 4),
  concurrency: Number(process.env.SEO_CONCURRENCY ?? 2),
  delayMs: Number(process.env.SEO_DELAY_MS ?? 500),
  userAgent:
    process.env.SEO_USER_AGENT ??
    "PartumSEOAuditBot/1.0 (+https://www.partumdesign.com.mx/; contacto: bryan.lopez@partumdesign.com.mx)",
  outputDir: process.env.SEO_OUTPUT_DIR ?? "output",
  includeSubdomains: process.env.SEO_INCLUDE_SUBDOMAINS === "true",
  excludePatterns: (process.env.SEO_EXCLUDE_PATTERNS ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean),
  device: (process.env.SEO_DEVICE as "mobile" | "desktop") ?? "mobile",
};

export const googleConfig = {
  searchConsoleSiteUrl:
    process.env.SEARCH_CONSOLE_SITE_URL ?? partumConfig.startUrl,
  ga4PropertyId: process.env.GA4_PROPERTY_ID ?? "",
  applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "",
  pagespeedApiKey: process.env.PAGESPEED_API_KEY ?? "",
  cruxApiKey: process.env.CRUX_API_KEY ?? "",
};

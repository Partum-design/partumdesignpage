import pLimit from "p-limit";
import * as cheerio from "cheerio";
import type { CrawlConfig } from "../config/partum.config.js";
import type { CrawledPage } from "./types.js";
import { isSameSite, normalizeUrl, sleep } from "./utils.js";

interface FetchResult {
  statusCode: number;
  contentType?: string;
  redirectedTo?: string;
  html?: string;
}

async function fetchPage(url: string, userAgent: string): Promise<FetchResult> {
  const res = await fetch(url, {
    headers: { "User-Agent": userAgent },
    redirect: "follow",
  });
  const contentType = res.headers.get("content-type") ?? undefined;
  const finalUrl = res.url !== url ? res.url : undefined;
  const html = contentType?.includes("text/html") ? await res.text() : undefined;
  return { statusCode: res.status, contentType, redirectedTo: finalUrl, html };
}

function extractLinks($: cheerio.CheerioAPI, pageUrl: string): string[] {
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const normalized = normalizeUrl(href, pageUrl);
    if (normalized) links.push(normalized);
  });
  return links;
}

/**
 * Breadth-first crawl bounded by maxPages/maxDepth/concurrency.
 * Read-only: GET requests only, no form submission, respects delayMs between requests per worker.
 */
export async function crawlSite(config: CrawlConfig): Promise<CrawledPage[]> {
  const limit = pLimit(config.concurrency);
  const visited = new Map<string, CrawledPage>();
  const queue: { url: string; depth: number; from?: string }[] = [
    { url: config.startUrl, depth: 0 },
  ];

  while (queue.length > 0 && visited.size < config.maxPages) {
    const batch = queue.splice(0, config.concurrency);
    await Promise.all(
      batch.map((item) =>
        limit(async () => {
          const normalized = normalizeUrl(item.url);
          if (!normalized || visited.has(normalized)) return;
          if (item.depth > config.maxDepth) return;
          if (!isSameSite(normalized, config.startUrl, config.includeSubdomains)) return;
          if (config.excludePatterns.some((p) => normalized.includes(p))) return;
          if (visited.size >= config.maxPages) return;

          try {
            const result = await fetchPage(normalized, config.userAgent);
            visited.set(normalized, {
              url: normalized,
              statusCode: result.statusCode,
              redirectedTo: result.redirectedTo,
              depth: item.depth,
              contentType: result.contentType,
              discoveredFrom: item.from,
              inSitemap: false,
            });

            if (result.html && item.depth < config.maxDepth) {
              const $ = cheerio.load(result.html);
              for (const link of extractLinks($, normalized)) {
                queue.push({ url: link, depth: item.depth + 1, from: normalized });
              }
            }
          } catch (err) {
            visited.set(normalized, {
              url: normalized,
              statusCode: 0,
              depth: item.depth,
              discoveredFrom: item.from,
              inSitemap: false,
            });
          }
          await sleep(config.delayMs);
        })
      )
    );
  }

  return Array.from(visited.values());
}

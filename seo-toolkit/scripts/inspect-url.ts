import "dotenv/config";
import * as cheerio from "cheerio";
import { partumConfig } from "../config/partum.config.js";
import type { PageMetadata } from "../src/types.js";
import { normalizeUrl, writeJson, nowIso } from "../src/utils.js";

/** Usage: tsx scripts/inspect-url.ts <url> */
async function inspectUrl(url: string): Promise<PageMetadata> {
  const res = await fetch(url, { headers: { "User-Agent": partumConfig.userAgent } });
  const html = await res.text();
  const $ = cheerio.load(html);

  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const normalized = href ? normalizeUrl(href, url) : null;
    if (!normalized) return;
    try {
      new URL(normalized).hostname === new URL(url).hostname
        ? internalLinks.push(normalized)
        : externalLinks.push(normalized);
    } catch {
      /* ignore malformed */
    }
  });

  return {
    url,
    title: $("title").first().text() || undefined,
    metaDescription: $('meta[name="description"]').attr("content"),
    h1: $("h1").map((_, el) => $(el).text().trim()).get(),
    h2: $("h2").map((_, el) => $(el).text().trim()).get(),
    h3: $("h3").map((_, el) => $(el).text().trim()).get(),
    canonical: $('link[rel="canonical"]').attr("href"),
    robotsMeta: $('meta[name="robots"]').attr("content"),
    xRobotsTag: res.headers.get("x-robots-tag") ?? undefined,
    wordCount: $("body").text().trim().split(/\s+/).filter(Boolean).length,
    images: $("img").map((_, el) => ({ src: $(el).attr("src") ?? "", alt: $(el).attr("alt") ?? null })).get(),
    internalLinks,
    externalLinks,
  };
}

async function main() {
  const url = process.argv[2] ?? partumConfig.startUrl;
  const result = await inspectUrl(url);
  console.log(JSON.stringify(result, null, 2));
  await writeJson(`${partumConfig.outputDir}/inspect-${nowIso().replace(/[:.]/g, "-")}.json`, result);
}

main();

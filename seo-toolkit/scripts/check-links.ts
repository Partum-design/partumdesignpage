import "dotenv/config";
import pLimit from "p-limit";
import { partumConfig } from "../config/partum.config.js";
import { crawlSite } from "../src/crawler.js";
import type { Finding } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso, sleep } from "../src/utils.js";

async function main() {
  const pages = await crawlSite(partumConfig);
  const limit = pLimit(partumConfig.concurrency);
  const findings: Finding[] = [];
  const seenUrls = new Set(pages.map((p) => p.url));

  const brokenChecks = pages
    .filter((p) => p.statusCode === 0 || p.statusCode >= 400)
    .map((page) =>
      limit(async () => {
        findings.push({
          url: page.url,
          date: nowIso(),
          tool: "check-links",
          category: "confirmed",
          evidence: page.statusCode === 0 ? "Error de red/timeout" : `HTTP ${page.statusCode}`,
          impact: "Enlace interno roto",
          severity: page.statusCode >= 500 || page.statusCode === 0 ? "high" : "medium",
          fix: "Corregir o eliminar el enlace de origen: " + (page.discoveredFrom ?? "desconocido"),
          validationMethod: "Recrawl tras el fix",
        });
        await sleep(partumConfig.delayMs);
      })
    );

  await Promise.all(brokenChecks);

  const orphaned = pages.filter((p) => p.depth > 0 && !p.discoveredFrom);
  for (const page of orphaned) {
    findings.push({
      url: page.url,
      date: nowIso(),
      tool: "check-links",
      category: "hypothesis",
      evidence: "URL presente sin enlace interno entrante detectado durante el crawl",
      impact: "Posible pagina huerfana, dificulta descubrimiento por crawlers",
      severity: "low",
      fix: "Agregar enlace interno desde pagina relevante o pilar",
      validationMethod: "Confirmar contra sitemap y Search Console (Paginas)",
    });
  }

  await saveFindings(partumConfig.outputDir, "check-links", findings);
  console.log(`URLs analizadas: ${pages.length}. Hallazgos de enlaces: ${findings.length}. Set total unicas: ${seenUrls.size}`);
}

main();

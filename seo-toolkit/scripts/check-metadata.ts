import "dotenv/config";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import { partumConfig } from "../config/partum.config.js";
import { crawlSite } from "../src/crawler.js";
import type { Finding, PageMetadata } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso, sleep } from "../src/utils.js";

async function extractMetadata(url: string): Promise<PageMetadata | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": partumConfig.userAgent } });
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
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
      internalLinks: [],
      externalLinks: [],
    };
  } catch {
    return null;
  }
}

async function main() {
  const pages = await crawlSite(partumConfig);
  const htmlPages = pages.filter((p) => p.statusCode === 200 && !p.redirectedTo);
  const limit = pLimit(partumConfig.concurrency);
  const findings: Finding[] = [];
  const titleMap = new Map<string, string[]>();

  await Promise.all(
    htmlPages.map((page) =>
      limit(async () => {
        const meta = await extractMetadata(page.url);
        await sleep(partumConfig.delayMs);
        if (!meta) return;

        if (!meta.title) {
          findings.push(mkFinding(page.url, "Sin <title>", "critical", "Agregar title unico y descriptivo"));
        } else {
          titleMap.set(meta.title, [...(titleMap.get(meta.title) ?? []), page.url]);
          if (meta.title.length > 60) {
            findings.push(mkFinding(page.url, `Title largo (${meta.title.length} caracteres)`, "low", "Acortar a <=60 caracteres"));
          }
        }
        if (!meta.metaDescription) {
          findings.push(mkFinding(page.url, "Sin meta description", "medium", "Agregar meta description de 120-158 caracteres"));
        } else if (meta.metaDescription.length > 160) {
          findings.push(mkFinding(page.url, `Meta description larga (${meta.metaDescription.length} caracteres)`, "low", "Acortar meta description"));
        }
        if (meta.h1.length === 0) {
          findings.push(mkFinding(page.url, "Sin H1", "high", "Agregar un H1 unico que resuma el contenido"));
        } else if (meta.h1.length > 1) {
          findings.push(mkFinding(page.url, `Multiples H1 (${meta.h1.length})`, "medium", "Dejar un solo H1 por pagina"));
        }
        const missingAlt = meta.images.filter((img) => !img.alt);
        if (missingAlt.length > 0) {
          findings.push(mkFinding(page.url, `${missingAlt.length} imagenes sin alt`, "medium", "Agregar alt descriptivo a cada imagen"));
        }
      })
    )
  );

  for (const [title, urls] of titleMap) {
    if (urls.length > 1) {
      findings.push({
        url: urls.join(" | "),
        date: nowIso(),
        tool: "check-metadata",
        category: "confirmed",
        evidence: `Title duplicado "${title}" en ${urls.length} URLs`,
        impact: "Posible canibalizacion y perdida de CTR/relevancia en SERP",
        severity: "high",
        fix: "Diferenciar titles por intencion de busqueda unica",
        validationMethod: "Revisar Search Console: consultas que compiten entre estas URLs",
      });
    }
  }

  await saveFindings(partumConfig.outputDir, "check-metadata", findings);
  console.log(`Paginas HTML analizadas: ${htmlPages.length}. Hallazgos: ${findings.length}`);
}

function mkFinding(url: string, evidence: string, severity: Finding["severity"], fix: string): Finding {
  return {
    url,
    date: nowIso(),
    tool: "check-metadata",
    category: "confirmed",
    evidence,
    impact: "Afecta relevancia y CTR en resultados de busqueda",
    severity,
    fix,
    validationMethod: "Re-inspeccionar HTML de la URL tras el cambio",
  };
}

main();

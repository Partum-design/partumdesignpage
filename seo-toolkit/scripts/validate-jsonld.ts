import "dotenv/config";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import { partumConfig } from "../config/partum.config.js";
import { crawlSite } from "../src/crawler.js";
import type { Finding, JsonLdBlock } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso, sleep, writeJson } from "../src/utils.js";

function extractTypes(parsed: unknown): string[] {
  const types: string[] = [];
  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const obj = node as Record<string, unknown>;
    if (typeof obj["@type"] === "string") types.push(obj["@type"]);
    if (Array.isArray(obj["@type"])) types.push(...(obj["@type"] as string[]));
    if (Array.isArray(obj["@graph"])) obj["@graph"].forEach(visit);
  };
  visit(parsed);
  return types;
}

async function main() {
  const pages = await crawlSite(partumConfig);
  const htmlPages = pages.filter((p) => p.statusCode === 200 && !p.redirectedTo);
  const limit = pLimit(partumConfig.concurrency);
  const findings: Finding[] = [];
  const blocks: JsonLdBlock[] = [];

  await Promise.all(
    htmlPages.map((page) =>
      limit(async () => {
        try {
          const res = await fetch(page.url, { headers: { "User-Agent": partumConfig.userAgent } });
          const html = await res.text();
          const $ = cheerio.load(html);
          const scripts = $('script[type="application/ld+json"]');

          if (scripts.length === 0) {
            findings.push({
              url: page.url,
              date: nowIso(),
              tool: "validate-jsonld",
              category: "recommendation",
              evidence: "Sin bloques JSON-LD detectados",
              impact: "Oportunidad perdida de rich results (Organization, LocalBusiness, WebPage, etc.)",
              severity: "opportunity",
              fix: "Agregar JSON-LD relevante segun el tipo de pagina",
              validationMethod: "Re-inspeccionar HTML tras agregar el schema",
            });
            return;
          }

          scripts.each((_, el) => {
            const raw = $(el).contents().text();
            let parsed: unknown;
            let valid = true;
            const errors: string[] = [];
            try {
              parsed = JSON.parse(raw);
            } catch (err) {
              valid = false;
              errors.push((err as Error).message);
              parsed = null;
            }
            const types = valid ? extractTypes(parsed) : [];
            blocks.push({ url: page.url, raw, parsed, valid, errors, types });

            if (!valid) {
              findings.push({
                url: page.url,
                date: nowIso(),
                tool: "validate-jsonld",
                category: "confirmed",
                evidence: `JSON-LD invalido: ${errors.join("; ")}`,
                impact: "Google puede ignorar completamente el bloque de datos estructurados",
                severity: "high",
                fix: "Corregir sintaxis JSON del bloque ld+json",
                validationMethod: "Reparsear el JSON tras el fix",
              });
            }
          });
          await sleep(partumConfig.delayMs);
        } catch (err) {
          findings.push({
            url: page.url,
            date: nowIso(),
            tool: "validate-jsonld",
            category: "unavailable",
            evidence: `No se pudo obtener/parsear la pagina: ${(err as Error).message}`,
            impact: "Desconocido",
            severity: "low",
            fix: "Reintentar analisis",
            validationMethod: "Reintentar fetch",
          });
        }
      })
    )
  );

  await writeJson(`${partumConfig.outputDir}/jsonld-blocks.json`, blocks);
  await saveFindings(partumConfig.outputDir, "validate-jsonld", findings);
  console.log(`Bloques JSON-LD encontrados: ${blocks.length}. Hallazgos: ${findings.length}`);
}

main();

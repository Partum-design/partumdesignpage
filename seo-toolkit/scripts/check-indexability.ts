import "dotenv/config";
import { partumConfig } from "../config/partum.config.js";
import { crawlSite } from "../src/crawler.js";
import type { Finding } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso } from "../src/utils.js";

const BLOCKING_TOKENS = ["noindex", "none"];

async function main() {
  const pages = await crawlSite(partumConfig);
  const findings: Finding[] = [];

  for (const page of pages) {
    if (page.statusCode >= 500) {
      findings.push({
        url: page.url,
        date: nowIso(),
        tool: "check-indexability",
        category: "confirmed",
        evidence: `HTTP ${page.statusCode}`,
        impact: "Pagina inaccesible para crawlers y usuarios",
        severity: "critical",
        fix: "Investigar error de servidor",
        validationMethod: "Repetir peticion HTTP tras el fix",
      });
      continue;
    }
    if (page.statusCode === 404) {
      findings.push({
        url: page.url,
        date: nowIso(),
        tool: "check-indexability",
        category: "confirmed",
        evidence: "HTTP 404",
        impact: "Enlace roto, posible perdida de equity de enlaces",
        severity: "medium",
        fix: "Redirigir 301 a URL vigente o eliminar enlace de origen",
        validationMethod: "Repetir peticion HTTP",
      });
    }
    if (page.redirectedTo) {
      findings.push({
        url: page.url,
        date: nowIso(),
        tool: "check-indexability",
        category: "confirmed",
        evidence: `Redirige a ${page.redirectedTo}`,
        impact: "Verificar si la redireccion es intencional (301 vs 302)",
        severity: "low",
        fix: "Confirmar codigo de redireccion correcto segun intencion",
        validationMethod: "Inspeccionar cabecera Location y codigo de estado",
      });
    }
  }

  await saveFindings(partumConfig.outputDir, "check-indexability", findings);
  console.log(`Hallazgos de indexabilidad: ${findings.length}`);
}

main();

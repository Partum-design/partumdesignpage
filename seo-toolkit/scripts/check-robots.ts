import "dotenv/config";
import robotsParser from "robots-parser";
import { partumConfig } from "../config/partum.config.js";
import type { Finding } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso } from "../src/utils.js";

async function main() {
  const robotsUrl = new URL("/robots.txt", partumConfig.startUrl).toString();
  const findings: Finding[] = [];

  const res = await fetch(robotsUrl, { headers: { "User-Agent": partumConfig.userAgent } }).catch(() => null);

  if (!res || !res.ok) {
    findings.push({
      url: robotsUrl,
      date: nowIso(),
      tool: "check-robots",
      category: "confirmed",
      evidence: `robots.txt no accesible (${res?.status ?? "sin respuesta"})`,
      impact: "Sin control explicito de crawl; comportamiento por defecto del bot",
      severity: "low",
      fix: "Publicar robots.txt explicito, aunque sea permisivo",
      validationMethod: "GET a /robots.txt debe responder 200",
    });
    await saveFindings(partumConfig.outputDir, "check-robots", findings);
    console.log(`robots.txt no accesible. Hallazgo registrado.`);
    return;
  }

  const body = await res.text();
  const robots = robotsParser(robotsUrl, body);

  const isHomeAllowed = robots.isAllowed(partumConfig.startUrl, partumConfig.userAgent);
  if (isHomeAllowed === false) {
    findings.push({
      url: partumConfig.startUrl,
      date: nowIso(),
      tool: "check-robots",
      category: "confirmed",
      evidence: "robots.txt bloquea explicitamente la URL de inicio",
      impact: "Bloqueo critico de indexacion del sitio completo",
      severity: "critical",
      fix: "Revisar reglas Disallow en robots.txt",
      validationMethod: "Repetir robotsParser.isAllowed tras el fix",
    });
  }

  const sitemapDeclared = robots.getSitemaps();
  if (sitemapDeclared.length === 0) {
    findings.push({
      url: robotsUrl,
      date: nowIso(),
      tool: "check-robots",
      category: "confirmed",
      evidence: "robots.txt no declara directiva Sitemap:",
      impact: "Crawlers no descubren el sitemap automaticamente desde robots.txt",
      severity: "low",
      fix: "Agregar linea Sitemap: <url completa del sitemap>",
      validationMethod: "Revisar contenido de robots.txt tras el fix",
    });
  }

  await saveFindings(partumConfig.outputDir, "check-robots", findings);
  console.log(`robots.txt analizado. Sitemaps declarados: ${sitemapDeclared.length}. Hallazgos: ${findings.length}`);
}

main();

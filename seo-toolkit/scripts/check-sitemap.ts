import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import { partumConfig } from "../config/partum.config.js";
import type { Finding } from "../src/types.js";
import { saveFindings } from "../src/reporter.js";
import { nowIso, writeJson } from "../src/utils.js";

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": partumConfig.userAgent } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function main() {
  const sitemapUrl = new URL("/sitemap.xml", partumConfig.startUrl).toString();
  const xml = await fetchText(sitemapUrl);
  const findings: Finding[] = [];

  if (!xml) {
    findings.push({
      url: sitemapUrl,
      date: nowIso(),
      tool: "check-sitemap",
      category: "confirmed",
      evidence: "sitemap.xml no accesible o inexistente en la ruta estandar",
      impact: "Los crawlers dependen mas del descubrimiento por enlaces, mas lento",
      severity: "medium",
      fix: "Publicar sitemap.xml y declararlo en robots.txt",
      validationMethod: "GET a /sitemap.xml debe responder 200 con XML valido",
    });
    await saveFindings(partumConfig.outputDir, "check-sitemap", findings);
    console.log("Sitemap no encontrado. Hallazgo registrado.");
    return;
  }

  const parser = new XMLParser({ ignoreAttributes: false });
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch (err) {
    findings.push({
      url: sitemapUrl,
      date: nowIso(),
      tool: "check-sitemap",
      category: "confirmed",
      evidence: `XML invalido: ${(err as Error).message}`,
      impact: "Search engines pueden rechazar el sitemap completo",
      severity: "high",
      fix: "Corregir sintaxis XML del sitemap",
      validationMethod: "Validar con parser XML tras el fix",
    });
    await saveFindings(partumConfig.outputDir, "check-sitemap", findings);
    return;
  }

  await writeJson(`${partumConfig.outputDir}/sitemap-raw.json`, parsed);

  const urlset = (parsed as any)?.urlset?.url;
  const urls: string[] = Array.isArray(urlset)
    ? urlset.map((u: any) => u.loc).filter(Boolean)
    : urlset?.loc
      ? [urlset.loc]
      : [];

  if (urls.length === 0) {
    findings.push({
      url: sitemapUrl,
      date: nowIso(),
      tool: "check-sitemap",
      category: "confirmed",
      evidence: "Sitemap valido pero sin entradas <url><loc>",
      impact: "No aporta URLs para descubrimiento",
      severity: "medium",
      fix: "Poblar el sitemap con URLs indexables",
      validationMethod: "Revisar conteo de entradas tras el fix",
    });
  } else {
    console.log(`Sitemap valido con ${urls.length} URLs.`);
  }

  await saveFindings(partumConfig.outputDir, "check-sitemap", findings);
}

main();

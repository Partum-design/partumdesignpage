import "dotenv/config";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { partumConfig } from "../config/partum.config.js";
import type { Finding } from "../src/types.js";
import { toMarkdownTable } from "../src/reporter.js";
import { nowIso } from "../src/utils.js";

async function loadFindingsFile(path: string): Promise<Finding[]> {
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.findings) ? parsed.findings : [];
  } catch {
    return [];
  }
}

async function main() {
  const dir = partumConfig.outputDir;
  const files = await readdir(dir).catch(() => [] as string[]);
  const findingFiles = files.filter((f) => f.endsWith(".json") && !f.includes("raw") && !f.includes("blocks") && !f.includes("summary"));

  const bySource: Record<string, Finding[]> = {};
  for (const file of findingFiles) {
    const findings = await loadFindingsFile(`${dir}/${file}`);
    if (findings.length > 0) bySource[file.replace(".json", "")] = findings;
  }

  const totalFindings = Object.values(bySource).flat();
  const bySeverity = totalFindings.reduce<Record<string, number>>((acc, f) => {
    acc[f.severity] = (acc[f.severity] ?? 0) + 1;
    return acc;
  }, {});

  let md = `# Reporte SEO — Partum Design\n\n`;
  md += `Generado: ${nowIso()}\n\n`;
  md += `Sitio: ${partumConfig.startUrl}\n\n`;
  md += `## Resumen por severidad\n\n`;
  md += Object.entries(bySeverity).map(([sev, count]) => `- ${sev}: ${count}`).join("\n") + "\n\n";

  for (const [source, findings] of Object.entries(bySource)) {
    md += `## ${source}\n\n`;
    md += toMarkdownTable(findings) + "\n\n";
  }

  if (totalFindings.length === 0) {
    md += `_No se encontraron archivos de hallazgos en ${dir}. Ejecuta primero los scripts de chequeo (npm run indexability, links, metadata, sitemap, robots, schema)._\n`;
  }

  await writeFile(`${dir}/report.md`, md, "utf-8");
  console.log(`Reporte generado: ${dir}/report.md (${totalFindings.length} hallazgos totales)`);
}

main();

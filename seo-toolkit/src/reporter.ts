import type { Finding } from "./types.js";
import { writeCsv, writeJson, nowIso } from "./utils.js";

export async function saveFindings(outputDir: string, name: string, findings: Finding[]): Promise<void> {
  await writeJson(`${outputDir}/${name}.json`, { generatedAt: nowIso(), findings });
  await writeCsv(`${outputDir}/${name}.csv`, findings as unknown as Record<string, unknown>[]);
}

export function toMarkdownTable(findings: Finding[]): string {
  if (findings.length === 0) return "_Sin hallazgos registrados._";
  const header = "| Severidad | URL | Hallazgo | Categoria | Solucion |\n|---|---|---|---|---|";
  const rows = findings.map(
    (f) => `| ${f.severity} | ${f.url} | ${f.evidence} | ${f.category} | ${f.fix} |`
  );
  return [header, ...rows].join("\n");
}

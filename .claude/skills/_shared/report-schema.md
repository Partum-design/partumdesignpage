# Esquema de reporte

Todas las Skills que generan hallazgos deben producir salidas consistentes en
tres formatos, guardados bajo `seo-toolkit/output/`.

## JSON

```json
{
  "generatedAt": "2026-07-15T00:00:00.000Z",
  "findings": [
    {
      "url": "https://www.partumdesign.com.mx/...",
      "date": "2026-07-15T00:00:00.000Z",
      "tool": "check-metadata",
      "category": "confirmed",
      "evidence": "...",
      "impact": "...",
      "severity": "high",
      "fix": "...",
      "validationMethod": "..."
    }
  ]
}
```

Ver tipos exactos en `seo-toolkit/src/types.ts` (`Finding`).

## CSV

Mismas columnas que el JSON (`url,date,tool,category,evidence,impact,severity,fix,validationMethod`),
una fila por hallazgo. Generado con `writeCsv` de `seo-toolkit/src/utils.ts`.

## Markdown

Tabla con columnas: Severidad | URL | Hallazgo | Categoria | Solucion — ver
`toMarkdownTable` en `seo-toolkit/src/reporter.ts`. El reporte consolidado final
vive en `seo-toolkit/output/report.md`, generado por `npm run report`.

## Convencion de nombres de archivo

`seo-toolkit/output/<nombre-del-check>.json` y `.csv` (ej. `check-metadata.json`,
`check-links.csv`). El orquestador no debe sobrescribir un archivo de un check
anterior salvo que sea una re-ejecucion intencional del mismo check.

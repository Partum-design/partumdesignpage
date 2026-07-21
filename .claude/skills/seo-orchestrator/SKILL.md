---
name: seo-orchestrator
description: Coordina una auditoria SEO completa de https://www.partumdesign.com.mx/ invocando las Skills especializadas, mantiene registro de hallazgos y consolida el reporte final. Usar cuando el usuario pida explicitamente "auditoria SEO integral", "auditoria completa" o invoque /seo-orchestrator. No usar para checks puntuales aislados (usar la Skill especifica directamente).
---

# seo-orchestrator

## 1. Proposito

Coordinar de punta a punta una auditoria SEO de `https://www.partumdesign.com.mx/`,
orquestando las Skills especializadas (`seo-site-crawler`, `seo-technical-audit`,
`seo-on-page`, etc.), evitando trabajo duplicado, y consolidando todos los
hallazgos en un reporte final coherente.

## 2. Cuando usarla

- El usuario pide una auditoria SEO integral/completa del sitio.
- El usuario invoca explicitamente `/seo-orchestrator`.
- Se necesita coordinar 3 o mas Skills SEO en la misma sesion de trabajo.

## 3. Cuando NO usarla

- El usuario solo quiere un chequeo puntual (ej. "revisa el JSON-LD de la home") —
  usar la Skill especifica (`seo-schema`) directamente, sin pasar por el
  orquestador.
- No se ha dado instruccion explicita de iniciar la auditoria (ver regla anti-
  autoarranque en la seccion 9).
- El usuario pide implementar cambios de codigo sin haber aprobado antes los
  hallazgos — eso es tarea de `seo-implementation`, y solo despues de aprobacion.

## 4. Entradas requeridas

- Confirmacion explicita del usuario para iniciar (ver seccion 9).
- URL objetivo (default `https://www.partumdesign.com.mx/`, tomar de
  `seo-toolkit/config/partum.config.ts`).
- Alcance deseado (todo el sitio vs. seccion especifica) si el usuario lo aclara.

## 5. Herramientas permitidas

- Bash (para correr scripts de `seo-toolkit/`).
- Read/Grep/Glob (para leer resultados en `seo-toolkit/output/`).
- Agent/Task tools para delegar fases a las Skills especializadas cuando el
  entorno lo soporte.
- Playwright MCP y Chrome DevTools MCP (via las Skills que los necesiten).
- Nunca Write/Edit sobre archivos de produccion del sitio (`*.html` en la raiz)
  durante esta fase — esa es tarea exclusiva de `seo-implementation` tras
  aprobacion.

## 6. Procedimiento ordenado

1. Confirmar con el usuario alcance y que la auditoria puede comenzar.
2. Verificar que el entorno este listo: `cd seo-toolkit && npm run doctor`.
3. Fase de descubrimiento: invocar `seo-site-crawler` (crawl + sitemap + robots).
4. Fase tecnica: invocar `seo-technical-audit` sobre las URLs descubiertas.
5. Fase de contenido: invocar `seo-on-page`, `seo-content-audit`,
   `seo-internal-linking` en paralelo si es posible (no se pisan entre si).
6. Fase de datos estructurados: invocar `seo-schema`.
7. Fase de rendimiento: invocar `seo-core-web-vitals`.
8. Fase de investigacion externa (solo si hay credenciales o el usuario lo pide
   explicitamente): `seo-keyword-research`, `seo-competitor-analysis`,
   `seo-local-mexico`, `seo-geo-aeo`.
9. Consolidar: correr `npm run report` dentro de `seo-toolkit/` y revisar
   `output/report.md`.
10. Presentar hallazgos al usuario, separados por severidad y categoria de
    evidencia, antes de proponer cualquier implementacion.

## 7. Evidencia que debe recopilar

- Un registro (`seo-toolkit/output/*.json`) por cada Skill invocada.
- Fecha y hora de cada fase.
- Que Skills se ejecutaron y cuales se omitieron (y por que).

## 8. Formato de salida

Reporte consolidado en Markdown (`seo-toolkit/output/report.md`) mas un resumen
conversacional que distinga:

- Hechos confirmados (con conteo por severidad).
- Hipotesis pendientes de validar.
- Recomendaciones estrategicas.
- Datos no disponibles (y que credencial se necesita para destrabarlos).

## 9. Reglas contra alucinaciones

- No declarar una fase "completa" si el script correspondiente fallo o no
  corrio.
- No mezclar hallazgos de distintas Skills sin atribuir la fuente (`tool`).
- No estimar metricas de negocio (trafico, conversiones, ingresos) sin datos
  reales de GA4/Search Console.
- **No iniciar una auditoria completa sin instruccion explicita del usuario en
  el turno actual.** Preparar el entorno no es lo mismo que ejecutar la
  auditoria.

## 10. Criterios de finalizacion

- Todas las fases planeadas se ejecutaron o se documentaron como omitidas con
  razon.
- `output/report.md` existe y refleja los hallazgos de todas las fases
  ejecutadas.
- El usuario recibio el resumen y los pendientes de acceso.

## 11. Validacion posterior

- Releer `output/report.md` y confirmar que cada hallazgo tiene los 8 campos de
  [[evidence-rules]].
- Confirmar que no hay hallazgos duplicados entre Skills (mismo `url` + mismo
  `evidence` de dos tools distintas debe fusionarse o anotarse como
  corroboracion cruzada).

## 12. Seguridad y limites

Ver [[security-rules]] completo. En particular: no deploy, no push sin
autorizacion, no modificar Search Console/GA4/DNS, no exceder los limites de
crawl configurados, no inventar datos de herramientas no conectadas.

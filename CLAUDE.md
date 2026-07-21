<!-- BEGIN PARTUM SEO TOOLKIT -->
## Entorno SEO (Partum Design)

Este proyecto tiene instalado un toolkit local de auditoria SEO
(`seo-toolkit/`) y 14 Skills especializadas en `.claude/skills/seo-*` para
auditar `https://www.partumdesign.com.mx/`.

Reglas que aplican siempre que se trabaje en tareas SEO:

- Usar las Skills SEO (`seo-orchestrator`, `seo-site-crawler`,
  `seo-technical-audit`, `seo-on-page`, `seo-keyword-research`,
  `seo-competitor-analysis`, `seo-content-audit`, `seo-internal-linking`,
  `seo-schema`, `seo-core-web-vitals`, `seo-local-mexico`, `seo-geo-aeo`,
  `seo-implementation`, `seo-validation`) cuando la tarea corresponda a su
  proposito.
- **No iniciar una auditoria SEO completa sin instruccion explicita del
  usuario en el turno actual.** Preparar/mantener el entorno no autoriza a
  ejecutarla.
- No modificar produccion (HTML del sitio, DNS, hosting, Vercel) sin
  aprobacion explicita; cambios reales pasan por `seo-implementation` en la
  rama `seo/audit-partumdesign`.
- Separar siempre hechos confirmados de hipotesis y recomendaciones
  estrategicas (ver `.claude/skills/_shared/evidence-rules.md`).
- Guardar toda evidencia de auditoria en `seo-toolkit/output/` (JSON/CSV/MD).
- Mexico es el mercado principal; Ciudad de Mexico es la prioridad local.
- Priorizar movil sobre escritorio en analisis de rendimiento y UX.
- Respetar los limites de crawling configurados en
  `seo-toolkit/config/partum.config.ts` (maxPages, maxDepth, concurrency,
  delayMs, user-agent).
- No inventar datos de herramientas externas (Search Console, GA4, PageSpeed,
  CrUX, DataForSEO, Semrush, Ahrefs) ni usar metricas simuladas — si no hay
  credenciales conectadas, el dato se reporta como "no disponible".
- No hacer deploy ni `git push` sin autorizacion explicita del usuario en ese
  momento.
- Mantener secretos (`seo-toolkit/.env`, `seo-toolkit/credentials/`) fuera del
  repositorio; ya estan en `.gitignore`.

Ver `SEO_SETUP.md` para el detalle completo de la instalacion, y
`.claude/skills/_shared/security-rules.md` para las reglas de seguridad
completas.
<!-- END PARTUM SEO TOOLKIT -->

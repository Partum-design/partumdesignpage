# Partum SEO Toolkit

Herramientas locales de auditoria SEO para `https://www.partumdesign.com.mx/`.
Solo lectura: crawling, inspeccion, Lighthouse y validaciones. No modifica el sitio,
no envia formularios, no inicia sesion.

## Instalacion

```bash
cd seo-toolkit
npm install
cp .env.example .env   # opcional, para credenciales
npm run typecheck
npm run doctor
```

## Scripts disponibles

| Comando | Que hace |
|---|---|
| `npm run doctor` | Verifica config, conectividad y credenciales presentes |
| `npm run crawl` | Crawl del sitio respetando maxPages/maxDepth/concurrency |
| `npm run inspect -- <url>` | Extrae metadata de una URL puntual |
| `npm run lighthouse -- <url> [mobile\|desktop]` | Corre Lighthouse local con Chromium |
| `npm run indexability` | Revisa status codes, redirecciones, errores 4xx/5xx |
| `npm run links` | Detecta enlaces rotos y paginas huerfanas |
| `npm run metadata` | Revisa title, meta description, H1, alt text, duplicados |
| `npm run sitemap` | Valida sitemap.xml |
| `npm run robots` | Valida robots.txt y directivas Disallow/Sitemap |
| `npm run schema` | Extrae y valida bloques JSON-LD |
| `npm run search-console` | Trae datos de Search Console (requiere credenciales) |
| `npm run analytics` | Trae datos de GA4 (requiere credenciales) |
| `npm run pagespeed -- <url> [mobile\|desktop]` | Consulta PageSpeed Insights API (requiere API key) |
| `npm run report` | Consolida todos los hallazgos de `output/*.json` en `output/report.md` |

Resultados se guardan en `output/` como JSON y CSV. Esa carpeta esta en `.gitignore`
salvo `.gitkeep`.

## Configuracion

Editar `config/partum.config.ts` o usar variables de entorno:

- `SITE_URL` — URL inicial (default: `https://www.partumdesign.com.mx/`)
- `SEO_MAX_PAGES`, `SEO_MAX_DEPTH`, `SEO_CONCURRENCY`, `SEO_DELAY_MS`
- `SEO_USER_AGENT`, `SEO_OUTPUT_DIR`, `SEO_DEVICE` (`mobile`/`desktop`)
- `SEO_INCLUDE_SUBDOMAINS` (`true`/`false`), `SEO_EXCLUDE_PATTERNS` (coma-separado)

## Conectar APIs externas (opcional)

La instalacion queda completa sin estas credenciales; simplemente los scripts
correspondientes reportaran el dato como "no disponible" en vez de fallar.

### Google Search Console API

1. Crear un proyecto en Google Cloud Console y habilitar "Search Console API".
2. Crear una cuenta de servicio (service account) y descargar el JSON de credenciales.
3. En Search Console, agregar el email de la cuenta de servicio como usuario
   (permiso de lectura) sobre la propiedad `https://www.partumdesign.com.mx/`.
4. Guardar el JSON en `seo-toolkit/credentials/` (ignorado por git) y apuntar
   `GOOGLE_APPLICATION_CREDENTIALS` a esa ruta en `.env`.

### Google Analytics 4 Data API

1. Habilitar "Google Analytics Data API" en el mismo proyecto de Cloud.
2. Agregar la misma cuenta de servicio como usuario "Viewer" en la propiedad GA4.
3. Definir `GA4_PROPERTY_ID` (numero de propiedad, no el Measurement ID) en `.env`.

### PageSpeed Insights API

1. Habilitar "PageSpeed Insights API" en Cloud Console.
2. Crear una API key restringida a esa API.
3. Definir `PAGESPEED_API_KEY` en `.env`.

### Chrome UX Report (CrUX) API

1. Habilitar "Chrome UX Report API" en Cloud Console.
2. Reusar o crear API key.
3. Definir `CRUX_API_KEY` en `.env`.

### DataForSEO / Semrush / Ahrefs (opcional)

Solo si el usuario decide contratarlas para keyword/backlink research. Definir
`DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`, `SEMRUSH_API_KEY` o `AHREFS_API_KEY`
en `.env`. Ningun script actual las requiere de forma obligatoria.

## Reglas de seguridad

Ver `.claude/skills/_shared/security-rules.md`. En resumen: sin secretos en git,
sin deploy, sin modificar Search Console/Analytics/DNS, sin enviar formularios
reales, sin generar datos simulados como si fueran reales.

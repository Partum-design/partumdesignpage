# SEO_SETUP.md — Entorno de auditoria SEO para Partum Design

Este documento describe el entorno preparado para auditar
`https://www.partumdesign.com.mx/`. **La auditoria completa NO se ha
ejecutado todavia** — este archivo documenta la instalacion/configuracion, no
resultados de auditoria.

## 1. Herramientas instaladas

- Node.js v24.17.0, npm 11.13.0 (ya presentes en el sistema, no se
  reinstalaron).
- Git 2.43.0, GitHub CLI (`gh`) 2.96.0 (ya presentes).
- curl 8.5.0, jq 1.7 (ya presentes).
- Chromium (via Playwright, `npx playwright install chromium`) — no hay
  Google Chrome ni Chromium de sistema instalados (requeriria `sudo apt` con
  contraseña); se opto por el Chromium administrado por Playwright, sin
  necesidad de privilegios de administrador.

## 2. Plugins instalados (Claude Code)

| Plugin | Version | Marketplace | Alcance | Estado |
|---|---|---|---|---|
| `playwright@claude-plugins-official` | (oficial, MCP `@playwright/mcp@latest`) | `claude-plugins-official` | project | Habilitado, MCP conectado |
| `chrome-devtools-mcp@chrome-devtools-plugins` | 1.6.0 | `chrome-devtools-plugins` (`ChromeDevTools/chrome-devtools-mcp`) | project | Habilitado, MCP conectado |
| `modern-web-guidance@googlechrome` | 0.0.176 | `googlechrome` (`GoogleChrome/modern-web-guidance`) | project | Habilitado (aporta 2 Skills, sin MCP propio) |

Marketplace oficial `anthropics/claude-plugins-official` ya estaba registrado
antes de esta sesion; se actualizo con `claude plugin marketplace update`.

## 3. MCP disponibles

- `plugin:playwright:playwright` — navegacion, screenshots, DOM, consola,
  requests, formularios (probado contra `https://example.com`).
- `plugin:chrome-devtools-mcp:chrome-devtools` — DOM, red, rendimiento,
  Core Web Vitals, emulacion movil (probado contra `https://example.com`).
- MCP de `claude.ai` ya presentes (Supabase, Google Drive, Gmail, Calendar,
  Vercel, Figma) no son parte de este setup SEO pero coexisten sin conflicto.

## 4. Skills creadas

En `.claude/skills/`:

`seo-orchestrator`, `seo-site-crawler`, `seo-technical-audit`, `seo-on-page`,
`seo-keyword-research`, `seo-competitor-analysis`, `seo-content-audit`,
`seo-internal-linking`, `seo-schema`, `seo-core-web-vitals`,
`seo-local-mexico`, `seo-geo-aeo`, `seo-implementation`, `seo-validation`.

Mas referencias compartidas en `.claude/skills/_shared/`: `partum-context.md`,
`evidence-rules.md`, `severity-model.md`, `report-schema.md`,
`security-rules.md`.

Cada `SKILL.md` tiene frontmatter valido (`name` coincide con el nombre de la
carpeta, `description` especifica) y las 12 secciones requeridas (proposito,
cuando usar/no usar, entradas, herramientas permitidas, procedimiento,
evidencia, formato de salida, reglas anti-alucinacion, criterios de
finalizacion, validacion posterior, seguridad).

## 5. Dependencias locales (`seo-toolkit/`)

Instaladas con `npm install` dentro de `seo-toolkit/` (619 paquetes,
`npm run typecheck` pasa sin errores):

- Runtime: `playwright`, `chrome-launcher`, `lighthouse`, `cheerio`,
  `fast-xml-parser`, `robots-parser`, `p-limit`, `zod`, `dotenv`,
  `googleapis`, `@google-analytics/data`, `ajv`.
- Dev: `typescript`, `tsx`, `@types/node`, `@lhci/cli`.

`npm audit` reporta 31 vulnerabilidades en dependencias transitivas (sobre
todo de `lighthouse`/`@lhci/cli`); no se corrio `npm audit fix --force` porque
implica cambios breaking no solicitados. Revisar si se decide actualizar mas
adelante.

## 6. Scripts disponibles

Ver tabla completa en `seo-toolkit/README.md`. Resumen: `doctor`, `crawl`,
`inspect`, `lighthouse`, `indexability`, `links`, `metadata`, `sitemap`,
`robots`, `schema`, `search-console`, `analytics`, `pagespeed`, `report`,
`typecheck`.

## 7. Comandos de verificacion

```bash
claude doctor
claude plugin marketplace list
claude plugin list --json
claude mcp list

cd seo-toolkit
npm run typecheck
npm run doctor
```

## 8. Variables pendientes (`seo-toolkit/.env.example`)

Ninguna tiene valor — deben completarse manualmente cuando el usuario decida
conectar cada API:

```
SITE_URL=https://www.partumdesign.com.mx/
SEARCH_CONSOLE_SITE_URL=https://www.partumdesign.com.mx/
GA4_PROPERTY_ID=
GOOGLE_APPLICATION_CREDENTIALS=
PAGESPEED_API_KEY=
CRUX_API_KEY=
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=
SEMRUSH_API_KEY=
AHREFS_API_KEY=
```

## 9. Como conectar Search Console

1. Crear proyecto en Google Cloud Console, habilitar "Search Console API".
2. Crear cuenta de servicio, descargar JSON de credenciales.
3. En Search Console, agregar el email de esa cuenta de servicio como usuario
   con permiso de lectura sobre `https://www.partumdesign.com.mx/`.
4. Guardar el JSON en `seo-toolkit/credentials/` (ya ignorado por git).
5. Apuntar `GOOGLE_APPLICATION_CREDENTIALS` a esa ruta en
   `seo-toolkit/.env`.
6. Ejecutar `npm run search-console` dentro de `seo-toolkit/`.

## 10. Como conectar GA4

1. Habilitar "Google Analytics Data API" en el mismo proyecto de Cloud.
2. Agregar la cuenta de servicio como "Viewer" en la propiedad GA4.
3. Definir `GA4_PROPERTY_ID` (numero de propiedad, no el Measurement ID) en
   `.env`.
4. Ejecutar `npm run analytics`.

## 11. Como ejecutar una auditoria (mas adelante, no ahora)

Comando maestro sugerido, solo cuando el usuario lo autorice explicitamente:

```
/seo-orchestrator Realiza una auditoria SEO integral de https://www.partumdesign.com.mx/ utilizando evidencia real. No modifiques el sitio ni el repositorio. Guarda todos los resultados en seo-toolkit/output/.
```

## 12. Como validar el entorno

```bash
cd seo-toolkit
npm run doctor          # config, conectividad, credenciales presentes
npm run typecheck       # sin errores de TypeScript
npx tsx scripts/lighthouse.ts https://example.com desktop   # prueba Lighthouse
```

`claude mcp list` debe mostrar `plugin:playwright:playwright` y
`plugin:chrome-devtools-mcp:chrome-devtools` como `Connected`.

## 13. Como desinstalar cada herramienta

```bash
# Plugins
claude plugin uninstall playwright@claude-plugins-official
claude plugin uninstall chrome-devtools-mcp@chrome-devtools-plugins
claude plugin uninstall modern-web-guidance@googlechrome

# Marketplaces (solo si ya no se usan sus plugins)
claude plugin marketplace remove chrome-devtools-plugins
claude plugin marketplace remove googlechrome

# Toolkit local
rm -rf seo-toolkit/node_modules
# (seo-toolkit/ completo se puede borrar si ya no se necesita el toolkit)

# Chromium de Playwright
rm -rf ~/.cache/ms-playwright
```

Ninguno de estos comandos se ejecuto en esta sesion — solo se documentan para
referencia futura.

## 14. Problemas conocidos

- **No hay Chrome/Chromium de sistema.** `chrome-launcher` (usado por
  `lighthouse.ts`) no lo detecta automaticamente. Solucion aplicada: el script
  `seo-toolkit/scripts/lighthouse.ts` ahora setea `process.env.CHROME_PATH`
  usando `chromium.executablePath()` de Playwright si no esta ya definido, asi
  que funciona sin configuracion manual. Verificado contra
  `https://example.com` (desktop).
- **`npx playwright install --with-deps` falla sin sudo interactivo.** Se usa
  el binario de Chromium sin las dependencias de sistema opcionales; funciono
  igual en las pruebas realizadas. Si aparecen errores de librerias faltantes
  al usar Playwright/Chrome DevTools MCP en el futuro, sera necesario ejecutar
  manualmente (con contraseña) el equivalente a
  `sudo npx playwright install-deps`.
- **31 vulnerabilidades npm** en dependencias transitivas de
  `lighthouse`/`@lhci/cli` — no bloquean el uso del toolkit; revisar con
  `npm audit` si se quiere mitigar mas adelante.

## Reglas de seguridad

Ver `.claude/skills/_shared/security-rules.md`. Resumen: sin secretos en git,
sin envio de formularios reales, sin compras, sin cambios a
DNS/hosting/Search Console/Analytics, sin deploy, sin borrar contenido, sin
reseñas falsas, respetando siempre `robots.txt` y los limites de crawl
configurados.

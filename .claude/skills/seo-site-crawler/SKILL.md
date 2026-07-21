---
name: seo-site-crawler
description: Descubre URLs de https://www.partumdesign.com.mx/ via sitemap, robots.txt y enlaces internos, registra codigos HTTP, redirecciones, paginas huerfanas, duplicadas y con parametros. Usar como primera fase de cualquier auditoria SEO o cuando el usuario pida "mapea el sitio" o "que URLs tiene el sitio". No usar para analizar contenido o metadata de cada pagina (eso es seo-on-page).
---

# seo-site-crawler

## 1. Proposito

Construir el inventario real de URLs del sitio (a diferencia de asumir una
estructura), cruzando sitemap.xml, robots.txt y el grafo de enlaces internos
descubierto por crawl.

## 2. Cuando usarla

- Fase de descubrimiento de `seo-orchestrator`.
- El usuario pregunta cuantas paginas tiene el sitio o pide un mapa de URLs.
- Se necesita una lista actualizada de URLs antes de correr `seo-on-page`,
  `seo-technical-audit` o `seo-internal-linking`.

## 3. Cuando NO usarla

- Ya existe un `seo-toolkit/output/crawl.json` reciente (misma sesion, mismo
  alcance) — reusar ese resultado en vez de recrawlear.
- El usuario pide analizar una sola URL puntual — usar `npm run inspect --
  <url>` directamente, no un crawl completo.

## 4. Entradas requeridas

- `startUrl` (default `https://www.partumdesign.com.mx/` desde
  `seo-toolkit/config/partum.config.ts`).
- Limites de crawl activos (`maxPages`, `maxDepth`, `concurrency`, `delayMs`).

## 5. Herramientas permitidas

- Bash: `cd seo-toolkit && npm run crawl`, `npm run sitemap`, `npm run robots`.
- Read sobre `seo-toolkit/output/crawl.json`, `sitemap-raw.json`,
  `check-sitemap.json`, `check-robots.json`.
- Playwright MCP solo si una URL requiere renderizado JS para descubrir enlaces
  que el crawler basado en `fetch`+cheerio no puede ver (SPA, contenido
  inyectado por JS).

## 6. Procedimiento ordenado

1. `npm run robots` — obtener reglas Disallow y sitemaps declarados.
2. `npm run sitemap` — parsear sitemap.xml y extraer todas las `<loc>`.
3. `npm run crawl` — crawl BFS desde `startUrl` respetando limites.
4. Cruzar el set de URLs del sitemap contra el set de URLs efectivamente
   crawleadas:
   - En sitemap pero no alcanzada por crawl → posible pagina huerfana o sitemap
     desactualizado.
   - Alcanzada por crawl pero no en sitemap → evaluar si deberia estar
     incluida.
5. Detectar duplicados: mismo contenido/URL con y sin parametros, con y sin
   slash final, http vs https, con y sin www.
6. Registrar cada redireccion detectada (`redirectedTo` en `CrawledPage`) y su
   codigo (asumir 301/302 segun lo que exponga `fetch`; anotar como
   "verificar codigo exacto con curl -I" si se necesita precision de cabecera).

## 7. Evidencia que debe recopilar

- `seo-toolkit/output/crawl.json` / `.csv` — inventario completo con
  `statusCode`, `depth`, `discoveredFrom`, `redirectedTo`.
- `seo-toolkit/output/check-sitemap.json`.
- `seo-toolkit/output/check-robots.json`.
- Lista explicita de discrepancias sitemap vs. crawl.

## 8. Formato de salida

Resumen con: total de URLs descubiertas, cuantas en sitemap, cuantas
huerfanas/discrepantes, distribucion de status codes, lista de redirecciones y
de parametros detectados. Adjuntar rutas de los archivos JSON/CSV generados.

## 9. Reglas contra alucinaciones

- Solo reportar como "huerfana" una URL si realmente no aparecio con
  `discoveredFrom` en el crawl Y no fue semilla (`depth: 0`) — no asumir
  orfandad sin verificar ambas fuentes.
- No reportar un status code que no fue observado por el script.
- Si el crawl se detuvo por `maxPages`, decirlo explicitamente (el inventario es
  parcial, no el sitio completo).

## 10. Criterios de finalizacion

- `crawl.json`, `check-sitemap.json` y `check-robots.json` existen y son del
  mismo run (timestamps cercanos).
- El cruce sitemap-vs-crawl esta documentado con al menos las categorias de la
  seccion 6.

## 11. Validacion posterior

- Confirmar que `npm run typecheck` en `seo-toolkit/` sigue pasando si se tocó
  algun script.
- Re-ejecutar el crawl si cambio `maxPages`/`maxDepth` y el usuario pide mayor
  cobertura, documentando la diferencia contra el run anterior.

## 12. Seguridad y limites

Ver [[security-rules]]. Respetar `delayMs` y `concurrency` configurados; nunca
aumentar la agresividad del crawler sin que el usuario lo pida explicitamente.
No seguir enlaces salientes a dominios externos mas alla de registrarlos como
`externalLinks`.

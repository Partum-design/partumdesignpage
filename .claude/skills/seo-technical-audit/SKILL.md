---
name: seo-technical-audit
description: Revisa indexabilidad tecnica del sitio partumdesign.com.mx -- canonicals, robots meta, X-Robots-Tag, HTTP/HTTPS, www vs no-www, redirecciones, 404, 5xx, soft 404, renderizado JS, recursos bloqueados y paginacion. Usar tras seo-site-crawler cuando se necesite diagnosticar problemas tecnicos de rastreo/indexacion. No usar para evaluar calidad de contenido (seo-on-page) ni rendimiento (seo-core-web-vitals).
---

# seo-technical-audit

## 1. Proposito

Diagnosticar barreras tecnicas que impiden que Google rastree e indexe
correctamente el sitio, mas alla del contenido en si.

## 2. Cuando usarla

- Despues de tener un inventario de `seo-site-crawler`.
- El usuario reporta que paginas no aparecen en Google o pide "revisa por que
  no indexa".
- Como fase tecnica dentro de `seo-orchestrator`.

## 3. Cuando NO usarla

- No hay todavia un crawl/inventario de URLs — correr primero
  `seo-site-crawler`.
- El problema reportado es puramente de contenido/copy — usar `seo-on-page`.

## 4. Entradas requeridas

- `seo-toolkit/output/crawl.json` (de `seo-site-crawler`).
- Acceso HTTP de solo lectura al sitio (via `fetch`/Playwright/Chrome DevTools).

## 5. Herramientas permitidas

- Bash: `npm run indexability`, `npm run inspect -- <url>`.
- Chrome DevTools MCP: inspeccionar DOM renderizado vs HTML inicial, network,
  recursos bloqueados.
- Playwright MCP: renderizar paginas con JS para comparar contra el HTML crudo.
- Read sobre `seo-toolkit/output/check-indexability.json`.

## 6. Procedimiento ordenado

1. `npm run indexability` sobre el inventario existente — status codes, 4xx,
   5xx, redirecciones.
2. Para cada URL representativa (home + 1 por seccion principal), correr
   `npm run inspect -- <url>` y revisar: `canonical`, `robotsMeta`,
   `xRobotsTag`.
3. Verificar consistencia de dominio: todas las URLs internas deben usar el
   mismo esquema (https) y el mismo host (`www.partumdesign.com.mx`) — anotar
   cualquier mezcla http/https o www/no-www.
4. Con Chrome DevTools o Playwright, comparar el HTML inicial (`view-source`)
   contra el DOM renderizado en al menos la home y una pagina con contenido
   dinamico, para detectar dependencia critica de JS para contenido indexable.
5. Revisar si hay paginacion (`rel=next/prev` o listados) y si esta bien
   señalizada.
6. Detectar "soft 404": paginas que responden 200 pero muestran contenido de
   error/vacio — requiere inspeccion de contenido, no solo status code.
7. Revisar si existe alguna necesidad de internacionalizacion (`hreflang`) —
   dado que el sitio es solo para Mexico en español, documentar como "no
   aplica" salvo evidencia de otro mercado/idioma.

## 7. Evidencia que debe recopilar

- `check-indexability.json/.csv`.
- Notas de inspeccion por URL muestreada (canonical, robots meta, x-robots-tag).
- Capturas o extractos de DOM renderizado vs HTML inicial cuando haya
  discrepancia relevante.

## 8. Formato de salida

Lista de hallazgos con severidad (ver [[severity-model]]), agrupados en:
indexabilidad basica, consistencia de dominio, dependencia de JS, paginacion,
soft 404, internacionalizacion.

## 9. Reglas contra alucinaciones

- No reportar "bloqueado para indexacion" sin haber visto explicitamente
  `noindex` en meta robots o `X-Robots-Tag`, o un `Disallow` real en
  robots.txt.
- No asumir renderizado del lado servidor o cliente sin comparar HTML inicial
  vs DOM real.
- Marcar "soft 404" solo tras inspeccionar el contenido, no solo por el status
  code 200.

## 10. Criterios de finalizacion

- Cada URL muestreada tiene su canonical/robots meta/x-robots-tag documentado.
- Se declaro explicitamente el estado de consistencia de dominio (www/no-www,
  http/https).
- Se declaro si hay o no dependencia critica de JS para contenido indexable.

## 11. Validacion posterior

- Repetir `npm run indexability` tras cualquier fix propuesto e implementado
  (via `seo-implementation` + `seo-validation`) para confirmar cierre del
  hallazgo.

## 12. Seguridad y limites

Ver [[security-rules]]. Solo lectura: no modificar robots.txt, canonicals ni
cabeceras durante esta fase. Cualquier cambio propuesto pasa por
`seo-implementation` tras aprobacion explicita del usuario.

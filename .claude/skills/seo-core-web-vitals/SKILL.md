---
name: seo-core-web-vitals
description: Usa Chrome DevTools y Lighthouse para medir LCP, INP, CLS, TTFB, FCP, TBT y analizar recursos, fuentes, imagenes, JavaScript, CSS y terceros en partumdesign.com.mx, en movil y escritorio, identificando el recurso o elemento responsable de cada problema. Usar cuando se necesite diagnosticar rendimiento/Core Web Vitals. No usar para SEO on-page o tecnico no relacionado a velocidad.
---

# seo-core-web-vitals

## 1. Proposito

Medir Core Web Vitals con herramientas reales y, mas importante, identificar
la causa raiz (que recurso, imagen, fuente o script) de cada metrica pobre —
no solo reportar un puntaje.

## 2. Cuando usarla

- Fase de rendimiento de `seo-orchestrator`.
- El usuario reporta que el sitio "se siente lento" o pregunta por Core Web
  Vitals.

## 3. Cuando NO usarla

- El problema reportado es de contenido/SEO, no de velocidad.

## 4. Entradas requeridas

- URLs a medir (priorizar home + paginas de servicio principales).
- Dispositivo objetivo: priorizar movil primero (ver CLAUDE.md), luego
  escritorio.

## 5. Herramientas permitidas

- Bash: `npm run lighthouse -- <url> mobile` y `... desktop`.
- Chrome DevTools MCP: Performance trace, Network panel, para identificar
  recursos especificos (bloqueantes, pesados, de terceros).
- Playwright MCP si se necesita interactuar con la pagina para medir INP.

## 6. Procedimiento ordenado

1. `npm run lighthouse -- <url> mobile` para cada URL priorizada (movil
   primero, siempre).
2. Repetir con `desktop` para comparar.
3. Revisar `seo-toolkit/output/lighthouse-*-summary.json`: LCP, CLS, TBT, FCP,
   TTFB.
4. Para cada metrica en rango pobre/necesita mejora, abrir el reporte completo
   (`lighthouse-*.json`) y ubicar el audit especifico (`largest-contentful-
   paint-element`, `render-blocking-resources`, `unused-css-rules`, `third-
   party-summary`, etc.) para identificar el recurso/elemento exacto
   responsable.
5. Con Chrome DevTools MCP, si se requiere mas detalle en vivo, inspeccionar
   Network (tamaño y tiempo de recursos) y Performance (long tasks, layout
   shifts) para confirmar el hallazgo de Lighthouse.
6. Clasificar causas por categoria: imagenes sin optimizar, fuentes web sin
   `font-display`, JS/CSS bloqueante, scripts de terceros pesados, TTFB alto
   del servidor/hosting.

## 7. Evidencia que debe recopilar

- `lighthouse-<url>-mobile.json` / `-desktop.json` y sus `-summary.json`.
- Nombre exacto del recurso/elemento senalado por cada audit relevante (no
  solo el puntaje de categoria).

## 8. Formato de salida

Tabla por URL: Metrica | Valor movil | Valor escritorio | Elemento/recurso
responsable | Severidad | Fix propuesto. Priorizar movil en la narrativa del
reporte.

## 9. Reglas contra alucinaciones

- No reportar una metrica sin haberla corrido con Lighthouse/Chrome DevTools en
  esta sesion — los valores cambian con el tiempo y la red.
- Siempre identificar el recurso/elemento especifico cuando el audit de
  Lighthouse lo provee; no quedarse solo en "el performance score es bajo".
- Diferenciar problemas de terceros (scripts externos) de problemas propios del
  sitio.

## 10. Criterios de finalizacion

- Cada URL priorizada tiene mediciones movil y escritorio.
- Cada metrica pobre tiene un recurso/elemento identificado, no solo un
  puntaje.

## 11. Validacion posterior

- Tras implementar un fix (`seo-implementation`), re-correr Lighthouse en la
  misma URL/dispositivo y comparar contra el baseline — esto es responsabilidad
  compartida con `seo-validation`.

## 12. Seguridad y limites

Ver [[security-rules]]. Lighthouse y Chrome DevTools operan en modo lectura
sobre el sitio publico; no hay riesgo de modificar produccion en esta fase.

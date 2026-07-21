---
name: seo-on-page
description: Revisa on-page por URL en partumdesign.com.mx -- title, meta description, H1/H2/H3, estructura de URL, intencion de busqueda, calidad de contenido, imagenes/alt, enlaces, CTA, canibalizacion y contenido duplicado o debil. Usar cuando se necesite evaluar paginas individuales de servicio/producto/informativas. No usar para temas tecnicos de rastreo (seo-technical-audit) ni para investigacion de keywords desde cero (seo-keyword-research).
---

# seo-on-page

## 1. Proposito

Evaluar la calidad on-page de cada URL relevante: si el title/meta/H1 reflejan
la intencion de busqueda, si el contenido es suficiente, y si hay
canibalizacion o duplicidad entre paginas del propio sitio.

## 2. Cuando usarla

- Tras tener el inventario de `seo-site-crawler`.
- El usuario pide revisar titles/metas/H1 o "por que esta pagina no rankea".
- Como fase de contenido dentro de `seo-orchestrator`.

## 3. Cuando NO usarla

- Sin inventario de URLs previo.
- El foco es investigacion de keywords nuevas (usar `seo-keyword-research`
  primero, luego volver aqui para mapear contra URLs existentes).

## 4. Entradas requeridas

- `seo-toolkit/output/crawl.json`.
- Lista de paginas HTML conocidas del repo (`index.html`, `contacto.html`,
  `desarrollo-web.html`, `marketing-digital.html`,
  `identidad-visual-y-corporativa.html`, `produccion-audiovisual.html`,
  `nosotros.html`) como referencia de que servicios existen.

## 5. Herramientas permitidas

- Bash: `npm run metadata` (analisis automatizado de title/meta/H1/alt/
  duplicados).
- Read sobre los `.html` del repo para leer contenido real cuando el analisis
  automatizado no sea suficiente (ej. evaluar calidad de copy).
- Playwright/Chrome DevTools MCP para ver la pagina renderizada tal como la ve
  un usuario.

## 6. Procedimiento ordenado

1. `npm run metadata` — obtiene title/meta description/H1/H2/H3/alt/duplicados
   para todas las URLs HTML del crawl.
2. Revisar `seo-toolkit/output/check-metadata.json` fila por fila.
3. Para cada pagina de servicio (desarrollo web, marketing digital, identidad
   visual, produccion audiovisual), evaluar manualmente (leyendo el HTML) si el
   contenido responde la intencion de busqueda esperada para ese servicio.
4. Detectar canibalizacion: dos o mas URLs compitiendo por el mismo title/
   intencion (ya senalado parcialmente por `check-metadata`, pero requiere
   revision humana de intencion, no solo texto identico).
5. Revisar imagenes: alt text presente y descriptivo (no generico tipo
   "imagen1.jpg").
6. Revisar presencia y claridad de CTA en cada pagina de servicio (ej. enlace a
   `contacto.html`).
7. Clasificar contenido debil (muy corto, generico, sin diferenciacion) para
   pasar a `seo-content-audit`.

## 7. Evidencia que debe recopilar

- `check-metadata.json/.csv`.
- Notas por URL: intencion inferida, calidad de match, presencia de CTA,
  calidad de alt text.
- Lista de pares de URLs con posible canibalizacion.

## 8. Formato de salida

Tabla por URL: title, meta description, H1, intencion inferida, calidad
(mantener/mejorar), issues de imagenes/alt, presencia de CTA. Mas lista aparte
de canibalizaciones detectadas.

## 9. Reglas contra alucinaciones

- La "intencion de busqueda" inferida es una hipotesis, no un hecho — etiquetar
  como tal salvo que haya datos de Search Console que la confirmen.
- No inventar metricas de trafico o CTR por pagina sin GA4/Search Console
  conectados.
- No calificar contenido como "debil" sin haber leido el HTML real de la
  pagina.

## 10. Criterios de finalizacion

- Todas las URLs HTML principales del crawl tienen una fila de analisis.
- Toda canibalizacion detectada por `check-metadata` fue revisada
  manualmente (confirmada o descartada).

## 11. Validacion posterior

- Tras cualquier cambio de title/meta/H1 implementado, re-correr
  `npm run metadata` y comparar antes/despues.

## 12. Seguridad y limites

Ver [[security-rules]]. No editar los `.html` de produccion en esta fase; solo
lectura y analisis. Cambios reales pasan por `seo-implementation`.

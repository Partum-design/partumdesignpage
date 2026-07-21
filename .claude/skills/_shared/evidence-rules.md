# Reglas de evidencia

Toda afirmacion producida durante la auditoria SEO debe clasificarse en una de
cuatro categorias. Nunca mezclar categorias sin etiquetarlas.

## Categorias

1. **Hallazgo confirmado** — Observado directamente con una herramienta (crawl,
   Lighthouse, Chrome DevTools, Playwright, Search Console, GA4, inspeccion de
   HTML/HTTP). Debe ser reproducible.
2. **Hipotesis** — Interpretacion razonable a partir de datos parciales, pero sin
   confirmacion directa (ej. "posible pagina huerfana" sin cruce contra Search
   Console).
3. **Recomendacion estrategica** — Sugerencia de mejora que no depende de un bug
   detectado, sino de buenas practicas o oportunidad competitiva.
4. **Dato no disponible** — La informacion requiere una credencial, acceso o
   herramienta externa que no esta conectada. Declarar explicitamente, nunca
   simular el dato ni rellenarlo con un valor plausible.

## Campos obligatorios por hallazgo

Cada hallazgo (`Finding`, ver `seo-toolkit/src/types.ts`) debe registrar:

- `url`
- `date` (ISO)
- `tool` (que script o inspeccion lo genero)
- `category` (una de las 4 anteriores)
- `evidence` (que se observo, literal)
- `impact` (por que importa)
- `severity` (ver [[severity-model]])
- `fix` (que cambiar)
- `validationMethod` (como confirmar tras el cambio)

## Prohibido

- Presentar una hipotesis como hallazgo confirmado.
- Inventar volumen de busqueda, CPC, dificultad de keyword, backlinks, rating,
  reviews o cualquier metrica de una API no conectada.
- Citar una aparicion en AI Overviews/ChatGPT/Gemini/Perplexity/Copilot sin
  captura o evidencia verificable de esa sesion especifica.

---
name: seo-keyword-research
description: Investigacion de keywords para Mexico/CDMX orientada a los servicios de Partum Design (desarrollo web, UX/UI, branding, marketing digital, produccion audiovisual). Organiza clusters, mapea keywords contra URLs, detecta canibalizacion y prioriza por impacto comercial. Usar cuando el usuario pida investigar palabras clave o oportunidades de contenido. No usar sin dejar claro que separa datos reales de estimaciones.
---

# seo-keyword-research

## 1. Proposito

Generar un mapa de keywords relevante para el mercado mexicano (prioridad CDMX)
alineado a los servicios reales del sitio, sin inventar metricas de volumen,
CPC o dificultad que no provengan de una fuente real conectada.

## 2. Cuando usarla

- El usuario pide investigacion de keywords o clusters de contenido.
- Fase de investigacion externa de `seo-orchestrator` (opcional, si hay
  herramientas conectadas o el usuario acepta trabajar solo con intencion/
  logica, sin metricas de volumen).

## 3. Cuando NO usarla

- No hay forma de obtener datos reales (Search Console, DataForSEO, Semrush,
  Ahrefs) y el usuario espera cifras de volumen/CPC/dificultad exactas — en ese
  caso, dejar explicito que solo se puede trabajar con intencion y estructura,
  no con numeros.

## 4. Entradas requeridas

- Lista de servicios reales del sitio (ver [[partum-context]]).
- Credenciales opcionales: `DATAFORSEO_LOGIN`/`PASSWORD`, `SEMRUSH_API_KEY`,
  `AHREFS_API_KEY`, o acceso a Search Console (`search-console.ts`) para
  consultas reales ya recibidas.

## 5. Herramientas permitidas

- Bash: `npm run search-console` (si hay credenciales) para ver consultas
  reales que ya generan impresiones/clics.
- WebSearch/WebFetch para observar la SERP real de Mexico (sin inventar
  resultados).
- Read sobre el contenido existente del sitio para mapear keywords a URLs.

## 6. Procedimiento ordenado

1. Si hay Search Console conectado: extraer consultas reales (`query`) con
   impresiones/clics — esta es la unica fuente de volumen real disponible sin
   herramienta de terceros.
2. Sin Search Console ni terceros: construir clusters basados en intencion
   (informacional/comercial/transaccional/navegacional) y logica de servicio,
   marcando explicitamente "sin dato de volumen — estructura logica basada en
   servicios ofrecidos".
3. Mapear cada cluster contra la URL existente mas relevante, o marcar como
   "gap de contenido" si no existe pagina.
4. Detectar canibalizacion: mas de una URL apuntando al mismo cluster/intencion.
5. Priorizar por impacto comercial: servicios con pagina de conversion directa
   (ej. lleva a `contacto.html`) priorizados sobre contenido puramente
   informacional.

## 7. Evidencia que debe recopilar

- `seo-toolkit/output/search-console.json` (si disponible).
- Tabla de clusters con: cluster, intencion, URL mapeada (o "gap"), fuente del
  dato (Search Console real vs. estructura logica).

## 8. Formato de salida

Tabla: Cluster | Intencion | URL actual (o gap) | Fuente del dato | Prioridad
comercial. Mas seccion aparte listando canibalizaciones detectadas.

## 9. Reglas contra alucinaciones

- **Nunca inventar volumen de busqueda, CPC o dificultad de keyword.** Si no
  hay fuente real conectada, escribir explicitamente "dato no disponible" (ver
  [[evidence-rules]]).
- No presentar clusters basados en intencion logica como si tuvieran respaldo
  de datos de volumen real.
- Distinguir siempre Mexico/CDMX de otros mercados; no reusar datos de otros
  paises como si aplicaran aqui.

## 10. Criterios de finalizacion

- Cada cluster tiene su fuente de dato explicitada (real vs. logica).
- Cada cluster esta mapeado a una URL existente o marcado como gap.

## 11. Validacion posterior

- Si se conecta una herramienta de terceros despues, re-priorizar el mapa con
  los datos reales y marcar version anterior como superada.

## 12. Seguridad y limites

Ver [[security-rules]]. No usar credenciales de terceros sin que el usuario las
haya provisto explicitamente en `.env`. No hacer scraping agresivo de SERPs que
viole terminos de servicio.

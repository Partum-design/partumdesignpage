---
name: seo-competitor-analysis
description: Identifica y compara competidores de Partum Design en la SERP mexicana -- arquitectura, contenido, autoridad, schema, velocidad, SEO local y conversion. Usar cuando el usuario pida comparar contra la competencia o entender el panorama competitivo. No usar para auditar el propio sitio de Partum (usar las demas Skills seo-*).
---

# seo-competitor-analysis

## 1. Proposito

Comparar a Partum Design contra competidores reales identificados en resultados
de busqueda de Mexico, documentando diferencias objetivas (no opiniones sin
evidencia).

## 2. Cuando usarla

- El usuario pide analisis competitivo o benchmark.
- Fase opcional de `seo-orchestrator` cuando se autoriza investigacion externa.

## 3. Cuando NO usarla

- No se ha identificado query/ubicacion especifica a analizar — pedir esa
  aclaracion antes de asumir competidores.
- El usuario quiere auditar su propio sitio — usar las Skills tecnicas/on-page.

## 4. Entradas requeridas

- Query(s) de busqueda representativas (ej. "diseño web CDMX", "agencia
  branding Ciudad de Mexico") — confirmar con el usuario o inferir de los
  servicios listados en [[partum-context]].
- Ubicacion de referencia (Mexico, CDMX) y fecha del analisis.

## 5. Herramientas permitidas

- WebSearch para observar la SERP real (no inventar resultados).
- WebFetch/Playwright MCP para inspeccionar sitios de competidores
  (arquitectura, contenido, schema, velocidad basica).
- Read sobre el propio sitio de Partum para comparar.

## 6. Procedimiento ordenado

1. Definir y documentar: query analizada, ubicacion, fecha.
2. Ejecutar la busqueda y registrar los primeros resultados organicos reales
   (no ads, distinguir explicitamente si aparecen).
3. Diferenciar competidor comercial (mismo giro de negocio) de competidor SEO
   (rankea para la misma query pero no es competencia directa de negocio, ej.
   un blog o directorio).
4. Para cada competidor relevante, comparar: arquitectura del sitio (secciones,
   profundidad), calidad/profundidad de contenido, señales de autoridad
   (dominios, menciones — solo si son observables sin herramienta de
   backlinks), presencia y tipo de schema JSON-LD, velocidad percibida
   (Lighthouse rapido si el tiempo lo permite), señales de SEO local (GBP,
   NAP visible), y claridad del CTA/conversion.
5. Documentar hallazgos por competidor, con fecha y query de origen.

## 7. Evidencia que debe recopilar

- Captura o extracto textual de la SERP con posiciones observadas.
- Notas estructuradas por competidor con los 6 ejes de comparacion.
- Fecha, ubicacion asumida (la SERP puede variar por geolocalizacion) y query
  exacta usada.

## 8. Formato de salida

Tabla comparativa: Competidor | Tipo (comercial/SEO) | Arquitectura | Contenido
| Autoridad observable | Schema | Velocidad | SEO local | Conversion. Mas
seccion de conclusiones para Partum Design.

## 9. Reglas contra alucinaciones

- No afirmar posicion de ranking sin haberla observado en esa sesion — las
  SERPs cambian y varian por ubicacion/personalizacion.
- No inventar metricas de autoridad de dominio (DA/DR) sin herramienta que las
  provea realmente.
- Etiquetar claramente cuando un dato de "autoridad" es una impresion
  cualitativa y no una metrica medida.

## 10. Criterios de finalizacion

- Al menos una query documentada con fecha, ubicacion y resultados reales.
- Cada competidor comparado en los 6 ejes o explicitamente marcado como "no
  observable".

## 11. Validacion posterior

- Si el usuario pide repetir el analisis mas adelante, comparar contra la
  version anterior y notar cambios de posicion/contenido.

## 12. Seguridad y limites

Ver [[security-rules]]. No hacer scraping agresivo ni automatizado en masa de
sitios de terceros; inspeccion puntual y razonable. No presentar como "hackeo
competitivo" nada que implique acceso no autorizado a sistemas de terceros.

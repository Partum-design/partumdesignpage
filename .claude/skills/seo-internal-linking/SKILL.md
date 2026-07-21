---
name: seo-internal-linking
description: Construye el mapa de enlaces internos de partumdesign.com.mx, identifica paginas pilar, clusters, paginas huerfanas, enlaces faltantes, anchor text recomendado, profundidad de navegacion y breadcrumbs. Usar tras seo-site-crawler para planear arquitectura de enlazado interno. No usar sin un crawl previo del sitio.
---

# seo-internal-linking

## 1. Proposito

Mapear como fluye el link equity interno del sitio y proponer mejoras de
enlazado que refuercen las paginas de mayor valor comercial.

## 2. Cuando usarla

- Tras `seo-site-crawler`.
- El usuario pide mejorar la arquitectura de enlaces o reducir profundidad de
  navegacion.

## 3. Cuando NO usarla

- Sin un crawl reciente (`crawl.json`) — correr `seo-site-crawler` primero.

## 4. Entradas requeridas

- `seo-toolkit/output/crawl.json` (con `discoveredFrom` y `depth` por URL).
- Lista de paginas de servicio conocidas (candidatas a pilar).

## 5. Herramientas permitidas

- Read sobre `crawl.json`.
- Read sobre los `.html` para verificar anchor text real usado en enlaces
  existentes (`header.html`, `footer.html` incluidos, ya que se reusan en
  todas las paginas).

## 6. Procedimiento ordenado

1. Construir el grafo de enlaces: nodo = URL, arista = `discoveredFrom` → `url`.
2. Identificar paginas pilar candidatas: `index.html` y las paginas de
   servicio principales (desarrollo-web, marketing-digital,
   identidad-visual-y-corporativa, produccion-audiovisual).
3. Agrupar clusters: paginas que deberian enlazar hacia/desde cada pilar segun
   tema.
4. Detectar paginas huerfanas: `depth > 0` sin `discoveredFrom` valido, o
   presentes en sitemap pero nunca alcanzadas por enlace interno.
5. Calcular profundidad de navegacion (clics desde home) por URL usando
   `depth`; senalar paginas importantes a mas de 3 clics de la home.
6. Revisar anchor text real usado en `header.html`/`footer.html` y en enlaces
   contextuales dentro de cada pagina — senalar anchors genericos ("click
   aqui", "ver mas") que deberian ser descriptivos.
7. Proponer enlaces faltantes especificos: de pagina X a pagina Y, con anchor
   text sugerido.
8. Evaluar si el sitio tiene breadcrumbs; si no, proponer estructura basica
   (Home > Servicio > [subpagina si aplica]).

## 7. Evidencia que debe recopilar

- Grafo de enlaces (lista de aristas) derivado de `crawl.json`.
- Lista de paginas huerfanas con evidencia (ausencia de `discoveredFrom`).
- Lista de anchors genericos detectados con su URL de origen.

## 8. Formato de salida

- Diagrama textual o lista de clusters (Pilar → paginas relacionadas).
- Tabla: Pagina huerfana | Profundidad | Sugerencia de enlace entrante.
- Tabla: Enlace faltante propuesto | Desde | Hacia | Anchor sugerido.
- Recomendacion de breadcrumbs (si aplica).

## 9. Reglas contra alucinaciones

- Solo declarar una pagina "huerfana" si se verifico contra `crawl.json` y,
  si esta disponible, contra Search Console (paginas indexadas).
- No proponer anchor text que no refleje el contenido real de la pagina
  destino — verificar leyendo esa pagina.

## 10. Criterios de finalizacion

- Grafo de enlaces documentado para todo el inventario del crawl.
- Toda pagina huerfana tiene al menos una sugerencia concreta de enlace
  entrante.

## 11. Validacion posterior

- Tras implementar enlaces nuevos, re-crawlear y confirmar que la pagina ya no
  aparece como huerfana.

## 12. Seguridad y limites

Ver [[security-rules]]. Esta Skill solo analiza y propone; agregar enlaces
reales al HTML pasa por `seo-implementation` tras aprobacion.

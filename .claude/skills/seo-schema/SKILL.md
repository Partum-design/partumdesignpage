---
name: seo-schema
description: Detecta y valida JSON-LD, microdatos y RDFa en partumdesign.com.mx, verifica correspondencia con el contenido visible y propone Organization, LocalBusiness, Service, WebSite, WebPage, BreadcrumbList, Article o Person cuando corresponda, sin inventar reviews, ratings, precios ni datos empresariales. Usar cuando se necesite auditar o proponer datos estructurados. No usar para generar schema con datos que el usuario no haya confirmado.
---

# seo-schema

## 1. Proposito

Auditar los datos estructurados existentes y proponer nuevos bloques
correctos y honestos (sin inventar hechos sobre el negocio).

## 2. Cuando usarla

- Fase de datos estructurados de `seo-orchestrator`.
- El usuario pregunta por rich results o pide agregar/revisar schema.org.

## 3. Cuando NO usarla

- El usuario pide agregar reviews/ratings/precios que no existen realmente —
  rechazar esa parte especifica y explicar por que (ver seccion 9).

## 4. Entradas requeridas

- `seo-toolkit/output/jsonld-blocks.json` (de `npm run schema`).
- Contenido real de cada pagina para verificar correspondencia.
- Datos confirmados de la empresa (ver [[partum-context]]) — nunca inventar los
  que falten.

## 5. Herramientas permitidas

- Bash: `npm run schema` (extrae y valida JSON-LD de todo el crawl).
- Read sobre `jsonld-blocks.json` y sobre los `.html` para comparar el schema
  contra el contenido visible.

## 6. Procedimiento ordenado

1. `npm run schema` para extraer todos los bloques `application/ld+json` del
   sitio.
2. Revisar `check-schema`/`validate-jsonld` findings: bloques invalidos
   (JSON malformado) son severidad alta.
3. Para cada bloque valido, verificar que los campos (`name`, `address`,
   `telephone`, etc.) correspondan a lo que realmente aparece en el HTML
   visible de esa pagina — si no corresponde, es un hallazgo confirmado de
   inconsistencia.
4. Identificar tipos de schema ausentes que aplicarian:
   - `Organization` o `LocalBusiness` en la home/paginas de "Nosotros"/
     contacto, solo con datos ya confirmados (nombre, URL, y NAP si esta
     visible en el sitio).
   - `WebSite` en la home.
   - `WebPage` por pagina.
   - `BreadcrumbList` si existe navegacion de breadcrumbs (ver
     `seo-internal-linking`).
   - `Service` en paginas de servicio, describiendo el servicio tal como esta
     redactado en la pagina (sin agregar precios o alcance no mencionado).
   - `Article`/`Person` solo si existe contenido tipo blog/autor real.
5. Redactar propuestas de JSON-LD usando exclusivamente datos observables en
   el HTML actual del sitio.

## 7. Evidencia que debe recopilar

- `jsonld-blocks.json` y `validate-jsonld.json` (hallazgos de sintaxis).
- Notas de correspondencia contenido-schema por pagina.
- Borradores de JSON-LD propuestos, cada campo trazable a una fuente en el
  HTML actual.

## 8. Formato de salida

- Tabla: URL | Schema presente | Valido | Corresponde al contenido | Tipos
  faltantes recomendados.
- Bloques de codigo JSON-LD propuestos, listos para revision (no para
  insertar automaticamente).

## 9. Reglas contra alucinaciones

- **Nunca inventar reviews, ratings, precios, nombres de personas o cifras de
  negocio** (empleados, años de fundacion, clientes) que no esten confirmados
  en el sitio o provistos explicitamente por el usuario.
- Si un campo de schema recomendado (ej. `telephone`, `address`) no tiene dato
  confirmado, omitirlo del borrador y marcarlo como "pendiente de
  confirmacion" en vez de rellenarlo.
- No marcar un schema como "valido" solo porque el JSON parsea — tambien debe
  corresponder al contenido real.

## 10. Criterios de finalizacion

- Todo bloque JSON-LD existente fue validado sintacticamente y comparado
  contra el contenido visible.
- Toda propuesta nueva de schema cita explicitamente de donde sale cada campo.

## 11. Validacion posterior

- Tras insertar un schema propuesto (via `seo-implementation`), validar de
  nuevo con `npm run schema` y, si es posible, con el Rich Results Test de
  Google (fuera de este toolkit, requiere acceso manual del usuario).

## 12. Seguridad y limites

Ver [[security-rules]]. No insertar schema con datos inventados bajo ninguna
circunstancia, incluso si el usuario lo pide de forma casual — señalar el
riesgo (schema markup abuse) y pedir el dato real o confirmacion explicita.

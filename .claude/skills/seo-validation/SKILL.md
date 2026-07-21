---
name: seo-validation
description: Repite las pruebas SEO tras cambios implementados en partumdesign.com.mx, compara antes/despues, revisa regresiones en metadata, canonicals, schema, navegacion, movil y rendimiento, y registra resultados. Usar siempre despues de seo-implementation antes de dar un lote de cambios por cerrado. No usar como sustituto de la auditoria inicial.
---

# seo-validation

## 1. Proposito

Confirmar que los cambios implementados realmente resuelven los hallazgos
aprobados y no introdujeron regresiones en otras areas.

## 2. Cuando usarla

- Inmediatamente despues de que `seo-implementation` completa un lote de
  cambios.

## 3. Cuando NO usarla

- No hubo ningun cambio implementado todavia.

## 4. Entradas requeridas

- Baseline: resultados de la auditoria original (`seo-toolkit/output/*.json`
  previos al cambio — conservar copia o timestamp de referencia).
- Lista de hallazgos que `seo-implementation` dice haber resuelto.

## 5. Herramientas permitidas

- Bash: re-correr los scripts relevantes de `seo-toolkit/`
  (`npm run indexability`, `metadata`, `sitemap`, `robots`, `schema`,
  `lighthouse`, etc.) segun que se haya tocado.
- Read para comparar el JSON nuevo contra el baseline guardado.

## 6. Procedimiento ordenado

1. Identificar que scripts corresponden a los hallazgos que se dicen resueltos
   (ej. cambio de meta description → `npm run metadata`).
2. Re-ejecutar esos scripts contra las URLs afectadas.
3. Comparar el resultado nuevo contra el baseline: el hallazgo especifico
   ¿desaparecio o se corrigio? ¿aparecieron hallazgos nuevos no esperados
   (regresion)?
4. Revisar especificamente: metadata (title/meta/H1), canonicals, JSON-LD
   valido, navegacion/enlaces internos no rotos, comportamiento en movil
   (Lighthouse mobile), rendimiento (Lighthouse scores antes/despues).
5. Documentar cada hallazgo como: Resuelto / Parcialmente resuelto / No
   resuelto / Regresion nueva detectada.

## 7. Evidencia que debe recopilar

- Resultado "antes" y "despues" de cada script relevante, con timestamps.
- Lista explicita de regresiones nuevas si las hay.

## 8. Formato de salida

Tabla: Hallazgo original | Script de validacion | Estado antes | Estado
despues | Veredicto (Resuelto/Parcial/No resuelto/Regresion) . Mas seccion de
regresiones nuevas si aplica.

## 9. Reglas contra alucinaciones

- No marcar "Resuelto" sin haber vuelto a correr el script y observado el
  cambio real en el output.
- Si el script no puede volver a correr (ej. falta credencial), marcar como
  "no verificable" en vez de asumir que quedo bien.

## 10. Criterios de finalizacion

- Cada hallazgo del lote de `seo-implementation` tiene un veredicto explicito.
- Cualquier regresion detectada fue reportada al usuario antes de considerar
  el lote cerrado.

## 11. Validacion posterior

- Si se detecta una regresion, regresa el ciclo a `seo-implementation` para
  corregirla, luego se repite esta validacion.

## 12. Seguridad y limites

Ver [[security-rules]]. Solo lectura/ejecucion de scripts de validacion; no
implementa cambios (eso es `seo-implementation`), no hace deploy ni push.

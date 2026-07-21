---
name: seo-content-audit
description: Clasifica cada contenido del sitio partumdesign.com.mx como Mantener, Mejorar, Expandir, Fusionar, Redirigir, Eliminar o Reescribir, con evidencia que respalde cada decision. Usar tras seo-on-page cuando se necesite un plan de accion por pagina. No usar como primer paso sin haber revisado antes metadata y contenido real de cada URL.
---

# seo-content-audit

## 1. Proposito

Producir una decision clara y justificada por cada pieza de contenido del
sitio, para alimentar el plan de implementacion.

## 2. Cuando usarla

- Despues de `seo-on-page` y, si aplica, `seo-keyword-research`.
- El usuario pide un plan de que hacer con cada pagina/contenido.

## 3. Cuando NO usarla

- Sin haber revisado metadata/contenido real de las URLs (`seo-on-page`
  primero).
- Para decisiones tecnicas puras (esas van en `seo-technical-audit`).

## 4. Entradas requeridas

- `seo-toolkit/output/check-metadata.json`.
- Notas de `seo-on-page` sobre calidad/canibalizacion.
- Mapa de keywords de `seo-keyword-research` si esta disponible.

## 5. Herramientas permitidas

- Read sobre los `.html` del repo para evaluar contenido real.
- Grep para buscar contenido duplicado literal entre paginas.

## 6. Procedimiento ordenado

1. Listar cada URL HTML relevante del inventario.
2. Para cada una, leer el contenido real y clasificar en una de:
   - **Mantener** — cumple su proposito, sin cambios necesarios.
   - **Mejorar** — funciona pero tiene issues on-page corregibles (title, meta,
     alt, etc. — ya detectados por `seo-on-page`).
   - **Expandir** — contenido correcto pero insuficiente en profundidad para
     competir.
   - **Fusionar** — solapa con otra URL sobre el mismo tema/intencion
     (canibalizacion confirmada).
   - **Redirigir** — la URL ya no debería existir de forma independiente;
     consolidar trafico hacia otra.
   - **Eliminar** — sin valor para usuarios ni SEO y sin alternativa de fusion.
   - **Reescribir** — la intencion es correcta pero la ejecucion actual es
     deficiente y no basta con mejoras puntuales.
3. Justificar cada decision citando la evidencia especifica (metadata, calidad
   de copy, canibalizacion, gap de keyword) que la respalda.
4. Marcar prioridad usando [[severity-model]] (impacto, alcance, esfuerzo).

## 7. Evidencia que debe recopilar

- Tabla URL → decision → justificacion → evidencia citada → prioridad.

## 8. Formato de salida

Tabla Markdown: URL | Decision | Justificacion | Evidencia | Prioridad. Mas
resumen de conteos por tipo de decision.

## 9. Reglas contra alucinaciones

- Toda decision "Eliminar" o "Redirigir" debe justificarse con evidencia
  concreta (no solo intuicion) — cita el hallazgo de `seo-on-page` o
  `seo-technical-audit` que la respalda.
- No proponer fusionar dos paginas sin haber confirmado que realmente compiten
  por la misma intencion (no solo por texto parecido).

## 10. Criterios de finalizacion

- Toda URL relevante del inventario tiene una decision asignada con
  justificacion.

## 11. Validacion posterior

- Cuando `seo-implementation` ejecute una decision (ej. fusion o redireccion),
  `seo-validation` debe confirmar que el resultado coincide con lo planeado
  aqui.

## 12. Seguridad y limites

Ver [[security-rules]]. Esta Skill solo produce el plan — no ejecuta cambios.
Eliminar o redirigir contenido real requiere aprobacion explicita del usuario y
pasa por `seo-implementation`.

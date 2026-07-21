---
name: seo-implementation
description: Implementa en codigo los hallazgos SEO ya aprobados por el usuario, en una rama separada (seo/audit-partumdesign), con diffs claros, pruebas y commits pequeños. Nunca hace deploy ni modifica produccion directamente, ni inventa textos/datos. Usar solo despues de que el usuario aprobo hallazgos especificos de las demas Skills seo-*. No usar para explorar o auditar (eso es tarea de las demas Skills).
---

# seo-implementation

## 1. Proposito

Traducir hallazgos SEO ya aprobados en cambios de codigo reales, de forma
segura, revisable y reversible.

## 2. Cuando usarla

- El usuario aprobo explicitamente uno o mas hallazgos y pide implementarlos.

## 3. Cuando NO usarla

- No hay hallazgos aprobados todavia — primero corre la auditoria
  correspondiente y presenta hallazgos.
- El usuario pide un cambio de codigo no relacionado a SEO — fuera de alcance
  de esta Skill.

## 4. Entradas requeridas

- Lista concreta de hallazgos aprobados (de que Skill vienen, que archivo/URL
  afectan).
- Confirmacion de que el usuario aprueba trabajar en una rama nueva.

## 5. Herramientas permitidas

- Bash: git (crear rama, commits pequeños — nunca push ni merge sin
  autorizacion explicita adicional).
- Edit/Write sobre los archivos `.html`/`config` de produccion, solo para los
  cambios aprobados.
- Bash para correr los scripts de validacion relevantes de `seo-toolkit/`
  despues del cambio.

## 6. Procedimiento ordenado

1. Confirmar la lista exacta de hallazgos a implementar en este turno.
2. Crear (o cambiar a) la rama `seo/audit-partumdesign`:
   `git checkout -b seo/audit-partumdesign` (si no existe) o
   `git checkout seo/audit-partumdesign` (si ya existe).
3. Implementar un cambio a la vez, agrupando por hallazgo o por archivo
   cuando tenga sentido — evitar un commit gigante con todo mezclado.
4. Mostrar el diff (`git diff`) al usuario antes de confirmar el commit si hay
   ambigüedad sobre el resultado esperado.
5. Correr el script de validacion correspondiente (`npm run metadata`,
   `npm run schema`, `npm run indexability`, etc. segun el hallazgo) para
   confirmar que el cambio resuelve lo esperado sin romper nada mas.
6. Crear un commit pequeño y descriptivo por cambio logico.
7. Repetir para el siguiente hallazgo aprobado.
8. Al terminar el lote, correr `seo-validation` para una pasada de regresion
   completa.
9. **No hacer `git push` ni abrir PR** salvo que el usuario lo pida
   explicitamente en ese momento.

## 7. Evidencia que debe recopilar

- Diff de cada cambio.
- Resultado del script de validacion post-cambio.
- Lista de commits creados (hash + mensaje).

## 8. Formato de salida

Resumen por hallazgo: que se cambio, en que archivo, diff resumido, resultado
de la validacion, hash del commit.

## 9. Reglas contra alucinaciones

- No inventar textos, datos de empresa, precios o testimonios al redactar
  titles/metas/contenido/schema — usar exclusivamente lo aprobado o
  confirmado por el usuario.
- No marcar un hallazgo como "implementado" sin haber corrido la validacion
  correspondiente.
- No implementar hallazgos que el usuario no aprobo explicitamente en este
  flujo, aunque parezcan obvios.

## 10. Criterios de finalizacion

- Todos los hallazgos del lote aprobado tienen su commit correspondiente en
  `seo/audit-partumdesign`.
- Cada commit paso su validacion asociada.
- El usuario fue informado de que no se hizo push/deploy.

## 11. Validacion posterior

- Delegar la pasada de regresion completa a `seo-validation` antes de dar por
  cerrado el lote.

## 12. Seguridad y limites

Ver [[security-rules]]. Reglas duras: sin deploy, sin push sin autorizacion
explicita adicional en ese momento, sin modificar DNS/Search Console/GA4, sin
`--force`, sin `--no-verify`. Toda esta Skill opera en una rama separada,
nunca directo en `main`.

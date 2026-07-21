---
name: seo-local-mexico
description: Revisa senales de SEO local para Mexico/CDMX de Partum Design -- consistencia de NAP, Google Business Profile, Maps, categorias, reseñas, paginas locales, y consistencia de datos entre el sitio y perfiles externos. Usar cuando el usuario pida revisar posicionamiento local. Nunca crear ubicaciones o paginas locales artificiales.
---

# seo-local-mexico

## 1. Proposito

Evaluar consistencia y completitud de las señales de SEO local reales del
negocio, sin fabricar presencia local que no existe.

## 2. Cuando usarla

- El usuario pide revisar SEO local, Google Business Profile o presencia en
  Maps.
- Fase opcional de `seo-orchestrator` si el negocio tiene componente local
  (Partum Design opera en/para CDMX segun contexto del usuario).

## 3. Cuando NO usarla

- No hay acceso ni informacion real de un Google Business Profile y el usuario
  pide "crear" presencia local ficticia — rechazar esa parte (ver seccion 9).

## 4. Entradas requeridas

- HTML del sitio (buscar NAP: nombre, direccion, telefono) en
  `contacto.html`, `footer.html`, `nosotros.html`.
- Acceso o datos que el usuario provea de su Google Business Profile (esta
  Skill no tiene una API de GBP conectada por defecto; sin acceso, se marca
  como dato no disponible).

## 5. Herramientas permitidas

- Grep/Read sobre los `.html` del sitio para extraer NAP tal como se muestra
  hoy.
- WebSearch para verificar si el negocio aparece en Google Maps/Business
  Profile publicamente (sin asumir datos que no se observen).

## 6. Procedimiento ordenado

1. Extraer NAP (nombre, direccion, telefono) de `footer.html`, `contacto.html`
   y `nosotros.html` — comparar si son consistentes entre si.
2. Buscar publicamente si existe un Google Business Profile indexado para
   Partum Design; si se encuentra, comparar su NAP contra el del sitio.
3. Si no se encuentra o no hay acceso, marcar GBP/Maps/categorias/reseñas como
   "dato no disponible — requiere acceso del usuario al panel de GBP".
4. Revisar si el sitio menciona zonas de servicio (ej. Lindavista, Gustavo A.
   Madero, CDMX) de forma consistente con el NAP real, sin asumir cobertura no
   declarada.
5. Evaluar si existen o deberian existir paginas locales — solo proponerlas si
   hay una ubicacion/zona de servicio real y confirmada, nunca inventar
   sucursales o zonas.

## 7. Evidencia que debe recopilar

- Extractos literales de NAP encontrados en cada archivo HTML.
- Estado de GBP: encontrado/no encontrado, y si encontrado, su NAP para
  comparar.

## 8. Formato de salida

Tabla: Fuente (footer/contacto/nosotros/GBP) | Nombre | Direccion | Telefono |
Consistente con las demas fuentes. Mas lista de accesos pendientes
(GBP, reseñas, categorias) si no hay acceso directo.

## 9. Reglas contra alucinaciones

- **Nunca crear ubicaciones, sucursales o paginas locales ficticias.**
- No afirmar un numero de reseñas, calificacion o categoria de GBP sin
  haberlo observado directamente.
- Si el usuario pide "inventar" una zona de cobertura para posicionar mejor,
  explicar el riesgo (señales de NAP falso pueden generar suspension del
  perfil de GBP) y no generarlo.

## 10. Criterios de finalizacion

- NAP extraido y comparado entre todas las fuentes disponibles en el sitio.
- Estado de GBP documentado (encontrado/no disponible), sin dato inventado.

## 11. Validacion posterior

- Si el usuario provee acceso a GBP mas adelante, repetir la comparacion NAP
  con datos reales del panel.

## 12. Seguridad y limites

Ver [[security-rules]]. No hay integracion automatica con la API de Google
Business Profile en este toolkit; cualquier cambio a un GBP real requiere que
el usuario lo haga manualmente con sus propias credenciales.

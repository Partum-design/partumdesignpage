---
name: seo-geo-aeo
description: Analiza claridad de entidad, E-E-A-T, respuestas directas, autoria, fuentes, FAQs y potencial de aparicion en AI Overviews, ChatGPT, Gemini, Perplexity y Copilot para partumdesign.com.mx. Usar cuando el usuario pregunte por optimizacion para busqueda con IA (GEO/AEO). Nunca presentar una aparicion en IA como verificada sin evidencia directa de esa sesion.
---

# seo-geo-aeo

## 1. Proposito

Evaluar que tan bien preparado esta el contenido del sitio para ser
citado/resumido por motores de respuesta con IA, basado en señales reales de
E-E-A-T y estructura de contenido — no en promesas de "aparecer en ChatGPT".

## 2. Cuando usarla

- El usuario pregunta especificamente por GEO (Generative Engine Optimization)
  o AEO (Answer Engine Optimization).
- Fase opcional de `seo-orchestrator`.

## 3. Cuando NO usarla

- El usuario solo quiere SEO tradicional — no forzar el marco GEO/AEO si no se
  pidio.

## 4. Entradas requeridas

- Contenido real de las paginas (via lectura de los `.html`).
- Resultados de `seo-schema` (FAQs, autoria estructurada si existe).

## 5. Herramientas permitidas

- Read sobre los `.html` del sitio.
- WebSearch para verificar, en la sesion actual, si el sitio aparece citado en
  una respuesta de un motor con capacidad de busqueda (solo si la herramienta
  disponible realmente lo permite verificar; de lo contrario, declarar no
  verificable).

## 6. Procedimiento ordenado

1. Evaluar claridad de entidad: ¿el sitio deja claro de forma inequivoca quien
   es Partum Design, que hace y donde opera, en texto plano (no solo en
   imagenes)?
2. Evaluar señales de E-E-A-T: autoria visible, experiencia demostrada (casos
   de estudio reales, portafolio), fuentes citadas, transparencia de contacto.
3. Revisar si el contenido responde preguntas de forma directa y extraible
   (parrafos claros tipo respuesta, listas, FAQs) vs. solo copy promocional
   vago.
4. Revisar si existen FAQs estructuradas (HTML + posible `FAQPage` schema via
   `seo-schema`).
5. Si la herramienta de busqueda disponible permite consultar un motor con IA
   en esta sesion, verificar puntualmente si el sitio aparece citado para una
   query relevante — documentar como "verificado en esta sesion, fecha X" o
   "no verificable con las herramientas actuales".

## 7. Evidencia que debe recopilar

- Notas por pagina: claridad de entidad (si/no + cita), señales de E-E-A-T
  presentes/ausentes, presencia de FAQs.
- Si se hizo verificacion de aparicion en IA: query usada, motor, fecha,
  resultado literal observado.

## 8. Formato de salida

Tabla: Pagina | Claridad de entidad | E-E-A-T presente | Respuestas directas |
FAQs | Recomendacion. Seccion aparte: "Verificacion de aparicion en motores de
IA" con estado explicito (verificado/no verificable) por cada intento.

## 9. Reglas contra alucinaciones

- **Nunca afirmar que el sitio "aparece en ChatGPT/Gemini/Perplexity/Copilot/AI
  Overviews" sin haberlo verificado directamente en la sesion actual con
  evidencia citable.** Sin esa verificacion, la respuesta correcta es "no
  verificado".
- No inventar casos de estudio, autores o credenciales que no esten en el
  sitio.
- Distinguir claramente recomendacion estrategica (mejorar E-E-A-T) de
  hallazgo confirmado (falta de autoria visible, por ejemplo).

## 10. Criterios de finalizacion

- Cada pagina relevante evaluada en los 4 ejes de la seccion 6-7.
- Todo intento de verificacion de aparicion en IA quedo documentado con su
  resultado real, sin extrapolar.

## 11. Validacion posterior

- Repetir la verificacion de aparicion en IA en una fecha posterior si el
  usuario quiere trackear cambios; nunca reusar un resultado viejo como si
  fuera actual.

## 12. Seguridad y limites

Ver [[security-rules]]. No prometer resultados de aparicion en sistemas de IA
que no se pueden garantizar ni verificar de forma determinista.

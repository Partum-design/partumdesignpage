# Modelo de severidad

Niveles, de mayor a menor:

- **Critica** — Bloquea indexacion o funcionamiento basico del sitio completo
  (ej. robots.txt bloquea todo, 5xx generalizado, noindex global accidental).
- **Alta** — Afecta significativamente rankings, conversion o UX en paginas
  importantes (ej. sin H1 en pagina de servicio, JSON-LD invalido en pagina clave,
  Core Web Vitals en rojo en movil).
- **Media** — Afecta paginas individuales o un subconjunto (ej. meta description
  faltante, titles duplicados entre 2 URLs, enlaces rotos puntuales).
- **Baja** — Mejora menor, bajo riesgo si no se atiende de inmediato (ej. title
  ligeramente largo, alt text generico).
- **Oportunidad** — No es un problema, es una mejora potencial (ej. agregar
  FAQ schema, expandir contenido, nuevo cluster de keywords).

## Como se pondera la prioridad

La prioridad final de un hallazgo (para ordenar el backlog) combina:

- **Impacto** — cuanto mejora metricas de negocio/SEO si se corrige.
- **Alcance** — cuantas URLs o cuanto trafico afecta.
- **Confianza** — que tan solida es la evidencia (confirmado > hipotesis).
- **Esfuerzo** — cuanto trabajo de implementacion requiere.
- **Riesgo** — probabilidad de introducir un problema nuevo al corregir.
- **Valor comercial** — relacion con paginas que generan leads/ventas (ej.
  contacto.html, paginas de servicio) pesa mas que paginas informativas.

Ver `seo-toolkit/src/severity.ts` para la heuristica de calculo automatico
(`estimateSeverity`), que debe tratarse como punto de partida, no como veredicto
final — el juicio humano/de la Skill correspondiente puede ajustarla con
justificacion explicita.

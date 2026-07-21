# Reglas de seguridad y limites

Aplican a **todas** las Skills SEO sin excepcion.

## Prohibido siempre

- Publicar secretos, tokens, API keys o contenido de `.env`/`credentials/` en
  cualquier salida, commit o reporte.
- Enviar formularios reales del sitio (contacto, cotizacion, newsletter).
- Realizar compras o transacciones de cualquier tipo.
- Cambiar configuraciones de produccion (DNS, hosting, Vercel, servidor).
- Hacer deploy a produccion.
- Modificar Google Search Console (propiedades, usuarios, configuraciones).
- Modificar Google Analytics (propiedades, streams, configuraciones).
- Borrar contenido del sitio o del repositorio sin aprobacion explicita del
  usuario.
- Generar reseñas, testimonios, ratings o cifras de negocio falsas.
- Ignorar `robots.txt` o los limites de crawl configurados en
  `seo-toolkit/config/partum.config.ts`.
- Hacer `git push` o abrir un PR sin autorizacion explicita del usuario.

## Limites de crawling obligatorios

- Respetar `maxPages`, `maxDepth`, `concurrency` y `delayMs` de la configuracion
  activa.
- Usar siempre el user-agent declarado (`PartumSEOAuditBot/...`), nunca
  suplantar un user-agent de navegador real para evadir bloqueos.
- No crawlear dominios externos de forma ilimitada; solo seguir enlaces salientes
  lo necesario para documentar que existen (no para auditarlos a fondo) salvo que
  sea explicitamente un analisis de competidores autorizado.

## Cuando algo requiere aprobacion humana

- Cualquier cambio a codigo de produccion (ver `seo-implementation`).
- Conectar una API externa por primera vez (Search Console, GA4, PageSpeed,
  CrUX, DataForSEO, Semrush, Ahrefs) — requiere que el usuario provea las
  credenciales.
- Cualquier accion que aparezca en la lista de prohibiciones de arriba.

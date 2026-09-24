# Partum Design

Sitio estático listo para Vercel con rutas limpias.

## Rutas

- `/` o `/inicio`
- `/nosotros`
- `/contacto`
- `/identidad-visual-y-corporativa`
- `/desarrollo-web`
- `/marketing-digital`
- `/produccion-audiovisual`
- `/servicios`

## Desarrollo local

Usa un servidor estático cualquiera, por ejemplo:

```bash
npx serve .
```

## Deploy

Sube el proyecto a Vercel con `vercel.json` en la raíz. Las rutas limpias quedan resueltas por `rewrites` y `cleanUrls`.

## Rediseño v2 (2026)

- Estilos y animaciones compartidos: `assets/v2/partum.css` y `assets/v2/partum.js`
  (GSAP + ScrollTrigger + Lenis desde CDN; sin ellos el sitio funciona sin animación).
- Navegación, footer, `<head>` común y el anillo/portal viven en `partials/`.
  Después de editarlos, ejecuta `python3 tools/build-partials.py` para copiarlos a cada página.
- Imágenes y videos optimizados para v2: `assets/v2/img/` y `assets/v2/media/`.

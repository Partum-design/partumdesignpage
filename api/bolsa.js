/* Bolsa de trabajo — recibe postulaciones (datos + CV) y las guarda en el
   Blob store PRIVADO "partum-bolsa-trabajo" de Vercel.
   POST  /api/bolsa                → guarda la postulación (multipart/form-data)
   GET   /api/bolsa?token=…        → lista postulaciones (solo RH, BOLSA_ADMIN_TOKEN)
   GET   /api/bolsa?token=…&file=… → descarga un CV o JSON de una postulación */
import { put, list, get } from '@vercel/blob';

const MAX_BYTES = 4 * 1024 * 1024; // límite de cuerpo en Vercel Functions: 4.5MB
const TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};
const AREAS = ['Desarrollo / Tecnología', 'Diseño / Branding', 'Marketing / Growth', 'Producción audiovisual', 'Ventas / Comercial', 'Administración / Operaciones', 'Otra'];
const ALLOWED_ORIGIN = /^https:\/\/((www\.)?partumdesign\.com\.mx|[a-z0-9-]+\.vercel\.app)$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
const txt = (v, n) => String(v || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'candidato';

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json({ error: 'origin' }, 403);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: 'not_configured' }, 503);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Formulario inválido.' }, 400); }

  if (txt(form.get('sitio_web'), 200)) return json({ ok: true }); // honeypot anti-spam

  const data = {
    nombre: txt(form.get('nombre'), 120),
    correo: txt(form.get('correo'), 160),
    telefono: txt(form.get('telefono'), 40),
    area: txt(form.get('area'), 60),
    puesto: txt(form.get('puesto'), 120),
    linkedin: txt(form.get('linkedin'), 200),
    mensaje: txt(form.get('mensaje'), 2000),
    acepta_aviso: form.get('acepta') === 'on',
    fecha: new Date().toISOString()
  };
  if (!data.nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) return json({ error: 'Revisa tu nombre y correo.' }, 400);
  if (!AREAS.includes(data.area)) data.area = 'Otra';
  if (!data.acepta_aviso) return json({ error: 'Necesitamos que aceptes el Aviso de Privacidad.' }, 400);

  const cv = form.get('cv');
  if (!cv || typeof cv === 'string' || !cv.size) return json({ error: 'Adjunta tu CV.' }, 400);
  const ext = TYPES[cv.type] || ({ pdf: 'pdf', doc: 'doc', docx: 'docx' })[(cv.name || '').split('.').pop().toLowerCase()];
  if (!ext) return json({ error: 'El CV debe ser PDF o Word (.doc, .docx).' }, 400);
  if (cv.size > MAX_BYTES) return json({ error: 'El CV pesa más de 4 MB. Comprímelo e intenta de nuevo.' }, 400);

  const folder = `postulaciones/${data.fecha.slice(0, 10)}/${slug(data.nombre)}-${Date.now().toString(36)}`;
  try {
    const file = await put(`${folder}/cv.${ext}`, cv, { access: 'private', contentType: cv.type || 'application/octet-stream', addRandomSuffix: true });
    data.cv = file.pathname;
    await put(`${folder}/datos.json`, JSON.stringify(data, null, 2), { access: 'private', contentType: 'application/json', addRandomSuffix: true });
  } catch (e) {
    console.error('bolsa_put', e && e.message);
    return json({ error: 'No pudimos guardar tu postulación. Intenta de nuevo o escríbenos a contacto@partumdesign.com.mx.' }, 502);
  }
  return json({ ok: true });
}

export async function GET(request) {
  const url = new URL(request.url);
  const admin = process.env.BOLSA_ADMIN_TOKEN;
  if (!admin || url.searchParams.get('token') !== admin) return json({ error: 'unauthorized' }, 401);

  const file = url.searchParams.get('file');
  if (file) {
    if (!file.startsWith('postulaciones/')) return json({ error: 'bad_file' }, 400);
    const r = await get(file, { access: 'private' });
    if (!r) return json({ error: 'not_found' }, 404);
    return new Response(r.stream, { headers: { 'content-type': r.blob.contentType || 'application/octet-stream', 'content-disposition': `attachment; filename="${file.split('/').pop()}"`, 'cache-control': 'no-store' } });
  }

  const { blobs } = await list({ prefix: 'postulaciones/', limit: 1000 });
  const rows = blobs
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .map((b) => ({ archivo: b.pathname, subido: b.uploadedAt, bytes: b.size, descargar: `/api/bolsa?token=${encodeURIComponent(admin)}&file=${encodeURIComponent(b.pathname)}` }));
  return json({ total: rows.length, postulaciones: rows });
}

/* Suscripcion al Cotizador IA (Vercel Function).
   Crea una suscripcion mensual en Mercado Pago (POST /preapproval) y devuelve
   el init_point al que se redirige al cliente para que autorice el cobro.

   Variables de entorno en Vercel:
   - MP_ACCESS_TOKEN          Access token de produccion de Mercado Pago (APP_USR-...)
   - MP_COTIZADOR_PLAN_URL    (opcional) link de un plan creado en el panel de MP.
                              Se usa si no hay MP_ACCESS_TOKEN.
   El token nunca llega al navegador. */

const PLAN = {
  reason: 'Cotizador IA — Partum Design',
  amount: 499,
  currency: 'MXN',
  frequency: 1,
  frequencyType: 'months'
};

const SITE = 'https://www.partumdesign.com.mx';
const ALLOWED_ORIGIN = /^https:\/\/((www\.)?partumdesign\.com\.mx|[a-z0-9-]+\.vercel\.app)$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

const RATE = { windowMs: 60_000, max: 6 };
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE.max;
}

function json(data, status = 200, origin = '') {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
  if (origin && ALLOWED_ORIGIN.test(origin)) headers['access-control-allow-origin'] = origin;
  return new Response(JSON.stringify(data), { status, headers });
}

const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json({ error: 'origin' }, 403);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon';
  if (limited(ip)) return json({ error: 'rate_limited' }, 429, origin);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400, origin); }

  const email = clean(body.email, 254).toLowerCase();
  const name = clean(body.name, 80);
  const company = clean(body.company, 80);
  if (!EMAIL.test(email)) return json({ error: 'email' }, 400, origin);

  const token = (process.env.MP_ACCESS_TOKEN || '').trim();
  const planUrl = (process.env.MP_COTIZADOR_PLAN_URL || '').trim();

  if (!token) {
    if (/^https:\/\/www\.mercadopago\.com\.mx\//.test(planUrl)) return json({ url: planUrl }, 200, origin);
    return json({ error: 'not_configured' }, 503, origin);
  }

  const payload = {
    reason: PLAN.reason,
    external_reference: `cotizador|${email}|${company || name}`.slice(0, 250),
    payer_email: email,
    back_url: `${/^https:\/\//.test(origin) ? origin : SITE}/cotizador-ia?suscripcion=ok`,
    status: 'pending',
    auto_recurring: {
      frequency: PLAN.frequency,
      frequency_type: PLAN.frequencyType,
      transaction_amount: PLAN.amount,
      currency_id: PLAN.currency
    }
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    const r = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'x-idempotency-key': crypto.randomUUID()
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.init_point) {
      console.error('mp_error', r.status, data && (data.message || data.error));
      return json({ error: 'upstream' }, 502, origin);
    }
    return json({ url: data.init_point }, 200, origin);
  } catch (e) {
    console.error('mp_fail', e && e.message);
    return json({ error: 'upstream' }, 502, origin);
  }
}

export function GET() {
  return json({ ok: true, plan: { amount: PLAN.amount, currency: PLAN.currency, frequency: 'mensual' } });
}

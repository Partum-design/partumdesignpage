/* Suscripcion al Cotizador IA (Vercel Function).

   El cliente paga dentro de la landing con el Card Payment Brick de Mercado Pago.
   El navegador solo manda el token de la tarjeta; el cobro se hace aqui.

   GET  -> { publicKey, amount, currency, test }  (configura el Brick)
   POST -> { status, detail, id, mode }           (procesa el pago)

   Modo segun MP_ACCESS_TOKEN:
   - TEST-...    Credenciales de prueba. MP no acepta suscripciones con ellas,
                 asi que se cobra el primer mes con /v1/payments (tarjetas de prueba).
   - APP_USR-... Credenciales reales. Se crea la suscripcion mensual
                 (/preapproval, status authorized): cobra hoy y cada mes.

   Variables en Vercel: MP_ACCESS_TOKEN, MP_PUBLIC_KEY. Solo la public key
   llega al navegador (es publica por diseño). */

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
const MP = 'https://api.mercadopago.com';

const RATE = { windowMs: 60_000, max: 8 };
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

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
const creds = () => ({
  token: (process.env.MP_ACCESS_TOKEN || '').trim(),
  publicKey: (process.env.MP_PUBLIC_KEY || '').trim()
});

async function mp(path, token, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25_000);
  try {
    const r = await fetch(MP + path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'x-idempotency-key': crypto.randomUUID()
      },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data };
  } finally {
    clearTimeout(timer);
  }
}

export function GET() {
  const { token, publicKey } = creds();
  if (!token || !publicKey) return json({ error: 'not_configured' }, 503);
  return json({ publicKey, amount: PLAN.amount, currency: PLAN.currency, test: token.startsWith('TEST-') });
}

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json({ error: 'origin' }, 403);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon';
  if (limited(ip)) return json({ error: 'rate_limited' }, 429, origin);

  const { token } = creds();
  if (!token) return json({ error: 'not_configured' }, 503, origin);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400, origin); }

  const card = body.card || {};
  const email = clean(body.email, 254).toLowerCase() || clean(card.payer && card.payer.email, 254).toLowerCase();
  const name = clean(body.name, 80);
  const company = clean(body.company, 80);
  const cardToken = clean(card.token, 64);
  const methodId = clean(card.payment_method_id, 40);
  const issuerId = clean(card.issuer_id, 20);
  if (!EMAIL.test(email)) return json({ error: 'email' }, 400, origin);
  if (!cardToken || !methodId) return json({ error: 'card' }, 400, origin);

  const ref = `cotizador-${Date.now().toString(36)}`;
  const test = token.startsWith('TEST-');
  const back = /^https:\/\//.test(origin) ? origin : SITE;

  try {
    if (test) {
      // Modo prueba: primer mes con /v1/payments. El monto lo fija el servidor.
      const payload = {
        transaction_amount: PLAN.amount,
        token: cardToken,
        description: `${PLAN.reason} (mensual)`,
        installments: 1,
        payment_method_id: methodId,
        payer: { email },
        external_reference: ref,
        statement_descriptor: 'PARTUMDESIGN',
        metadata: { plan: 'cotizador-ia', name, company }
      };
      if (name) payload.payer.first_name = name;
      if (issuerId) payload.issuer_id = issuerId;
      const r = await mp('/v1/payments', token, payload);
      if (!r.ok) {
        console.error('mp_payment_error', r.status, r.data && (r.data.message || r.data.error));
        return json({ error: 'upstream', detail: clean(r.data && r.data.message, 160) }, 502, origin);
      }
      return json({ mode: 'test', id: r.data.id, status: r.data.status, detail: r.data.status_detail, ref }, 200, origin);
    }

    // Produccion: suscripcion mensual real con la tarjeta tokenizada.
    const r = await mp('/preapproval', token, {
      reason: PLAN.reason,
      external_reference: ref,
      payer_email: email,
      card_token_id: cardToken,
      back_url: `${back}/cotizador-ia?suscripcion=ok`,
      status: 'authorized',
      auto_recurring: {
        frequency: PLAN.frequency,
        frequency_type: PLAN.frequencyType,
        transaction_amount: PLAN.amount,
        currency_id: PLAN.currency
      }
    });
    if (!r.ok) {
      console.error('mp_preapproval_error', r.status, r.data && (r.data.message || r.data.error));
      return json({ error: 'upstream', detail: clean(r.data && r.data.message, 160) }, 502, origin);
    }
    const ok = r.data.status === 'authorized';
    return json({ mode: 'live', id: r.data.id, status: ok ? 'approved' : r.data.status, detail: r.data.status, ref }, 200, origin);
  } catch (e) {
    console.error('mp_fail', e && e.message);
    return json({ error: 'upstream' }, 502, origin);
  }
}

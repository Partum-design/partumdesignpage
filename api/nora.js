// api/nora.js
// Proxy servidor para el asistente NORA. La API key de Gemini vive SOLO
// en la variable de entorno GEMINI_API_KEY (Vercel → Settings → Environment
// Variables) y nunca se expone al navegador.
//
// Controles de costo:
//  - Modelo por defecto = el nivel "flash-lite" de Gemini (el más barato).
//    Cambia GEMINI_MODEL si Google renombra/retira el modelo.
//  - maxOutputTokens bajo + instrucciones de responder corto.
//  - El system prompt limita a NORA a temas de Partum Design (nada de
//    "pregúntale lo que sea").
//  - Historial recortado a los últimos turnos.
//  - Límite de longitud de entrada.
//  - Rate limit best-effort por IP (en memoria del proceso).
//  - Filtro de Origin/Referer para que solo el propio sitio pueda usarlo.

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const MAX_INPUT_CHARS = 400;
const MAX_HISTORY_TURNS = 4;
const MAX_OUTPUT_TOKENS = 220;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const RATE_LIMIT_MAX_REQUESTS = 20;

const ALLOWED_HOST_SUFFIXES = [
    'partumdesign.com.mx',
    'vercel.app',
    'localhost',
];

const SYSTEM_PROMPT = `Eres NORA, la asistente virtual del sitio web de Partum Design, una agencia
creativa y de desarrollo con sede en Ciudad de México (Pernambuco 734,
Lindavista, Gustavo A. Madero, CDMX).

Tu único propósito es ayudar a las personas que visitan el sitio a entender
los servicios de Partum Design y resolver dudas sobre la empresa. Responde
SIEMPRE en español, de forma breve (2 a 4 frases), clara y amable.

Servicios de Partum Design:
- Estrategia Digital / Identidad Visual y Corporativa: branding, diseño de marca.
- Desarrollo Web: sitios y aplicaciones a medida, e-commerce, landing pages,
  planes desde presencia web básica hasta desarrollos empresariales complejos.
- Marketing Digital: posicionamiento, visibilidad de marca, growth.
- Producción Audiovisual: contenido multimedia (video, fotografía, 4K/60fps).

Aplicaciones propias desarrolladas por Partum Design:
- NORA AI: https://get-nora-ai-landing.vercel.app/
- Medical OS: https://medicalbypartum.vercel.app/
- Indusec: en desarrollo, todavía no tiene enlace público — si preguntan, di
  que está en construcción y aún no está disponible.

Contacto: contacto@partumdesign.com.mx · +52 56 1604 4547 ·
WhatsApp: https://wa.me/525616044547

Reglas importantes:
- NO inventes precios exactos, plazos ni datos que no tengas. Si preguntan
  por cotizaciones o precios, invita a contactar por WhatsApp o el formulario
  de contacto del sitio.
- NO dês información de contacto personal de empleados (usa solo el contacto
  general de la empresa).
- Si te preguntan algo que NO tiene relación con Partum Design, sus
  servicios, sus aplicaciones o cómo contactarlos, responde amablemente que
  solo puedes ayudar con temas de Partum Design y redirige la conversación.
- No generes código, ensayos, tareas, ni actúes como un asistente general de
  propósito abierto: eso está fuera de tu alcance.`;

const rateLimitStore = new Map();

function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
    return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }
    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) return true;
    return false;
}

function isAllowedOrigin(req) {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin) return true; // algunos clientes (curl directo desde el propio server) no mandan origin
    try {
        const host = new URL(origin).hostname;
        return ALLOWED_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith('.' + suffix));
    } catch (e) {
        return false;
    }
}

function sanitizeHistory(history) {
    if (!Array.isArray(history)) return [];
    return history
        .filter((turn) => turn && (turn.role === 'user' || turn.role === 'model') && typeof turn.text === 'string')
        .slice(-MAX_HISTORY_TURNS * 2)
        .map((turn) => ({
            role: turn.role,
            parts: [{ text: String(turn.text).slice(0, MAX_INPUT_CHARS) }],
        }));
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method_not_allowed' });
        return;
    }

    if (!isAllowedOrigin(req)) {
        res.status(403).json({ error: 'forbidden_origin' });
        return;
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
        res.status(429).json({ error: 'rate_limited', message: 'Demasiadas preguntas por ahora, intenta de nuevo en unos minutos.' });
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(503).json({ error: 'not_configured', message: 'NORA todavía no está configurada. Falta la API key de Gemini en el servidor.' });
        return;
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) {
        res.status(400).json({ error: 'empty_message' });
        return;
    }
    if (message.length > MAX_INPUT_CHARS) {
        res.status(400).json({ error: 'message_too_long', message: `Máximo ${MAX_INPUT_CHARS} caracteres por mensaje.` });
        return;
    }

    const contents = [
        ...sanitizeHistory(body.history),
        { role: 'user', parts: [{ text: message }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    try {
        const geminiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
                generationConfig: {
                    maxOutputTokens: MAX_OUTPUT_TOKENS,
                    temperature: 0.4,
                },
            }),
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini error', geminiRes.status, errText);
            res.status(502).json({ error: 'upstream_error', message: 'NORA no pudo responder en este momento, intenta de nuevo.' });
            return;
        }

        const data = await geminiRes.json();
        const reply = data && data.candidates && data.candidates[0] && data.candidates[0].content
            ? data.candidates[0].content.parts.map((p) => p.text).join('').trim()
            : '';

        if (!reply) {
            res.status(200).json({ reply: 'No tengo una respuesta clara para eso. ¿Puedes reformular tu pregunta sobre Partum Design?' });
            return;
        }

        res.status(200).json({ reply });
    } catch (err) {
        console.error('NORA handler error', err);
        res.status(500).json({ error: 'server_error', message: 'Ocurrió un error inesperado, intenta de nuevo.' });
    }
};

/* NORA — asistente IA de Partum Design (widget del sitio).
   Conversa vía /api/nora (Gemini en el servidor) y puede llevar al visitante a
   cualquier página o sección del sitio. La conversación sobrevive al cambiar de
   página (sessionStorage), así Nora "acompaña" al usuario mientras navega. */
(function () {
  'use strict';

  var API = '/api/nora';
  var KEY = 'nora-v1';
  var WA = '525616044547';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PAGE = (location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/').replace(/^\/index$/, '/');

  var HELLO = {
    '/': 'Hola, soy **Nora**, la IA residente de Partum Design. Puedo explicarte nuestras soluciones B2B, ayudarte a elegir paquete o llevarte directo a lo que buscas.',
    '/desarrollo-web': 'Hola, soy **Nora**. Entiendo que adoptar nueva tecnología genera dudas, sobre todo con integraciones a medida o seguridad de datos B2B. Estoy aquí para ayudarte.',
    '/marketing-digital': 'Hola, soy **Nora**. El ciclo de ventas B2B suele ser largo y complejo; mi objetivo es ayudarte a identificar dónde se estancan tus prospectos. ¿Hablamos de métricas?',
    '/identidad-visual-y-corporativa': 'Hola, soy **Nora**. Una marca anticuada o inconsistente puede costarte contratos sin que te des cuenta. Estoy lista para guiarte en el proceso.',
    '/bolsa-de-trabajo': 'Hola, soy **Nora**. ¿Quieres trabajar en Partum? Te explico cómo postularte y qué perfiles buscamos.',
    '/contacto': 'Hola, soy **Nora**. Puedo resolver tu duda al momento o conectarte con un especialista por WhatsApp.'
  };
  var CHIPS = {
    '/': ['¿Qué paquete me conviene?', '¿Qué incluye la auditoría digital?', 'Llévame a Soluciones Tech'],
    '/desarrollo-web': ['¿Cuánto toma un portal B2B para clientes?', '¿Cómo califica leads la IA?', '¿Se integran con mi ERP (SAP, Oracle)?'],
    '/marketing-digital': ['Mi CPL en Google Ads está muy alto', 'Tengo tráfico pero pocos contactos', '¿Cómo funciona el Social Selling?'],
    '/identidad-visual-y-corporativa': ['¿Cómo actualizo mi logo sin perder esencia?', '¿Qué incluye un Sistema de Diseño?', '¿Cuánto tarda un Rebranding B2B?'],
    '/nosotros': ['¿Quiénes forman el equipo?', '¿Dónde están ubicados?', 'Quiero trabajar con ustedes'],
    '/bolsa-de-trabajo': ['¿Qué perfiles buscan?', '¿Qué formato de CV aceptan?', 'Llévame al formulario'],
    '/contacto': ['Agendar auditoría digital', '¿Cuál es su horario?', 'Hablar por WhatsApp']
  };
  var FALLBACK = [
    [/paquete|precio|cu[aá]nto cuesta|costo|plan(es)?\b|essential|corporate|elite/i, '/#paquetes', 'Paquetes'],
    [/auditor/i, '/#auditoria', 'Auditoría digital'],
    [/agend|cita|calendar/i, '/agenda', 'Agendar auditoría'],
    [/nora ai|medical|indusecc|soluciones tech|producto/i, '/#soluciones-tech', 'Soluciones Tech'],
    [/software|erp|crm|app|portal|desarroll|web|\bia\b|inteligencia|bot/i, '/desarrollo-web', 'Tech & Desarrollo IA'],
    [/marketing|ads|google|meta|linkedin|seo|growth|lead|cpl|venta/i, '/marketing-digital', 'Estrategia & Growth'],
    [/marca|branding|logo|identidad|rebranding|dise[nñ]o/i, '/identidad-visual-y-corporativa', 'Branding Corporativo'],
    [/video|foto|audiovisual/i, '/produccion-audiovisual', 'Producción audiovisual'],
    [/trabajo|vacante|cv|empleo|postul/i, '/bolsa-de-trabajo', 'Bolsa de trabajo'],
    [/equipo|qui[eé]nes|nosotros/i, '/nosotros#equipo', 'Equipo'],
    [/contact|direcci|ubicaci|tel[eé]fono|correo|whats/i, '/contacto', 'Contacto']
  ];

  /* ---------- Estado ---------- */
  var state = { open: false, messages: [], spot: '' };
  try { var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (saved && Array.isArray(saved.messages)) state = saved; } catch (e) {}
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify({ open: state.open, messages: state.messages.slice(-30), spot: state.spot })); } catch (e) {} }

  /* ---------- Utilidades ---------- */
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(s) {
    var lines = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').split('\n');
    var out = '', inList = false;
    lines.forEach(function (l) {
      var m = l.match(/^\s*[-•]\s+(.*)$/);
      if (m) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + m[1] + '</li>'; return; }
      if (inList) { out += '</ul>'; inList = false; }
      if (l.trim()) out += '<p>' + l + '</p>';
    });
    return out + (inList ? '</ul>' : '');
  }
  function sections() {
    return Array.prototype.slice.call(document.querySelectorAll('main section[id], main [data-nora-label][id]')).map(function (s) {
      var h = s.getAttribute('data-nora-label') || (s.querySelector('h1, h2, h3') || {}).textContent || s.id;
      return { id: s.id, label: h.replace(/\s+/g, ' ').trim().slice(0, 80) };
    });
  }
  var ICON = {
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44a9.44 9.44 0 0 1 0 18.89z"/></svg>'
  };
  var ORB = '<span class="nora-orb" aria-hidden="true"><i></i><b>N</b></span>';

  /* ---------- UI ---------- */
  var launcher = el('button', 'nora-launch');
  launcher.type = 'button';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'nora-panel');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = ORB + '<span class="nora-launch__txt"><strong>Pregúntale a Nora</strong><small>IA · te guía por el sitio</small></span>';

  var teaser = el('div', 'nora-teaser', '<button type="button" class="nora-teaser__x" aria-label="Cerrar aviso">' + ICON.close + '</button><p><strong>Hola, soy Nora.</strong> ¿Te llevo directo a lo que buscas?</p>');

  var panel = el('section', 'nora-panel');
  panel.id = 'nora-panel';
  panel.setAttribute('data-lenis-prevent', '');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', 'Chat con Nora, asistente con inteligencia artificial');
  panel.innerHTML =
    '<header class="nora-head">' + ORB +
      '<div><strong>Nora</strong><span class="nora-live">IA de Partum · en línea</span></div>' +
      '<button type="button" class="nora-icon" data-nora-reset aria-label="Nueva conversación" title="Nueva conversación">' + ICON.reset + '</button>' +
      '<button type="button" class="nora-icon" data-nora-close aria-label="Cerrar chat">' + ICON.close + '</button>' +
    '</header>' +
    '<div class="nora-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<div class="nora-chips"></div>' +
    '<form class="nora-form" autocomplete="off">' +
      '<label class="sr-only" for="nora-input">Escribe tu pregunta para Nora</label>' +
      '<textarea id="nora-input" rows="1" maxlength="1000" placeholder="Escribe tu duda o a dónde quieres ir…"></textarea>' +
      '<button type="submit" class="nora-send" aria-label="Enviar pregunta">' + ICON.send + '</button>' +
    '</form>' +
    '<p class="nora-legal">Nora es una IA y puede equivocarse. No compartas datos sensibles. <a href="/aviso-de-privacidad">Privacidad</a></p>';

  document.body.appendChild(teaser);
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var log = panel.querySelector('.nora-log');
  var chips = panel.querySelector('.nora-chips');
  var form = panel.querySelector('.nora-form');
  var input = panel.querySelector('#nora-input');
  var busy = false;
  var pendingNav = null;

  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function bubble(role, text, action) {
    var b = el('div', 'nora-msg nora-msg--' + (role === 'user' ? 'user' : 'nora'));
    b.innerHTML = role === 'user' ? '<p>' + esc(text) + '</p>' : md(text);
    if (action && action.type && action.type !== 'none') b.appendChild(actionCard(action, false));
    log.appendChild(b);
    scrollLog();
    return b;
  }

  function labelFor(a) {
    if (a.label) return a.label;
    if (a.type === 'whatsapp') return 'Hablar por WhatsApp';
    if (a.type === 'external') return 'Abrir sitio';
    var s = sections().filter(function (x) { return '#' + x.id === a.target || a.target === PAGE + '#' + x.id; })[0];
    return s ? s.label : 'Ir a la sección';
  }

  function actionCard(a, live) {
    var href = a.type === 'whatsapp' ? 'https://wa.me/' + WA + '?text=' + encodeURIComponent(a.target) : a.target;
    var card = el('a', 'nora-act nora-act--' + a.type);
    card.href = href;
    if (a.type !== 'navigate') { card.target = '_blank'; card.rel = 'noopener'; }
    card.innerHTML = '<span class="nora-act__ico">' + (a.type === 'whatsapp' ? ICON.wa : ICON.go) + '</span><span><small>' +
      (a.type === 'navigate' ? (live ? 'Te llevo a' : 'Ir a') : a.type === 'whatsapp' ? 'WhatsApp' : 'Sitio externo') +
      '</small>' + esc(labelFor(a)) + '</span>' + (live ? '<i class="nora-act__bar"></i>' : '');
    if (a.type === 'navigate') card.addEventListener('click', function (e) { e.preventDefault(); cancelNav(); go(a.target); });
    return card;
  }

  function renderChips(list) {
    chips.innerHTML = '';
    (list || []).forEach(function (q) {
      var c = el('button', 'nora-chip'); c.type = 'button'; c.textContent = q;
      c.addEventListener('click', function () { ask(q); });
      chips.appendChild(c);
    });
  }

  function renderAll() {
    log.innerHTML = '';
    if (!state.messages.length) {
      bubble('model', HELLO[PAGE] || HELLO['/']);
      renderChips(CHIPS[PAGE] || CHIPS['/']);
    } else {
      state.messages.forEach(function (m) { bubble(m.role, m.text, m.action); });
      var last = state.messages[state.messages.length - 1];
      renderChips(last.suggestions && last.suggestions.length ? last.suggestions : CHIPS[PAGE] || CHIPS['/']);
    }
  }

  function typing(on) {
    var t = log.querySelector('.nora-typing');
    if (on && !t) { log.appendChild(el('div', 'nora-msg nora-msg--nora nora-typing', '<span></span><span></span><span></span>')); scrollLog(); }
    if (!on && t) t.remove();
  }

  /* ---------- Navegación guiada ---------- */
  function spotlight(id) {
    var target = id && document.getElementById(id);
    if (!target) return false;
    var lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.classList.remove('nora-spot');
    void target.offsetWidth;
    target.classList.add('nora-spot');
    setTimeout(function () { target.classList.remove('nora-spot'); }, 3200);
    return true;
  }

  function go(target) {
    var u;
    try { u = new URL(target, location.href); } catch (e) { return; }
    if (u.origin !== location.origin) { location.href = u.href; return; }
    var path = (u.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/').replace(/^\/index$/, '/');
    var id = u.hash.slice(1);
    if (path === PAGE) {
      if (window.matchMedia('(max-width: 600px)').matches) setOpen(false);
      if (!spotlight(id) && !id) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    state.spot = id;
    save();
    location.href = u.pathname + (u.search || '');
  }

  function cancelNav() { if (pendingNav) { clearTimeout(pendingNav); pendingNav = null; } }

  /* ---------- Conversación ---------- */
  function localAnswer(q) {
    for (var i = 0; i < FALLBACK.length; i++) {
      if (FALLBACK[i][0].test(q)) {
        return { reply: 'Ahora mismo no logro conectarme con mi cerebro de IA, pero creo que esto te sirve: te llevo a **' + FALLBACK[i][2] + '**.', action: { type: 'navigate', target: FALLBACK[i][1], label: FALLBACK[i][2] }, suggestions: [] };
      }
    }
    return { reply: 'Ahora mismo no logro conectarme con mi cerebro de IA. Escríbenos por WhatsApp y un especialista te responde enseguida.', action: { type: 'whatsapp', target: 'Hola Partum, tengo una duda: ' + q, label: 'Hablar con un especialista' }, suggestions: [] };
  }

  function ask(q) {
    q = String(q || '').trim();
    if (!q || busy) return;
    cancelNav();
    setOpen(true);
    busy = true;
    form.classList.add('is-busy');
    renderChips([]);
    state.messages.push({ role: 'user', text: q });
    save();
    bubble('user', q);
    typing(true);
    var payload = {
      page: PAGE,
      sections: sections(),
      messages: state.messages.slice(-12).map(function (m) { return { role: m.role, text: m.text }; })
    };
    var done = function (res) {
      typing(false);
      busy = false;
      form.classList.remove('is-busy');
      var a = res.action && res.action.type !== 'none' ? res.action : null;
      state.messages.push({ role: 'model', text: res.reply, action: a, suggestions: res.suggestions || [] });
      save();
      var b = bubble('model', res.reply);
      renderChips(res.suggestions && res.suggestions.length ? res.suggestions : []);
      if (a) {
        var card = actionCard(a, a.type === 'navigate');
        b.appendChild(card);
        scrollLog();
        if (a.type === 'navigate') {
          var stay = el('button', 'nora-stay', 'Quedarme aquí'); stay.type = 'button';
          stay.addEventListener('click', function () { cancelNav(); card.classList.add('is-cancel'); stay.remove(); });
          b.appendChild(stay);
          pendingNav = setTimeout(function () { pendingNav = null; stay.remove(); go(a.target); }, reduce ? 600 : 1600);
        }
      }
      if (window.gtag) window.gtag('event', 'nora_message', { page_path: PAGE, action: a ? a.type : 'none' });
    };
    fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (x) { done(x.ok && x.j.reply ? x.j : (x.j && x.j.reply ? x.j : localAnswer(q))); })
      .catch(function () { done(localAnswer(q)); });
  }

  /* ---------- Abrir / cerrar ---------- */
  var lastFocus = null;
  function setOpen(v) {
    if (state.open === v && panel.classList.contains('is-open') === v) return;
    state.open = v;
    save();
    panel.classList.toggle('is-open', v);
    launcher.setAttribute('aria-expanded', v);
    document.documentElement.classList.toggle('nora-open', v);
    teaser.classList.remove('is-show');
    if (v) {
      lastFocus = document.activeElement;
      if (!log.childNodes.length) renderAll();
      setTimeout(function () { if (!window.matchMedia('(hover: none)').matches) input.focus(); scrollLog(); }, 50);
    } else {
      cancelNav();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }

  launcher.addEventListener('click', function () { setOpen(!panel.classList.contains('is-open')); });
  panel.querySelector('[data-nora-close]').addEventListener('click', function () { setOpen(false); });
  panel.querySelector('[data-nora-reset]').addEventListener('click', function () { cancelNav(); state.messages = []; save(); renderAll(); input.focus(); });
  teaser.querySelector('.nora-teaser__x').addEventListener('click', function (e) { e.stopPropagation(); teaser.classList.remove('is-show'); try { sessionStorage.setItem('nora-teased', '1'); } catch (er) {} });
  teaser.addEventListener('click', function () { setOpen(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) setOpen(false); });

  form.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value; input.value = ''; input.style.height = ''; ask(q); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit')); } });
  input.addEventListener('input', function () { input.style.height = ''; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });

  /* Disparadores dentro de las páginas: botones y cajas "Pregúntale a Nora" */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-nora-ask], [data-nora-open]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-nora-ask')) ask(t.getAttribute('data-nora-ask') || t.textContent);
    else setOpen(true);
  });
  Array.prototype.forEach.call(document.querySelectorAll('form[data-nora-form]'), function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var field = f.querySelector('textarea, input[type=text]');
      if (field && field.value.trim()) { ask(field.value); field.value = ''; }
      else setOpen(true);
    });
  });

  /* En móvil, WhatsApp y Nora se apartan al bajar para no tapar el texto */
  var lastY = window.scrollY, idle = null, mq = window.matchMedia('(max-width: 600px)');
  window.addEventListener('scroll', function () {
    if (!mq.matches) return;
    var y = window.scrollY, root = document.documentElement;
    if (y > lastY + 6 && y > 200) root.classList.add('floats-away');
    else if (y < lastY - 6) root.classList.remove('floats-away');
    lastY = y;
    clearTimeout(idle);
    idle = setTimeout(function () { root.classList.remove('floats-away'); }, 1200);
  }, { passive: true });

  /* ---------- Arranque ---------- */
  if (state.open) { renderAll(); panel.classList.add('is-open'); launcher.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('nora-open'); }
  if (state.spot) {
    var id = state.spot; state.spot = ''; save();
    window.addEventListener('load', function () { setTimeout(function () { spotlight(id); }, 450); });
  }
  try {
    if (!state.open && !state.messages.length && !sessionStorage.getItem('nora-teased')) {
      setTimeout(function () { if (!state.open) { teaser.classList.add('is-show'); sessionStorage.setItem('nora-teased', '1'); } }, 7000);
    }
  } catch (e) {}
})();

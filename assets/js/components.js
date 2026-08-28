(function () {
    'use strict';

    /* ─── NAVBAR HTML + CSS incrustado (sin petición de red) ─── */
    var NAV_CSS = [
        ':root{--dark-bg:#010a13;--accent:#0ea5e9;--nav-height:96px;--nav-height-scrolled:82px;--text-white:#fff;--text-muted:rgba(255,255,255,.72);--glass-bg:rgba(4,14,24,.68)}',
        'html{scroll-behavior:smooth}',
        '.navbar{position:fixed;top:14px;left:50%;width:min(calc(100% - 32px),1360px);height:var(--nav-height);z-index:99999;display:flex;align-items:center;transform:translateX(-50%);transition:top .34s cubic-bezier(.4,0,.2,1),height .34s cubic-bezier(.4,0,.2,1),background .34s,box-shadow .34s,border-color .34s;background:linear-gradient(135deg,rgba(4,14,24,.72),rgba(9,22,34,.5));backdrop-filter:blur(22px) saturate(135%);-webkit-backdrop-filter:blur(22px) saturate(135%);border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 18px 46px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.08);will-change:height,background}',
        '.navbar::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(90deg,rgba(14,165,233,.28),transparent 28%,transparent 72%,rgba(99,102,241,.2));opacity:.45}',
        '.navbar.scrolled{top:10px;height:var(--nav-height-scrolled);background:rgba(4,12,22,.88);border-color:rgba(255,255,255,.12);box-shadow:0 18px 56px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.08)}',
        '.nav-container{position:relative;z-index:1;width:100%;max-width:1440px;margin:0 auto;padding:0 26px;display:flex;align-items:center;justify-content:space-between}',
        '.logo{display:block;width:228px;height:70px;transition:width .34s ease,height .34s ease;flex-shrink:0;z-index:100000;position:relative}',
        '.logo-img{width:100%;height:100%;object-fit:contain;object-position:left center}',
        '.navbar.scrolled .logo{width:196px;height:60px}',
        '.nav-content-wrapper{display:flex;align-items:center;gap:28px}',
        '.nav-menu{display:flex;align-items:center;gap:28px;list-style:none;margin:0;padding:0}',
        '.nav-item{position:relative}',
        '.nav-link{color:var(--text-muted);text-decoration:none;font-size:.9rem;font-weight:600;padding:10px 2px;display:flex;align-items:center;gap:8px;transition:color .25s ease,opacity .25s ease;font-family:Inter,sans-serif}',
        '.nav-link:hover,.nav-item.active>.nav-link{color:var(--text-white)}',
        '.nav-link::after{content:"";position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:var(--accent);transition:width .3s ease}',
        '.nav-link:hover::after,.nav-item.active>.nav-link::after{width:100%}',
        '.dropdown{position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%) translateY(14px);background:rgba(6,16,28,.94);border:1px solid rgba(255,255,255,.08);border-radius:14px;min-width:280px;padding:12px;opacity:0;visibility:hidden;transition:opacity .25s,transform .25s,visibility .25s;box-shadow:0 24px 54px rgba(0,0,0,.46);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}',
        '@media(min-width:1025px){.nav-item.has-dropdown:hover .dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}}',
        '.dropdown-item{display:flex;align-items:center;padding:12px 15px;text-decoration:none;border-radius:10px;transition:background .2s,transform .2s}',
        '.dropdown-item:hover{background:rgba(255,255,255,.08);transform:translateX(2px)}',
        '.drop-content h4{font-size:.9rem;color:var(--text-white);margin:0 0 4px;font-weight:600;font-family:Inter,sans-serif}',
        '.drop-content p{font-size:.75rem;color:var(--text-muted);margin:0;font-family:Inter,sans-serif}',
        '.nav-btn{background:var(--text-white);color:#010a13;padding:12px 22px;border-radius:12px;font-size:.78rem;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:.05em;transition:background .25s,color .25s,box-shadow .25s,transform .25s;border:1px solid rgba(255,255,255,.9);box-shadow:0 10px 24px rgba(0,0,0,.14);white-space:nowrap;font-family:Inter,sans-serif}',
        '.nav-btn:hover{background:rgba(255,255,255,.08);color:var(--text-white);box-shadow:0 0 0 1px rgba(255,255,255,.16);transform:translateY(-1px)}',
        '.mobile-toggle{display:none;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;z-index:100000;padding:0;width:44px;height:44px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.04)}',
        '.mobile-toggle span{width:28px;height:2px;background:var(--text-white);transition:.3s cubic-bezier(.68,-.55,.265,1.55);border-radius:2px;display:block}',
        '@media(max-width:1024px){',
        '.navbar{top:10px;width:calc(100% - 24px);height:78px;border-radius:16px}',
        '.navbar.scrolled{height:70px}',
        '.nav-container{padding:0 16px}',
        '.logo{width:min(190px,52vw);height:56px}',
        '.mobile-toggle{display:flex}',
        '.nav-content-wrapper{position:fixed;top:90px;left:50%;width:calc(100vw - 24px);height:auto;max-height:calc(100svh - 110px);overflow-y:auto;background:rgba(4,12,22,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 22px 54px rgba(0,0,0,.42);flex-direction:column;justify-content:flex-start;align-items:center;opacity:0;visibility:hidden;transform:translate(-50%,-12px);transition:opacity .34s,transform .34s,visibility .34s;padding:22px;z-index:99998}',
        '.navbar.mobile-active .nav-content-wrapper{opacity:1;visibility:visible;transform:translate(-50%,0)}',
        '.nav-menu{flex-direction:column;width:100%;text-align:center;gap:4px}',
        '.nav-item{width:100%}',
        '.nav-link{font-size:1.08rem;padding:14px;justify-content:center;color:var(--text-white);border-radius:12px}',
        '.nav-link:hover,.nav-item.active>.nav-link{background:rgba(255,255,255,.06)}',
        '.nav-link::after{display:none}',
        '.dropdown{position:relative;top:0;left:0;transform:none;width:100%;background:transparent;box-shadow:none;border:none;padding:0;display:none;opacity:1;visibility:visible;margin-top:8px}',
        '.nav-item.active .dropdown{display:flex;flex-direction:column;gap:5px}',
        '.dropdown-item{justify-content:center;padding:12px;background:rgba(255,255,255,.03);border-radius:12px;margin-bottom:5px}',
        '.drop-content h4{font-size:1.1rem;margin:0}',
        '.drop-content p{display:none}',
        '.nav-btn{margin-top:16px;font-size:.92rem;padding:15px 30px;width:100%;max-width:300px;text-align:center}',
        '}'
    ].join('');

    var NAV_HTML = '<nav class="navbar" id="main-navbar">' +
        '<div class="nav-container">' +
            '<a href="/" class="logo"><img src="/uploads/logotipo%20de%20partum%20design/partum-logo-dark.png" alt="Logo Partum Design" class="logo-img" width="228" height="70" fetchpriority="high"></a>' +
            '<div class="nav-content-wrapper">' +
                '<ul class="nav-menu">' +
                    '<li class="nav-item"><a href="/" class="nav-link">Inicio</a></li>' +
                    '<li class="nav-item"><a href="/nosotros" class="nav-link">Nosotros</a></li>' +
                    '<li class="nav-item has-dropdown">' +
                        '<a href="#" class="nav-link" id="servicios-toggle">Servicios <i class="fa-solid fa-chevron-down" style="font-size:.8rem;transition:.3s"></i></a>' +
                        '<div class="dropdown">' +
                            '<a href="/identidad-visual-y-corporativa" class="dropdown-item"><div class="drop-content"><h4>Estrategia Digital</h4><p>Crecimiento basado en datos.</p></div></a>' +
                            '<a href="/desarrollo-web" class="dropdown-item"><div class="drop-content"><h4>Desarrollo Web</h4><p>Interfaces premium y alto rendimiento.</p></div></a>' +
                            '<a href="/marketing-digital" class="dropdown-item"><div class="drop-content"><h4>Marketing Digital</h4><p>Posicionamiento y visibilidad de marca.</p></div></a>' +
                            '<a href="/produccion-audiovisual" class="dropdown-item"><div class="drop-content"><h4>Producción Audiovisual</h4><p>Contenido multimedia de alto impacto.</p></div></a>' +
                        '</div>' +
                    '</li>' +
                    '<li class="nav-item"><a href="/contacto" class="nav-link">Contacto</a></li>' +
                '</ul>' +
                '<a href="/contacto" class="nav-btn">Cotizar ahora</a>' +
            '</div>' +
            '<div class="mobile-toggle" id="burger-menu"><span></span><span></span><span></span></div>' +
        '</div>' +
    '</nav>';

    /* ─── Asegurar dependencias (Inter + FontAwesome) ─── */
    function ensureDeps() {
        if (!document.querySelector('link[href*="Inter"]')) {
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(l);
        }
        if (!document.querySelector('link[href*="font-awesome"]')) {
            var fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            document.head.appendChild(fa);
        }
    }

    /* ─── Padding del body según tamaño de pantalla ─── */
    function applyBodyPadding() {
        document.body.style.paddingTop = '0px';
    }

    /* ─── Lógica del navbar ─── */
    function initNavbar() {
        var nav = document.getElementById('main-navbar');
        var burger = document.getElementById('burger-menu');
        var svcToggle = document.getElementById('servicios-toggle');
        if (!nav || !burger) return;

        /* Scroll effect — usando requestAnimationFrame para no bloquear */
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    nav.classList.toggle('scrolled', window.scrollY > 40);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        /* Menú móvil */
        burger.addEventListener('click', function () {
            var open = nav.classList.toggle('mobile-active');
            var spans = burger.querySelectorAll('span');
            document.body.style.overflow = open ? 'hidden' : '';
            spans[0].style.transform = open ? 'rotate(45deg) translate(5px,6px)' : 'none';
            spans[1].style.opacity  = open ? '0' : '1';
            spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-6px)' : 'none';
        });

        /* Acordeón Servicios en móvil */
        if (svcToggle) {
            svcToggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    var li = svcToggle.parentElement;
                    var icon = svcToggle.querySelector('i');
                    li.classList.toggle('active');
                    icon.style.transform = li.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        /* Cerrar menú móvil al hacer clic en un enlace */
        nav.querySelectorAll('.nav-link:not(#servicios-toggle), .dropdown-item').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 1024) {
                    nav.classList.remove('mobile-active');
                    document.body.style.overflow = '';
                    burger.querySelectorAll('span').forEach(function (s) { s.style.transform = 'none'; s.style.opacity = '1'; });
                }
            });
        });

        /* Resaltar página activa */
        var path = window.location.pathname.replace(/\/$/, '') || '/';
        nav.querySelectorAll('a[href]').forEach(function (link) {
            var href = link.getAttribute('href').replace(/\/$/, '') || '/';
            if (href === path || (href !== '/' && path.startsWith(href))) {
                var li = link.closest('.nav-item');
                if (li) li.classList.add('active');
            }
        });
    }

    /* ─── Cargar footer (sólo el footer es fetch, está al fondo) ─── */
    function loadFooter(el) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/assets/partials/footer-partial.html', true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) el.innerHTML = xhr.responseText;
        };
        xhr.send();
    }

    /* ═══════════════════════════════════════════════════════════
       CURSOR PERSONALIZADO — visible sobre cualquier fondo
       (usa mix-blend-mode: difference, así que siempre contrasta
       con lo que tenga debajo, claro u oscuro).
       Solo se activa en dispositivos con puntero fino (mouse/trackpad).
       ═══════════════════════════════════════════════════════════ */
    var CURSOR_CSS = [
        'html.has-fine-cursor, html.has-fine-cursor a, html.has-fine-cursor button,',
        'html.has-fine-cursor input, html.has-fine-cursor textarea, html.has-fine-cursor select,',
        'html.has-fine-cursor [role="button"], html.has-fine-cursor label { cursor: none !important; }',
        '.pd-cursor-dot, .pd-cursor-ring {',
        '  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 2147483000;',
        '  border-radius: 50%; mix-blend-mode: difference; background: #fff;',
        '  transform: translate3d(-50%,-50%,0); opacity: 0; will-change: transform;',
        '}',
        '.pd-cursor-dot { width: 7px; height: 7px; transition: opacity .25s ease, width .2s ease, height .2s ease; }',
        '.pd-cursor-ring { width: 34px; height: 34px; background: transparent; border: 1.5px solid #fff; transition: opacity .25s ease, width .2s ease, height .2s ease, border-width .2s ease; }',
        'html.has-fine-cursor.pd-cursor-active .pd-cursor-dot,',
        'html.has-fine-cursor.pd-cursor-active .pd-cursor-ring { opacity: 1; }',
        'html.pd-cursor-hover .pd-cursor-ring { width: 56px; height: 56px; border-width: 1px; }',
        'html.pd-cursor-hover .pd-cursor-dot { width: 0; height: 0; }',
        '@media (pointer: coarse) { .pd-cursor-dot, .pd-cursor-ring { display: none !important; } }'
    ].join('');

    function initCustomCursor() {
        if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;

        var styleEl = document.createElement('style');
        styleEl.textContent = CURSOR_CSS;
        document.head.appendChild(styleEl);

        var dot = document.createElement('div');
        dot.className = 'pd-cursor-dot';
        var ring = document.createElement('div');
        ring.className = 'pd-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        document.documentElement.classList.add('has-fine-cursor');

        var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, active = false;
        var HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, .nav-link, .footer-link, .social-link, .whatsapp-float, .pd-nora-fab';

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0) translate(-50%,-50%)';
            if (!active) {
                active = true;
                document.documentElement.classList.add('pd-cursor-active');
            }
            var target = e.target;
            var isHover = target && target.closest && target.closest(HOVER_SELECTOR);
            document.documentElement.classList.toggle('pd-cursor-hover', !!isHover);
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            document.documentElement.classList.remove('pd-cursor-active');
        });
        document.addEventListener('mouseenter', function () {
            if (mouseX || mouseY) document.documentElement.classList.add('pd-cursor-active');
        });

        function raf() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0) translate(-50%,-50%)';
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* ═══════════════════════════════════════════════════════════
       NORA — asistente virtual (Gemini vía /api/nora, sin exponer
       la API key en el navegador). Alcance limitado a Partum Design
       y con límite de mensajes por sesión para controlar el costo.
       ═══════════════════════════════════════════════════════════ */
    var NORA_SESSION_LIMIT = 12;
    var NORA_STORAGE_KEY = 'pd_nora_count';

    var NORA_CSS = [
        '.pd-nora-fab { position: fixed; left: 24px; bottom: 24px; width: 60px; height: 60px; border-radius: 50%;',
        '  background: linear-gradient(135deg,#6366f1,#0ea5e9); display: flex; align-items: center; justify-content: center;',
        '  color: #fff; font-size: 1.4rem; border: none; cursor: pointer; z-index: 999998;',
        '  box-shadow: 0 10px 30px rgba(99,102,241,.45); animation: pdNoraPulse 2.6s infinite; transition: transform .25s ease, box-shadow .25s ease; }',
        '.pd-nora-fab:hover { transform: translateY(-3px) scale(1.05); }',
        '.pd-nora-fab.pd-open { animation: none; }',
        '@keyframes pdNoraPulse { 0% { box-shadow: 0 10px 30px rgba(99,102,241,.45), 0 0 0 0 rgba(99,102,241,.5); } 70% { box-shadow: 0 10px 30px rgba(99,102,241,.45), 0 0 0 14px rgba(99,102,241,0); } 100% { box-shadow: 0 10px 30px rgba(99,102,241,.45), 0 0 0 0 rgba(99,102,241,0); } }',
        '@media (max-width: 768px) { .pd-nora-fab { left: 18px; bottom: 18px; width: 54px; height: 54px; font-size: 1.25rem; } }',
        '.pd-nora-panel { position: fixed; left: 24px; bottom: 96px; width: 368px; max-width: calc(100vw - 36px); height: 520px; max-height: calc(100vh - 130px);',
        '  background: linear-gradient(180deg, rgba(9,16,28,.97), rgba(4,10,19,.99)); border: 1px solid rgba(255,255,255,.1); border-radius: 20px;',
        '  box-shadow: 0 30px 70px rgba(0,0,0,.55); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);',
        '  display: flex; flex-direction: column; overflow: hidden; z-index: 999997; font-family: Inter, sans-serif;',
        '  opacity: 0; visibility: hidden; transform: translateY(16px) scale(.97); transition: opacity .25s ease, transform .25s ease, visibility .25s; }',
        '.pd-nora-panel.pd-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }',
        '@media (max-width: 768px) { .pd-nora-panel { left: 18px; bottom: 84px; height: 68vh; } }',
        '.pd-nora-head { display: flex; align-items: center; gap: 10px; padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,.08); }',
        '.pd-nora-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#0ea5e9); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1rem; flex-shrink: 0; }',
        '.pd-nora-title { display: flex; flex-direction: column; line-height: 1.25; }',
        '.pd-nora-title strong { color: #fff; font-size: .95rem; font-weight: 800; }',
        '.pd-nora-title span { color: rgba(255,255,255,.55); font-size: .74rem; display: flex; align-items: center; gap: 5px; }',
        '.pd-nora-dot-live { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; display: inline-block; }',
        '.pd-nora-close { margin-left: auto; background: transparent; border: none; color: rgba(255,255,255,.55); font-size: 1.1rem; cursor: pointer; padding: 6px; line-height: 1; }',
        '.pd-nora-close:hover { color: #fff; }',
        '.pd-nora-body { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }',
        '.pd-nora-body::-webkit-scrollbar { width: 6px; }',
        '.pd-nora-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 6px; }',
        '.pd-nora-msg { max-width: 84%; padding: 10px 13px; border-radius: 14px; font-size: .85rem; line-height: 1.5; white-space: pre-wrap; }',
        '.pd-nora-msg.bot { align-self: flex-start; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.88); border-bottom-left-radius: 4px; }',
        '.pd-nora-msg.user { align-self: flex-end; background: linear-gradient(135deg,#6366f1,#0ea5e9); color: #fff; border-bottom-right-radius: 4px; }',
        '.pd-nora-msg.system { align-self: center; background: transparent; color: rgba(255,255,255,.45); font-size: .74rem; text-align: center; max-width: 100%; }',
        '.pd-nora-typing { align-self: flex-start; display: flex; gap: 4px; padding: 10px 13px; }',
        '.pd-nora-typing span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.5); animation: pdNoraBounce 1.2s infinite ease-in-out; }',
        '.pd-nora-typing span:nth-child(2) { animation-delay: .15s; } .pd-nora-typing span:nth-child(3) { animation-delay: .3s; }',
        '@keyframes pdNoraBounce { 0%,60%,100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }',
        '.pd-nora-foot { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-top: 1px solid rgba(255,255,255,.08); }',
        '.pd-nora-input { flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 10px 13px; color: #fff; font-size: .85rem; font-family: Inter, sans-serif; outline: none; }',
        '.pd-nora-input::placeholder { color: rgba(255,255,255,.4); }',
        '.pd-nora-input:focus { border-color: #6366f1; }',
        '.pd-nora-send { width: 38px; height: 38px; flex-shrink: 0; border-radius: 10px; border: none; background: linear-gradient(135deg,#6366f1,#0ea5e9); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity .2s; }',
        '.pd-nora-send:disabled { opacity: .45; cursor: not-allowed; }'
    ].join('');

    var NORA_HTML_FAB = '<button type="button" class="pd-nora-fab" id="pdNoraFab" aria-label="Abrir asistente NORA"><i class="fas fa-wand-magic-sparkles"></i></button>';

    var NORA_HTML_PANEL =
        '<div class="pd-nora-panel" id="pdNoraPanel" role="dialog" aria-label="Chat con NORA">' +
            '<div class="pd-nora-head">' +
                '<div class="pd-nora-avatar"><i class="fas fa-wand-magic-sparkles"></i></div>' +
                '<div class="pd-nora-title"><strong>NORA</strong><span><i class="pd-nora-dot-live"></i>Asistente de Partum Design</span></div>' +
                '<button type="button" class="pd-nora-close" id="pdNoraClose" aria-label="Cerrar chat">✕</button>' +
            '</div>' +
            '<div class="pd-nora-body" id="pdNoraBody"></div>' +
            '<div class="pd-nora-foot">' +
                '<input type="text" class="pd-nora-input" id="pdNoraInput" placeholder="Pregúntame sobre Partum Design…" maxlength="400" autocomplete="off">' +
                '<button type="button" class="pd-nora-send" id="pdNoraSend" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>' +
            '</div>' +
        '</div>';

    function noraGetCount() {
        try { return parseInt(sessionStorage.getItem(NORA_STORAGE_KEY) || '0', 10); } catch (e) { return 0; }
    }
    function noraSetCount(n) {
        try { sessionStorage.setItem(NORA_STORAGE_KEY, String(n)); } catch (e) { /* almacenamiento no disponible */ }
    }

    function initNora() {
        var styleEl = document.createElement('style');
        styleEl.textContent = NORA_CSS;
        document.head.appendChild(styleEl);

        var wrap = document.createElement('div');
        wrap.innerHTML = NORA_HTML_FAB + NORA_HTML_PANEL;
        document.body.appendChild(wrap);

        var fab = document.getElementById('pdNoraFab');
        var panel = document.getElementById('pdNoraPanel');
        var closeBtn = document.getElementById('pdNoraClose');
        var body = document.getElementById('pdNoraBody');
        var input = document.getElementById('pdNoraInput');
        var sendBtn = document.getElementById('pdNoraSend');

        var history = [];
        var opened = false;
        var busy = false;

        function addMsg(text, role) {
            var el = document.createElement('div');
            el.className = 'pd-nora-msg ' + role;
            el.textContent = text;
            body.appendChild(el);
            body.scrollTop = body.scrollHeight;
            return el;
        }

        function showTyping() {
            var el = document.createElement('div');
            el.className = 'pd-nora-typing';
            el.id = 'pdNoraTyping';
            el.innerHTML = '<span></span><span></span><span></span>';
            body.appendChild(el);
            body.scrollTop = body.scrollHeight;
        }
        function hideTyping() {
            var el = document.getElementById('pdNoraTyping');
            if (el) el.remove();
        }

        function setBusy(v) {
            busy = v;
            sendBtn.disabled = v;
            input.disabled = v;
        }

        function lockSession(message) {
            addMsg(message, 'system');
            input.disabled = true;
            sendBtn.disabled = true;
            input.placeholder = 'Límite de mensajes alcanzado';
        }

        function sendMessage() {
            var text = input.value.trim();
            if (!text || busy) return;

            var count = noraGetCount();
            if (count >= NORA_SESSION_LIMIT) {
                lockSession('Llegaste al límite de preguntas de esta sesión. Escríbenos por WhatsApp para seguir platicando: https://wa.me/525616044547');
                return;
            }

            addMsg(text, 'user');
            input.value = '';
            setBusy(true);
            showTyping();

            fetch('/api/nora', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: history })
            }).then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
            .then(function (res) {
                hideTyping();
                if (!res.ok) {
                    var msg = (res.data && res.data.message) || 'NORA no pudo responder, intenta de nuevo en un momento.';
                    addMsg(msg, 'system');
                    return;
                }
                var reply = (res.data && res.data.reply) || 'No tengo respuesta para eso ahora mismo.';
                addMsg(reply, 'bot');
                history.push({ role: 'user', text: text });
                history.push({ role: 'model', text: reply });
                noraSetCount(count + 1);
            })
            .catch(function () {
                hideTyping();
                addMsg('No pude conectar con NORA. Revisa tu conexión e intenta de nuevo.', 'system');
            })
            .finally(function () {
                setBusy(false);
                input.focus();
            });
        }

        function openPanel() {
            opened = true;
            panel.classList.add('pd-open');
            fab.classList.add('pd-open');
            if (!body.childElementCount) {
                addMsg('¡Hola! Soy NORA, la asistente de Partum Design. Puedo ayudarte con dudas sobre nuestros servicios, aplicaciones (NORA AI, Medical OS) o cómo contactarnos.', 'bot');
            }
            setTimeout(function () { input.focus(); }, 200);
        }
        function closePanel() {
            opened = false;
            panel.classList.remove('pd-open');
            fab.classList.remove('pd-open');
        }

        fab.addEventListener('click', function () { opened ? closePanel() : openPanel(); });
        closeBtn.addEventListener('click', closePanel);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    }

    /* ─── Inicialización ─── */
    function init() {
        ensureDeps();

        /* Navbar — sin petición de red, aparece inmediatamente */
        var styleEl = document.createElement('style');
        styleEl.textContent = NAV_CSS;
        document.head.appendChild(styleEl);

        var headerEl = document.createElement('div');
        headerEl.id = 'site-header';
        headerEl.innerHTML = NAV_HTML;
        document.body.insertBefore(headerEl, document.body.firstChild);

        applyBodyPadding();
        window.addEventListener('resize', applyBodyPadding, { passive: true });
        initNavbar();

        /* Footer — petición asíncrona al fondo de la página */
        var footerEl = document.createElement('div');
        footerEl.id = 'site-footer';
        document.body.appendChild(footerEl);
        loadFooter(footerEl);

        /* Cursor personalizado + asistente NORA */
        initCustomCursor();
        initNora();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

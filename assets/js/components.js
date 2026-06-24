(function () {
    'use strict';

    /* ─── NAVBAR HTML + CSS incrustado (sin petición de red) ─── */
    var NAV_CSS = [
        ':root{--dark-bg:#010a13;--accent:#6366f1;--nav-height:95px;--nav-height-scrolled:75px;--text-white:#fff;--text-muted:rgba(255,255,255,.75);--glass-bg:rgba(1,10,19,.85)}',
        'html{scroll-behavior:smooth}',
        '.navbar{position:fixed;top:0;left:0;width:100%;height:var(--nav-height);z-index:99999;display:flex;align-items:center;transition:height .4s cubic-bezier(.4,0,.2,1),background .4s,box-shadow .4s;background:var(--glass-bg);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);border-bottom:1px solid rgba(255,255,255,.05);will-change:height,background}',
        '.navbar.scrolled{height:var(--nav-height-scrolled);background:rgba(1,10,19,.98);box-shadow:0 10px 40px rgba(0,0,0,.5)}',
        '.nav-container{width:100%;max-width:1440px;margin:0 auto;padding:0 50px;display:flex;align-items:center;justify-content:space-between}',
        '.logo{display:block;width:240px;height:50px;transition:width .4s ease,height .4s ease;flex-shrink:0;z-index:100000;position:relative}',
        '.logo-img{width:100%;height:100%;object-fit:contain;object-position:left center}',
        '.navbar.scrolled .logo{width:190px;height:40px}',
        '.nav-content-wrapper{display:flex;align-items:center;gap:40px}',
        '.nav-menu{display:flex;align-items:center;gap:35px;list-style:none;margin:0;padding:0}',
        '.nav-item{position:relative}',
        '.nav-link{color:var(--text-muted);text-decoration:none;font-size:.9rem;font-weight:500;padding:10px 0;display:flex;align-items:center;gap:8px;transition:color .3s ease;font-family:Inter,sans-serif}',
        '.nav-link:hover,.nav-item.active>.nav-link{color:var(--text-white)}',
        '.nav-link::after{content:"";position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:var(--accent);transition:width .3s ease}',
        '.nav-link:hover::after{width:100%}',
        '.dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(10,18,30,.95);border:1px solid rgba(255,255,255,.05);border-radius:12px;min-width:280px;padding:12px;opacity:0;visibility:hidden;transition:opacity .3s,transform .3s,visibility .3s;box-shadow:0 20px 40px rgba(0,0,0,.6);backdrop-filter:blur(20px)}',
        '@media(min-width:1025px){.nav-item.has-dropdown:hover .dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(10px)}}',
        '.dropdown-item{display:flex;align-items:center;padding:12px 15px;text-decoration:none;border-radius:8px;transition:background .2s}',
        '.dropdown-item:hover{background:rgba(255,255,255,.08)}',
        '.drop-content h4{font-size:.9rem;color:var(--text-white);margin:0 0 4px;font-weight:600;font-family:Inter,sans-serif}',
        '.drop-content p{font-size:.75rem;color:var(--text-muted);margin:0;font-family:Inter,sans-serif}',
        '.nav-btn{background:var(--text-white);color:#010a13;padding:12px 24px;border-radius:8px;font-size:.8rem;font-weight:800;text-decoration:none;text-transform:uppercase;letter-spacing:.05em;transition:background .3s,color .3s;border:2px solid var(--text-white);white-space:nowrap;font-family:Inter,sans-serif}',
        '.nav-btn:hover{background:transparent;color:var(--text-white)}',
        '.mobile-toggle{display:none;flex-direction:column;gap:6px;cursor:pointer;z-index:100000;padding:10px}',
        '.mobile-toggle span{width:28px;height:2px;background:var(--text-white);transition:.3s cubic-bezier(.68,-.55,.265,1.55);border-radius:2px;display:block}',
        '@media(max-width:1024px){',
        '.navbar{height:75px}',
        '.nav-container{padding:0 20px}',
        '.logo{width:180px;height:40px}',
        '.mobile-toggle{display:flex}',
        '.nav-content-wrapper{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(1,10,19,.98);backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);flex-direction:column;justify-content:center;align-items:center;opacity:0;visibility:hidden;transform:translateY(-20px);transition:opacity .4s,transform .4s,visibility .4s;padding:20px;z-index:99998}',
        '.navbar.mobile-active .nav-content-wrapper{opacity:1;visibility:visible;transform:translateY(0)}',
        '.nav-menu{flex-direction:column;width:100%;text-align:center;gap:10px}',
        '.nav-item{width:100%}',
        '.nav-link{font-size:1.5rem;padding:15px;justify-content:center;color:var(--text-white)}',
        '.nav-link::after{display:none}',
        '.dropdown{position:relative;top:0;left:0;transform:none;width:100%;background:transparent;box-shadow:none;border:none;padding:0;display:none;opacity:1;visibility:visible;margin-top:10px}',
        '.nav-item.active .dropdown{display:flex;flex-direction:column;gap:5px}',
        '.dropdown-item{justify-content:center;padding:12px;background:rgba(255,255,255,.03);border-radius:12px;margin-bottom:5px}',
        '.drop-content h4{font-size:1.1rem;margin:0}',
        '.drop-content p{display:none}',
        '.nav-btn{margin-top:30px;font-size:1rem;padding:15px 30px;width:100%;max-width:300px;text-align:center}',
        '}'
    ].join('');

    var NAV_HTML = '<nav class="navbar" id="main-navbar">' +
        '<div class="nav-container">' +
            '<a href="/" class="logo"><img src="https://partumdesign.com.mx/wp-content/uploads/2024/10/xx-e1771301244701.png" alt="Logo Partum Design" class="logo-img" width="240" height="50" fetchpriority="high"></a>' +
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
        document.body.style.paddingTop = window.innerWidth <= 1024 ? '75px' : '95px';
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

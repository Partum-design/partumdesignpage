/*
 * Fuente de datos compartida de paquetes comerciales (Partum Design).
 * Consumida por index.html (Home) y por las páginas de servicio, para que
 * "MÁS POPULAR", el indicador de soporte y los precios NUNCA se dupliquen
 * manualmente y se mantengan sincronizados en un solo lugar.
 *
 * Precios y características: reales, tomados de la sección original de
 * planes del Home. No modificar cantidades sin instrucción explícita.
 */
(function () {
    'use strict';

    var SUPPORT_INDICATOR = 'SOPORTE ACTIVO · RESPUESTA EN < 24H';

    var PARTUM_PLANS = [
        {
            id: 'essential-kit',
            title: 'Essential Kit',
            subtitle: 'Presencia & Marca',
            price: '$1,200',
            priceNote: 'Desde',
            popular: false,
            features: [
                'Identidad Visual (Logo & UI Kit)',
                'Web One-Page de Alto Impacto',
                'Optimización SEO Estructural'
            ],
            ctaLabel: 'Cotizar Proyecto',
            ctaHref: '/contacto2',
            ctaStyle: 'outline'
        },
        {
            id: 'growth-engine',
            title: 'Growth Engine',
            subtitle: 'Web + Ads + Conversión',
            price: '$2,500',
            priceNote: 'Desde',
            popular: true,
            features: [
                { text: 'Funnel de Ventas Completo', highlight: true, icon: 'fa-fire' },
                'Gestión de Meta & Google Ads',
                'Landing Pages Optimizadas',
                'Dashboard de Resultados 24/7'
            ],
            ctaLabel: 'Hablar con un Especialista',
            ctaHref: '/contacto2',
            ctaStyle: 'solid'
        },
        {
            id: 'elite-partner',
            title: 'Elite Partner',
            subtitle: 'Solución 360° Premium',
            price: '$4,500',
            priceNote: 'Desde',
            popular: false,
            features: [
                'Todo lo del Plan Performance',
                'Rebranding & Estrategia de Marca',
                'Estrategia de Contenido & CRM',
                { text: 'Soporte Prioritario VIP', highlight: true, icon: 'fa-star' }
            ],
            ctaLabel: 'Solicitar Consultoría',
            ctaHref: '/contacto2',
            ctaStyle: 'outline'
        }
    ];

    window.PARTUM_PLANS = PARTUM_PLANS;
    window.PARTUM_SUPPORT_INDICATOR = SUPPORT_INDICATOR;

    var CSS = [
        '#planes-partum-premium{padding:120px 5% !important;background-color:#010a13 !important;position:relative !important;overflow:hidden !important;color:#fff !important;font-family:"Montserrat",sans-serif !important;}',
        '#planes-partum-premium *,#planes-partum-premium *::before,#planes-partum-premium *::after{box-sizing:border-box !important;}',
        '#planes-partum-premium .bg-grid-texture{position:absolute !important;inset:0 !important;opacity:.05 !important;pointer-events:none !important;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px) !important;background-size:50px 50px !important;z-index:0 !important;mask-image:radial-gradient(ellipse 100% 100% at 50% 0%,black 10%,transparent 80%) !important;-webkit-mask-image:radial-gradient(ellipse 100% 100% at 50% 0%,black 10%,transparent 80%) !important;}',
        '#planes-partum-premium .light-orb{position:absolute !important;border-radius:50% !important;filter:blur(100px) !important;pointer-events:none !important;z-index:1 !important;animation:planesOrbFloat 10s infinite alternate ease-in-out !important;}',
        '#planes-partum-premium .orb-1{top:-10%;left:-5%;width:450px;height:450px;background:rgba(0,85,255,.15) !important;}',
        '#planes-partum-premium .orb-2{bottom:-10%;right:-5%;width:550px;height:550px;background:rgba(79,172,254,.12) !important;animation-delay:-5s !important;}',
        '#planes-partum-premium .orb-3{top:40%;left:50%;transform:translate(-50%,-50%);width:300px;height:300px;background:rgba(0,85,255,.1) !important;animation-delay:-2s !important;}',
        '@keyframes planesOrbFloat{0%{transform:translateY(0) scale(1);}100%{transform:translateY(-40px) scale(1.1);}}',
        '#planes-partum-premium .premium-title{font-size:clamp(28px,4vw,48px) !important;font-weight:900 !important;letter-spacing:-.03em !important;line-height:1.2 !important;color:#fff !important;position:relative !important;z-index:10 !important;margin-bottom:14px !important;}',
        '#planes-partum-premium .premium-title em{font-style:normal !important;background:linear-gradient(135deg,#4facfe 0%,#0055ff 100%) !important;-webkit-background-clip:text !important;background-clip:text !important;-webkit-text-fill-color:transparent !important;}',
        '#planes-partum-premium .planes-support{position:relative !important;z-index:10 !important;display:inline-flex !important;align-items:center !important;gap:8px !important;margin:0 auto 56px !important;padding:8px 18px !important;border-radius:999px !important;background:rgba(16,185,129,.12) !important;border:1px solid rgba(16,185,129,.35) !important;color:#6ee7b7 !important;font-size:.7rem !important;font-weight:800 !important;letter-spacing:.12em !important;text-transform:uppercase !important;}',
        '#planes-partum-premium .planes-support .dot{width:7px !important;height:7px !important;border-radius:50% !important;background:#34d399 !important;box-shadow:0 0 0 3px rgba(52,211,153,.25) !important;animation:planesPulseDot 2s ease-in-out infinite !important;}',
        '@keyframes planesPulseDot{0%,100%{opacity:1;}50%{opacity:.4;}}',
        '#planes-partum-premium .planes-grid{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:2rem !important;max-width:1200px !important;margin:0 auto !important;align-items:stretch !important;position:relative !important;z-index:10 !important;}',
        '@media(max-width:992px){#planes-partum-premium .planes-grid{grid-template-columns:1fr !important;max-width:500px !important;}}',
        '#planes-partum-premium .glass-card{background:rgba(255,255,255,.02) !important;backdrop-filter:blur(12px) !important;-webkit-backdrop-filter:blur(12px) !important;border:1px solid rgba(255,255,255,.05) !important;border-radius:2.5rem !important;padding:2.5rem !important;display:flex !important;flex-direction:column !important;transition:all .4s cubic-bezier(.25,1,.5,1) !important;position:relative !important;overflow:hidden !important;}',
        '#planes-partum-premium .glass-card::before,#planes-partum-premium .card-destacada-inner::before{content:"" !important;position:absolute !important;inset:0 !important;border-radius:inherit !important;background:radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%),rgba(0,85,255,.2),transparent 40%) !important;opacity:0 !important;transition:opacity .4s ease !important;pointer-events:none !important;z-index:0 !important;}',
        '#planes-partum-premium .glass-card:hover::before,#planes-partum-premium .card-destacada-inner:hover::before{opacity:1 !important;}',
        '#planes-partum-premium .card-content-wrapper{position:relative !important;z-index:10 !important;display:flex !important;flex-direction:column !important;height:100% !important;}',
        '#planes-partum-premium .card-normal{transition:all .4s cubic-bezier(.25,1,.5,1) !important;}',
        '#planes-partum-premium .card-normal:hover{border-color:rgba(0,85,255,.5) !important;transform:translateY(-8px) !important;box-shadow:0 15px 40px -10px rgba(0,85,255,.2),inset 0 0 20px rgba(0,85,255,.05) !important;}',
        '#planes-partum-premium .card-destacada-wrapper{background:linear-gradient(to bottom,rgba(0,85,255,.8),rgba(0,85,255,.1) 60%,transparent) !important;padding:1px !important;border-radius:2.5rem !important;transition:all .4s cubic-bezier(.25,1,.5,1) !important;display:flex !important;flex-direction:column !important;position:relative !important;}',
        '@media(min-width:993px){#planes-partum-premium .planes-grid{margin-bottom:60px !important;}#planes-partum-premium .card-normal{transform:translateY(45px) !important;}#planes-partum-premium .card-normal:hover{transform:translateY(35px) !important;border-color:rgba(0,85,255,.5) !important;}#planes-partum-premium .card-destacada-wrapper{transform:translateY(-25px) !important;}#planes-partum-premium .card-destacada-wrapper:hover{transform:translateY(-35px) scale(1.02) !important;}}',
        '#planes-partum-premium .card-destacada-inner{background:#020d1a !important;border-radius:calc(2.5rem - 1px) !important;height:100% !important;padding:2.5rem !important;display:flex !important;flex-direction:column !important;position:relative !important;overflow:hidden !important;}',
        '#planes-partum-premium .badge-popular{position:absolute !important;top:0 !important;right:2.5rem !important;background:linear-gradient(135deg,#0055ff,#4facfe) !important;color:#fff !important;font-size:.6rem !important;font-weight:900 !important;text-transform:uppercase !important;letter-spacing:.2em !important;padding:.5rem 1.2rem !important;border-radius:0 0 .75rem .75rem !important;box-shadow:0 8px 24px rgba(0,85,255,.4) !important;z-index:20 !important;}',
        '#planes-partum-premium .btn-outline{width:100% !important;padding:1.2rem !important;border-radius:1rem !important;border:1px solid rgba(255,255,255,.2) !important;background:transparent !important;color:#fff !important;font-size:.65rem !important;font-weight:900 !important;text-transform:uppercase !important;letter-spacing:.2em !important;cursor:pointer !important;transition:all .3s ease !important;margin-top:auto !important;text-align:center !important;text-decoration:none !important;display:block !important;position:relative !important;z-index:10 !important;}',
        '#planes-partum-premium .btn-outline:hover,#planes-partum-premium .btn-outline:focus-visible{background:#fff !important;color:#000 !important;border-color:#fff !important;box-shadow:0 10px 30px rgba(255,255,255,.2) !important;}',
        '#planes-partum-premium .btn-solid{width:100% !important;padding:1.2rem !important;border-radius:1rem !important;background:#fff !important;border:none !important;color:#010a13 !important;font-size:.65rem !important;font-weight:900 !important;text-transform:uppercase !important;letter-spacing:.2em !important;cursor:pointer !important;transition:all .3s ease !important;margin-top:auto !important;text-align:center !important;text-decoration:none !important;display:block !important;box-shadow:0 20px 40px -10px rgba(0,85,255,.5) !important;position:relative !important;z-index:10 !important;}',
        '#planes-partum-premium .btn-solid:hover,#planes-partum-premium .btn-solid:focus-visible{transform:scale(.97) !important;background:#e2e8f0 !important;}',
        '#planes-partum-premium .plan-title{font-size:1.6rem !important;font-weight:800 !important;margin-bottom:.5rem !important;color:#fff !important;}',
        '#planes-partum-premium .plan-subtitle{color:#fff !important;font-size:.65rem !important;text-transform:uppercase !important;font-weight:800 !important;letter-spacing:.2em !important;margin-bottom:1.5rem !important;}',
        '#planes-partum-premium .plan-price{font-size:2.4rem !important;font-weight:900 !important;color:#fff !important;}',
        '#planes-partum-premium .plan-price-note{font-size:.625rem !important;color:#94a3b8 !important;text-transform:uppercase !important;font-weight:700 !important;}',
        '#planes-partum-premium .plan-list{list-style:none !important;padding:0 !important;margin:0 0 2.5rem !important;flex-grow:1 !important;}',
        '#planes-partum-premium .plan-list li{display:flex !important;align-items:flex-start !important;gap:.8rem !important;font-size:.95rem !important;color:#cbd5e1 !important;margin-bottom:1.2rem !important;line-height:1.4 !important;font-weight:400 !important;}',
        '#planes-partum-premium .plan-list i.fa-check{color:#4facfe !important;margin-top:.25rem !important;font-size:.9rem !important;}',
        '#planes-partum-premium .plan-list i.fa-fire{color:#f97316 !important;margin-top:.2rem !important;}',
        '#planes-partum-premium .plan-list i.fa-star{color:#fbbf24 !important;margin-top:.2rem !important;}',
        '@media(max-width:480px){#planes-partum-premium{padding:80px 5% !important;}#planes-partum-premium .glass-card,#planes-partum-premium .card-destacada-inner{padding:2rem 1.5rem !important;}}'
    ].join('');

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function renderFeature(f) {
        if (typeof f === 'string') {
            return '<li><i class="fa-solid fa-check" aria-hidden="true"></i><span>' + escapeHtml(f) + '</span></li>';
        }
        var icon = f.icon || 'fa-check';
        var cls = f.highlight ? ' text-white font-medium' : '';
        var extra = icon === 'fa-fire' ? ' text-orange-500 animate-pulse' : (icon === 'fa-star' ? ' text-amber-400' : '');
        return '<li><i class="fa-solid ' + icon + extra + ' mt-1" aria-hidden="true"></i><span class="' + cls + '">' + escapeHtml(f.text) + '</span></li>';
    }

    function renderCard(plan) {
        var featuresHtml = plan.features.map(renderFeature).join('');
        if (plan.popular) {
            return (
                '<div class="card-destacada-wrapper interactive-light">' +
                    '<div class="card-destacada-inner">' +
                        '<div class="badge-popular">Más Popular</div>' +
                        '<div class="card-content-wrapper">' +
                            '<div class="mb-8 mt-4">' +
                                '<h3 class="plan-title">' + escapeHtml(plan.title) + '</h3>' +
                                '<p class="plan-subtitle">' + escapeHtml(plan.subtitle) + '</p>' +
                                '<div class="flex items-baseline gap-2">' +
                                    '<span class="plan-price">' + escapeHtml(plan.price) + '</span>' +
                                    '<span class="plan-price-note">' + escapeHtml(plan.priceNote) + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<ul class="plan-list">' + featuresHtml + '</ul>' +
                            '<a href="' + plan.ctaHref + '" class="btn-solid">' + escapeHtml(plan.ctaLabel) + '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }
        var btnClass = plan.ctaStyle === 'solid' ? 'btn-solid' : 'btn-outline';
        return (
            '<div class="glass-card card-normal interactive-light">' +
                '<div class="card-content-wrapper">' +
                    '<div class="mb-8">' +
                        '<h3 class="plan-title">' + escapeHtml(plan.title) + '</h3>' +
                        '<p class="plan-subtitle">' + escapeHtml(plan.subtitle) + '</p>' +
                        '<div class="flex items-baseline gap-2">' +
                            '<span class="plan-price">' + escapeHtml(plan.price) + '</span>' +
                            '<span class="plan-price-note">' + escapeHtml(plan.priceNote) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<ul class="plan-list">' + featuresHtml + '</ul>' +
                    '<a href="' + plan.ctaHref + '" class="' + btnClass + '">' + escapeHtml(plan.ctaLabel) + '</a>' +
                '</div>' +
            '</div>'
        );
    }

    function renderSection() {
        var cardsHtml = PARTUM_PLANS.map(renderCard).join('');
        return (
            '<section id="planes-partum-premium">' +
                '<div class="bg-grid-texture"></div>' +
                '<div class="light-orb orb-1"></div>' +
                '<div class="light-orb orb-2"></div>' +
                '<div class="light-orb orb-3"></div>' +
                '<div class="relative z-10">' +
                    '<div class="text-center mb-6 lg:mb-8">' +
                        '<h2 class="premium-title">Nuestros planes<br><em>y qué incluyen.</em></h2>' +
                        '<p class="text-slate-400 uppercase text-[9px] md:text-[10px] tracking-[0.4em] font-bold mt-6">Precios claros, sin letra chica</p>' +
                    '</div>' +
                    '<div class="text-center mb-16 lg:mb-20">' +
                        '<span class="planes-support"><span class="dot" aria-hidden="true"></span>' + escapeHtml(SUPPORT_INDICATOR) + '</span>' +
                    '</div>' +
                    '<div class="planes-grid">' + cardsHtml + '</div>' +
                    '<div class="mt-16 lg:mt-24 text-center">' +
                        '<p class="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] mb-4">¿Dudas? Escríbenos y te orientamos sin compromiso</p>' +
                    '</div>' +
                '</div>' +
            '</section>'
        );
    }

    function initInteractiveLight(root) {
        var cards = root.querySelectorAll('.interactive-light');
        cards.forEach(function (wrapper) {
            var card = wrapper.classList.contains('card-destacada-wrapper')
                ? wrapper.querySelector('.card-destacada-inner')
                : wrapper;
            wrapper.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
            });
        });
    }

    function mount() {
        var targets = document.querySelectorAll('[data-planes-mount]');
        if (!targets.length) return;

        if (!document.getElementById('partum-planes-style')) {
            var styleEl = document.createElement('style');
            styleEl.id = 'partum-planes-style';
            styleEl.textContent = CSS;
            document.head.appendChild(styleEl);
        }

        targets.forEach(function (target) {
            target.innerHTML = renderSection();
            initInteractiveLight(target);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();

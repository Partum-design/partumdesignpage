/* Partum Design — interacciones y animaciones v2
   Depende (opcional) de GSAP + ScrollTrigger + Lenis. Si no cargan, el sitio
   sigue funcionando y el contenido se muestra sin animación. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var WA = '525616044547';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  if (!hasGsap || reduce) doc.classList.remove('js-anim');
  window.__partumReady = true;

  /* ---------- Loader (solo la primera visita de la sesión) ---------- */
  var loader = $('.loader');
  if (loader) {
    var seen = doc.classList.contains('intro-seen');
    try { sessionStorage.setItem('partum-intro', '1'); } catch (e) {}
    if (seen || reduce || !hasGsap) loader.remove();
    else setTimeout(function () { loader.classList.add('is-done'); setTimeout(function () { loader.remove(); }, 700); }, 1300);
  }
  var introDelay = loader && document.body.contains(loader) ? 1.1 : 0.1;

  /* ---------- Navegación ---------- */
  var nav = $('.nav');
  if (nav) {
    var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    $$('a[href]', nav).forEach(function (a) {
      var h = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (h === path || (path === '/index' && h === '/')) a.setAttribute('aria-current', 'page');
    });
    if ($('.nav__drop [aria-current]', nav)) $('.nav__item--drop > .nav__link', nav).setAttribute('aria-current', 'page');

    var burger = $('.nav__burger', nav);
    burger && burger.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', open);
    });
    var dropItem = $('.nav__item--drop', nav);
    if (dropItem) {
      var dropBtn = $('.nav__link', dropItem);
      var setDrop = function (v) { dropItem.classList.toggle('nav__item--open', v); dropBtn.setAttribute('aria-expanded', v); };
      dropBtn.addEventListener('click', function () { setDrop(!dropItem.classList.contains('nav__item--open')); });
      var desk = window.matchMedia('(min-width: 1081px) and (hover: hover)');
      dropItem.addEventListener('mouseenter', function () { if (desk.matches) setDrop(true); });
      dropItem.addEventListener('mouseleave', function () { if (desk.matches) setDrop(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrop(false); nav.classList.remove('nav--open'); } });
      document.addEventListener('click', function (e) { if (!dropItem.contains(e.target)) setDrop(false); });
    }
    var lastY = 0;
    var onScroll = function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > 400 && y > lastY + 4 && !nav.classList.contains('nav--open'));
      if (y < lastY - 4) nav.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Videos: solo se reproducen cuando están a la vista ---------- */
  var vids = $$('video[data-autoplay]');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !reduce) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!en.isIntersecting) v.pause();
      });
    }, { rootMargin: '200px' });
    vids.forEach(function (v) { v.muted = true; vio.observe(v); });
  }

  /* ---------- Estado "en vista" para mini ilustraciones CSS ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.3 });
    $$('[data-inview]').forEach(function (el) { io.observe(el); });
  } else $$('[data-inview]').forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- Luz que sigue al cursor en tarjetas ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.tile, .card').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Contadores ---------- */
  function fmt(n, dec) {
    return n.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function runCount(el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
    var pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduce || !hasGsap) { el.textContent = pre + fmt(to, dec) + suf; return; }
    var o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: function () { el.textContent = pre + fmt(o.v, dec) + suf; } });
  }
  var counters = $$('[data-count]');
  counters.forEach(function (el) {
    var dec = parseInt(el.dataset.dec || '0', 10);
    el.textContent = (el.dataset.pre || '') + fmt(parseFloat(el.dataset.count), dec) + (el.dataset.suf || '');
  });

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  var form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var msg = 'Hola Partum Design, soy ' + d.get('nombre') + ' (' + d.get('correo') + ').\n' +
        'Servicio de interés: ' + d.get('servicio') + '\n\n' + d.get('proyecto');
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      var st = $('.form__status', form);
      if (st) st.textContent = 'Abrimos WhatsApp con tu mensaje listo. Solo presiona enviar.';
    });
    var mail = $('#contact-mail');
    mail && mail.addEventListener('click', function (e) {
      if (!form.reportValidity()) { e.preventDefault(); return; }
      var d = new FormData(form);
      mail.href = 'mailto:contacto@partumdesign.com.mx?subject=' + encodeURIComponent('Proyecto: ' + d.get('servicio')) +
        '&body=' + encodeURIComponent('Nombre: ' + d.get('nombre') + '\nCorreo: ' + d.get('correo') + '\n\n' + d.get('proyecto'));
    });
  }

  /* ---------- Diagnóstico de marca (Identidad) ---------- */
  var diag = $('#diag');
  if (diag) {
    var boxes = $$('input[type=checkbox]', diag), fg = $('.diag__meter .fg', diag), pct = $('.diag__meter b', diag);
    var cnt = $('[data-diag-count]', diag), verdict = $('[data-diag-verdict]', diag), send = $('[data-diag-send]', diag);
    var update = function () {
      var on = boxes.filter(function (b) { return b.checked; });
      var p = Math.round(on.length / boxes.length * 100);
      fg.style.strokeDashoffset = 440 - 440 * p / 100;
      pct.textContent = p + '%';
      cnt.textContent = on.length + ' de ' + boxes.length + ' situaciones';
      verdict.textContent = on.length === 0 ? 'Marca las situaciones que vives hoy.' : on.length <= 2 ? 'Tu marca tiene áreas por reforzar.' : '¡Tu marca necesita atención!';
      var txt = 'Hola Partum, hice el diagnóstico de marca en su sitio (' + p + '%). Situaciones:\n- ' +
        on.map(function (b) { return b.parentNode.textContent.trim(); }).join('\n- ');
      send.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(on.length ? txt : 'Hola Partum, quiero una consultoría de identidad de marca.');
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  /* ---------- Comparador de color (Audiovisual) ---------- */
  $$('.compare').forEach(function (c) {
    var r = $('input', c);
    r.addEventListener('input', function () { c.style.setProperty('--pos', r.value + '%'); });
  });

  /* ---------- Timecode del visor ---------- */
  var tc = $('[data-timecode]');
  if (tc && !reduce) {
    var t0 = performance.now();
    (function tick(now) {
      var f = Math.floor((now - t0) / (1000 / 24));
      var s = Math.floor(f / 24), p2 = function (n) { return ('0' + n).slice(-2); };
      tc.textContent = p2(Math.floor(s / 3600)) + ':' + p2(Math.floor(s / 60) % 60) + ':' + p2(s % 60) + ':' + p2(f % 24);
      requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Sin GSAP / movimiento reducido: estados finales ---------- */
  if (!hasGsap || reduce) {
    counters.forEach(runCount);
    $$('.step__ring .fg').forEach(function (c) { c.style.strokeDashoffset = 226 - 226 * (+c.dataset.p) / 100; });
    $$('.reveal-words').forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  /* =================== Animaciones con GSAP =================== */
  gsap.registerPlugin(ScrollTrigger);

  /* Scroll suave */
  if (window.Lenis) {
    var lenis = window.__lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -90 }); }
      });
    });
  }

  /* Titulares que entran palabra por palabra */
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = '';
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(' ')); return; }
          var o = document.createElement('span'); o.className = 'split-line';
          o.style.display = 'inline-block';
          var i = document.createElement('span'); i.textContent = w;
          o.appendChild(i); el.appendChild(o);
        });
      } else if (n.nodeName === 'BR') {
        el.appendChild(n);
      } else {
        var o2 = document.createElement('span'); o2.className = 'split-line'; o2.style.display = 'inline-block';
        var i2 = document.createElement('span'); i2.appendChild(n); o2.appendChild(i2); el.appendChild(o2);
      }
    });
    return $$('.split-line > span', el);
  }
  $$('[data-split]').forEach(function (el) {
    var words = splitWords(el);
    var inHero = !!el.closest('.hero, .page-hero');
    gsap.from(words, {
      yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.06,
      delay: inHero ? introDelay : 0,
      scrollTrigger: inHero ? null : { trigger: el, start: 'top 85%' }
    });
  });

  /* Revelado general */
  var heroReveals = $$('.hero [data-reveal], .page-hero [data-reveal]');
  if (heroReveals.length) {
    gsap.to(heroReveals, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: introDelay + 0.3 });
  }
  ScrollTrigger.batch($$('[data-reveal]').filter(function (el) { return heroReveals.indexOf(el) < 0; }), {
    start: 'top 88%',
    onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }); }
  });

  /* Contadores al entrar */
  counters.forEach(function (el) {
    el.textContent = (el.dataset.pre || '') + '0' + (el.dataset.suf || '');
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { runCount(el); } });
  });

  /* Texto que se ilumina con el scroll */
  $$('.reveal-words').forEach(function (el) {
    var txt = el.textContent.trim().split(/\s+/);
    el.innerHTML = txt.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    gsap.to($$('.w', el), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  });

  /* Portal (anillo Partum): trazo inicial + parallax */
  $$('.portal').forEach(function (p) {
    var rings = $$('.portal__ring, .portal__glow', p);
    gsap.fromTo(rings, { strokeDasharray: 1, strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 2, ease: 'power3.inOut', delay: p.closest('.hero') ? introDelay : 0,
      scrollTrigger: p.closest('.hero') ? null : { trigger: p, start: 'top 80%' }
    });
    var media = $('.portal__media', p);
    if (media) gsap.from(media, { opacity: 0, scale: 0.85, transformOrigin: '50% 33.5%', duration: 1.6, ease: 'expo.out', delay: (p.closest('.hero') ? introDelay : 0) + 0.8, scrollTrigger: p.closest('.hero') ? null : { trigger: p, start: 'top 80%' } });
    $$('.float-card', p).forEach(function (c, i) {
      gsap.from(c, { opacity: 0, y: 30, scale: 0.9, duration: 1, ease: 'back.out(1.6)', delay: introDelay + 1.2 + i * 0.15 });
    });
  });
  var heroPortal = $('.hero .portal');
  if (heroPortal) {
    gsap.to(heroPortal, { scale: 1.18, yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  $$('[data-parallax]').forEach(function (el) {
    gsap.to(el, { yPercent: parseFloat(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Metodología Growth: recorrido horizontal fijado */
  var proc = $('.process');
  if (proc) {
    var track = $('.process__track', proc), steps = $$('.step', proc);
    var meter = $('.process__meter-bar i', proc), meterNum = $('[data-meter]', proc);
    var fill = function (i) {
      steps.forEach(function (s, k) {
        var c = $('.step__ring .fg', s);
        if (k <= i) c.style.strokeDashoffset = 226 - 226 * (+c.dataset.p) / 100;
      });
      var v = Math.max(25, (i + 1) * 25);
      if (meter) meter.style.width = v + '%';
      if (meterNum) meterNum.textContent = v + '%';
    };
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        var dist = function () { return track.scrollWidth - window.innerWidth; };
        gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: {
            trigger: proc, pin: '.process__pin', start: 'top top', end: function () { return '+=' + dist(); },
            scrub: 1, invalidateOnRefresh: true,
            onUpdate: function (st) { fill(Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999 + 0.35))); }
          }
        });
      },
      '(max-width: 900px)': function () {
        steps.forEach(function (s, i) { ScrollTrigger.create({ trigger: s, start: 'top 75%', onEnter: function () { fill(i); } }); });
      }
    });
    fill(0);
  }

  /* Palabra gigante del footer */
  var word = $('.footer__word');
  if (word) {
    var letters = word.textContent.split('');
    word.innerHTML = letters.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    gsap.from($$('span', word), { yPercent: 60, opacity: 0, stagger: 0.05, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%' } });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

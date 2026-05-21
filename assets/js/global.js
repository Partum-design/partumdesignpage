(function () {
  'use strict';

  var doc = document;
  var win = window;
  var body = doc.body;

  if (!body) return;

  doc.documentElement.classList.add('js-enabled');

  var header = doc.querySelector('[data-partum-header], #partum-site-header, .partum-header');
  var nav = doc.querySelector('[data-partum-nav], .partum-nav');
  var navToggle = doc.querySelector('[data-partum-menu-toggle], .partum-nav__toggle');
  var servicesItem = doc.querySelector('[data-partum-services-item], .partum-nav__item--services');
  var servicesTrigger = doc.querySelector('[data-partum-services-trigger], .partum-nav__trigger--services');
  var servicesPanel = doc.querySelector('[data-partum-services-panel], .partum-nav__panel--services');
  var navLinks = doc.querySelectorAll('.partum-nav__link, .partum-nav__panel-link, .partum-footer__link, a[href^="/"]');
  var currentYearNodes = doc.querySelectorAll('[data-partum-current-year]');

  var mobileQuery = win.matchMedia('(max-width: 768px)');
  var reducedMotionQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopHoverQuery = win.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');

  var scrollTicking = false;
  var resizeTicking = false;
  var openState = false;

  function normalizePath(pathname) {
    var clean = String(pathname || '/')
      .split('?')[0]
      .split('#')[0]
      .replace(/index\.html?$/i, '')
      .replace(/\/+$/, '');

    if (!clean || clean === '') return '/';
    if (clean.charAt(0) !== '/') clean = '/' + clean;
    return clean === '/' ? '/' : clean + '/';
  }

  function samePath(href) {
    if (!href || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
      return false;
    }

    var anchor = doc.createElement('a');
    anchor.href = href;
    return normalizePath(anchor.pathname) === normalizePath(win.location.pathname);
  }

  function isServicePath(pathname) {
    var normalized = normalizePath(pathname);
    return normalized === '/identidad-visual/' ||
      normalized === '/desarrollo-web/' ||
      normalized === '/marketing-digital/' ||
      normalized === '/produccion-audiovisual/';
  }

  function setCurrentState() {
    var currentPath = normalizePath(win.location.pathname);

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var active = samePath(href);
      link.classList.toggle('is-current', active);

      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (servicesItem) {
      servicesItem.classList.toggle('is-current', isServicePath(currentPath));
    }
  }

  function syncHeaderHeight() {
    if (!header) return;
    var height = Math.ceil(header.getBoundingClientRect().height);
    doc.documentElement.style.setProperty('--partum-header-height', height + 'px');
  }

  function setScrolledState() {
    if (!header) return;

    var scrolled = win.scrollY > 8;
    header.classList.toggle('is-scrolled', scrolled);
    body.classList.toggle('is-scrolled', scrolled);
    syncHeaderHeight();
  }

  function requestScrollState() {
    if (scrollTicking) return;
    scrollTicking = true;

    win.requestAnimationFrame(function () {
      setScrolledState();
      scrollTicking = false;
    });
  }

  function updateOpenState(next) {
    openState = Boolean(next);
    body.classList.toggle('partum-nav-open', openState);

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', openState ? 'true' : 'false');
    }

    if (nav) {
      nav.setAttribute('data-open', openState ? 'true' : 'false');
    }

    if (servicesTrigger) {
      servicesTrigger.setAttribute('aria-expanded', servicesItem && servicesItem.classList.contains('is-open') ? 'true' : 'false');
    }
  }

  function closeServices() {
    if (!servicesItem) return;
    servicesItem.classList.remove('is-open');

    if (servicesTrigger) {
      servicesTrigger.setAttribute('aria-expanded', 'false');
    }

    if (servicesPanel) {
      servicesPanel.hidden = mobileQuery.matches ? true : false;
    }
  }

  function openServices() {
    if (!servicesItem) return;
    servicesItem.classList.add('is-open');

    if (servicesTrigger) {
      servicesTrigger.setAttribute('aria-expanded', 'true');
    }

    if (servicesPanel) {
      servicesPanel.hidden = false;
    }
  }

  function toggleServices(event) {
    if (!servicesItem || !servicesTrigger) return;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (servicesItem.classList.contains('is-open')) {
      closeServices();
      return;
    }

    openServices();
  }

  function closeNav() {
    updateOpenState(false);
    closeServices();
  }

  function openNav() {
    updateOpenState(true);
  }

  function toggleNav(event) {
    if (event) event.preventDefault();

    if (openState) {
      closeNav();
      return;
    }

    openNav();
  }

  function closeOnOutsideClick(event) {
    if (!body.classList.contains('partum-nav-open') && !(servicesItem && servicesItem.classList.contains('is-open'))) {
      return;
    }

    if (!header) return;
    if (header.contains(event.target)) return;

    closeNav();
  }

  function closeOnEscape(event) {
    if (event.key !== 'Escape') return;
    closeNav();

    if (servicesTrigger) {
      servicesTrigger.blur();
    }
  }

  function syncResponsiveState() {
    if (resizeTicking) return;
    resizeTicking = true;

    win.requestAnimationFrame(function () {
      if (!mobileQuery.matches) {
        body.classList.remove('partum-nav-open');
        openState = false;
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }

      if (!servicesItem) {
        resizeTicking = false;
        return;
      }

      if (mobileQuery.matches) {
        servicesPanel && (servicesPanel.hidden = !servicesItem.classList.contains('is-open'));
      } else {
        servicesPanel && (servicesPanel.hidden = false);
      }

      syncHeaderHeight();
      resizeTicking = false;
    });
  }

  function setupRevealObserver() {
    var targets = doc.querySelectorAll('[data-partum-reveal], [data-partum-bg-src]');

    if (!targets.length) return;

    if (!('IntersectionObserver' in win) || reducedMotionQuery.matches) {
      targets.forEach(function (node) {
        if (node.hasAttribute('data-partum-bg-src')) {
          node.style.backgroundImage = 'url("' + node.getAttribute('data-partum-bg-src') + '")';
          node.classList.add('is-bg-loaded');
        }
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var node = entry.target;
        node.classList.add('is-visible');

        if (node.hasAttribute('data-partum-bg-src')) {
          node.style.backgroundImage = 'url("' + node.getAttribute('data-partum-bg-src') + '")';
          node.classList.add('is-bg-loaded');
        }

        node.dispatchEvent(new CustomEvent('partum:visible', {
          bubbles: true,
          detail: { target: node }
        }));

        obs.unobserve(node);
      });
    }, {
      root: null,
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach(function (node) {
      observer.observe(node);
    });
  }

  function setupLazyBackgrounds() {
    var nodes = doc.querySelectorAll('[data-partum-bg-src]');
    if (!nodes.length) return;

    if (!('IntersectionObserver' in win) || reducedMotionQuery.matches) {
      nodes.forEach(function (node) {
        node.style.backgroundImage = 'url("' + node.getAttribute('data-partum-bg-src') + '")';
        node.classList.add('is-bg-loaded');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var node = entry.target;
        node.style.backgroundImage = 'url("' + node.getAttribute('data-partum-bg-src') + '")';
        node.classList.add('is-bg-loaded');
        obs.unobserve(node);
      });
    }, {
      threshold: 0.08,
      rootMargin: '180px 0px'
    });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function hydrateFooterYear() {
    var year = String(new Date().getFullYear());
    currentYearNodes.forEach(function (node) {
      node.textContent = year;
    });
  }

  function wireHeader() {
    if (!header) return;

    syncHeaderHeight();
    setScrolledState();
    setCurrentState();

    if (navToggle) {
      navToggle.addEventListener('click', toggleNav);
    }

    if (servicesTrigger) {
      servicesTrigger.addEventListener('click', toggleServices);
    }

    if (servicesItem && servicesPanel) {
      servicesPanel.hidden = mobileQuery.matches && !servicesItem.classList.contains('is-open');
    }

    doc.addEventListener('click', closeOnOutsideClick, true);
    doc.addEventListener('keydown', closeOnEscape);

    if ('ResizeObserver' in win) {
      var resizeObserver = new ResizeObserver(function () {
        syncHeaderHeight();
      });
      resizeObserver.observe(header);
    } else {
      win.addEventListener('resize', syncResponsiveState, { passive: true });
    }

    win.addEventListener('scroll', requestScrollState, { passive: true });
    win.addEventListener('resize', syncResponsiveState, { passive: true });
  }

  function wireNavLinkClosing() {
    doc.addEventListener('click', function (event) {
      var target = event.target.closest && event.target.closest('a');
      if (!target) return;

      if (mobileQuery.matches && body.classList.contains('partum-nav-open')) {
        closeNav();
      }
    });
  }

  function wireMediaQueryListeners() {
    var onChange = function () {
      syncResponsiveState();
    };

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', onChange);
      reducedMotionQuery.addEventListener('change', onChange);
      desktopHoverQuery.addEventListener('change', onChange);
    } else {
      mobileQuery.addListener(onChange);
      reducedMotionQuery.addListener(onChange);
      desktopHoverQuery.addListener(onChange);
    }
  }

  function init() {
    wireHeader();
    wireNavLinkClosing();
    wireMediaQueryListeners();
    setupRevealObserver();
    setupLazyBackgrounds();
    hydrateFooterYear();
    syncResponsiveState();
    setCurrentState();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

(function () {
    'use strict';

    // Inject Google Fonts + FontAwesome if not already present
    function ensureDeps() {
        if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="font-awesome"]')) {
            var fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            document.head.appendChild(fa);
        }
    }

    function applyBodyPadding() {
        var isMobile = window.innerWidth <= 1024;
        document.body.style.paddingTop = isMobile ? '75px' : '95px';
    }

    function initNavbar() {
        var nav = document.getElementById('main-navbar');
        var burger = document.getElementById('burger-menu');
        var dropdownToggle = document.getElementById('servicios-toggle');
        if (!nav || !burger) return;

        // Scroll effect
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });

        // Mobile menu toggle
        burger.addEventListener('click', function () {
            nav.classList.toggle('mobile-active');
            var spans = burger.querySelectorAll('span');
            if (nav.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                document.body.style.overflow = '';
                spans.forEach(function (s) { s.style.transform = 'none'; });
                spans[1].style.opacity = '1';
            }
        });

        // Servicios accordion on mobile
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    var parentLi = dropdownToggle.parentElement;
                    var icon = dropdownToggle.querySelector('i');
                    parentLi.classList.toggle('active');
                    icon.style.transform = parentLi.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        // Close mobile menu when a nav link is clicked
        var navLinks = nav.querySelectorAll('.nav-link:not(#servicios-toggle), .dropdown-item');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 1024) {
                    nav.classList.remove('mobile-active');
                    document.body.style.overflow = '';
                    var spans = burger.querySelectorAll('span');
                    spans.forEach(function (s) { s.style.transform = 'none'; });
                    spans[1].style.opacity = '1';
                }
            });
        });

        // Highlight active page link
        var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        nav.querySelectorAll('.nav-link[href], .dropdown-item[href]').forEach(function (link) {
            var href = link.getAttribute('href').replace(/\/$/, '') || '/';
            if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
                link.closest('.nav-item') && link.closest('.nav-item').classList.add('active');
            }
        });
    }

    function loadComponent(url, targetEl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                targetEl.innerHTML = xhr.responseText;
                if (callback) callback();
            }
        };
        xhr.send();
    }

    function init() {
        ensureDeps();

        // Create and prepend header placeholder
        var headerEl = document.createElement('div');
        headerEl.id = 'site-header';
        document.body.insertBefore(headerEl, document.body.firstChild);

        // Create and append footer placeholder
        var footerEl = document.createElement('div');
        footerEl.id = 'site-footer';
        document.body.appendChild(footerEl);

        // Apply initial body padding immediately (prevents content jump)
        applyBodyPadding();
        window.addEventListener('resize', applyBodyPadding);

        // Load navbar
        loadComponent('/assets/partials/navbar.html', headerEl, function () {
            initNavbar();
        });

        // Load footer
        loadComponent('/assets/partials/footer-partial.html', footerEl, null);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

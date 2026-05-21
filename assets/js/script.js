(function () {
  var injectedParts = {
    header: false,
    footer: false,
  };

  function decodePath(pathname) {
    return pathname.replace(/\/+$/, "") || "/";
  }

  function shouldSkipShellInjection() {
    var path = decodePath(window.location.pathname);
    return path === "/header.html" || path === "/footer.html";
  }

  function copyShellHead(doc, fingerprint) {
    var headNodes = doc.head ? doc.head.querySelectorAll("link[rel='stylesheet'], link[rel='preconnect'], style") : [];
    for (var i = 0; i < headNodes.length; i++) {
      var node = headNodes[i].cloneNode(true);
      if (node.tagName === "LINK" && node.getAttribute("href")) {
        var href = node.getAttribute("href");
        if (document.head.querySelector('link[href="' + href + '"]')) continue;
      }
      if (node.tagName === "STYLE") {
        node.textContent = node.textContent.replace(/body\s*\{[\s\S]*?\}\s*/m, "");
      }
      if (fingerprint) {
        node.setAttribute("data-partum-shell", fingerprint);
      }
      document.head.appendChild(node);
    }
  }

  function mountShellFragment(url, position, fingerprint, done) {
    if (injectedParts[fingerprint] || shouldSkipShellInjection()) {
      if (done) done();
      return;
    }

    if (document.querySelector('[data-partum-fragment="' + fingerprint + '"]')) {
      injectedParts[fingerprint] = true;
      if (done) done();
      return;
    }

    fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        copyShellHead(doc, fingerprint);

        if (fingerprint === "footer" && doc.body) {
          var spacer = doc.body.querySelector("main");
          if (spacer) spacer.remove();
        }

        var wrapper = document.createElement(fingerprint === "header" ? "header" : "footer");
        wrapper.setAttribute("data-partum-fragment", fingerprint);
        wrapper.innerHTML = doc.body ? doc.body.innerHTML : "";

        if (position === "prepend") {
          document.body.insertBefore(wrapper, document.body.firstChild);
        } else {
          document.body.appendChild(wrapper);
        }

        injectedParts[fingerprint] = true;
        if (done) done();
      })
      .catch(function () {
        if (done) done();
      });
  }

  function enhanceImages() {
    var images = document.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (!img.hasAttribute("decoding")) {
        img.decoding = "async";
      }
    }
  }

  function setupPreloader() {
    var preloader = document.getElementById("partum-preloader");
    if (!preloader) return;

    document.body.classList.add("partum-loading");

    var hidePreloader = function () {
      if (preloader.dataset.partumHidden === "true") return;
      preloader.dataset.partumHidden = "true";
      preloader.classList.add("is-hidden");
      window.setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
        document.body.classList.remove("partum-loading");
      }, 720);
    };

    if (document.readyState === "complete") {
      window.setTimeout(hidePreloader, 180);
      return;
    }

    window.addEventListener("load", function () {
      window.setTimeout(hidePreloader, 180);
    }, { once: true });
  }

  function scrollServicesRoute() {
    var path = decodePath(window.location.pathname);
    if (path !== "/servicios") return;

    var target = document.getElementById("servicios-premium-partum");
    if (!target) return;

    window.setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function wireNavBehavior() {
    var nav = document.getElementById("main-navbar");
    var burger = document.getElementById("burger-menu");
    var dropdownToggle = document.getElementById("servicios-toggle");
    var body = document.body;

    if (nav && burger && !burger.dataset.partumBound) {
      burger.dataset.partumBound = "true";
      burger.addEventListener("click", function () {
        nav.classList.toggle("mobile-active");
        var spans = burger.querySelectorAll("span");

        if (nav.classList.contains("mobile-active")) {
          body.style.overflow = "hidden";
          if (spans[0]) spans[0].style.transform = "rotate(45deg) translate(5px, 6px)";
          if (spans[1]) spans[1].style.opacity = "0";
          if (spans[2]) spans[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
        } else {
          body.style.overflow = "";
          for (var i = 0; i < spans.length; i++) spans[i].style.transform = "none";
          if (spans[1]) spans[1].style.opacity = "1";
        }
      });
    }

    if (nav && !nav.dataset.partumStickyBound) {
      nav.dataset.partumStickyBound = "true";
      var syncNavState = function () {
        if (window.scrollY > 40) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      };
      syncNavState();
      window.addEventListener("scroll", syncNavState, { passive: true });
    }

    if (dropdownToggle && !dropdownToggle.dataset.partumBound) {
      dropdownToggle.dataset.partumBound = "true";
      dropdownToggle.addEventListener("click", function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          var parentLi = dropdownToggle.parentElement;
          var icon = dropdownToggle.querySelector("i");

          parentLi.classList.toggle("active");
          if (icon) {
            icon.style.transform = parentLi.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";
          }
        }
      });
    }
  }

  function setActiveNav() {
    var path = decodePath(window.location.pathname);
    var links = document.querySelectorAll('a.nav-link[href], a.dropdown-item[href], .footer-link[href]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute("href");
      if (!href || href === "#" || href.indexOf("#") === 0) {
        continue;
      }
      try {
        var url = new URL(href, window.location.origin);
        var linkPath = decodePath(url.pathname);
        if (linkPath === path && linkPath !== "/") {
          link.setAttribute("aria-current", "page");
        } else if (path === "/" && linkPath === "/") {
          link.setAttribute("aria-current", "page");
        }
      } catch (_) {
        // Ignore non-URL anchors.
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    enhanceImages();
    setupPreloader();
    mountShellFragment("/header.html", "prepend", "header", function () {
      wireNavBehavior();
      setActiveNav();
    });
    mountShellFragment("/footer.html", "append", "footer");
    scrollServicesRoute();
    wireNavBehavior();
    setActiveNav();
  });
})();

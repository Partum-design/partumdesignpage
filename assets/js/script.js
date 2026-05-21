(function () {
  function decodePath(pathname) {
    return pathname.replace(/\/+$/, "") || "/";
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

  function scrollServicesRoute() {
    var path = decodePath(window.location.pathname);
    if (path !== "/servicios") return;

    var target = document.getElementById("servicios-premium-partum");
    if (!target) return;

    window.setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
    scrollServicesRoute();
    setActiveNav();
  });
})();

#!/usr/bin/env python3
"""Inserta los parciales compartidos (partials/*.html) en cada pagina del sitio.

Uso:  python3 tools/build-partials.py

En cada .html de la raiz, reemplaza el contenido entre marcadores:
    <!-- @head --> ... <!-- /@head -->
    <!-- @nav --> ... <!-- /@nav -->
    <!-- @footer --> ... <!-- /@footer -->
    <!-- @portal video="cdmx-angel" --> ... <!-- /@portal -->
El HTML resultante es estatico: Vercel lo sirve tal cual, sin build.
Lo que va *dentro* de un bloque @portal antes de </div> se conserva como
{{extra}} (tarjetas flotantes, etc.) si esta marcado con <!-- extra --> ... <!-- /extra -->.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "partials"
SKIP = {"header.html", "footer.html", "google1c3733e4a3017350.html", "cronograma-tplink.html"}


def partial(name):
    return (PARTIALS / f"{name}.html").read_text(encoding="utf-8").rstrip("\n")


def fill_simple(html, name):
    pat = re.compile(r"(<!-- @%s -->)(.*?)(<!-- /@%s -->)" % (name, name), re.S)
    return pat.sub(lambda m: m.group(1) + "\n" + partial(name) + "\n    " + m.group(3), html)


def fill_portal(html):
    pat = re.compile(r'(<!-- @portal video="([\w-]+)" -->)(.*?)(<!-- /@portal -->)', re.S)

    def rep(m):
        extra = re.search(r"<!-- extra -->.*?<!-- /extra -->", m.group(3), re.S)
        body = partial("portal").replace("{{video}}", m.group(2))
        body = body.replace("{{extra}}", extra.group(0) if extra else "")
        return m.group(1) + "\n          " + body + "\n          " + m.group(4)

    return pat.sub(rep, html)


def main():
    for page in sorted(ROOT.glob("*.html")):
        if page.name in SKIP:
            continue
        src = page.read_text(encoding="utf-8")
        out = src
        for name in ("head", "nav", "footer"):
            out = fill_simple(out, name)
        out = fill_portal(out)
        if out != src:
            page.write_text(out, encoding="utf-8")
            print("actualizado:", page.name)


if __name__ == "__main__":
    main()

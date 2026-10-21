/* Globo 3D "Diseño sin fronteras" (Nosotros).
   Carga three.js y los puntos de tierra solo cuando la seccion se acerca al viewport. */
(function () {
  var root = document.querySelector('[data-globe]');
  if (!root) return;

  var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var LAND_URL = '/assets/v2/globe-land.js?v=1';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var HUB = { id: 'mx', name: 'CDMX', lat: 19.43, lon: -99.13, color: '#ffffff' };
  var PLACES = [
    { id: 'us', name: 'Texas', lat: 30.27, lon: -97.74, color: '#3fe0ff' },
    { id: 'ht', name: 'Haití', lat: 18.54, lon: -72.34, color: '#ff4d8d' },
    { id: 'es', name: 'España', lat: 40.42, lon: -3.70, color: '#ffc15e' },
    { id: 'fr', name: 'Francia', lat: 48.86, lon: 2.35, color: '#3ff0b4' },
    { id: 'kr', name: 'Corea del Sur', lat: 37.57, lon: 126.98, color: '#d64dff' }
  ];

  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src; s.async = true; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  function hasWebGL() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }

  function fail() { root.classList.add('is-fallback'); }

  if (!hasWebGL()) { fail(); return; }

  var started = false;
  var io = new IntersectionObserver(function (entries) {
    if (started || !entries[0].isIntersecting) return;
    started = true; io.disconnect();
    (window.THREE ? Promise.resolve() : load(THREE_URL))
      .then(function () { return window.PARTUM_LAND ? null : load(LAND_URL); })
      .then(init)
      .catch(fail);
  }, { rootMargin: '600px 0px' });
  io.observe(root);

  function init() {
    var THREE = window.THREE;
    var stage = root.querySelector('.globe3d__stage');
    var labelsEl = root.querySelector('.globe3d__labels');
    var scope = root.closest('section') || document;
    var DEG = Math.PI / 180;
    var R = 1;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    stage.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    var tilt = new THREE.Group();
    var spin = new THREE.Group();
    tilt.add(spin); scene.add(tilt);

    function toVec(lat, lon, r) {
      var phi = (90 - lat) * DEG, th = (lon + 180) * DEG;
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
    }

    /* Esfera base: nucleo oscuro con borde cian (fresnel) */
    var core = new THREE.Mesh(
      new THREE.SphereGeometry(R, 72, 72),
      new THREE.ShaderMaterial({
        uniforms: { cA: { value: new THREE.Color('#03121f') }, cB: { value: new THREE.Color('#0093b8') } },
        vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'uniform vec3 cA; uniform vec3 cB; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6); vec3 col = mix(cA, cB, f * 0.55) + vec3(0.0, 0.02, 0.05) * (1.0 - f); gl_FragColor = vec4(col, 1.0); }'
      })
    );
    spin.add(core);

    /* Atmosfera */
    var atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.16, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color('#3fb8ff') } },
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(max(0.58 - dot(vN, vec3(0.0,0.0,1.0)), 0.0), 3.2); gl_FragColor = vec4(c, 1.0) * i * 1.1; }'
      })
    );
    scene.add(atmo);

    /* Puntos de tierra (instanciados, orientados hacia afuera) */
    var land = window.PARTUM_LAND || [];
    var count = land.length / 2;
    var dotGeo = new THREE.CircleGeometry(0.0105, 6);
    var dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    var dots = new THREE.InstancedMesh(dotGeo, dotMat, count);
    var m = new THREE.Object3D(), cLo = new THREE.Color('#2aa8d8'), cHi = new THREE.Color('#8f7bff'), tmp = new THREE.Color();
    for (var i = 0; i < count; i++) {
      var lat = land[i * 2], lon = land[i * 2 + 1];
      var p = toVec(lat, lon, R * 1.002);
      m.position.copy(p); m.lookAt(p.clone().multiplyScalar(2)); m.updateMatrix();
      dots.setMatrixAt(i, m.matrix);
      tmp.copy(cLo).lerp(cHi, Math.min(Math.max((lon + 180) / 360, 0), 1) * 0.8);
      dots.setColorAt(i, tmp);
    }
    dots.instanceMatrix.needsUpdate = true;
    if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
    spin.add(dots);

    /* Pines con anillo pulsante y haz de luz */
    var ringGeo = new THREE.RingGeometry(0.03, 0.038, 40);
    var beamGeo = new THREE.CylinderGeometry(0.004, 0.004, 1, 8, 1, true);
    beamGeo.translate(0, 0.5, 0);
    var pins = [];
    function addPin(pl, big) {
      var pos = toVec(pl.lat, pl.lon, R * 1.004);
      var col = new THREE.Color(pl.color);
      var g = new THREE.Group();
      g.position.copy(pos); g.lookAt(pos.clone().multiplyScalar(2));
      var dot = new THREE.Mesh(new THREE.CircleGeometry(big ? 0.024 : 0.017, 24), new THREE.MeshBasicMaterial({ color: col }));
      var ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      var beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      beam.rotation.x = Math.PI / 2; beam.scale.y = big ? 0.12 : 0.08;
      g.add(dot, ring, beam); spin.add(g);
      var lbl = document.createElement('span');
      lbl.className = 'globe3d__lbl' + (big ? ' is-hub' : '');
      lbl.style.setProperty('--c', pl.color);
      lbl.textContent = big ? 'CDMX · Sede' : pl.name;
      labelsEl.appendChild(lbl);
      pins.push({ g: g, ring: ring, lbl: lbl, phase: Math.random() * 6, big: big, pos: pos.clone().multiplyScalar(1.02) });
    }
    addPin(HUB, true);
    PLACES.forEach(function (pl) { addPin(pl, false); });

    /* Arcos CDMX -> pais con pulso que viaja */
    var arcMats = [], pulses = [];
    var hubV = toVec(HUB.lat, HUB.lon, R);
    PLACES.forEach(function (pl, idx) {
      var end = toVec(pl.lat, pl.lon, R);
      var ang = hubV.angleTo(end);
      var lift = R + 0.12 + ang * 0.32;
      var mid1 = hubV.clone().lerp(end, 0.25).normalize().multiplyScalar(lift);
      var mid2 = hubV.clone().lerp(end, 0.75).normalize().multiplyScalar(lift);
      var curve = new THREE.CubicBezierCurve3(hubV.clone().multiplyScalar(1.003), mid1, mid2, end.clone().multiplyScalar(1.003));
      var mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color(pl.color) }, t: { value: 0 }, draw: { value: reduced ? 1 : 0 }, off: { value: idx * 0.21 } },
        vertexShader: 'varying float vU; void main(){ vU = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 c; uniform float t; uniform float draw; uniform float off; varying float vU; void main(){ if (vU > draw) discard; float h = fract(t * 0.32 + off); float seg = smoothstep(h - 0.28, h, vU) * step(vU, h); float a = 0.22 + seg * 1.1; gl_FragColor = vec4(c * (0.7 + seg), a); }'
      });
      arcMats.push(mat);
      spin.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 96, 0.0042, 6, false), mat));
      var pulse = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(pl.color) }));
      spin.add(pulse);
      pulses.push({ mesh: pulse, curve: curve, off: idx * 0.21 });
    });

    /* Particulas de fondo para dar profundidad */
    var starCount = 520, sp = new Float32Array(starCount * 3);
    for (var s = 0; s < starCount; s++) {
      var v = new THREE.Vector3().randomDirection ? new THREE.Vector3().randomDirection() : new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      v.multiplyScalar(1.5 + Math.random() * 1.6);
      sp[s * 3] = v.x; sp[s * 3 + 1] = v.y; sp[s * 3 + 2] = v.z;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9fdcff, size: 0.012, transparent: true, opacity: 0.55, depthWrite: false }));
    scene.add(stars);

    /* Interaccion: arrastrar para girar, inercia, giro automatico */
    var spinY = -(-60) * DEG - Math.PI / 2;  // arranca mostrando America y el Atlantico
    var tiltX = 0.38, vel = 0, dragging = false, lastX = 0, lastY = 0, idleUntil = 0, target = null;
    spin.rotation.y = spinY; tilt.rotation.x = tiltX;
    var canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY; target = null;
      root.classList.add('is-grabbing');
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      var k = 0.0055 * (600 / Math.max(stage.clientWidth, 300));
      spinY += dx * k; vel = dx * k;
      tiltX = Math.min(Math.max(tiltX + dy * k * 0.6, -0.15), 0.85);
    });
    function up() { dragging = false; idleUntil = performance.now() + 2500; root.classList.remove('is-grabbing'); }
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    /* Chips de paises: giran el globo hacia ese pais */
    scope.querySelectorAll('[data-focus]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-focus');
        var pl = id === 'mx' ? HUB : PLACES.filter(function (x) { return x.id === id; })[0];
        if (!pl) return;
        var t = -pl.lon * DEG - Math.PI / 2;
        var d = ((t - spinY) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        target = { spin: spinY + d, tilt: Math.min(Math.max(pl.lat * DEG * 0.9, -0.1), 0.8) };
        vel = 0; idleUntil = performance.now() + 4000;
        scope.querySelectorAll('[data-focus]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      });
    });

    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize);

    var visible = true;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(root);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) loop(); });

    var v3 = new THREE.Vector3(), camDir = new THREE.Vector3(), start = performance.now(), last = start, running = false, drawT = 0;
    function frame(now) {
      running = false;
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var t = (now - start) / 1000;

      if (target) {
        spinY += (target.spin - spinY) * Math.min(dt * 4, 1);
        tiltX += (target.tilt - tiltX) * Math.min(dt * 4, 1);
        if (Math.abs(target.spin - spinY) < 0.002) target = null;
      } else if (!dragging) {
        spinY += vel; vel *= 0.94;
        if (!reduced && now > idleUntil) spinY += dt * 0.09;
      }
      spin.rotation.y = spinY; tilt.rotation.x = tiltX;
      stars.rotation.y = t * 0.012;

      if (!reduced && drawT < 1) drawT = Math.min(drawT + dt * 0.55, 1);
      arcMats.forEach(function (mt) { mt.uniforms.t.value = reduced ? 0.4 : t; mt.uniforms.draw.value = reduced ? 1 : drawT; });
      pulses.forEach(function (p) {
        var h = (t * 0.32 + p.off) % 1;
        p.mesh.visible = !reduced && h <= drawT;
        p.curve.getPoint(h, p.mesh.position);
      });

      scene.updateMatrixWorld();
      camDir.copy(camera.position).normalize();
      var w = stage.clientWidth, hgt = stage.clientHeight;
      pins.forEach(function (pn) {
        var sc = reduced ? 1 : 1 + ((t * 0.9 + pn.phase) % 1) * 1.6;
        pn.ring.scale.setScalar(sc);
        pn.ring.material.opacity = reduced ? 0.6 : 1 - (sc - 1) / 1.6;
        v3.copy(pn.pos).applyMatrix4(spin.matrixWorld);
        var facing = v3.clone().normalize().dot(camDir);
        v3.project(camera);
        pn.lbl.style.transform = 'translate3d(' + ((v3.x * 0.5 + 0.5) * w).toFixed(1) + 'px,' + ((-v3.y * 0.5 + 0.5) * hgt).toFixed(1) + 'px,0)';
        pn.lbl.style.opacity = Math.max(0, Math.min(1, (facing - 0.12) * 4)).toFixed(2);
      });

      renderer.render(scene, camera);
      root.classList.add('is-ready');
      if (visible && !document.hidden) loop();
    }
    function loop() { if (!running) { running = true; requestAnimationFrame(frame); } }
    loop();
  }
})();

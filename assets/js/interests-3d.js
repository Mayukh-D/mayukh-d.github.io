/* interests-3d.js  (ES module)
 Interests in 3D: hovering a card runs the art strip at its top; green wireframe models fly into the strip
 and stay while the cursor does. On touch screens each strip plays once as it scrolls into view.
 three.js loads from a CDN only when the section is near; without WebGL, or with reduced motion,
 the line drawings stay.
*/

// Interests in 3D: hovering a card runs the art strip at its top; green wireframe models fly into the strip
// and stay while the cursor does. On touch screens each strip plays once as it scrolls into view.
// three.js loads only when the section is near; without WebGL, or with reduced motion, the line drawings stay.
const section = document.getElementById('interests');
const cards = section ? [...section.querySelectorAll('.interest-card')] : [];
if (cards.length && !Site.reducedMotion()) {
  let T = null, renderer = null, active = null, runs = 0;
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;

  const near = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    near.disconnect();
    import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js').then(m => {
      T = m;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
      catch (e) { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.domElement.className = 'ia3';
      // If the browser drops the 3D context (sleep, GPU reset), fall back to the line drawings for good.
      renderer.domElement.addEventListener('webglcontextlost', e => {
        e.preventDefault(); stop(); renderer = null; section.classList.remove('ia3d');
      });
      section.classList.add('ia3d');
      cards.forEach((card, i) => {
        if (touch) { seen.observe(card); card.addEventListener('click', () => play(card, i)); }   // tap replays it
        else {
          card.addEventListener('pointerenter', () => play(card, i));
          card.addEventListener('pointerleave', () => { if (active && active.card === card && active.leaveAt === null) active.leaveAt = performance.now(); });
        }
      });
    }).catch(() => {});
  }, { rootMargin: touch ? '0px' : '600px 0px' });   // phones fetch three.js only once the section is on screen
  near.observe(section);
  const seen = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > 0.4 && !e.target.dataset.played) {
      e.target.dataset.played = '1'; play(e.target, cards.indexOf(e.target));
    }
  }), { threshold: [0.4] });

  // ---------- materials and helpers ----------
  function mats() {
    return {
      face: new T.MeshPhongMaterial({ color: 0x00ff41, emissive: 0x00300e, specular: 0x88ffaa, shininess: 50, transparent: true, opacity: 0.2, depthWrite: false, side: T.DoubleSide }),
      edge: new T.LineBasicMaterial({ color: 0x3dff7a, transparent: true, opacity: 0.95 }),
      faint: new T.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.22 }),
      dash: new T.LineDashedMaterial({ color: 0x3dff7a, transparent: true, opacity: 0.95, dashSize: 0.16, gapSize: 0.1 }),
      glow: new T.MeshBasicMaterial({ color: 0xb6ffc9, transparent: true, opacity: 1 }),
    };
  }
  function solid(geom, M, angle = 22) {
    const g = new T.Group();
    g.add(new T.Mesh(geom, M.face), new T.LineSegments(new T.EdgesGeometry(geom, angle), M.edge));
    return g;
  }
  function lines(pts, mat) {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pts.flat(), 3));
    return new T.LineSegments(g, mat);
  }
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // ---------- models (each about 2 units across) ----------
  function network(M) {
    const g = new T.Group(), layers = [4, 6, 6, 3], pts = [];
    layers.forEach((n, i) => {
      const col = [];
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2, r = n > 4 ? 0.72 : 0.48;
        const p = new T.Vector3((i - 1.5) * 0.85, Math.cos(a) * r, Math.sin(a) * r);
        const s = solid(new T.IcosahedronGeometry(0.11, 1), M, 8); s.position.copy(p); g.add(s); col.push(p);
      }
      pts.push(col);
    });
    const edges = [];
    for (let i = 0; i < pts.length - 1; i++) for (const a of pts[i]) for (const b of pts[i + 1]) edges.push([a, b]);
    g.add(lines(edges.map(([a, b]) => [a.x, a.y, a.z, b.x, b.y, b.z]), M.faint));
    const pulses = Array.from({ length: 10 }, () => {
      const m = new T.Mesh(new T.SphereGeometry(0.045, 10, 10), M.glow); g.add(m);
      return { m, e: edges[Math.floor(rnd() * edges.length)], p: rnd() };
    });
    g.userData.tick = dt => pulses.forEach(q => {
      q.p += dt * 1.4;
      if (q.p > 1) { q.p = 0; q.e = edges[Math.floor(rnd() * edges.length)]; }
      q.m.position.lerpVectors(q.e[0], q.e[1], q.p);
    });
    return g;
  }
  function attention(M) {
    const g = new T.Group(), n = 6, step = 0.3;
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      const h = i === j ? 0.95 : 0.12 + rnd() * 0.55;
      const b = solid(new T.BoxGeometry(0.22, h, 0.22), M); b.position.set((j - n / 2 + 0.5) * step, h / 2, (i - n / 2 + 0.5) * step); g.add(b);
    }
    const grid = [];
    for (let k = 0; k <= n; k++) { const v = (k - n / 2) * step; grid.push([v, 0, -n / 2 * step, v, 0, n / 2 * step], [-n / 2 * step, 0, v, n / 2 * step, 0, v]); }
    g.add(lines(grid, M.faint));
    g.position.y = -0.4;
    const w = new T.Group(); w.add(g); return w;
  }
  function pieceShape() {
    const s = new T.Shape();
    s.moveTo(0, 0); s.lineTo(1, 0); s.lineTo(1, 0.327);
    s.absarc(1.1, 0.5, 0.2, -2 * Math.PI / 3, 2 * Math.PI / 3, false);
    s.lineTo(1, 1); s.lineTo(0.673, 1);
    s.absarc(0.5, 1.1, 0.2, -Math.PI / 6, 7 * Math.PI / 6, false);
    s.lineTo(0, 1); s.lineTo(0, 0.673);
    s.absarc(0.1, 0.5, 0.2, 2 * Math.PI / 3, -2 * Math.PI / 3, true);
    s.lineTo(0, 0);
    return s;
  }
  function piece(M) {
    const geo = new T.ExtrudeGeometry(pieceShape(), { depth: 0.22, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 2, curveSegments: 14 });
    geo.translate(-0.5, -0.5, -0.11);
    return solid(geo, M, 30);
  }
  function maze(M) {
    const g = new T.Group(), u = 0.42;
    g.add(solid(new T.BoxGeometry(4 * u + 0.1, 0.06, 4 * u + 0.1), M));
    const walls = [[0,0,4,0],[0,4,4,4],[0,0,0,4],[4,0,4,4],[0,1,2,1],[3,0,3,2],[1,1,1,3],[2,2,4,2],[2,2,2,4],[0,3,1,3]];
    walls.forEach(([x1, z1, x2, z2]) => {
      const len = Math.hypot(x2 - x1, z2 - z1) * u + 0.06;
      const b = solid(new T.BoxGeometry(x1 === x2 ? 0.06 : len, 0.28, z1 === z2 ? 0.06 : len), M);
      b.position.set(((x1 + x2) / 2 - 2) * u, 0.17, ((z1 + z2) / 2 - 2) * u); g.add(b);
    });
    const route = [[0.5,0.5],[2.5,0.5],[2.5,1.5],[1.5,1.5],[1.5,2.5],[3.5,2.5],[3.5,3.5]].map(([x, z]) => new T.Vector3((x - 2) * u, 0.13, (z - 2) * u));
    const ball = new T.Mesh(new T.SphereGeometry(0.08, 14, 14), M.glow); g.add(ball);
    const segs = route.slice(1).map((p, i) => [route[i], p]); let t = 0;
    g.userData.tick = dt => { t = (t + dt * 1.6) % segs.length; const [a, b] = segs[Math.floor(t)]; ball.position.lerpVectors(a, b, t % 1); };
    return g;
  }
  function jet(M) {
    const g = new T.Group();
    const body = solid(new T.CylinderGeometry(0.13, 0.16, 2.2, 10), M); body.rotation.z = Math.PI / 2; g.add(body);
    const nose = solid(new T.ConeGeometry(0.13, 0.7, 10), M); nose.rotation.z = Math.PI / 2; nose.position.x = -1.45; g.add(nose);
    const wingS = new T.Shape(); wingS.moveTo(-0.3, 0); wingS.lineTo(0.95, 0.95); wingS.lineTo(1.05, 0.95); wingS.lineTo(1.0, 0); wingS.lineTo(1.05, -0.95); wingS.lineTo(0.95, -0.95); wingS.closePath();
    const wing = solid(new T.ExtrudeGeometry(wingS, { depth: 0.04, bevelEnabled: false }), M); wing.rotation.x = Math.PI / 2; g.add(wing);
    const canS = new T.Shape(); canS.moveTo(-0.85, 0); canS.lineTo(-0.55, 0.42); canS.lineTo(-0.48, 0.42); canS.lineTo(-0.5, -0.42); canS.lineTo(-0.55, -0.42); canS.closePath();
    const can = solid(new T.ExtrudeGeometry(canS, { depth: 0.03, bevelEnabled: false }), M); can.rotation.x = Math.PI / 2; can.position.y = 0.06; g.add(can);
    const finS = new T.Shape(); finS.moveTo(0.45, 0); finS.lineTo(0.95, 0.62); finS.lineTo(1.08, 0.62); finS.lineTo(1.1, 0); finS.closePath();
    const fin = solid(new T.ExtrudeGeometry(finS, { depth: 0.03, bevelEnabled: false }), M); fin.position.set(0, 0.1, -0.015); g.add(fin);
    const canopy = solid(new T.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), M); canopy.scale.set(2.4, 1, 1); canopy.position.set(-0.75, 0.1, 0); g.add(canopy);
    const flame = new T.Mesh(new T.ConeGeometry(0.1, 0.45, 10), M.glow); flame.rotation.z = Math.PI / 2; flame.position.x = 1.33; g.add(flame);
    g.userData.tick = (dt, t) => { flame.scale.y = 0.75 + Math.sin(t * 40) * 0.25; };
    return g;
  }
  function tank(M) {
    const g = new T.Group();
    const hullS = new T.Shape(); hullS.moveTo(-1.2, 0); hullS.lineTo(-1.35, 0.22); hullS.lineTo(-1.0, 0.42); hullS.lineTo(1.1, 0.42); hullS.lineTo(1.3, 0.2); hullS.lineTo(1.15, 0); hullS.closePath();
    const hull = new T.ExtrudeGeometry(hullS, { depth: 1.1, bevelEnabled: false }); hull.translate(0, 0.18, -0.55); g.add(solid(hull, M));
    [-0.62, 0.62].forEach(z => {
      const track = solid(new T.CapsuleGeometry(0.2, 2.2, 4, 10), M, 30); track.rotation.z = Math.PI / 2; track.position.set(0, 0.2, z); track.scale.z = 0.9; g.add(track);
      for (let k = 0; k < 6; k++) { const w = solid(new T.CylinderGeometry(0.15, 0.15, 0.08, 14), M, 30); w.rotation.x = Math.PI / 2; w.position.set(-0.95 + k * 0.38, 0.2, z + Math.sign(z) * 0.2); g.add(w); }
    });
    const turret = solid(new T.CylinderGeometry(0.42, 0.55, 0.32, 8), M); turret.position.set(-0.05, 0.76, 0); g.add(turret);
    const barrel = solid(new T.CylinderGeometry(0.05, 0.06, 1.7, 10), M); barrel.rotation.z = Math.PI / 2; barrel.position.set(1.3, 0.78, 0); g.add(barrel);
    const brake = solid(new T.CylinderGeometry(0.08, 0.08, 0.16, 10), M); brake.rotation.z = Math.PI / 2; brake.position.set(2.12, 0.78, 0); g.add(brake);
    const hatch = solid(new T.CylinderGeometry(0.13, 0.13, 0.06, 10), M); hatch.position.set(-0.2, 0.95, 0.15); g.add(hatch);
    return g;
  }
  function border(M, span) {
    // A map border: dashed boundary meandering across the ground, one territory faintly filled, pillars along it.
    const g = new T.Group(), n = 60, pts = [];
    for (let k = 0; k <= n; k++) { const x = -span / 2 + (k / n) * span; pts.push(new T.Vector3(x, 0.01, 0.22 * Math.sin(x * 1.3) + 0.09 * Math.sin(x * 3.4 + 1))); }
    const line = new T.Line(new T.BufferGeometry().setFromPoints(pts), M.dash); line.computeLineDistances(); g.add(line);
    const land = new T.Shape([...pts.map(p => new T.Vector2(p.x, -p.z)), new T.Vector2(span / 2, -0.9), new T.Vector2(-span / 2, -0.9)]);
    const fill = new T.Mesh(new T.ShapeGeometry(land), M.face); fill.rotation.x = -Math.PI / 2; g.add(fill);
    const grid = [];
    for (let k = 0; k <= 14; k++) { const x = -span / 2 + (k / 14) * span; grid.push([x, 0, -0.9, x, 0, 0.9]); }
    for (const z of [-0.9, -0.45, 0, 0.45, 0.9]) grid.push([-span / 2, 0, z, span / 2, 0, z]);
    g.add(lines(grid, M.faint));
    for (let k = 1; k < 6; k++) {
      const p = pts[Math.round((k / 6) * n)];
      const post = solid(new T.BoxGeometry(0.07, 0.32, 0.07), M); post.position.set(p.x, 0.16, p.z); g.add(post);
      const cap = solid(new T.ConeGeometry(0.07, 0.1, 4), M); cap.position.set(p.x, 0.37, p.z); cap.rotation.y = Math.PI / 4; g.add(cap);
    }
    return g;
  }
  function pyramids(M) {
    const g = new T.Group();
    [[0, 1.5, 1.05], [1.15, 1.1, 0.8], [-1.05, 0.8, 0.6]].forEach(([x, h, r], i) => {
      const p = solid(new T.ConeGeometry(r, h, 4, 1), M); p.rotation.y = Math.PI / 4; p.position.set(x, h / 2, i ? -0.5 * i : 0); g.add(p);
    });
    const grid = [];
    for (let k = -6; k <= 6; k++) { const v = k * 0.3; grid.push([v, 0, -1.6, v, 0, 1.4], [-1.8, 0, v * 0.8, 1.8, 0, v * 0.8]); }
    g.add(lines(grid, M.faint));
    const sun = new T.Mesh(new T.SphereGeometry(0.2, 24, 16), M.glow); sun.position.set(1.4, 1.75, -1.2); g.add(sun);
    g.position.y = -0.7;
    const w = new T.Group(); w.add(g); return w;
  }
  function manuscript(M) {
    const g = new T.Group();
    const page = side => {
      const geo = new T.PlaneGeometry(1, 1.35, 18, 1), p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i) + 0.5; p.setZ(i, Math.sin(x * Math.PI) * 0.12 + x * 0.18); p.setX(i, x * side); }
      geo.computeVertexNormals();
      const m = solid(geo, M, 1); m.rotation.x = -Math.PI / 2 + 0.25; return m;
    };
    g.add(page(-1), page(1));
    const cover = solid(new T.BoxGeometry(2.15, 0.06, 1.45), M); cover.position.y = -0.08; cover.rotation.x = 0.25; g.add(cover);
    const text = [];
    for (const sd of [-1, 1]) for (let r = 0; r < 6; r++) { const z = -0.42 + r * 0.17; text.push([sd * 0.18, 0.17 + 0.03, z, sd * 0.82, 0.25, z]); }
    const tl = lines(text, M.faint); tl.rotation.x = 0.25; g.add(tl);
    const ribbon = solid(new T.BoxGeometry(0.04, 0.01, 0.75), M); ribbon.position.set(0.04, 0.2, 0.62); ribbon.rotation.x = 0.25; g.add(ribbon);
    return g;
  }

  // ---------- scenes: where each model ends up, and where it flies in from and out to ----------
  // x, y are fractions of the card's half-width and half-height; from/to are directions.
  const layouts = [
    M => [
      { o: network(M), x: -0.42, y: 0.05, s: 0.78, rx: 0.15, ry: 0.5, from: 'l', to: 'l' },
      { o: attention(M), x: 0.45, y: -0.12, s: 0.82, rx: 0.55, ry: -0.6, from: 'r', to: 'r' },
    ],
    M => [
      { o: piece(M), x: -0.36, dx: -0.5, y: 0.02, s: 0.86, rx: -0.55, ry: 0, from: 'l', to: 'l', pair: true },
      { o: piece(M), x: -0.36, dx: 0.5, y: 0.02, s: 0.86, rx: -0.55, ry: 0, from: 'r', to: 'r', pair: true },
      { o: maze(M), x: 0.42, y: 0.0, s: 0.68, rx: 0.95, ry: 0.5, from: 't', to: 'r' },
    ],
    M => [
      { o: jet(M), x: 0.38, y: 0.28, s: 0.62, rx: 0.5, ry: 0.5, rz: -0.08, spin: 0, from: 'tr', to: 'l' },
      { o: tank(M), x: -0.38, y: -0.12, s: 0.6, spin: 0.12, rx: 0.3, ry: -0.55, from: 'l', to: 'r' },
      { o: border(M, 7), x: 0, y: -0.72, s: 0.4, rx: 0.6, ry: 0, spin: 0, from: 'b', to: 'b', wide: true },
    ],
    M => [
      { o: pyramids(M), x: -0.4, y: -0.2, s: 0.82, rx: 0.3, ry: 0.4, from: 'l', to: 'l' },
      { o: manuscript(M), x: 0.42, y: -0.12, s: 0.82, rx: 0.75, ry: -0.35, from: 'r', to: 'r' },
    ],
  ];
  const built = [];
  function build(i) {
    if (built[i]) return built[i];
    seed = 7 + i;
    const scene = new T.Scene(), M = mats();
    scene.add(new T.AmbientLight(0xffffff, 0.55));
    const sun = new T.DirectionalLight(0xffffff, 1.4); sun.position.set(2, 4, 5); scene.add(sun);
    const cam = new T.PerspectiveCamera(30, 1.75, 0.1, 100); cam.position.set(0, 1.0, 9); cam.lookAt(0, 0, 0);
    const items = layouts[i](M);
    items.forEach(it => scene.add(it.o));
    return (built[i] = { scene, cam, M, items });
  }

  const ease = t => 1 - Math.pow(1 - t, 3), easeIn = t => t * t * t;
  const IN = 0.95, HOLD = 2.0, OUT = 0.8;
  function dir(d, hw, hh) {
    return { l: [-2.6 * hw, 0], r: [2.6 * hw, 0], t: [0, 2.6 * hh], b: [0, -2.4 * hh], tr: [2.2 * hw, 1.9 * hh] }[d];
  }
  function play(card, i) {
    if (!renderer || i < 0) return;
    if (active) stop();
    const S = build(i);
    const stage = card.querySelector('.ia-stage');
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    stage.append(renderer.domElement);
    stage.classList.add('live');
    S.cam.aspect = w / h; S.cam.updateProjectionMatrix();
    const hh = Math.tan(T.MathUtils.degToRad(S.cam.fov / 2)) * S.cam.position.length(), hw = hh * S.cam.aspect;
    S.items.forEach(it => {
      const size = hh * 2 * it.s;
      it.o.scale.setScalar(it.wide ? hw * 2 / 7 : size / 2);
      if (it.pair) it.o.scale.setScalar(size / 2.4);
      if (it.squash) it.o.scale.y *= it.squash;
      const k = it.o.scale.x;
      it.end = new T.Vector3(it.x * hw + (it.dx || 0) * k, it.y * hh, 0);
      const [fx, fy] = dir(it.from, hw, hh), [tx, ty] = dir(it.to, hw, hh);
      it.start = it.end.clone().add(new T.Vector3(fx, fy, -1.5));
      it.exit = it.end.clone().add(new T.Vector3(tx, ty, -1.5));
      it.leaveFrom = null;
    });
    const run = ++runs;   // each play gets its own loop; a stale loop sees a newer run and stops
    // On a laptop the models stay while the cursor does; on touch screens they leave after HOLD seconds.
    active = { card, stage, S, run, t0: performance.now(), last: performance.now(), leaveAt: null };
    requestAnimationFrame(now => frame(now, run));
  }
  function stop() {
    if (!active) return;
    active.stage.classList.remove('live');
    renderer.domElement.remove();
    active = null;
  }
  function frame(now, run) {
    if (!active || active.run !== run) return;
    const { S } = active, t = Math.max(0, (now - active.t0) / 1000), dt = Math.min(0.05, Math.max(0, (now - active.last) / 1000));
    active.last = now;
    if (touch && active.leaveAt === null && t > IN + HOLD) active.leaveAt = now;
    const out = active.leaveAt === null ? -1 : (now - active.leaveAt) / 1000;
    S.items.forEach((it, k) => {
      const lag = k * 0.08;
      let p, pos;
      if (out >= 0) { p = easeIn(Math.min(1, Math.max(0, out - lag * 0.5) / OUT)); it.leaveFrom ??= it.o.position.clone(); pos = it.leaveFrom.clone().lerp(it.exit, p); }
      else if (t < IN + lag) { p = ease(Math.max(0, (t - lag) / IN)); pos = it.start.clone().lerp(it.end, p); }
      else { pos = it.end.clone(); pos.y += Math.sin((t - IN) * 2.2 + k) * 0.03; }
      it.o.position.copy(pos);
      it.o.rotation.set(it.rx || 0, (it.ry || 0) + (it.pair ? 0 : t * (it.spin ?? 0.35)), it.rz || 0);
      if (it.o.userData.tick) it.o.userData.tick(dt, t);
    });
    const fade = Math.min(1, t / 0.35, out < 0 ? 1 : Math.max(0, 1 - out / OUT));
    S.M.face.opacity = 0.2 * fade; S.M.edge.opacity = 0.95 * fade; S.M.faint.opacity = 0.22 * fade; S.M.dash.opacity = 0.95 * fade; S.M.glow.opacity = fade; 
    renderer.render(S.scene, S.cam);
    if (out < OUT + 0.3) requestAnimationFrame(n => frame(n, run)); else stop();
  }
}

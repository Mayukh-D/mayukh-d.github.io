// Easter egg: type "plane" in the terminal and the page folds into a paper plane and flies off.
// The screenshot is the printed side of a sheet, plain paper is the back, and each fold of a
// classic dart rotates the real paper layers in 3D. Loaded on demand; a refresh brings the page back.
(function () {
  // Renders the page through the browser's own engine, so masks and glows survive.
  const SNAP = 'https://cdn.jsdelivr.net/npm/modern-screenshot@4.7.0/dist/index.js';
  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  const loadScript = (src, ready) => new Promise((ok, fail) => {
    if (ready()) return ok();
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = fail;
    document.head.append(s);
  });
  const timeout = ms => new Promise((_, f) => setTimeout(f, ms));

  // A faint paper edge, so the sheet reads as paper against a page of the same colour.
  function edged(canvas) {
    const g = canvas.getContext('2d'), w = canvas.width, h = canvas.height, e = Math.max(3, w / 260);
    g.strokeStyle = 'rgba(220, 255, 230, 0.5)'; g.lineWidth = e; g.strokeRect(e / 2, e / 2, w - e, h - e);
    return canvas;
  }

  // The page's Google Fonts sheet is cross-origin, so its @font-face rules are handed over directly.
  // Fetched once and kept, so later snapshots start straight away.
  let fonts;
  const fontCss = () => fonts || (fonts = (async () => {
    const sheet = document.querySelector('link[href*="fonts.googleapis.com/css"]');
    return sheet ? Promise.race([fetch(sheet.href).then(r => r.text()), timeout(1500)]).catch(() => '') : '';
  })());

  // What is on screen right now, as a canvas. Falls back to a plain sheet with the name on it.
  async function snapshot(W, H, bg) {
    try {
      await Promise.race([loadScript(SNAP, () => window.modernScreenshot), timeout(4000)]);
      const cssText = await fontCss();
      const canvas = await Promise.race([
        window.modernScreenshot.domToCanvas(document.documentElement, {
          width: W, height: H, scale: Math.min(devicePixelRatio || 1, 1.5), backgroundColor: bg,
          font: cssText ? { cssText } : false, timeout: 1500,   // cap slow fetches: 30s -> about 2s
          style: { transform: `translate(${-scrollX}px, ${-scrollY}px)` },
          // only what is on screen (and fixed bars), not the whole long page
          filter: n => {
            if (n.nodeType !== 1) return true;
            if (n.id === 'chat' || n.classList.contains('plane-egg')) return false;
            if (n === document.body || n === document.documentElement) return true;
            const r = n.getBoundingClientRect();
            return r.height === 0 || (r.bottom > -50 && r.top < H + 50) || getComputedStyle(n).position === 'fixed';
          },
        }),
        timeout(6000),
      ]);
      return edged(canvas);
    } catch {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--green') || '#00ff41';
      g.font = `700 ${Math.round(W / 9)}px "JetBrains Mono", monospace`;
      g.textAlign = 'center'; g.fillText('MAYUKH DAS', W / 2, H / 2);
      return edged(c);
    }
  }

  const css = `
    .plane-egg { position: fixed; inset: 0; z-index: 2147483000; overflow: hidden; }
    .plane-egg canvas { position: absolute; inset: 0; }
    .plane-egg .note { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;
      font: 500 0.95rem/1.7 'JetBrains Mono', monospace; color: var(--green, #00ff41); opacity: 0; transition: opacity 0.6s; }
    .plane-egg .note.on { opacity: 1; }
    .plane-egg .note button { margin-top: 14px; font: inherit; color: var(--bg, #000); background: var(--green, #00ff41);
      border: 0; border-radius: 6px; padding: 8px 16px; cursor: pointer; }
    .plane-letter { position: fixed; z-index: 2147482999; display: flex; flex-direction: column; overflow: hidden;
      background: var(--panel-bg, #050805); border: 1px solid var(--border-bright, #1d4a2f); border-radius: 8px;
      font: 0.78rem/1.7 'JetBrains Mono', monospace; color: var(--text-muted, #7d8f85);
      opacity: 0; transform: translateY(12px) scale(0.96); transition: opacity 0.25s, transform 0.25s ease-out; }
    .plane-letter.on { opacity: 1; transform: none; }
    .plane-letter .pl-bar { padding: 7px 14px; border-bottom: 1px solid var(--border, #10241a); background: var(--bg-soft, #0a0f0c); color: var(--text-muted, #7d8f85); }
    .plane-letter p { margin: 0; }
    .plane-letter .pl-body { flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; overflow-wrap: anywhere; }
    .plane-letter b { display: inline-block; min-width: 4.6em; font-weight: 500; color: var(--green, #00ff41); }
    .plane-letter .pl-msg { margin-top: 14px; color: var(--text, #d8e4dc); }
    .plane-letter .pl-cur { margin-top: auto; color: var(--green-dim, #00b32e); }`;

  // ---- paper: flat convex faces, each with its place on the sheet (uv) and a stacking layer ----

  // Cut a face along a line (point P, unit normal n). Returns [back side, front side] or null.
  function cut(face, P, n) {
    const d = face.pts.map(p => (p[0] - P[0]) * n[0] + (p[1] - P[1]) * n[1]);
    if (d.every(v => v >= -1e-6) || d.every(v => v <= 1e-6)) return null;
    const A = [], Au = [], B = [], Bu = [];
    for (let i = 0; i < d.length; i++) {
      const j = (i + 1) % d.length, p = face.pts[i], u = face.uv[i];
      if (d[i] <= 1e-6) { A.push(p); Au.push(u); }
      if (d[i] >= -1e-6) { B.push(p); Bu.push(u); }
      if ((d[i] < -1e-6 && d[j] > 1e-6) || (d[i] > 1e-6 && d[j] < -1e-6)) {
        const t = d[i] / (d[i] - d[j]), q = face.pts[j], w = face.uv[j];
        const ip = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
        const iu = [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t];
        A.push(ip); Au.push(iu); B.push(ip); Bu.push(iu);
      }
    }
    return [{ ...face, pts: A, uv: Au }, { ...face, pts: B, uv: Bu }];
  }
  const centroid = f => f.pts.reduce((a, p) => [a[0] + p[0] / f.pts.length, a[1] + p[1] / f.pts.length], [0, 0]);

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const three = () => loadScript(THREE_URL, () => window.THREE).catch(() => {});
  let style;
  function overlay(bg) {
    if (!style) { style = document.createElement('style'); style.textContent = css; document.head.append(style); }
    const egg = document.createElement('div'); egg.className = 'plane-egg';
    if (bg) egg.style.background = bg; else egg.style.pointerEvents = 'none';   // a see-through layer leaves the page usable
    document.body.append(egg);
    return egg;
  }

  // Folds `shot` into a classic dart and throws it. `rect` is where the sheet sits on screen at the
  // start (css px). With `bg` the layer is opaque (the whole page); without it the page shows through.
  async function flight({ egg, shot, rect, bg, s, pace = 1, heading = 1, shown, launch }) {
    const W = innerWidth, H = innerHeight, SW = rect.width, SH = rect.height;
    const T = window.THREE;
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: !bg });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    if (bg) renderer.setClearColor(new T.Color(bg)); else renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.domElement.style.opacity = 0;          // shown once the first frame is drawn
    egg.append(renderer.domElement);

    // a camera that maps 1 world unit to 1 css pixel on the z = 0 plane, so frame one matches the page
    // near = 200 (not 1): the paper sits ~1500 away, and a tight near plane spends depth precision there,
    // which stops stacked layers flickering through each other
    const fov = 30, camera = new T.PerspectiveCamera(fov, W / H, 200, 15000);
    camera.position.z = (H / 2) / Math.tan(fov * Math.PI / 360);
    const scene = new T.Scene();
    scene.add(new T.AmbientLight(0xffffff, 0.72));
    const sun = new T.DirectionalLight(0xffffff, 0.34); sun.position.set(0.3, 0.6, 1); scene.add(sun);

    const tex = new T.CanvasTexture(shot); tex.encoding = T.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();   // keeps tilted folds crisp
    const front = new T.MeshLambertMaterial({ map: tex, side: T.FrontSide });
    const back = new T.MeshLambertMaterial({ color: 0xf2f5f1, side: T.BackSide });

    const root = new T.Group(), flyer = new T.Group(), body = new T.Group();
    scene.add(root); root.add(flyer); flyer.add(body);
    root.position.set(rect.left + SW / 2 - W / 2, H / 2 - rect.top - SH / 2, 0);   // over the element it replaces

    // the sheet, in world units (y up), with its long side as the length of the plane
    let faces = [{ pts: [[-SW / 2, -SH / 2], [SW / 2, -SH / 2], [SW / 2, SH / 2], [-SW / 2, SH / 2]],
                   uv: [[0, 0], [1, 0], [1, 1], [0, 1]], layer: 0 }];
    const portrait = SH >= SW, w = portrait ? SW : SH, h = portrait ? SH : SW;
    // canonical paper coords: x across (centre crease at 0), y from the nose (0) to the tail (h)
    const C = portrait ? (x, y) => [x, SH / 2 - y] : (x, y) => [SW / 2 - y, -x];
    const DZ = 1.2;   // gap between stacked layers

    function build(f) {
      const g = new T.BufferGeometry(), pos = [], uv = [];
      for (let i = 1; i < f.pts.length - 1; i++) {
        for (const k of [0, i, i + 1]) { pos.push(f.pts[k][0], f.pts[k][1], f.layer * DZ); uv.push(f.uv[k][0], f.uv[k][1]); }
      }
      g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      f.meshes = [new T.Mesh(g, front), new T.Mesh(g, back)];
      f.meshes.forEach(m => { m.matrixAutoUpdate = false; body.add(m); });
    }
    function rebuild() {
      body.children.slice().forEach(m => { m.geometry.dispose(); body.remove(m); });
      faces.forEach(build);
    }
    rebuild();

    const render = () => renderer.render(scene, camera);
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tween = (ms, fn) => new Promise(done => {
      const t0 = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - t0) / (ms * pace));
        fn(ease(t), t); render();
        t < 1 ? requestAnimationFrame(step) : done();
      })(t0);
    });
    const wait = ms => new Promise(r => setTimeout(r, ms * pace));

    // One fold of every layer along the line a-b (canonical coords). `toward` is a canonical point
    // on the side that moves. Valley folds come up toward the viewer, mountain folds go behind.
    async function fold({ a, b, toward, valley = true, angle = Math.PI, ms = 480, unfold = false, hold = false, pick, mark }) {
      const P = C(...a), Q = C(...b), len = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
      const D = [(Q[0] - P[0]) / len, (Q[1] - P[1]) / len], n = [-D[1], D[0]];
      const S = C(...toward), side = Math.sign((S[0] - P[0]) * n[0] + (S[1] - P[1]) * n[1]);
      if (!hold) {                       // cut every face the crease runs through
        const next = [];
        faces.forEach(f => { const parts = cut(f, P, n); parts ? next.push(...parts) : next.push(f); });
        faces = next; rebuild();
      }
      const onSide = f => { const c = centroid(f); return Math.sign((c[0] - P[0]) * n[0] + (c[1] - P[1]) * n[1]) === side; };
      const moving = faces.filter(f => (pick ? pick(f) : true) && (hold ? true : onSide(f)));
      const cz = D[0] * side * n[1] - D[1] * side * n[0];          // which way a positive turn lifts the paper
      const dir = Math.sign(cz) * (valley ? 1 : -1);
      const axis = new T.Vector3(D[0], D[1], 0);
      const to = new T.Matrix4().makeTranslation(P[0], P[1], 0), from = new T.Matrix4().makeTranslation(-P[0], -P[1], 0);
      const base = new Map(moving.map(f => [f, f.meshes[0].matrix.clone()]));
      const turn = th => moving.forEach(f => {
        const m = to.clone().multiply(new T.Matrix4().makeRotationAxis(axis, th)).multiply(from).multiply(base.get(f));
        f.meshes.forEach(x => x.matrix.copy(m));
      });
      await tween(ms, e => turn(dir * angle * e));
      if (unfold) { await tween(ms * 0.8, e => turn(dir * angle * (1 - e))); return; }
      if (hold) return;
      // settle the folded faces flat: mirror them across the crease and restack them
      const all = faces.map(f => f.layer), lay = moving.map(f => f.layer);
      const top = Math.max(...all), bottom = Math.min(...all), hi = Math.max(...lay), lo = Math.min(...lay);
      moving.forEach(f => {
        f.pts = f.pts.map(p => { const k = 2 * ((p[0] - P[0]) * n[0] + (p[1] - P[1]) * n[1]); return [p[0] - k * n[0], p[1] - k * n[1]]; });
        f.layer = valley ? top + 1 + (hi - f.layer) : bottom - 1 - (f.layer - lo);
        if (mark) mark(f);
      });
      rebuild();
    }

    const t22 = Math.tan(Math.PI / 8);
    render(); renderer.domElement.style.opacity = 1;
    shown && shown();

    // 0) the sheet lifts off the screen
    await tween(700, e => { const k = 1 + (s - 1) * e; root.scale.set(k, k, k); root.rotation.x = -0.12 * e; });
    await wait(120);
    // 1) fold in half lengthwise and open it again: the centre crease
    await fold({ a: [0, 0], b: [0, h], toward: [w / 4, h / 2], unfold: true, ms: 420 });
    faces.forEach(f => {                // remember which half each piece belongs to
      const c = centroid(f), P = C(0, 0), Q = C(0, h), d = (c[0] - P[0]) * (Q[1] - P[1]) - (c[1] - P[1]) * (Q[0] - P[0]);
      const R = C(w / 4, h / 2), dr = (R[0] - P[0]) * (Q[1] - P[1]) - (R[1] - P[1]) * (Q[0] - P[0]);
      f.half = Math.sign(d) === Math.sign(dr) ? 'R' : 'L';
    });
    // 2, 3) top corners to the centre crease
    await fold({ a: [0, 0], b: [-w / 2, w / 2], toward: [-w / 2 + 1, 1] });
    await fold({ a: [0, 0], b: [w / 2, w / 2], toward: [w / 2 - 1, 1] });
    // 4, 5) the new slanted edges to the centre crease, for a sharper nose
    await fold({ a: [0, 0], b: [-w / 2, (w / 2) / t22], toward: [-w / 2, w / 2] });
    await fold({ a: [0, 0], b: [w / 2, (w / 2) / t22], toward: [w / 2, w / 2] });
    // 6) in half along the centre, flaps outside
    await fold({ a: [0, 0], b: [0, h], toward: [w / 4, h / 2], valley: false, ms: 600 });
    // 7, 8) each wing down so its edge meets the keel
    await fold({ a: [-w / 4, 0], b: [-w / 4, h], toward: [-w / 2 + 1, h - 1], pick: f => f.half === 'L', mark: f => { f.wing = true; } });
    await fold({ a: [-w / 4, 0], b: [-w / 4, h], toward: [-w / 2 + 1, h - 1], valley: false, pick: f => f.half === 'R', mark: f => { f.wing = true; } });
    // 9) open the wings out level
    await Promise.all([
      fold({ a: [-w / 4, 0], b: [-w / 4, h], toward: [0, h / 2], angle: Math.PI / 2, hold: true, pick: f => f.wing && f.half === 'L' }),
      fold({ a: [-w / 4, 0], b: [-w / 4, h], toward: [0, h / 2], angle: Math.PI / 2, hold: true, valley: false, pick: f => f.wing && f.half === 'R' }),
    ]);
    await wait(150);

    // 10) turn nose-first and fly off into the distance
    launch && launch();
    const box = new T.Box3().setFromObject(body), mid = box.getCenter(new T.Vector3());
    body.position.copy(mid).multiplyScalar(-1); flyer.position.copy(mid);
    const v3 = (x, y) => new T.Vector3(x, y, 0);
    const N0 = v3(...C(0, -1)).sub(v3(...C(0, 0))).normalize();       // nose
    const U0 = v3(...C(-1, 0)).sub(v3(...C(0, 0))).normalize();       // from the keel up to the wings
    const basis = (N, U) => new T.Matrix4().makeBasis(N, U, new T.Vector3().crossVectors(N, U));
    const N1 = new T.Vector3(heading, 0.22, -0.55).normalize();   // heading 1 = off to the right, -1 = to the left
    const U1 = new T.Vector3(0, 1, 0.55).sub(N1.clone().multiplyScalar(N1.dot(new T.Vector3(0, 1, 0.55)))).normalize();
    const R = basis(N1, U1).multiply(basis(N0, U0).transpose());
    const q0 = new T.Quaternion(), q1 = new T.Quaternion().setFromRotationMatrix(R), q = new T.Quaternion();
    await tween(650, e => { q.copy(q0).slerp(q1, e); flyer.quaternion.copy(q); flyer.position.copy(mid).add(N1.clone().multiplyScalar(-40 * e)); });
    const start = flyer.position.clone(), dist = Math.max(W, H) * 4;
    await tween(1800, (e, t) => {
      const go = t * t;                                  // speeds up like a real throw
      flyer.position.copy(start).add(N1.clone().multiplyScalar(dist * go)).add(new T.Vector3(0, Math.sin(Math.PI * t) * H * 0.18, 0));
      const roll = new T.Quaternion().setFromAxisAngle(N1, Math.sin(t * Math.PI * 2) * 0.18);
      flyer.quaternion.copy(roll).multiply(q1);
    });

    renderer.dispose(); tex.dispose();
  }

  // Typing "plane" in the terminal: the whole page folds up and flies away.
  window.paperPlane = async function (beforeFold) {
    if (document.querySelector('.plane-egg')) return;
    const W = innerWidth, H = innerHeight;
    const bg = getComputedStyle(document.body).backgroundColor || '#000';
    const [shot] = await Promise.all([snapshot(W, H, bg), three()]);
    beforeFold && beforeFold();

    const egg = overlay(bg);
    document.documentElement.style.overflow = 'hidden';
    const end = () => {
      egg.querySelector('canvas')?.remove();
      const note = document.createElement('div'); note.className = 'note';
      note.innerHTML = '&gt; the page flew away.<br>refresh to bring it back<br><button type="button">&#8635; refresh</button>';
      note.querySelector('button').onclick = () => location.reload();
      egg.append(note); requestAnimationFrame(() => note.classList.add('on'));
    };
    if (reduced() || !window.THREE) return end();
    try { await flight({ egg, shot, bg, rect: { left: 0, top: 0, width: W, height: H }, s: W > 700 ? 0.62 : 0.72 }); } catch {}
    end();
  };

  // Gets both libraries and the fonts ready, so a fold can start the moment it is asked for.
  window.paperPlane.preload = () => Promise.all([loadScript(SNAP, () => window.modernScreenshot), three(), fontCss()]).catch(() => {});

  // One element folds into a plane and flies off; the page stays put underneath.
  // `hide` runs once the paper copy is on screen (or straight away if anything fails), `launch` as it takes off.
  window.paperPlane.fly = async function (el, { hide, launch, pace = 0.6, heading = 1 } = {}) {
    let hid = false, went = false;
    const doHide = () => { if (!hid) { hid = true; hide && hide(); } };
    const doLaunch = () => { if (!went) { went = true; launch && launch(); } };
    try {
      if (reduced()) throw 0;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) throw 0;
      const bg = getComputedStyle(document.body).backgroundColor || '#000';
      await Promise.race([window.paperPlane.preload(), timeout(2500)]);
      if (!window.modernScreenshot || !window.THREE) throw 0;
      const canvas = await Promise.race([
        window.modernScreenshot.domToCanvas(el, {
          scale: Math.min(devicePixelRatio || 1, 2), backgroundColor: bg,
          font: (await fontCss()) ? { cssText: await fontCss() } : false, timeout: 1000,
        }),
        timeout(2000),
      ]);
      const egg = overlay();
      try { await flight({ egg, shot: edged(canvas), rect, s: 0.9, pace, heading, shown: doHide, launch: doLaunch }); }
      finally { egg.remove(); }
    } catch {
      doHide(); doLaunch();
    }
  };

  // The email button: a short note pops out of the button, folds into a plane and is sent.
  window.paperPlane.letter = function (from, addr, send) {
    const r = from.getBoundingClientRect(), cw = Math.min(280, innerWidth - 32), ch = Math.round(cw * 1.3);
    const card = document.createElement('div'); card.className = 'plane-letter';
    card.innerHTML = '<div class="pl-bar">~/new-message</div>' +
      '<div class="pl-body"><p><b>to</b> ' + addr + '</p><p><b>from</b> you</p><p><b>subject</b> hello</p>' +
      '<p class="pl-msg">Hi Mayukh,</p><p class="pl-cur">&gt; folding it up and sending</p></div>';
    const left = Math.max(16, Math.min(innerWidth - cw - 16, r.left + r.width / 2 - cw / 2));
    const top = Math.max(16, Math.min(innerHeight - ch - 16, r.top - ch - 12));
    Object.assign(card.style, { left: left + 'px', top: top + 'px', width: cw + 'px', height: ch + 'px' });
    if (!style) { style = document.createElement('style'); style.textContent = css; document.head.append(style); }
    document.body.append(card);
    requestAnimationFrame(() => card.classList.add('on'));
    setTimeout(() => window.paperPlane.fly(card, { hide: () => card.remove(), launch: send, pace: 0.5 }), 450);
  };
})();

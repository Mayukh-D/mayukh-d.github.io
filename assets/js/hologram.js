/* hologram.js
 U-TAE wireframe hologram (#holo, bottom-right): the satellite time-series model as a 3D wireframe
 (encoder, decoder, temporal attention, skips) with data pulses along it. Auto-spins, drag to rotate with
 inertia, sleeps when idle or off screen. Pure canvas 2D, no libraries.
*/

/* ---------- U-TAE wireframe hologram ---------- */
(function () {
  var canvas = document.getElementById('holo');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var V = [], E = [];
  function v(x, y, z) { V.push([x, y, z]); return V.length - 1; }
  // every edge carries the part of the network it belongs to, for colour
  var GRP = 0, G_ENC = 0, G_DEC = 1, G_ATT = 2, G_SKIP = 3, G_FLOW = 4, G_IN = 5, G_OUT = 6;
  var FILLS = [], FLOW = [], SKIPS = [], ATTN = [];
  function e(a, b) { E.push([a, b, GRP]); }
  function ring(idx) { for (var i = 0; i < idx.length; i++) e(idx[i], idx[(i + 1) % idx.length]); }
  function loft(a, b) { for (var i = 0; i < a.length; i++) e(a[i], b[i]); }

  /* A U-TAE (Garnot & Landrieu, 2021), the model behind my canopy mapping
     at Haizea: a U-Net that reads a satellite time series. Each feature map
     is a box: its face is the spatial size, its depth along x the channel
     count. The encoder runs on every date, so its maps carry ghost frames,
     one per date. At the bottleneck a temporal attention encoder (the
     octahedron) collapses time, and its attention masks reach up to collapse
     time in every skip connection too, which is what separates a U-TAE from
     a plain U-Net. The decoder then works on single maps. A stack of dated
     tiles goes in on the left, a canopy map comes out on the right.
     x: input -> output, y: up, z: across. */
  function ghosts(x, y, s, n) {        // earlier dates, stacked behind a face
    var h = s / 2;
    for (var k = 1; k <= n; k++) {
      var o = 0.07 * k;
      ring([v(x - o, y - h + o, -h + o), v(x - o, y - h + o, h + o),
            v(x - o, y + h + o, h + o), v(x - o, y + h + o, -h + o)]);
    }
  }
  function box(x, y, s, d) {           // centre x/y, face size s, depth d
    var h = s / 2, x0 = x - d / 2, x1 = x + d / 2, f = [], k = [];
    [[-h, -h], [h, -h], [h, h], [-h, h]].forEach(function (c) {
      f.push(v(x0, y + c[0], c[1])); k.push(v(x1, y + c[0], c[1]));
    });
    ring(f); ring(k); loft(f, k);
    // channel slices, so depth reads as stacked feature maps
    var n = Math.max(1, Math.round(d / 0.12));
    for (var i = 1; i < n; i++) {
      var xs = x0 + d * i / n;
      ring([v(xs, y - h, -h), v(xs, y - h, h), v(xs, y + h, h), v(xs, y + h, -h)]);
    }
    return { x0: x0, x1: x1, y: y, h: h };
  }
  function arrow(p, q) {                // flow between maps, with a small head
    var a = v(p[0], p[1], 0), b = v(q[0], q[1], 0);
    e(a, b);
    var dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy) || 1;
    var ux = dx / m, uy = dy / m, L = 0.09;
    e(b, v(q[0] - L * (ux - 0.6 * uy), q[1] - L * (uy + 0.6 * ux), 0));
    e(b, v(q[0] - L * (ux + 0.6 * uy), q[1] - L * (uy - 0.6 * ux), 0));
  }
  var LV = [                            // x, y, face, depth
    [-2.45,  0.62, 1.15, 0.14],
    [-1.62,  0.18, 0.86, 0.24],
    [-0.82, -0.24, 0.62, 0.36],
    [ 0.00, -0.62, 0.42, 0.50],         // bottleneck
    [ 0.82, -0.24, 0.62, 0.36],
    [ 1.62,  0.18, 0.86, 0.24],
    [ 2.45,  0.62, 1.15, 0.14]
  ];
  var B = LV.map(function (l, i) { GRP = i < 4 ? G_ENC : G_DEC; return box(l[0], l[1], l[2], l[3]); });
  GRP = G_ENC;
  for (var gi = 0; gi <= 3; gi++) ghosts(B[gi].x0, LV[gi][1], LV[gi][2], 2);   // encoder sees every date
  GRP = G_ATT;
  // L-TAE: temporal attention under the bottleneck, as an octahedron
  var tx = 0, ty = -1.26, tr = 0.23;
  var oc = [v(tx + tr, ty, 0), v(tx, ty + tr, 0), v(tx - tr, ty, 0), v(tx, ty - tr, 0),
            v(tx, ty, tr), v(tx, ty, -tr)];
  ring([oc[0], oc[1], oc[2], oc[3]]);
  [0, 1, 2, 3].forEach(function (i) { e(oc[i], oc[4]); e(oc[i], oc[5]); });
  e(v(0, B[3].y - B[3].h, 0), oc[1]);
  // its attention masks reach every skip connection (dotted)
  for (var ai = 0; ai < 3; ai++) {
    var ax = B[ai].x1 + 0.05, ay = B[ai].y + B[ai].h, pa = oc[2], path = [V[oc[2]]];
    for (var am = 1; am <= 10; am++) {
      var u2 = am / 10;
      var p2 = v(tx - tr + (ax - tx + tr) * u2, ty + (ay - ty) * u2 - 0.35 * Math.sin(Math.PI * u2), 0);
      if (am % 2 === 0) e(pa, p2);
      pa = p2; path.push(V[p2]);
    }
    ATTN.push(path);
  }
  GRP = G_FLOW;
  for (var li = 0; li < B.length - 1; li++) {
    arrow([B[li].x1 + 0.04, B[li].y], [B[li + 1].x0 - 0.04, B[li + 1].y]);
  }
  // skip connections: encoder level i to decoder level 6-i, arcing over the top
  GRP = G_SKIP;
  for (var si = 0; si < 3; si++) {
    var A = B[si], Z = B[6 - si], top = 1.45 - si * 0.28, prev = null, arc = [];
    for (var sk = 0; sk <= 12; sk++) {
      var u = sk / 12;
      var sx = A.x1 + (Z.x0 - A.x1) * u;
      var sy = (A.y + A.h) + ((Z.y + Z.h) - (A.y + A.h)) * u + (top - Math.max(A.y + A.h, Z.y + Z.h)) * Math.sin(Math.PI * u);
      var cur = v(sx, sy, 0);
      if (prev !== null && sk % 2 === 1) e(prev, cur);   // dashed
      prev = cur; arc.push(V[cur]);
    }
    SKIPS.push(arc);
  }
  // input: a satellite tile with its pixel grid; output: the canopy map
  function tile(x, y, s, n, paint) {
    var h = s / 2, i, j, c = [];
    ring([v(x, y - h, -h), v(x, y - h, h), v(x, y + h, h), v(x, y + h, -h)]);
    for (i = 1; i < n; i++) {
      var o = -h + s * i / n;
      e(v(x, y + o, -h), v(x, y + o, h));
      e(v(x, y - h, o), v(x, y + h, o));
    }
    // filled cells: the satellite pixels going in, the canopy map coming out
    for (i = 0; i <= n; i++) { c.push([]); for (j = 0; j <= n; j++) c[i].push(v(x, y - h + s * i / n, -h + s * j / n)); }
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
      var col = paint(i, j);
      FILLS.push([c[i][j], c[i][j + 1], c[i + 1][j + 1], c[i + 1][j], col[0], col[1]]);
    }
  }
  var LAND = [[22, 96, 58], [64, 128, 70], [118, 100, 62], [34, 80, 100], [48, 112, 64]];
  GRP = G_IN;
  tile(-3.15, 0.62, 1.15, 5, function (i, j) { return [LAND[(i * 7 + j * 3 + i * j) % 5], 0.55]; });
  ghosts(-3.15, 0.62, 1.15, 3);            // the time series: one tile per date
  GRP = G_OUT;
  tile(3.15, 0.62, 1.15, 3, function (i, j) { return [[0, 255, 65], [0.55, 0.25, 0.4, 0.15, 0.6, 0.35, 0.3, 0.5, 0.2][i * 3 + j]]; });
  GRP = G_FLOW;
  arrow([-3.08, 0.62], [B[0].x0 - 0.04, 0.62]);
  arrow([B[6].x1 + 0.04, 0.62], [3.08, 0.62]);
  // the path data takes: tile in, down the encoder, up the decoder, tile out
  FLOW = [[-3.15, 0.62, 0]].concat(LV.map(function (l) { return [l[0], l[1], 0]; }), [[3.15, 0.62, 0]]);
  function measure(pts) {
    var L = [0];
    for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
    return { pts: pts, L: L, total: L[L.length - 1] };
  }
  function along(m, u) {
    var d = u * m.total, i = 1;
    while (i < m.L.length - 1 && m.L[i] < d) i++;
    var a = m.pts[i - 1], b = m.pts[i], f = (d - m.L[i - 1]) / ((m.L[i] - m.L[i - 1]) || 1);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  var MFLOW = measure(FLOW), MSKIP = SKIPS.map(measure), MATTN = ATTN.map(measure);
  // colour per part: encoder cyan, decoder green, attention amber, skips pale
  var GCOL = [[0, 229, 255], [0, 255, 110], [255, 184, 64], [190, 240, 255], [0, 229, 255], [0, 229, 255], [0, 255, 110]];
  var GA = [0.78, 0.84, 0.95, 0.5, 0.6, 0.75, 0.84];

  /* ---------- render loop ---------- */
  var W, H;
  // base: a cached copy of the wireframe, so idle frames only repaint the travelling data pulses
  var base = document.createElement('canvas'), bctx = base.getContext('2d'), baseOk = false, baseT = 0;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    base.width = canvas.width; base.height = canvas.height; baseOk = false;
  }
  resize();
  window.addEventListener('resize', resize);

  var pitch = 0.42, camD = 9.5;
  var cp = Math.cos(pitch), sps = Math.sin(pitch);
  var proj = new Array(V.length);
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* quaternion helpers: q = [w, x, y, z] */
  function qMul(a, b) {
    return [
      a[0]*b[0] - a[1]*b[1] - a[2]*b[2] - a[3]*b[3],
      a[0]*b[1] + a[1]*b[0] + a[2]*b[3] - a[3]*b[2],
      a[0]*b[2] - a[1]*b[3] + a[2]*b[0] + a[3]*b[1],
      a[0]*b[3] + a[1]*b[2] - a[2]*b[1] + a[3]*b[0]
    ];
  }
  function qAxis(ax, ay, az, angle) {
    var s = Math.sin(angle / 2);
    return [Math.cos(angle / 2), ax * s, ay * s, az * s];
  }
  function qNorm(q) {
    var m = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
    return [q[0] / m, q[1] / m, q[2] / m, q[3] / m];
  }
  function qRot(q, v) {
    var w = q[0], x = q[1], y = q[2], z = q[3];
    var tx = 2 * (y * v[2] - z * v[1]),
        ty = 2 * (z * v[0] - x * v[2]),
        tz = 2 * (x * v[1] - y * v[0]);
    return [
      v[0] + w * tx + y * tz - z * ty,
      v[1] + w * ty + z * tx - x * tz,
      v[2] + w * tz + x * ty - y * tx
    ];
  }
  function qSlerp(a, b, t) {
    var d = a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3];
    if (d < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; d = -d; }
    if (d > 0.9995) {
      return qNorm([a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t,
                    a[2] + (b[2]-a[2])*t, a[3] + (b[3]-a[3])*t]);
    }
    var th = Math.acos(d), s = Math.sin(th);
    var wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
    return [a[0]*wa + b[0]*wb, a[1]*wa + b[1]*wb, a[2]*wa + b[2]*wb, a[3]*wa + b[3]*wb];
  }

  /* interaction state machine: auto -> drag -> free -> righting -> auto */
  var MODE_AUTO = 0, MODE_DRAG = 1, MODE_FREE = 2, MODE_RIGHT = 3;
  var mode = MODE_AUTO;
  var SPIN = 0.55;               // auto yaw speed, rad/s
  var yawAngle = 0;
  var q = qAxis(0, 1, 0, 0);     // model orientation
  var wxv = 0, wyv = 0;          // angular velocity about world X/Y, rad/s
  var lastT = null;

  var lastDrawn = -1e9;
  function draw(t, idle) {
    // 30 fps: halves the work, and stops 120/144 Hz screens doing 4-5x it
    if (!idle && !mq.matches && t - lastDrawn < 32) { schedule(); return; }
    if (!idle) { lastDrawn = t; baseOk = false; }
    var mt = idle ? baseT : t;   // idle frames keep the model as it was cached; only the pulses move
    ctx.clearRect(0, 0, W, H);
    var scale = W * 0.118;   // the U-Net is wider than the old jet
    var dt = lastT == null ? 0.016 : Math.min((t - lastT) / 1000, 0.05);
    lastT = t;

    if (mode === MODE_AUTO) {
      yawAngle += scrollYaw; scrollYaw = 0;   // turns with the page's scroll, rests when it rests
      q = qAxis(0, 1, 0, yawAngle);
    } else if (mode === MODE_FREE) {
      var wm = Math.hypot(wxv, wyv);
      if (wm > 1e-4) {
        q = qNorm(qMul(qAxis(wxv / wm, wyv / wm, 0, wm * dt), q));
      }
      var decay = Math.exp(-1.1 * dt);   // friction
      wxv *= decay; wyv *= decay;
      if (Math.hypot(wxv, wyv) < 0.35) mode = MODE_RIGHT;
    } else if (mode === MODE_RIGHT) {
      var f = qRot(q, [1, 0, 0]);
      var targetYaw = Math.atan2(-f[2], f[0]);
      var qT = qAxis(0, 1, 0, targetYaw);
      q = qSlerp(q, qT, 1 - Math.exp(-3.2 * dt));
      var dd = Math.abs(q[0]*qT[0] + q[1]*qT[1] + q[2]*qT[2] + q[3]*qT[3]);
      if (dd > 0.99995) { yawAngle = targetYaw; mode = MODE_AUTO; }
    }
    /* MODE_DRAG: orientation is driven by pointermove */

    var cx0 = W / 2, cy0 = H * 0.52;
    var hover = 0;   // steady: no bob, so the model looks the same moving or still
    if (idle && baseOk) {
      ctx.drawImage(base, 0, 0, W, H);
    } else {

    /* projector pad */
    var g = ctx.createRadialGradient(cx0, H * 0.80, 4, cx0, H * 0.80, W * 0.307);
    g.addColorStop(0, 'rgba(0,229,255,0.16)');
    g.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(cx0, H * 0.80, W * 0.35, W * 0.087, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,229,255,0.24)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx0, H * 0.80, W * 0.293, W * 0.067, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx0, H * 0.80, W * 0.2, W * 0.043, 0, 0, Math.PI * 2); ctx.stroke();

    /* project vertices: model orientation q, then fixed camera pitch */
    for (var i = 0; i < V.length; i++) {
      var r = qRot(q, V[i]);
      var ry2 = r[1] * cp - r[2] * sps;
      var rz2 = r[1] * sps + r[2] * cp;
      var p = camD / (camD - rz2);
      proj[i] = [cx0 + r[0] * p * scale, cy0 - (ry2 - 0.45) * p * scale + hover, p];
    }

    }
    /* hologram flicker */
    var flick = 0.72;   // steady glow; the travelling pulses carry the motion
    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'; }
    // depth: perspective factor p runs ~0.75 (far) to ~1.6 (near)
    function shade(pv) { return pv < 0.93 ? 0.4 : pv < 1.08 ? 0.72 : 1; }
    if (!(idle && baseOk)) {

    /* filled tile cells, behind the lines */
    for (i = 0; i < FILLS.length; i++) {
      var F = FILLS[i], c0 = proj[F[0]], c1 = proj[F[1]], c2 = proj[F[2]], c3 = proj[F[3]];
      ctx.fillStyle = rgba(F[4], Math.min(1, F[5] * 1.05 * flick * shade((c0[2] + c2[2]) / 2)));
      ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(c3[0], c3[1]); ctx.fill();
    }

    /* edges, batched by part and depth band. Glow is a wide faint stroke
       under the line: looks like shadowBlur, costs a fraction of it */
    var bands = {};
    for (i = 0; i < E.length; i++) {
      var a = proj[E[i][0]], b = proj[E[i][1]], pd = (a[2] + b[2]) / 2;
      var key = E[i][2] * 3 + (pd < 0.93 ? 0 : pd < 1.08 ? 1 : 2);
      (bands[key] = bands[key] || []).push(a, b);
    }
    var attnPulse = 0.9;
    for (var k in bands) {
      var grp = (k / 3) | 0, depth = [0.4, 0.72, 1][k % 3], segs = bands[k];
      var al = GA[grp] * depth * flick * (grp === G_ATT ? attnPulse : 1);
      ctx.beginPath();
      for (i = 0; i < segs.length; i += 2) { ctx.moveTo(segs[i][0], segs[i][1]); ctx.lineTo(segs[i + 1][0], segs[i + 1][1]); }
      ctx.lineWidth = 3.5; ctx.strokeStyle = rgba(GCOL[grp], al * 0.28); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = rgba(GCOL[grp], al); ctx.stroke();
    }
    if (idle) { bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.clearRect(0, 0, base.width, base.height); bctx.drawImage(canvas, 0, 0); baseOk = true; }
    }

    /* data pulses: down the encoder and up the decoder, across the skips,
       and out from the attention node to the skips it gates */
    function pt3(m) {
      var r = qRot(q, m), y2 = r[1] * cp - r[2] * sps, z2 = r[1] * sps + r[2] * cp, pp = camD / (camD - z2);
      return [cx0 + r[0] * pp * scale, cy0 - (y2 - 0.45) * pp * scale + hover, pp];
    }
    function pulse(m, u, col, size) {
      var P = pt3(along(m, u)), rr = size * P[2] * (W / 380);
      ctx.fillStyle = rgba(col, 0.3 * flick); ctx.beginPath(); ctx.arc(P[0], P[1], rr * 3, 0, 6.2832); ctx.fill();
      ctx.fillStyle = rgba(col, 0.95 * flick); ctx.beginPath(); ctx.arc(P[0], P[1], rr, 0, 6.2832); ctx.fill();
    }
    var ts = t * 0.001;
    for (k = 0; k < 3; k++) {
      var u3 = (ts * 0.11 + k / 3) % 1;
      pulse(MFLOW, u3, u3 < 0.5 ? GCOL[G_ENC] : GCOL[G_DEC], 3);
    }
    for (k = 0; k < MSKIP.length; k++) pulse(MSKIP[k], (ts * 0.16 + k * 0.33) % 1, GCOL[G_SKIP], 2.3);
    for (k = 0; k < MATTN.length; k++) pulse(MATTN[k], (ts * 0.22 + k * 0.21) % 1, GCOL[G_ATT], 2.3);

    if (!idle) { running = false; schedule(); }
  }

  /* The model only moves while something moves it: scrolling turns it, dragging spins it, and a
     flick coasts to a stop. With the page still, it draws nothing, so idle costs nothing. */
  var running = false, scrollYaw = 0, lastActive = 0, lastY = window.scrollY;
  function schedule() {
    if (running) return;
    var busy = mode !== MODE_AUTO || performance.now() - lastActive < 450 || lastDrawn < 0;
    if (!busy) return;
    running = true; requestAnimationFrame(function (t) { running = false; draw(t); });
  }
  function wake() { lastActive = performance.now(); schedule(); }

  /* Idle: the data pulses keep travelling at 20 fps over the cached model, only while the model
     is on screen and the tab is visible. Each tick is one image copy plus a dozen small dots. */
  var onScreen = true, lastIdle = 0;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onScreen = es[es.length - 1].isIntersecting; }).observe(canvas);
  (function idleTick(t) {
    requestAnimationFrame(idleTick);
    if (mq.matches || !onScreen || document.hidden || running || t - lastIdle < 50) return;
    if (mode !== MODE_AUTO || performance.now() - lastActive < 450) return;
    lastIdle = t;
    if (!baseOk) baseT = t;
    draw(t, true);
  })(0);
  window.addEventListener('scroll', function () {
    var y = window.scrollY; scrollYaw += (y - lastY) * 0.006; lastY = y; wake();
  }, { passive: true });

  /* drag to spin: hit-test the car region so the page is never blocked */
  var wrap = document.getElementById('holo-wrap');
  var hint = document.getElementById('holo-hint');
  var dragging = false, lastPX = 0, lastPY = 0;
  var samples = [];
  var DRAG_K = 0.012;            // rad per px of drag
  var MAXW = 10;                 // rad/s spin cap

  function carHit(cx, cyp) {
    var r = wrap.getBoundingClientRect();
    var dx = cx - (r.left + r.width / 2);
    var dy = cyp - (r.top + r.height * 0.52);
    return (dx * dx + dy * dy) < Math.pow(r.width * 0.34, 2);
  }

  if (!mq.matches) {
    document.addEventListener('pointerdown', function (ev) {
      if (!carHit(ev.clientX, ev.clientY)) return;
      dragging = true; mode = MODE_DRAG; wake();
      wxv = 0; wyv = 0;
      lastPX = ev.clientX; lastPY = ev.clientY;
      samples.length = 0;
      samples.push([performance.now(), ev.clientX, ev.clientY]);
      document.body.style.cursor = 'grabbing';
      ev.preventDefault();
    });

    window.addEventListener('pointermove', function (ev) {
      if (dragging) {
        var dx = ev.clientX - lastPX, dy = ev.clientY - lastPY;
        lastPX = ev.clientX; lastPY = ev.clientY;
        q = qNorm(qMul(qMul(qAxis(0, 1, 0, dx * DRAG_K), qAxis(1, 0, 0, dy * DRAG_K)), q));
        var now = performance.now();
        samples.push([now, ev.clientX, ev.clientY]);
        while (samples.length > 2 && now - samples[0][0] > 90) samples.shift();
      } else if (ev.pointerType !== 'touch') {
        document.body.style.cursor = carHit(ev.clientX, ev.clientY) ? 'grab' : '';
      }
    });

    function endDrag(ev) {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = '';
      if (hint) hint.style.display = 'none';
      var s0 = samples[0];
      var dtms = Math.max(performance.now() - s0[0], 16);
      wyv = (ev.clientX - s0[1]) / dtms * 1000 * DRAG_K;   // horizontal flick -> yaw
      wxv = (ev.clientY - s0[2]) / dtms * 1000 * DRAG_K;   // vertical flick -> tumble
      var wm = Math.hypot(wxv, wyv);
      if (wm > MAXW) { wxv *= MAXW / wm; wyv *= MAXW / wm; }
      mode = wm < 0.35 ? MODE_RIGHT : MODE_FREE;
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    /* stop page scroll only while actively dragging the car */
    document.addEventListener('touchmove', function (ev) {
      if (dragging) ev.preventDefault();
    }, { passive: false });
  }

  if (mq.matches) { draw(0); } else { lastActive = performance.now() + 1200; schedule(); }
})();

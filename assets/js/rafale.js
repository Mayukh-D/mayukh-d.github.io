/* rafale.js
 Rafale band:
 - flight notes: HUD callouts pinned to parts of the jet (#raf-hud), or a tap-open list on smaller screens (#raf-list);
 - the jet itself: a side profile authored as shaded polygons in metres, sampled into a halftone dot field
   on #rafale, with an afterburner and drifting clouds. Animates only while on screen.
*/

  /* ---------- Rafale flight notes ----------
     Each callout is a real part of the jet, paired with how I work.
     Positions are airframe coordinates in metres (x: +nose, y: up). */
  (function () {
    var canvas = document.getElementById('rafale'), hud = document.getElementById('raf-hud'), hint = document.getElementById('raf-hint');
    if (!canvas || !hud) return;
    var NOTES = [
      { at: [7.3, 0.0],    lbl: [6.0, 2.95],   part: 'RBE2 AESA RADAR',                title: 'SEE BEFORE YOU STRIKE',        sub: 'find the right question, then optimise for it' },
      { at: [0.6, 0.44],   lbl: [3.5, -1.6],   part: 'CANARD FOREPLANES',              title: 'SMALL SURFACES, BIG CONTROL',  sub: 'one variable at a time, measured changes' },
      { at: [-5.0, 0.46],  lbl: [-3.9, 3.1],   part: 'FLIGHT DATA RECORDER',           title: 'THE BLACK BOX REMEMBERS',      sub: 'every run logged; a change must beat the noise' },
      { at: [-7.45, 3.05], lbl: [-11.2, 3.35], part: 'SPECTRA SELF-PROTECTION SUITE',  title: 'FIND THE THREAT FIRST',        sub: 'finding the failure is half solving it' },
      { at: [-7.45, 0.0],  lbl: [-11.2, -1.0], part: 'TWIN SAFRAN M88 ENGINES',        title: 'TWO ENGINES, ONE AIRFRAME',    sub: 'research and engineering, both at full thrust' },
      { at: [-2.6, -0.42], lbl: [-1.9, -1.65], part: 'RELAXED STABILITY · FLY-BY-WIRE', title: 'UNSTABLE BY DESIGN',          sub: 'bold ideas, kept in the air by experiments' }
    ];
    // the same notes as a plain list under the jet on narrower screens, opened by a tap
    var list = document.getElementById('raf-list');
    var small = matchMedia('(max-width: 1360px)');
    function hintText() { if (hint) hint.textContent = small.matches ? (list && list.classList.contains('open') ? '[ tap to hide flight notes ]' : '[ tap for flight notes ]') : '[ hover for flight notes ]'; }
    hintText(); small.addEventListener('change', hintText);
    canvas.parentNode.addEventListener('click', function () {
      if (!small.matches || !list) return;
      list.classList.toggle('open'); hintText();
      if (list.classList.contains('open')) list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    if (list) NOTES.forEach(function (n) {
      var li = document.createElement('li');
      [['p', n.part], ['t', n.title], ['s', n.sub]].forEach(function (x) { var sp = document.createElement('span'); sp.className = x[0]; sp.textContent = x[1]; li.append(sp); });
      list.append(li);
    });
    var NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, text) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (text) e.textContent = text;
      return e;
    }
    canvas.addEventListener('layout', function (ev) {
      var map = ev.detail, W = canvas.clientWidth, H = canvas.clientHeight;
      if (W <= 1360) { hud.innerHTML = ''; return; }
      var k = Math.max(1, W / 1440);               // line spacing grows with the text
      hud.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      hud.innerHTML = '';
      NOTES.forEach(function (n, i) {
        var a = map(n.at[0], n.at[1]), b = map(n.lbl[0], n.lbl[1]);
        var right = b[0] < a[0];                    // label sits left of the part, so text ends at the elbow
        var ex = b[0] + (right ? -8 : 8) * k;
        var pts = a[0] + ',' + a[1] + ' ' + b[0] + ',' + b[1] + ' ' + ex + ',' + b[1];
        var len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 8 * k;
        var g = el('g', { style: '--d:' + (i * 0.12) + 's;--l:' + Math.ceil(len) });
        g.append(el('circle', { class: 'pip', cx: a[0], cy: a[1], r: 3.2 * k }));
        var line = el('polyline', { class: 'ln', points: pts });
        g.append(line);
        var anchor = right ? 'end' : 'start', tx = ex + (right ? -4 : 4) * k;
        var texts = [el('text', { class: 't0', x: tx, y: b[1] - 22 * k, 'text-anchor': anchor }, '[ ' + n.part + ' ]'),
                     el('text', { class: 't1', x: tx, y: b[1] - 8 * k, 'text-anchor': anchor }, n.title),
                     el('text', { class: 't2', x: tx, y: b[1] + 13 * k, 'text-anchor': anchor }, n.sub)];
        texts.forEach(function (t) { g.append(t); });
        hud.append(g);
        // keep every label on screen: slide it in and stretch the leader's tail to meet it
        var w = 0;
        texts.forEach(function (t) { w = Math.max(w, t.getComputedTextLength()); });
        var shift = right ? Math.max(0, 12 - (tx - w)) : Math.min(0, (W - 12) - (tx + w));
        if (shift) {
          texts.forEach(function (t) { t.setAttribute('x', tx + shift); });
          line.setAttribute('points', a[0] + ',' + a[1] + ' ' + b[0] + ',' + b[1] + ' ' + (ex + shift) + ',' + b[1]);
          g.style.setProperty('--l', Math.ceil(len + Math.abs(shift)));
        }
      });
    });
  })();

/* ---------- Rafale EH side profile, halftone render ----------
   The airframe is authored as shaded regions in metres (15.27 m long,
   5.34 m tall), then sampled on a grid: every sample that lands inside a
   region becomes a dot whose radius and colour follow that region's tone.
   No bitmap, no external asset; the shape is geometry, the dots are derived.
   x: +nose, y: +up, origin on the fuselage centreline. */
(function () {
  var canvas = document.getElementById('rafale');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* Regions are listed back to front: later entries win a sample.
     tone 0 = darkest, 1 = brightest. */
  var R = [];
  function reg(tone, pts) { R.push({ t: tone, p: pts }); }

  /* Stations derived from a side-elevation reference: canard at 42-53% of
     length, wing root LE at 49%, fin root LE at 72%, and the fin tip
     trailing edge overhanging the tail at 106%. Listed back to front. */

  // fin
  reg(0.72, [[-3.34, 0.58], [-6.45, 3.04], [-7.95, 2.98], [-8.20, 2.40],
             [-7.80, 0.40]]);
  reg(0.44, [[-6.60, 2.72], [-8.10, 2.66], [-7.80, 0.42], [-6.40, 0.52]]);
  // ECM fairing: a separate pod overhanging the fin tip, not part of the fin
  reg(0.95, [[-6.30, 3.20], [-8.58, 3.12], [-8.62, 2.90], [-6.34, 2.96]]);

  // fuselage
  reg(0.86, [
    [7.62, -0.02], [7.10, 0.20], [6.40, 0.40], [5.60, 0.58], [4.84, 0.73],
    [4.35, 1.05], [3.75, 1.27], [2.90, 1.22], [1.90, 1.02], [1.55, 0.88],
    [0.80, 0.80], [-0.60, 0.74], [-2.00, 0.66], [-3.34, 0.58], [-5.00, 0.48],
    [-6.40, 0.42], [-7.30, 0.38], [-7.66, 0.30],
    [-7.66, -0.29], [-7.20, -0.48], [-6.00, -0.58], [-4.50, -0.66],
    [-3.00, -0.72], [-1.50, -0.78], [0.00, -0.82], [1.26, -0.80],
    [2.50, -0.78], [3.20, -0.70], [4.20, -0.56], [5.20, -0.40], [6.30, -0.20]
  ]);
  // shaded underside
  reg(0.56, [[6.30, -0.20], [5.20, -0.40], [4.20, -0.56], [3.20, -0.70],
             [2.50, -0.78], [1.26, -0.80], [0.00, -0.82], [-1.50, -0.78],
             [-3.00, -0.72], [-4.50, -0.66], [-6.00, -0.58], [-7.20, -0.48],
             [-7.66, -0.29], [-7.40, -0.06], [-3.00, -0.30], [1.00, -0.42],
             [4.00, -0.26]]);

  // panel tones, breaking up the flank the way the real scheme does
  reg(0.70, [[4.20, 0.62], [1.60, 0.86], [-1.60, 0.70], [-3.20, 0.60],
             [-3.20, 0.30], [-1.60, 0.40], [1.60, 0.52], [4.10, 0.40]]);
  reg(0.62, [[-3.40, 0.58], [-5.80, 0.46], [-7.20, 0.38], [-7.20, 0.10],
             [-5.60, 0.18], [-3.40, 0.28]]);

  // conformal tank along the belly
  reg(0.66, [[1.90, -0.78], [1.00, -1.02], [-0.60, -1.22], [-2.60, -1.30],
             [-4.30, -1.24], [-5.50, -1.00], [-5.95, -0.76]]);

  // side intake, no splitter plate
  reg(0.42, [[2.55, -0.52], [2.50, -1.02], [1.90, -1.10], [1.20, -1.06],
             [0.92, -0.90], [0.95, -0.58]]);
  reg(0.95, [[2.55, -0.55], [2.50, -0.98], [2.30, -1.00], [2.35, -0.57]]);

  // delta wing, edge-on, running aft almost to the nozzles
  reg(0.32, [[0.30, -0.14], [-6.71, -0.28], [-6.71, -0.60], [-0.30, -0.50]]);
  // close-coupled canard
  reg(0.46, [[1.45, 0.62], [0.10, 0.50], [-0.62, 0.38], [-0.30, 0.18],
             [0.75, 0.26], [1.42, 0.40]]);

  // canopy glazing: the brightest mass on the airframe
  reg(1.00, [[4.84, 0.73], [4.35, 1.05], [3.75, 1.27], [2.90, 1.22],
             [1.90, 1.02], [1.58, 0.88]]);

  // nozzle
  reg(0.30, [[-7.00, 0.34], [-7.66, 0.28], [-7.66, -0.28], [-7.00, -0.40]]);

  // fixed refuelling probe and nose pitot
  reg(0.62, [[6.52, 0.56], [5.05, 0.82], [4.98, 0.62], [6.46, 0.36]]);

  var MINX = -11.7, MAXX = 8.8, MINY = -1.65, MAXY = 3.45;

  /* ---- afterburner: shock cells, not a sine wave ----
     Cell length decays downstream as the pressure mismatch driving it decays,
     the cell profile is triangular so the edges meet at a cusp, and the glow
     spikes where the shocks cross rather than swelling smoothly. */
  var PL_X0 = -7.72, PL_LEN = 3.5, PL_R0 = 0.46;
  var CELL_L0 = 0.95, CELL_DECAY = 0.80;
  var plume = [];
  var cells = (function () {
    var c = [0], d = 0;
    for (var k = 0; k < 10 && d <= PL_LEN; k++) { d += CELL_L0 * Math.pow(CELL_DECAY, k); c.push(d); }
    return c;
  })();
  function cellU(dist) {
    for (var k = 0; k < cells.length - 1; k++) {
      if (dist >= cells[k] && dist < cells[k + 1]) return (dist - cells[k]) / (cells[k + 1] - cells[k]);
    }
    return 1;
  }

  function inside(px, py, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > py) !== (yj > py)) &&
          (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }

  /* ---- build the dot field ---- */
  var dots = [], W, H, S, ox, oy, step;

  function build() {
    dots = [];
    var spanX = MAXX - MINX, spanY = MAXY - MINY;
    S = Math.min(W / spanX, H / spanY) * 0.86;
    ox = W / 2 - ((MINX + MAXX) / 2) * S;
    oy = H / 2 + ((MINY + MAXY) / 2) * S - H * 0.05;
    // dot pitch grows gently with the band (square root): a laptop keeps its
    // halftone, a big monitor gets slightly larger dots rather than a fine
    // mesh (fixed pitch) or coarse blobs (linear pitch)
    step = Math.max(2.6, Math.min(4.6, W / 190) * Math.sqrt(Math.max(1, W / 1440)));

    // the flame is a small region, so it samples finer than the airframe
    plume = [];
    var gp = step * 0.66 / S;
    for (var py = -PL_R0 * 1.9, prow = 0; py <= PL_R0 * 1.9; py += gp, prow++) {
      for (var px = PL_X0 - (prow % 2 ? gp / 2 : 0); px >= PL_X0 - PL_LEN; px -= gp) {
        var dist = PL_X0 - px, tt = dist / PL_LEN, uu = cellU(dist);
        var tri = 1 - Math.abs(2 * uu - 1);
        var rr = Math.max(PL_R0 * Math.pow(1 - tt, 0.5) * (0.52 + 0.48 * tri), 0.05);
        var aa = Math.abs(py);
        if (aa > rr * 1.75) continue;
        var node = Math.exp(-Math.pow(Math.min(uu, 1 - uu) / 0.14, 2));
        var glow = 0.52 + 1.05 * node, ax = Math.pow(1 - tt, 0.8);
        var pv = aa <= rr ? ax * (1 - Math.pow(aa / rr, 2)) * glow
                          : ax * 0.34 * (1 - (aa - rr) / (rr * 0.75)) * glow;
        pv = Math.pow(Math.max(0, Math.min(1, pv)), 0.7);
        if (pv > 0.06) plume.push([ox + px * S, oy - py * S, pv, tt]);
      }
    }

    var g = step / S;                                // grid pitch in metres
    for (var y = MINY; y <= MAXY; y += g) {
      // offset alternate rows: a hex lattice reads smoother than a square one
      var odd = Math.round((y - MINY) / g) % 2;
      for (var x = MINX + (odd ? g / 2 : 0); x <= MAXX; x += g) {
        var tone = -1;
        for (var i = R.length - 1; i >= 0; i--) {
          if (inside(x, y, R[i].p)) { tone = R[i].t; break; }
        }
        if (tone < 0) continue;
        // a soft top-down gradient, so the airframe is lit from above
        var lit = 0.80 + 0.34 * ((y - MINY) / spanY);
        var v = Math.max(0.10, Math.min(1, 0.16 + 0.86 * tone * lit));
        dots.push([ox + x * S, oy - y * S, v]);
      }
    }
    // nose pitot, drawn explicitly so it is always a hairline: one row of
    // dots on small screens, two on large ones, never more
    var rows = W >= 1500 ? 2 : 1;
    for (var r = 0; r < rows; r++) {
      for (var px2 = 7.62 + (r ? g / 2 : 0); px2 <= 8.62; px2 += g) {
        dots.push([ox + px2 * S, oy - (0.02 - r * g * 0.866) * S, 0.68]);
      }
    }
  }

  /* The airframe's resting dots are drawn once into this bitmap; each frame
     blits it and redraws only the dots under the moving highlight. */
  var base = document.createElement('canvas'), bctx = base.getContext('2d');
  var layer = document.createElement('canvas'), lctx = layer.getContext('2d');
  var px = DPR;
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    if (!W || !H) return;
    // big monitors: cap the backing store, the dots are soft anyway
    px = Math.min(DPR, 3000 / W);
    canvas.width = Math.round(W * px); canvas.height = Math.round(H * px);
    ctx.setTransform(px, 0, 0, px, 0, 0);
    build();
    buildClouds();
    canvas.dispatchEvent(new CustomEvent('layout', { detail: function (x, y) { return [ox + x * S, oy - y * S]; } }));
    base.width = layer.width = canvas.width; base.height = layer.height = canvas.height;
    bctx.setTransform(px, 0, 0, px, 0, 0);
    lctx.setTransform(px, 0, 0, px, 0, 0);
    bctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) dot(bctx, dots[i], dots[i][2]);
  }
  function dot(c, d, vv) {
    var r = step * 0.50 * (0.38 + 0.62 * vv);
    // bright green in the lit areas, deep green in the shadows
    c.fillStyle = 'rgba(' + Math.round(88 * vv) + ',' + Math.round(140 + 115 * vv) + ','
      + Math.round(38 + 52 * vv) + ',' + (0.42 + 0.58 * vv).toFixed(3) + ')';
    c.beginPath();
    c.arc(d[0], d[1], r, 0, 6.2832);
    c.fill();
  }

  /* ---- air and cloud lines, drifting aft ---- */
  var air = [];
  for (var i = 0; i < 30; i++) {
    air.push({ y: Math.random(), x: Math.random(), len: 0.04 + Math.random() * 0.17,
               v: 0.02 + Math.random() * 0.055, a: 0.04 + Math.random() * 0.11 });
  }
  /* ---- clouds as dot fields ----
     Each cloud is a handful of overlapping lobes summed into a density field,
     sampled on a lattice: dense in the core, thinning at the edges, which is
     what makes a cloud read as volume rather than as an outline. Three layers
     at different size, speed and brightness give parallax, so the aircraft
     looks like it is moving through them rather than past a backdrop. */
  var clouds = [];
  function buildClouds() {
    clouds = [];
    var seed = 20260902;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var layers = [
      { n: 3, w: 0.21, a: 0.24, v: 0.011, pitch: 6.5 },   // distant: small, slow, faint
      { n: 2, w: 0.34, a: 0.34, v: 0.023, pitch: 5.5 },
      { n: 2, w: 0.52, a: 0.44, v: 0.041, pitch: 4.8 }    // near: big, fast, brighter
    ];
    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];
      for (var c = 0; c < L.n; c++) {
        var cw = W * L.w * (0.75 + 0.5 * rnd());
        var ch = cw * (0.30 + 0.14 * rnd());
        var nl = 4 + Math.floor(rnd() * 4), lobes = [];
        for (var i = 0; i < nl; i++) {
          var fx = (nl === 1 ? 0 : (i / (nl - 1) - 0.5)) * 2;
          var top = i % 2 === 1;            // alternate lobes ride high
          lobes.push([fx * cw * 0.40 + (rnd() - 0.5) * cw * 0.08,
                      top ? -ch * (0.08 + 0.30 * rnd()) : ch * 0.18,
                      ch * (top ? 0.55 + 0.28 * rnd() : 0.40 + 0.16 * rnd())
                         * (1 - 0.26 * Math.abs(fx))]);
        }
        var pts = [], p = L.pitch * Math.sqrt(Math.max(1, W / 1440)), row = 0;
        for (var y = -ch * 1.3; y <= ch * 1.3; y += p, row++) {
          for (var x = -cw * 0.75 + (row % 2 ? p / 2 : 0); x <= cw * 0.75; x += p) {
            var s = 0;
            for (var k = 0; k < lobes.length; k++) {
              var dx = x - lobes[k][0], dy = (y - lobes[k][1]) * 1.35, r = lobes[k][2];
              var q = 1 - (dx * dx + dy * dy) / (r * r);
              if (q > 0) s += q * q;
            }
            if (s > 0.26) pts.push([x, y, Math.min(1, (s - 0.26) / 0.85)]);
          }
        }
        /* Rasterise once. Blitting one bitmap per cloud costs a fraction of
           re-stroking a few thousand arcs every frame, which is what lets the
           lattice be dense enough to read as cloud instead of speckle. */
        /* The bitmap is cropped to the dots, rendered at the main canvas's
           (capped) resolution, and has the layer's opacity baked in, so each
           frame is a plain blit. At 2x on a 5K screen the uncapped, uncropped
           version was ~23M pixels per cloud, which Safari could not keep up with. */
        var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for (var q0 = 0; q0 < pts.length; q0++) {
          x0 = Math.min(x0, pts[q0][0]); x1 = Math.max(x1, pts[q0][0]);
          y0 = Math.min(y0, pts[q0][1]); y1 = Math.max(y1, pts[q0][1]);
        }
        if (!pts.length) continue;
        x0 -= p; y0 -= p;
        var bw = Math.ceil(x1 + p - x0), bh = Math.ceil(y1 + p - y0);
        var off = document.createElement('canvas');
        off.width = Math.max(1, Math.ceil(bw * px)); off.height = Math.max(1, Math.ceil(bh * px));
        var octx = off.getContext('2d');
        octx.setTransform(px, 0, 0, px, 0, 0);
        for (var q = 0; q < pts.length; q++) {
          var pt = pts[q];
          var dw2 = Math.pow(pt[2], 0.75);
          octx.fillStyle = 'rgba(' + Math.round(78 + 96 * dw2) + ','
                                   + Math.round(158 + 64 * dw2) + ',255,'
                                   + ((0.50 + 0.50 * dw2) * L.a).toFixed(3) + ')';
          octx.beginPath();
          octx.arc(pt[0] - x0, pt[1] - y0, p * 0.46 * (0.45 + 0.55 * dw2), 0, 6.2832);
          octx.fill();
        }
        clouds.push({ img: off, w: bw, h: bh, ox: x0, oy: y0, y: H * (0.12 + 0.76 * rnd()), x: rnd(),
                      v: L.v, span: cw * 1.5 });
      }
    }
  }

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    for (var i = 0; i < air.length; i++) {
      var a = air[i];
      var x = ((a.x - t * a.v) % 1.3 + 1.3) % 1.3 - 0.15;
      ctx.strokeStyle = 'rgba(0,229,255,' + a.a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(x * W, a.y * H);
      ctx.lineTo((x + a.len) * W, a.y * H);
      ctx.stroke();
    }
    for (i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      var span = W + c.span;
      var cx0 = ((c.x - t * c.v) % 1 + 1) % 1 * span - c.span / 2;
      if (cx0 + c.span / 2 < -40 || cx0 - c.span / 2 > W + 40) continue;
      ctx.drawImage(c.img, cx0 + c.ox, c.y + c.oy, c.w, c.h);
    }

    // afterburner. Phase decreases with distance aft, so the bright wave
    // runs nozzle -> tail. The other sign runs it up into the engine.
    var pr = step * 0.66 * 0.5;
    for (i = 0; i < plume.length; i++) {
      var pd = plume[i];
      var wv = 0.55 + 0.45 * Math.sin(6.2832 * (t / 0.62 - pd[3] * 1.15));
      var pv2 = Math.min(1, pd[2] * (0.55 + 0.65 * wv));
      var pf = pv2;
      ctx.fillStyle = 'rgba(' + Math.round(40 + 110 * pf) + ','
                              + Math.round(120 + 95 * pf) + ',255,'
                              + (0.30 + 0.62 * pf).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(pd[0], pd[1], pr * (0.52 + 0.48 * pf), 0, 6.2832);
      ctx.fill();
    }

    // the airframe, as dots. A slow highlight sweeps nose to tail.
    // Copy the resting airframe to a layer, cut out the dots under the
    // highlight, and redraw those brighter, so every dot is drawn exactly once.
    var sweep = ((t * 0.14) % 1.5) - 0.25, lit = [];
    for (i = 0; i < dots.length; i++) {
      var boost = 1 - Math.min(1, Math.abs(dots[i][0] / W - sweep) / 0.16);
      if (boost > 0) lit.push(i, boost);
    }
    if (!lit.length) { ctx.drawImage(base, 0, 0, W, H); return; }
    lctx.globalCompositeOperation = 'copy';
    lctx.drawImage(base, 0, 0, W, H);
    lctx.globalCompositeOperation = 'destination-out';
    lctx.fillStyle = '#000';
    for (i = 0; i < lit.length; i += 2) {
      var d0 = dots[lit[i]];
      lctx.beginPath();
      lctx.arc(d0[0], d0[1], step * 0.50 * (0.38 + 0.62 * d0[2]) + 0.6 / px, 0, 6.2832);
      lctx.fill();
    }
    lctx.globalCompositeOperation = 'source-over';
    for (i = 0; i < lit.length; i += 2) {
      var d1 = dots[lit[i]];
      dot(lctx, d1, Math.min(1, d1[2] + lit[i + 1] * 0.45));
    }
    ctx.drawImage(layer, 0, 0, W, H);
  }

  // 30 fps is plenty for a slow fly-by, and it only runs while on screen
  var t0 = null, last = -1e9, onScreen = false, looping = false;
  function frame(ts) {
    if (!onScreen) { looping = false; return; }
    if (t0 === null) t0 = ts;
    if (ts - last >= 32) { last = ts; draw((ts - t0) / 1000); }
    requestAnimationFrame(frame);
  }
  function start() { if (!looping && !mq.matches) { looping = true; requestAnimationFrame(frame); } }

  resize();
  window.addEventListener('resize', function () { resize(); draw(t0 === null ? 0 : (last - t0) / 1000); });
  draw(0);
  new IntersectionObserver(function (es) {
    onScreen = es[0].isIntersecting;
    if (onScreen) start();
  }, { rootMargin: '200px' }).observe(canvas);
})();

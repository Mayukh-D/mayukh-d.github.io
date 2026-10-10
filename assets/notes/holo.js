/* Small wireframe "hologram" renderer for notes, in the style of the homepage U-TAE.
   Holo.mount(canvas, build, state) draws the scene build(state, S) returns, spins it slowly,
   lets the reader drag it, and cross-fades to a new scene whenever set() changes the state. */
window.Holo = window.Holo || (function () {
  var COL = { cyan: [0, 229, 255], green: [0, 255, 110], amber: [255, 184, 64], pale: [190, 240, 255],
              red: [255, 107, 129], muted: [125, 143, 133] };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function Scene() { this.L = []; this.T = []; }
  Scene.prototype.line = function (a, b, c, al) { this.L.push([a, b, c || 'cyan', al == null ? 1 : al]); return this; };
  Scene.prototype.text = function (p, s, c, al, size) { this.T.push([p, s, c || 'pale', al == null ? 1 : al, size || 11]); return this; };
  Scene.prototype.poly = function (pts, c, al, closed) {
    for (var i = 0; i < pts.length - (closed === false ? 1 : 0); i++) this.line(pts[i], pts[(i + 1) % pts.length], c, al);
    return this;
  };
  // axis-aligned box from its centre and size, with optional slices along an axis
  Scene.prototype.box = function (x, y, z, w, h, d, c, al, slices, axis) {
    var X = [x - w / 2, x + w / 2], Y = [y - h / 2, y + h / 2], Z = [z - d / 2, z + d / 2];
    var face = function (yy) { return [[X[0], yy, Z[0]], [X[1], yy, Z[0]], [X[1], yy, Z[1]], [X[0], yy, Z[1]]]; };
    this.poly(face(Y[0]), c, al); this.poly(face(Y[1]), c, al);
    var b = face(Y[0]), t = face(Y[1]);
    for (var i = 0; i < 4; i++) this.line(b[i], t[i], c, al);
    for (var k = 1; k < (slices || 0); k++) {
      var f = k / slices;
      if (axis === 'x') { var xs = X[0] + w * f; this.poly([[xs, Y[0], Z[0]], [xs, Y[1], Z[0]], [xs, Y[1], Z[1]], [xs, Y[0], Z[1]]], c, al * 0.45); }
      else if (axis === 'z') { var zs = Z[0] + d * f; this.poly([[X[0], Y[0], zs], [X[1], Y[0], zs], [X[1], Y[1], zs], [X[0], Y[1], zs]], c, al * 0.45); }
      else { var ys = Y[0] + h * f; this.poly(face(ys), c, al * 0.45); }
    }
    return this;
  };
  // circle in a plane: 'xz' (flat), 'xy' (facing), 'yz'
  Scene.prototype.ring = function (x, y, z, r, plane, c, al, n) {
    n = n || 28; var pts = [];
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2, u = Math.cos(a) * r, v = Math.sin(a) * r;
      pts.push(plane === 'xy' ? [x + u, y + v, z] : plane === 'yz' ? [x, y + u, z + v] : [x + u, y, z + v]);
    }
    return this.poly(pts, c, al);
  };
  Scene.prototype.dot = function (p, r, c, al) {
    this.line([p[0] - r, p[1], p[2]], [p[0] + r, p[1], p[2]], c, al);
    this.line([p[0], p[1] - r, p[2]], [p[0], p[1] + r, p[2]], c, al);
    return this;
  };
  Scene.prototype.dash = function (a, b, c, al, n) {
    n = n || 10;
    for (var i = 0; i < n; i += 2) {
      var f0 = i / n, f1 = (i + 1) / n;
      this.line([a[0] + (b[0] - a[0]) * f0, a[1] + (b[1] - a[1]) * f0, a[2] + (b[2] - a[2]) * f0],
                [a[0] + (b[0] - a[0]) * f1, a[1] + (b[1] - a[1]) * f1, a[2] + (b[2] - a[2]) * f1], c, al);
    }
    return this;
  };

  function bounds(S) {
    var lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    S.L.forEach(function (l) { [l[0], l[1]].forEach(function (p) { for (var i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]); } }); });
    var c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
    return { c: c, rx: (hi[0] - lo[0]) / 2 || 1, ry: (hi[1] - lo[1]) / 2 || 1, rz: (hi[2] - lo[2]) / 2 || 1 };
  }

  function mount(canvas, build, state, opt) {
    opt = opt || {};
    var ctx = canvas.getContext('2d'), DPR = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
    var yaw = opt.yaw == null ? -0.55 : opt.yaw, pitch = opt.pitch == null ? 0.32 : opt.pitch, spin = opt.spin == null ? 0.22 : opt.spin;
    var cur = null, prev = null, fade = 1, fadeStart = 0, fit = null, fitTo = null;
    var dragging = false, lx = 0, ly = 0, idleAt = 0, visible = true, raf = 0, lastT = 0;

    function rebuild(instant) {
      var S = new Scene(); build(state, S);
      prev = instant ? null : cur; cur = S; fade = prev ? 0 : 1; fadeStart = performance.now();
      fitTo = bounds(S); if (!fit) fit = { c: fitTo.c.slice(), rx: fitTo.rx, ry: fitTo.ry, rz: fitTo.rz };
    }
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function rgba(c, a) { c = COL[c] || c; return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }

    function draw(t) {
      raf = 0;
      if (!canvas.isConnected) return;
      var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0.016; lastT = t;
      if (!dragging && !reduce.matches && t > idleAt) yaw += spin * dt;
      fade = prev ? Math.min(1, (t - fadeStart) / 420) : 1;
      if (fade >= 1) prev = null;
      // ease the framing towards the new scene so changes in size feel physical
      var k = 1 - Math.exp(-6 * dt);
      for (var i = 0; i < 3; i++) fit.c[i] += (fitTo.c[i] - fit.c[i]) * k;
      ['rx', 'ry', 'rz'].forEach(function (q) { fit[q] += (fitTo[q] - fit[q]) * k; });

      ctx.clearRect(0, 0, W, H);
      var horiz = Math.max(fit.rx, fit.rz) * 1.08, vert = fit.ry + Math.max(fit.rx, fit.rz) * Math.sin(pitch) * 0.6;
      var scale = Math.min(W * 0.46 / horiz, H * 0.4 / vert);
      var cx = W / 2, cy = H * 0.5, camD = 9;
      var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      function P(p) {
        var x = p[0] - fit.c[0], y = p[1] - fit.c[1], z = p[2] - fit.c[2];
        var x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
        var y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        var s = camD / (camD - z2 / Math.max(fit.rx, fit.ry, fit.rz) * 2.2);
        return [cx + x1 * s * scale, cy - y2 * s * scale, s];
      }
      // projector pad
      var g = ctx.createRadialGradient(cx, H * 0.9, 2, cx, H * 0.9, W * 0.3);
      g.addColorStop(0, 'rgba(0,229,255,0.12)'); g.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, H * 0.9, W * 0.32, H * 0.06, 0, 0, 6.2832); ctx.fill();

      var flick = reduce.matches ? 0.9 : 0.82 + 0.12 * Math.sin(t * 0.009) * Math.sin(t * 0.0031);
      function render(S, alpha) {
        if (!S || alpha <= 0) return;
        var bands = {};
        for (var i = 0; i < S.L.length; i++) {
          var l = S.L[i], a = P(l[0]), b = P(l[1]), d = (a[2] + b[2]) / 2;
          var key = l[2] + '|' + l[3] + '|' + (d < 0.96 ? 0.5 : d < 1.04 ? 0.78 : 1);
          (bands[key] = bands[key] || []).push(a, b);
        }
        for (var key2 in bands) {
          var parts = key2.split('|'), al = parseFloat(parts[1]) * parseFloat(parts[2]) * alpha * flick, segs = bands[key2];
          ctx.beginPath();
          for (var j = 0; j < segs.length; j += 2) { ctx.moveTo(segs[j][0], segs[j][1]); ctx.lineTo(segs[j + 1][0], segs[j + 1][1]); }
          ctx.lineWidth = 3.5; ctx.strokeStyle = rgba(parts[0], al * 0.22); ctx.stroke();
          ctx.lineWidth = 1; ctx.strokeStyle = rgba(parts[0], al); ctx.stroke();
        }
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        S.T.forEach(function (tx) {
          var p = P(tx[0]);
          ctx.font = (tx[4] * Math.min(1.15, Math.max(0.85, W / 600))).toFixed(1) + 'px "JetBrains Mono", monospace';
          ctx.fillStyle = rgba(tx[2], tx[3] * alpha);
          ctx.fillText(tx[1], p[0], p[1]);
        });
      }
      render(prev, 1 - fade);
      render(cur, fade);
      if (visible) raf = requestAnimationFrame(draw);
    }
    function kick() { if (!raf && visible && canvas.isConnected) { lastT = 0; raf = requestAnimationFrame(draw); } }

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; lx = e.clientX; ly = e.clientY;
      if (e.pointerType === 'mouse') canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      yaw += (e.clientX - lx) * 0.01;
      if (e.pointerType === 'mouse') pitch = Math.max(-0.2, Math.min(1.2, pitch + (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY; kick();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) {
      canvas.addEventListener(n, function () { if (dragging) { dragging = false; idleAt = performance.now() + 1800; } });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; kick(); }).observe(canvas);
    }
    if ('ResizeObserver' in window) new ResizeObserver(function () { resize(); kick(); }).observe(canvas);
    resize(); rebuild(); kick();
    return {
      set: function (patch, instant) { for (var k in patch) state[k] = patch[k]; rebuild(instant); kick(); },
      state: state
    };
  }
  return { mount: mount };
})();

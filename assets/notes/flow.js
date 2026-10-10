/* Demos for /notes/x-vs-v-prediction/. The hologram is an illustration of the setup (a 2D swiss roll
   on a flat sheet inside a bigger space, shown here in 3D); the step and width frames are the report's own figures. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }

  // fixed samples so the picture is stable: a swiss roll on a tilted sheet, and Gaussian noise
  var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function gauss() { return Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.2832 * rnd()); }
  var N = 240, X = [], E = [];
  var tilt = 0.5, ct = Math.cos(tilt), stl = Math.sin(tilt);
  for (var i = 0; i < N; i++) {
    var th = 1.5 * Math.PI * (1 + 2 * rnd()), u = th * Math.cos(th) / 10, w = th * Math.sin(th) / 10;
    X.push([u, w * stl, w * ct]);                       // the sheet: a plane through the origin
    E.push([gauss() * 0.75, gauss() * 0.75, gauss() * 0.75]);
  }
  var c1 = $('[data-holo="flow"]');
  if (c1) {
    var MODES = {
      zt: 'Noisy samples z<sub>t</sub> = (1 − t)·x + t·ε. Slide t to blend the data into noise.',
      x: '<b>x-prediction</b>: the network\'s target is the clean point. Every target lies on the flat sheet.',
      v: '<b>v-prediction</b>: the target is the velocity ε − x. It contains the noise, so it fills the whole space.'
    };
    var h = Holo.mount(c1, function (st, S) {
      var R = 1.8;                                       // a faint cube keeps the framing steady
      S.box(0, 0, 0, 2 * R, 2 * R, 2 * R, 'muted', 0.18);
      var sh = 1.45, corners = [[-sh, -sh], [sh, -sh], [sh, sh], [-sh, sh]].map(function (c) { return [c[0], c[1] * stl, c[1] * ct]; });
      S.poly(corners, 'pale', 0.4);
      S.text([0, R + 0.25, 0], st.mode === 'v' ? 'v targets fill all of space' : st.mode === 'x' ? 'x targets stay on the sheet' : 't = ' + st.t.toFixed(2), st.mode === 'v' ? 'cyan' : 'green', 0.9, 12);
      for (var i = 0; i < N; i++) {
        var x = X[i], e = E[i], p;
        if (st.mode === 'x') p = x;
        else if (st.mode === 'v') p = [e[0] - x[0], e[1] - x[1], e[2] - x[2]];
        else p = [(1 - st.t) * x[0] + st.t * e[0], (1 - st.t) * x[1] + st.t * e[1], (1 - st.t) * x[2] + st.t * e[2]];
        S.dot(p.map(function (q) { return Math.max(-R, Math.min(R, q)); }), 0.035, st.mode === 'v' ? 'cyan' : 'green', 0.9);
      }
    }, { mode: 'zt', t: 0.25 }, { pitch: 0.25, spin: 0.18 });
    var rt = $('[data-range="t"]'), out = $('[data-out="flow"]'), segF = $('[data-seg="flow"]');
    rt.addEventListener('input', function () {
      segF.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === 'zt'); });
      h.set({ mode: 'zt', t: +rt.value }, true); out.innerHTML = MODES.zt;
    });
    segF.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      segF.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      h.set({ mode: b.dataset.v }); out.innerHTML = MODES[b.dataset.v];
    });
    out.innerHTML = MODES.zt;
  }

  /* How much of each target lies off the data's 2D sheet, as the space grows (data and noise at equal scale). */
  var sv = $('[data-out="spectrum"]'), rd = $('[data-range="dim"]');
  if (sv) {
    var DIMS = [2, 4, 8, 16, 32, 64];
    var draw = function () {
      var D = DIMS[+rd.value], W = 320, rowH = 46, bw = (W - 70) / D, html = '';
      [['x target', function (k) { return k < 2 ? 1 : 0; }, '#00ff41', 14], ['v target', function (k) { return k < 2 ? 1 : 0.5; }, '#00e5ff', 14 + rowH + 18]].forEach(function (r) {
        html += '<text x="0" y="' + (r[3] + rowH / 2 + 4) + '" fill="#7d8f85" font-size="10" font-family="JetBrains Mono">' + r[0] + '</text>';
        for (var k = 0; k < D; k++) {
          var v = r[1](k), hh = v * rowH;
          html += '<rect x="' + (70 + k * bw + bw * 0.12) + '" y="' + (r[3] + rowH - hh) + '" width="' + Math.max(1, bw * 0.76) + '" height="' + Math.max(0.5, hh) + '" fill="' + r[2] + '" opacity="' + (v ? 0.9 : 0.2) + '"/>';
        }
      });
      html += '<text x="70" y="' + (14 + 2 * rowH + 34) + '" fill="#7d8f85" font-size="9" font-family="JetBrains Mono">the sheet\'s 2 directions, then every other →</text>';
      sv.innerHTML = html;
      var off = (D - 2) / (D + 2);
      $('[data-out="dim"]').innerHTML = 'D = <b>' + D + '</b> · share of the target off the sheet: x <b>0%</b>, v <b>' + Math.round(off * 100) + '%</b>';
    };
    rd.addEventListener('input', draw); draw();
  }

  /* The report's own samples, as frames. */
  function frames(sel, rangeSel, labels, srcFor, outSel, note) {
    var img = $(sel), r = $(rangeSel); if (!img) return;
    labels.forEach(function (_, i) { var im = new Image(); im.src = srcFor(i); });  // preload
    var upd = function () { var i = +r.value; img.src = srcFor(i); $(outSel).innerHTML = note(i); };
    r.addEventListener('input', upd); upd();
    return upd;
  }
  var STEPS = [1, 2, 5, 10, 20, 50, 100, 200];
  frames('[data-frame="steps"]', '[data-range="steps"]', STEPS, function (i) { return '/assets/notes/flow-steps-' + i + '.jpg'; }, '[data-out="steps"]', function (i) {
    var n = STEPS[i]; return '<b>' + n + '</b> Euler step' + (n > 1 ? 's' : '') + (n < 10 ? ': structure has not formed yet' : n < 20 ? ': the rings appear' : n <= 50 ? ': close to its best' : ': no visible gain past 50');
  });
  var shift = $('[data-k="shift"]'), WIDTHS = [256, 512, 1024], PARAMS = { 256: 'about 330K parameters', 1024: 'about 5.2M parameters, 16× the compute' };
  var upW = frames('[data-frame="width"]', '[data-range="width"]', [0, 1, 2, 3, 4, 5], function (i) {
    return '/assets/notes/flow-width-' + (1 + (+$('[data-range="width"]').value) * 2 + (shift.checked ? 1 : 0)) + '.jpg';
  }, '[data-out="width"]', function (i) {
    var w = WIDTHS[i]; return 'v-prediction, width <b>' + w + '</b>' + (shift.checked ? ' + shifted schedule' : '') + (PARAMS[w] ? ' · ' + PARAMS[w] : '');
  });
  if (shift && upW) shift.addEventListener('change', upW);
  for (var k = 0; k < 7; k++) { var pre = new Image(); pre.src = '/assets/notes/flow-width-' + k + '.jpg'; }
})();

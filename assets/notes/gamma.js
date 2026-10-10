/* Demos for /notes/gamma-beat-saturation/.
   lantern() is Lantern's calibrated() from Light.swift, line for line.
   The bar itself is simulated: it drives each channel linearly, and its green and blue are brighter
   than its red by the inverse of Lantern's tuned gains (1, 0.85, 0.45). A model, not a measurement. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }
  var demo = $('[data-demo="led"]'); if (!demo) return;

  function rgb2hsv(r, g, b) {
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx];
  }
  function hsv2rgb(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c, r = 0, g = 0, b = 0, k = Math.floor(h / 60) % 6;
    if (k === 0) { r = c; g = x; } else if (k === 1) { r = x; g = c; } else if (k === 2) { g = c; b = x; }
    else if (k === 3) { g = x; b = c; } else if (k === 4) { r = x; b = c; } else { r = c; b = x; }
    return [r + m, g + m, b + m];
  }
  // what Lantern sends to the bar, 0...1 per channel
  function lantern(c, st) {
    var hsv = rgb2hsv(c[0] / 255, c[1] / 255, c[2] / 255);
    var s2 = 1 - Math.pow(1 - hsv[1], st.sat);
    var m = hsv2rgb(hsv[0], s2, hsv[2]);
    var gains = st.bal ? [1, 0.85, 0.45] : [1, 1, 1];
    var o = m.map(function (x, i) { return Math.pow(x, st.gamma) * gains[i]; });
    var peak = Math.max.apply(null, o);
    if (peak > 0) o = o.map(function (x) { return x * hsv[2] / peak; });
    return o;
  }
  // how the simulated bar looks: linear drive, uneven channels, shown on an sRGB screen
  var STRENGTH = [0.45, 0.53, 1];
  function bar(o) {
    var L = o.map(function (x, i) { return x * STRENGTH[i] / 0.45; });
    return L.map(function (x) { return Math.round(255 * Math.pow(Math.min(1, x), 1 / 2.2)); });
  }
  var css = function (c) { return 'rgb(' + c.join(',') + ')'; };

  var COLS = [['teal', [40, 180, 180]], ['deep blue', [30, 60, 200]], ['orange', [235, 120, 40]],
              ['dusty blue', [100, 130, 180]], ['navy', [20, 30, 110]], ['violet', [140, 70, 200]]];
  var grid = $('[data-out="swatches"]'), picker = $('[data-pick]');
  var st = { sat: 1, gamma: 1, bal: false };
  var PRE = { raw: { sat: 1, gamma: 1, bal: false }, sat: { sat: 2.5, gamma: 1, bal: false }, lantern: { sat: 1, gamma: 3.5, bal: true } };
  var rs = $('[data-k="sat"]'), rg = $('[data-k="gamma"]'), cb = $('[data-k="bal"]');

  function render() {
    var list = COLS.concat([['yours', hex(picker.value)]]);
    grid.innerHTML = list.map(function (c) {
      return '<div class="sw"><div style="background:' + css(c[1]) + '"></div><div style="background:' + css(bar(lantern(c[1], st))) + '"></div><span>' + c[0] + '</span></div>';
    }).join('');
    rs.nextElementSibling.textContent = st.sat.toFixed(2); rg.nextElementSibling.textContent = st.gamma.toFixed(1);
    curve();
  }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }

  // the curve: a 20%-strength channel against a full one, after gamma and rescaling
  var svg = $('[data-out="curve"]');
  function curve() {
    var W = 300, H = 170, P = 26, pts = [];
    for (var i = 0; i <= 40; i++) { var x = i / 40; pts.push((P + x * (W - 2 * P)).toFixed(1) + ',' + (H - P - Math.pow(x, st.gamma) * (H - 2 * P)).toFixed(1)); }
    var lo = 40 / 180, ly = Math.pow(lo, st.gamma), X = function (x) { return P + x * (W - 2 * P); }, Y = function (y) { return H - P - y * (H - 2 * P); };
    svg.innerHTML =
      '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - P) + '" y2="' + (H - P) + '" stroke="#1d4a2f"/>' +
      '<line x1="' + P + '" y1="' + P + '" x2="' + P + '" y2="' + (H - P) + '" stroke="#1d4a2f"/>' +
      '<polyline fill="none" stroke="#00ff41" stroke-width="2" points="' + pts.join(' ') + '"/>' +
      '<line x1="' + X(lo) + '" y1="' + (H - P) + '" x2="' + X(lo) + '" y2="' + Y(ly) + '" stroke="#ff6b81" stroke-dasharray="3 3"/>' +
      '<circle cx="' + X(lo) + '" cy="' + Y(ly) + '" r="4" fill="#ff6b81"/><circle cx="' + X(1) + '" cy="' + Y(1) + '" r="4" fill="#00e5ff"/>' +
      '<text x="' + (W - P) + '" y="' + (H - 8) + '" fill="#7d8f85" font-size="10" text-anchor="end" font-family="JetBrains Mono">channel in</text>' +
      '<text x="' + (P + 4) + '" y="' + (P - 8) + '" fill="#7d8f85" font-size="10" font-family="JetBrains Mono">out</text>';
    $('[data-out="ratio"]').innerHTML = 'In the teal, red is <b>' + (lo * 100).toFixed(0) + '%</b> of green on screen. After gamma ' + st.gamma.toFixed(1) +
      ' it is <b>' + (ly * 100).toFixed(ly < 0.1 ? 1 : 0) + '%</b>.';
  }

  rs.addEventListener('input', function () { st.sat = +rs.value; clearPre(); render(); });
  rg.addEventListener('input', function () { st.gamma = +rg.value; clearPre(); render(); });
  cb.addEventListener('change', function () { st.bal = cb.checked; clearPre(); render(); });
  picker.addEventListener('input', render);
  var segEl = $('[data-seg="led"]');
  function clearPre() { segEl.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); }); }
  segEl.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var p = PRE[b.dataset.v]; st.sat = p.sat; st.gamma = p.gamma; st.bal = p.bal;
    rs.value = st.sat; rg.value = st.gamma; cb.checked = st.bal;
    clearPre(); b.classList.add('on'); render();
  });
  render();
})();

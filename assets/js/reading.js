/* reading.js
 Reading aids:
 - reading mode: adds .fans-tucked to <html> while scrolling down so the edge tabs slide to a sliver,
   and removes it on the way up (styles in overlays.css);
 - reading progress: fills the line under the menu and ticks each section; the deep panel gets its own.
*/

/* ---------- reading mode: tuck the edge fans while scrolling down, bring them back on the way up ---------- */
(function () {
  var root = document.documentElement, last = window.scrollY, ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, d = y - last;
    if (Math.abs(d) < 6) return;          // ignore jitter
    if (y < 160 || d < 0) root.classList.remove('fans-tucked');
    else root.classList.add('fans-tucked');
    last = y;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
})();

/* ---------- reading progress in the menu ---------- */
(function () {
  var bar = document.querySelector('nav .read-bar'); if (!bar) return;
  var fill = bar.querySelector('.rb-fill'), ticksEl = bar.querySelector('.rb-ticks');
  var header = document.querySelector('header');
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var start = 0, span = 1, marks = [], ticks = [], ticking = false;
  function measure() {
    start = header ? header.offsetHeight * 0.6 : 0;
    span = Math.max(1, document.documentElement.scrollHeight - innerHeight - start);
    marks = secs.map(function (s) { return s ? Math.max(0, Math.min(1, (s.offsetTop - 70 - start) / span)) : 0; });
    ticksEl.innerHTML = marks.map(function (m) { return '<i style="left:' + (m * 100).toFixed(2) + '%"></i>'; }).join('');
    ticks = [].slice.call(ticksEl.children); update();
  }
  function update() {
    ticking = false;
    var p = Math.max(0, Math.min(1, (scrollY - start) / span));
    fill.style.setProperty('--read', p.toFixed(4));
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('here', i === cur); });
    ticks.forEach(function (t, i) { t.classList.toggle('done', marks[i] <= p + 0.001 && p > 0); });
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  measure();
  // the deep panel gets its own line under "back to the page"
  // (the panel is further down the page than this script, so hook it up once the DOM is ready)
  function hookPanel() {
    var panel = document.getElementById('deep-panel'), pfill = panel && panel.querySelector('.read-bar .rb-fill');
    if (pfill) panel.addEventListener('scroll', function () {
      var m = panel.scrollHeight - panel.clientHeight;
      pfill.style.setProperty('--read', m > 0 ? (panel.scrollTop / m).toFixed(4) : 0);
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hookPanel); else hookPanel();
})();

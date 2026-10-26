/* hero.js
 Hero behaviour:
 - rotating words and the scroll push-in (CSS scroll timelines where supported, a rAF fallback elsewhere);
 - "make me dapper": the sketched coat drawn stroke by stroke (#dapper, #dapper-back, #dapper-btn);
 - the typed hero line (#typed).
 Exposes: window.makeDapper(want).
*/

/* ---------- rotating words and the scroll push-in ---------- */
(function () {
  var reduce = Site.reducedMotion();
  [].forEach.call(document.querySelectorAll('[data-rotate]'), function (el, n) {
    var words = el.getAttribute('data-rotate').split('|'), i = 0;
    if (reduce || words.length < 2) return;
    setTimeout(function () {
      setInterval(function () {
        if (document.hidden) return;
        el.classList.add('out');
        setTimeout(function () {
          i = (i + 1) % words.length; el.textContent = words[i];
          el.classList.remove('out'); el.classList.add('pre'); void el.offsetWidth; el.classList.remove('pre');
        }, 330);
      }, 2300);
    }, 1800 + n * 700);
  });
  if (reduce) return;
  // browsers with scroll-linked animations do the hero push in CSS, off the main thread
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()')) return;
  var header = document.querySelector('header'), ticking = false, h = 1;
  var cs = getComputedStyle(header);
  var wordMax = parseFloat(cs.getPropertyValue('--word-max')) || 1.55, meMax = parseFloat(cs.getPropertyValue('--me-max')) || 1.16;
  function measure() { h = header.offsetHeight || 1; }
  function push() {
    ticking = false;
    var p = Math.max(0, Math.min(1, window.scrollY / h));
    // set on the header, not the page root, so only the hero restyles on each frame
    header.style.setProperty('--push-me', (1 + p * (meMax - 1)).toFixed(4));
    header.style.setProperty('--push-word', (1 + p * (wordMax - 1)).toFixed(4));
  }
  window.addEventListener('scroll', function () { if (!ticking && window.scrollY <= h) { ticking = true; requestAnimationFrame(push); } }, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  measure(); push();
})();

/* ---------- make me dapper ----------
   Each stroke is drawn in with a dash offset, one after another, at a
   speed proportional to its length, so it reads as a pen sketching. */
(function () {
  var svg = document.getElementById('dapper'), back = document.getElementById('dapper-back'), btn = document.getElementById('dapper-btn');
  if (!svg || !btn) return;
  var flat = document.getElementById('dapper-flat');
  var layers = [back, flat, svg].filter(Boolean);
  var paths = [].slice.call(document.querySelectorAll('#dapper-back path, #dapper path'));
  var lens = paths.map(function (p) { return Math.ceil(p.getTotalLength()) + 2; });
  var total = lens.reduce(function (a, b) { return a + b; }, 0), budget = 4.2, t = 0;
  paths.forEach(function (p, n) {
    var dur = Math.max(0.08, budget * 0.85 * lens[n] / total);
    p.style.setProperty('--len', back && back.contains(p) ? Math.ceil(lens[n] * 1.3) : lens[n]);
    p.style.setProperty('--dur', dur + 's');
    p.style.setProperty('--delay', t + 's');
    t += dur * 0.85 + 0.01;
  });
  window.makeDapper = function (want) {
    var on = want === undefined ? !svg.classList.contains('on') : want;
    layers.forEach(function (l) { l.classList.toggle('on', on); l.classList.toggle('off', !on); });
    btn.textContent = on ? 'undo dapper' : 'make me dapper';
    btn.setAttribute('aria-pressed', on);
    return on;
  };
  btn.addEventListener('click', function () { window.makeDapper(); });
})();

/* ---------- typed hero line ---------- */
(function () {
  var phrases = ['ML architect', 'machine learning engineer', 'satellite AI researcher', 'problem solver', 'defence nerd'];
  var el = document.getElementById('typed');
  if (!el) return;
  var pi = 0, ci = 0, deleting = false;
  function tick() {
    var p = phrases[pi];
    el.textContent = p.slice(0, ci);
    var delay = deleting ? 34 : 74;
    if (!deleting && ci === p.length) { delay = 1700; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
    else ci += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
})();

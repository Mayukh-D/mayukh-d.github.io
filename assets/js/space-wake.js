/* space-wake.js
 Wakes the nanoGPT Hugging Face Space early (it sleeps when idle and takes about a minute to start),
 as soon as a visitor nears the projects or reaches for the demo link.
 Exposes: window.wakeStoryGenerator().
*/

/* ---------- wake the story generator early ----------
   The nanoGPT demo is a free Hugging Face Space that goes to sleep when nobody uses it, and takes
   about a minute to start. So the page pokes it as soon as a visitor gets near the projects, or
   reaches for the demo link: by the time they click, it is usually already awake. */
(function () {
  var woken = false;
  function wake() {
    if (woken) return; woken = true;
    try { fetch('https://mayukh1999-nanogpt-story-generator.hf.space/', { mode: 'no-cors', cache: 'no-store' }).catch(function () {}); } catch (e) {}
  }
  window.wakeStoryGenerator = wake;
  var link = document.querySelector('[data-wake-space]');
  if (!link) return;
  ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) { link.addEventListener(ev, wake, { passive: true }); });
  var tl = document.querySelector('[data-tldr="nanogpt"]'); if (tl) tl.addEventListener('click', wake);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { wake(); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(link.closest('.project-card'));
  }
})();

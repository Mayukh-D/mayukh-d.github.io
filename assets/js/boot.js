/* boot.js  (loaded in <head>, before the stylesheets apply)
 Runs before first paint, so it stays small and synchronous:
 - marks <html class="js"> so motion.css may hide elements that scripts will reveal;
 - restores light mode if the visitor chose it (opt-in only, never the system setting);
 - starts the hero intro (html.intro-go and an 'intro-go' event) once the portrait and fonts are ready,
   or after 0.9s at most;
 - defines window.Site, the few helpers shared by the component scripts.
*/
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    if (localStorage.getItem('theme') === 'light') root.dataset.theme = 'light';
  } catch (e) {}

  /* Shared helpers for the component scripts in assets/js/. */
  window.Site = {
    /* Landscape screens with room for the page-cover fans; everything else gets the small edge tabs.
       Must match the media queries in assets/css/overlays.css. */
    COVERS: '(min-width: 1000px) and (min-aspect-ratio: 1/1) and (min-height: 600px)',
    coversActive: function () { return matchMedia(window.Site.COVERS).matches; },
    reducedMotion: function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  };

  addEventListener('DOMContentLoaded', function () {
    var go = function () {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        root.classList.add('intro-go'); dispatchEvent(new Event('intro-go'));
      }); });
    };
    var img = document.querySelector('.hero-photo'), waits = [];
    if (img && img.decode) waits.push(img.decode().catch(function () {}));
    if (document.fonts && document.fonts.ready) waits.push(document.fonts.ready);
    Promise.race([Promise.all(waits), new Promise(function (r) { setTimeout(r, 900); })]).then(go);
  });
})();

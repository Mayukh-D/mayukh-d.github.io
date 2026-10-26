/* reveals.js
 Staged reveals: the hero stages in once per session; everything else reveals as it scrolls into view,
 with grid siblings staggered. Works with the .reveal / .in classes in motion.css.
*/

/* ---------- staged reveals ----------
   The hero stages in once per session, so returning to the page is not a
   performance every time. Everything below reveals as it scrolls into
   view, with siblings in a grid staggered. Nothing here gates content:
   the hidden state only exists while the script is alive to undo it. */
(function () {
  if (!document.documentElement.classList.contains('js')) return;
  var reduce = Site.reducedMotion();
  function show(el) { el.classList.add('in'); }

  /* The intro plays on every load. Gating it per session meant the effect
     was invisible on any revisit, and at ~1.5s that is not worth guarding
     against. prefers-reduced-motion still skips straight to the end. */
  var stage = [].slice.call(document.querySelectorAll('[data-stage]'));
  if (reduce) {
    stage.forEach(show);
  } else {
    // Timed from the moment the shutters start (not from page load), so the entrances play as they part.
    var startStage = function () {
      stage.forEach(function (el, i) {
        setTimeout(function () { show(el); setTimeout(function () { el.style.willChange = ''; }, 1500); }, 780 + i * 130);
      });
    };
    stage.forEach(function (el) { el.style.willChange = 'transform, opacity'; });   // layers drawn behind the shutters, ahead of time
    if (document.documentElement.classList.contains('intro-go')) startStage();
    else addEventListener('intro-go', startStage, { once: true });
  }

  var items = [].slice.call(document.querySelectorAll('[data-scroll]'));
  if (reduce) { items.forEach(show); return; }

  items.forEach(function (el) {
    var idx = 0, prev = el.previousElementSibling;
    while (prev) {
      if (prev.hasAttribute('data-scroll')) idx++;
      prev = prev.previousElementSibling;
    }
    el._delay = Math.min(idx, 6) * 110;  // cap the stagger on long lists
  });

  /* A rect check on scroll rather than IntersectionObserver: one code path,
     no observer semantics to get wrong, and cheap since revealed elements
     drop out of the pending list. */
  var pending = items.slice(), ticking = false;

  function sweep() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = pending.length - 1; i >= 0; i--) {
      var el = pending[i], r = el.getBoundingClientRect();
      if (r.top < vh * 0.84 && r.bottom > 0) {
        pending.splice(i, 1);
        (function (node) {
          setTimeout(function () { show(node); }, node._delay || 0);
        })(el);
      }
    }
    if (!pending.length) {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    }
  }

  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(sweep);
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request);
  sweep();

  /* Failsafe. If scroll or rAF never fire, content on screen must not sit
     invisible: poll the same viewport check. This only ever reveals what
     is actually in view, so lingering on the hero no longer burns through
     every reveal on the page. */
  var poll = setInterval(function () {
    if (!pending.length) { clearInterval(poll); return; }
    sweep();
  }, 1500);
})();

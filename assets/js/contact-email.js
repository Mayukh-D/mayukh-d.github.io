/* contact-email.js
 Contact email button (#email-btn). The address is assembled at runtime so scrapers miss it; clicking
 writes a short note that folds into a paper plane before the mail app opens.
 Exposes: window.loadPaperPlane() -> Promise, which lazy-loads assets/plane.js (window.paperPlane).
 Used by: chat.js (the terminal's exit animation).
*/

/* ---------- contact email (assembled at runtime to dodge scrapers) ---------- */
(function () {
  var el = document.getElementById('email-btn');
  if (!el) return;
  var addr = ['me', 'mayukhdas.com'].join('@');
  el.href = 'mailto:' + addr;
  el.textContent = addr;

  // the paper plane lives in assets/plane.js and loads on demand; the terminal uses this too
  var plane;
  window.loadPaperPlane = function () {
    return plane || (plane = new Promise(function (ok, fail) {
      if (window.paperPlane && window.paperPlane.fly) return ok();
      var s = document.createElement('script'); s.src = 'assets/plane.js?v=8';
      s.onload = ok; s.onerror = function () { plane = null; fail(); };
      document.head.append(s);
    }));
  };
  var reduce = function () { return Site.reducedMotion(); };
  var warm = function () { if (!reduce()) window.loadPaperPlane().then(function () { window.paperPlane.preload(); }, function () {}); };
  ['pointerenter', 'focus', 'touchstart'].forEach(function (t) { el.addEventListener(t, warm, { once: true, passive: true }); });

  // clicking it writes a short note that folds into a paper plane and is sent, then the mail app opens
  var sending = false;
  el.addEventListener('click', function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduce()) return;
    e.preventDefault();
    if (sending) return;
    sending = true;
    var sent = false, send = function () {
      if (sent) return; sent = true; sending = false;
      location.href = 'mailto:' + addr;
    };
    setTimeout(send, 6000);   // never hold the email back for long
    window.loadPaperPlane().then(function () { window.paperPlane.letter(el, addr, send); }, send);
  });
})();

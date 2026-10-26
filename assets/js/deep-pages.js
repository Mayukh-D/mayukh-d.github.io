/* deep-pages.js
 Deep pages: an edge tab fetches its page (/projects/, /research/, /jobs/, /notes/...), swings it in
 from the edge in #deep-panel and gives it its own URL (history API). On landscape screens with covers
 (Site.coversActive()) the page grows out of, and closes back into, the cover that was clicked.
*/

// Deep pages: fetch the page, swing it in from the right edge, and give it its own URL.
// Visiting /work/<page>/ or /notes/<page>/ directly serves the same page standalone.
(() => {
  const panel = document.getElementById('deep-panel'), host = document.getElementById('deep-host');
  const home = location.pathname;
  let opener = null, busy = false;
  // on a laptop the edge tabs are page sheets: open from, and close back into, the one clicked
  const sheetRect = () => opener && opener.classList.contains('edge-tab') && Site.coversActive()
    && !Site.reducedMotion() ? opener.getBoundingClientRect() : null;
  const inset = r => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 10px)`;
  async function open(href, push) {
    if (busy) return; busy = true;
    try {
      const res = await fetch(href, { cache: 'no-cache' });
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const main = doc.querySelector('main.deep');
      if (!res.ok || !main) { location.href = href; return; }
      host.replaceChildren(document.importNode(main, true));
      host.querySelectorAll('video[autoplay]').forEach(v => { v.muted = true; v.play().catch(() => {}); });
      // parsed scripts are inert; re-create them so a page's demos run in the panel, in order.
      // They start after the reveal, so their set-up never competes with the animation.
      const runScripts = () => host.querySelectorAll('script').forEach(old => {
        const s = document.createElement('script');
        for (const a of old.attributes) s.setAttribute(a.name, a.value);
        s.async = false; s.textContent = old.textContent; old.replaceWith(s);
      });
      document.title = doc.title;
      const wasOpen = !panel.hidden;
      if (push) history.pushState({ deep: href, depth: wasOpen && history.state && history.state.depth ? history.state.depth + 1 : 1 }, '', href);
      panel.hidden = false; panel.scrollTop = 0; panel.dispatchEvent(new Event('scroll'));
      if (!wasOpen) {
        panel.classList.remove('swing-out', 'swing-in');
        const r = sheetRect();
        // Hold the first frame until the new page has laid out and painted, then play the whole reveal.
        const reveal = r
          ? panel.animate([{ clipPath: inset(r), opacity: 0.85 }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', opacity: 1 }],
                          { duration: 640, easing: 'cubic-bezier(.22, .8, .25, 1)', fill: 'both' })
          : panel.animate([{ transform: 'perspective(1600px) rotateY(-78deg)', opacity: 0.2 }, { transform: 'perspective(1600px) rotateY(0)', opacity: 1 }],
                          { duration: 640, easing: 'cubic-bezier(.22, .8, .25, 1)', fill: 'both' });
        reveal.pause();
        await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
        reveal.play();
        reveal.finished.then(() => { reveal.cancel(); runScripts(); }, runScripts);
      } else runScripts();
      document.documentElement.style.overflow = 'hidden';
      panel.querySelector('.deep-close').focus({ preventScroll: true });
    } catch (err) { console.error(err); location.href = href; }
    finally { busy = false; }
  }
  function close(pop) {
    if (panel.hidden) return;
    const r = sheetRect();
    panel.classList.remove('swing-in');
    const shut = r ? panel.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)', opacity: 1 }, { clipPath: inset(r), opacity: 0.6 }],
                                   { duration: 420, easing: 'cubic-bezier(.5, 0, .75, .2)', fill: 'forwards' }) : null;
    if (!r) { void panel.offsetWidth; panel.classList.add('swing-out'); }
    setTimeout(() => {
      panel.hidden = true; panel.classList.remove('swing-out'); host.replaceChildren(); if (shut) shut.cancel();
      document.documentElement.style.overflow = ''; document.title = window.__homeTitle;
      if (opener) opener.focus({ preventScroll: true });
    }, 430);
    if (!pop && history.state && history.state.deep) history.go(-(history.state.depth || 1));
  }
  window.__homeTitle = document.title;
  document.querySelectorAll('[data-deep-link]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); opener = a; open(a.getAttribute('href'), true);
  }));
  // Links inside a deep page (e.g. the notes list) stay in the panel.
  host.addEventListener('click', e => {
    const a = e.target.closest('a[href^="/work/"], a[href^="/notes/"], a[href^="/videos/"], a[href^="/jobs/"], a[href^="/projects/"], a[href^="/research/"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); open(a.getAttribute('href'), true);
  });
  panel.querySelector('[data-deep-close]').addEventListener('click', () => close(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(false); });
  addEventListener('popstate', e => { if (e.state && e.state.deep) open(e.state.deep, false); else close(true); });
})();

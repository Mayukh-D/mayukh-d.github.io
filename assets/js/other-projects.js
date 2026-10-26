/* other-projects.js
 Other projects: a row opens into its full card, with the art growing out of the row's thumbnail.
 On a laptop, hovering a closed row previews its art beside the cursor.
*/

// Other projects: a row opens into its full card, the art growing out of the row's thumbnail.
// On a laptop, hovering a closed row previews its art beside the cursor.
(() => {
  const rows = document.querySelectorAll('.project-card.other');
  const peek = document.querySelector('.art-peek');
  if (!rows.length || !peek) return;
  const pimg = peek.querySelector('img'), q = sel => peek.querySelector(sel);
  // Fill the preview from the row's own card, so it always says what the card says.
  function fill(row, art) {
    const txt = el => el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    pimg.src = art.getAttribute('src');
    q('.peek-title').textContent = txt(row.querySelector('.row-inner h3'));
    q('.peek-outcome').textContent = txt(row.querySelector('.project-outcome'));
    q('.peek-desc').textContent = txt(row.querySelector('.row-inner p'));
    q('.peek-lang').replaceChildren(...[...(row.querySelector('.row-lang')?.childNodes || [])].map(n => n.cloneNode(true)));
  }
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.2,.8,.2,1)';
  function place(e) {
    const w = peek.offsetWidth, h = peek.offsetHeight;
    let x = e.clientX + 26, y = e.clientY - h / 2;
    if (x + w > innerWidth - 12) x = e.clientX - w - 26;
    y = Math.max(66, Math.min(innerHeight - h - 12, y));   // stay below the nav bar
    peek.style.left = x + 'px'; peek.style.top = y + 'px';
  }
  // Fly a copy of the art from the thumbnail's crop to where the full art lands.
  function grow(thumb, art) {
    const img = thumb.querySelector('img'), from = thumb.getBoundingClientRect(), to = art.getBoundingClientRect();
    if (!from.width || !to.width) return;
    const s = from.height / to.height, shown = to.width * s;
    const off = (parseFloat(img.style.objectPosition) / 100 || 0.5) * (shown - from.width);
    const fly = art.cloneNode();
    fly.className = 'art-fly'; fly.removeAttribute('loading');
    Object.assign(fly.style, { left: to.left + 'px', top: to.top + 'px', width: to.width + 'px', height: to.height + 'px', transformOrigin: '0 0' });
    document.body.append(fly);
    art.style.visibility = 'hidden';
    const l = off / s, r = to.width - (off + from.width) / s;
    fly.animate([
      { transform: `translate(${from.left - off - to.left}px, ${from.top - to.top}px) scale(${s})`, clipPath: `inset(0 ${r}px 0 ${l}px round ${5 / s}px)` },
      { transform: 'none', clipPath: 'inset(0 0 0 0 round 8px)' }
    ], { duration: 560, easing: ease }).finished.then(() => { art.style.visibility = ''; fly.remove(); });
  }
  rows.forEach(row => {
    const head = row.querySelector('.row-head'), art = row.querySelector('.project-art'), thumb = row.querySelector('.row-thumb');
    const inner = row.querySelector('.row-inner');
    inner.inert = true;   // closed rows keep their links out of the tab order
    head.addEventListener('click', () => {
      const open = !row.classList.contains('open');
      peek.classList.remove('on');
      row.classList.toggle('open', open);
      head.setAttribute('aria-expanded', String(open));
      inner.inert = !open;
      if (open && art && !still.matches) grow(thumb, art);
    });
    head.addEventListener('pointerenter', e => {
      if (!fine.matches || row.classList.contains('open') || !art) return;
      fill(row, art); place(e); peek.classList.add('on');
    });
    head.addEventListener('pointermove', e => { if (peek.classList.contains('on')) place(e); });
    head.addEventListener('pointerleave', () => peek.classList.remove('on'));
  });
  addEventListener('scroll', () => peek.classList.remove('on'), { passive: true });
})();

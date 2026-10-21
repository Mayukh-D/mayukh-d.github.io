// Easter egg: type "plane" in the terminal and the page folds into a paper plane and flies off.
// Loaded on demand by the chat terminal. A refresh brings the page back.
(function () {
  // Renders the page through the browser's own engine, so masks and glows survive.
  const SNAP = 'https://cdn.jsdelivr.net/npm/modern-screenshot@4.7.0/dist/index.js';

  function loadScript(src) {
    return new Promise((ok, fail) => {
      if (window.modernScreenshot) return ok();
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.append(s);
    });
  }
  const timeout = ms => new Promise((_, f) => setTimeout(f, ms));

  // A faint paper edge, so the sheet reads as paper against a page of the same colour.
  function edged(canvas) {
    const g = canvas.getContext('2d'), w = canvas.width, h = canvas.height, e = Math.max(3, w / 220);
    g.strokeStyle = 'rgba(220, 255, 230, 0.55)'; g.lineWidth = e; g.strokeRect(e / 2, e / 2, w - e, h - e);
    return canvas.toDataURL('image/jpeg', 0.85);
  }

  // What is on screen right now, as an image. Falls back to a plain sheet with the name on it.
  async function snapshot(W, H, bg) {
    try {
      await Promise.race([loadScript(SNAP), timeout(4000)]);
      const canvas = await Promise.race([
        window.modernScreenshot.domToCanvas(document.documentElement, {
          width: W, height: H, scale: Math.min(devicePixelRatio || 1, 1.5), backgroundColor: bg,
          font: false, timeout: 1500,              // skip font embedding and slow fetches: 30s -> under 2s
          style: { transform: `translate(${-scrollX}px, ${-scrollY}px)` },
          // only what is on screen (and fixed bars), not the whole long page
          filter: n => {
            if (n.nodeType !== 1) return true;
            if (n.id === 'chat' || n.classList.contains('plane-egg')) return false;
            if (n === document.body || n === document.documentElement) return true;
            const r = n.getBoundingClientRect();
            return r.height === 0 || (r.bottom > -50 && r.top < H + 50) || getComputedStyle(n).position === 'fixed';
          },
        }),
        timeout(6000),
      ]);
      return edged(canvas);
    } catch {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--green') || '#00ff41';
      g.font = `700 ${Math.round(W / 9)}px "JetBrains Mono", monospace`;
      g.textAlign = 'center'; g.fillText('MAYUKH DAS', W / 2, H / 2);
      return edged(c);
    }
  }

  const css = `
    .plane-egg { position: fixed; inset: 0; z-index: 2147483000; overflow: hidden; perspective: 1400px; }
    .plane-egg .stage, .plane-egg .half { position: absolute; inset: 0; transform-style: preserve-3d; }
    .plane-egg .piece { position: absolute; inset: 0; background-size: 100% 100%; backface-visibility: visible; }
    .plane-egg .piece.fold { filter: brightness(0.92); }
    .plane-egg svg.trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .plane-egg .note { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;
      font: 500 0.95rem/1.7 'JetBrains Mono', monospace; color: var(--green, #00ff41); opacity: 0; transition: opacity 0.6s; }
    .plane-egg .note.on { opacity: 1; }
    .plane-egg .note button { margin-top: 14px; font: inherit; color: var(--bg, #000); background: var(--green, #00ff41);
      border: 0; border-radius: 6px; padding: 8px 16px; cursor: pointer; }`;

  // A paper plane seen from above, nose pointing right.
  const PLANE = `<svg viewBox="0 0 120 60" width="120" height="60" aria-hidden="true">
    <path d="M2 30 L118 30 L20 4 Z" fill="#f4f7f5"/>
    <path d="M2 30 L118 30 L20 56 Z" fill="#d9e1dc"/>
    <path d="M30 30 L118 30 L40 38 Z" fill="#b9c4be"/>
    <path d="M2 30 L118 30" stroke="#9aa7a0" stroke-width="1"/></svg>`;

  // beforeFold runs once the snapshot is ready (the terminal closes then, not before)
  window.paperPlane = async function (beforeFold) {
    if (document.querySelector('.plane-egg')) return;
    const W = innerWidth, H = innerHeight;
    const bg = getComputedStyle(document.body).backgroundColor || '#000';
    const img = await snapshot(W, H, bg);
    beforeFold && beforeFold();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const style = document.createElement('style'); style.textContent = css;
    const egg = document.createElement('div'); egg.className = 'plane-egg'; egg.style.background = bg;
    document.head.append(style); document.body.append(egg);
    document.documentElement.style.overflow = 'hidden';

    const c = W / 2, a = Math.min(c, H * 0.45);    // corner folds meet on the centre line
    const piece = (pts, cls = '') => {
      const d = document.createElement('div');
      d.className = 'piece ' + cls;
      d.style.backgroundImage = `url(${img})`;
      d.style.clipPath = `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(',')})`;
      return d;
    };
    const stage = document.createElement('div'); stage.className = 'stage';
    const left = document.createElement('div'); left.className = 'half';
    const right = document.createElement('div'); right.className = 'half';
    const bodyL = piece([[c, 0], [c, H], [0, H], [0, a]]);
    const bodyR = piece([[c, 0], [W, a], [W, H], [c, H]]);
    const triL = piece([[0, 0], [c, 0], [0, a]], 'fold');
    const triR = piece([[c, 0], [W, 0], [W, a]], 'fold');
    triL.style.transformOrigin = `${c}px 0`; triR.style.transformOrigin = `${c}px 0`;
    right.style.transformOrigin = `${c}px 0`;
    left.append(bodyL, triL); right.append(bodyR, triR); stage.append(left, right); egg.append(stage);

    const run = (el, frames, opts) => el.animate(frames, { fill: 'forwards', easing: 'cubic-bezier(.45,0,.2,1)', ...opts }).finished;
    const s = Math.min(0.42, 340 / W);             // the page shrinks to a sheet of paper

    const end = () => {
      stage.remove();
      const note = document.createElement('div'); note.className = 'note';
      note.innerHTML = '&gt; the page flew away.<br>refresh to bring it back<br><button type="button">&#8635; refresh</button>';
      note.querySelector('button').onclick = () => location.reload();
      egg.append(note); requestAnimationFrame(() => note.classList.add('on'));
    };
    if (reduce) { await run(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }); return end(); }

    // 1) the page becomes a sheet
    await run(stage, [{ transform: 'none' }, { transform: `scale(${s}) rotateX(18deg)` }], { duration: 650 });
    // 2) both top corners fold to the centre line
    const k = `translateZ(1px) rotate3d(${-c}, ${a}, 0, 180deg)`, k2 = `translateZ(1px) rotate3d(${c}, ${a}, 0, -180deg)`;
    await Promise.all([run(triL, [{ transform: 'none' }, { transform: k }], { duration: 520 }),
                       run(triR, [{ transform: 'none' }, { transform: k2 }], { duration: 520, delay: 120 })]);
    // 3) fold in half along the centre
    await run(right, [{ transform: 'none' }, { transform: 'translateZ(2px) rotateY(-180deg)' }], { duration: 520 });
    // 4) turn it nose-first and swap in the plane
    await run(stage, [{ transform: `scale(${s}) rotateX(18deg)` },
                      { transform: `scale(${s * 0.5}) rotateZ(90deg) rotateX(60deg)`, opacity: 0 }], { duration: 420 });
    stage.remove();

    const plane = document.createElement('div');
    plane.innerHTML = PLANE;
    Object.assign(plane.style, { position: 'absolute', left: `${W / 2 - 60}px`, top: `${H / 2 - 30}px`, width: '120px', height: '60px' });
    const trail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    trail.setAttribute('class', 'trail');
    const x0 = W / 2, y0 = H / 2;
    const path = `M ${x0} ${y0} C ${x0 + W * 0.18} ${y0 + H * 0.18}, ${x0 + W * 0.32} ${y0 - H * 0.05}, ${x0 + W * 0.2} ${y0 - H * 0.28} S ${x0 + W * 0.45} ${-H * 0.15}, ${W + 200} ${-H * 0.35}`;
    trail.innerHTML = `<path d="${path}" fill="none" stroke="var(--green, #00ff41)" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.55"/>`;
    egg.append(trail, plane);
    const p = trail.querySelector('path'), len = p.getTotalLength();
    // the trail is drawn behind the plane as it goes
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mask.setAttribute('d', path); mask.setAttribute('fill', 'none'); mask.setAttribute('stroke', '#fff'); mask.setAttribute('stroke-width', '4');
    mask.setAttribute('stroke-dasharray', `${len} ${len}`); mask.setAttribute('stroke-dashoffset', len);
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'mask'); m.id = 'plane-trail-mask'; m.append(mask);
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); defs.append(m); trail.prepend(defs);
    p.setAttribute('mask', 'url(#plane-trail-mask)');

    const dur = 2200, t0 = performance.now();
    plane.animate([{ transform: 'scale(0.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 250, fill: 'forwards' });
    await new Promise(done => {
      (function step(now) {
        const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const at = p.getPointAtLength(e * len), ahead = p.getPointAtLength(Math.min(len, e * len + 2));
        const ang = Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180 / Math.PI;
        const size = 1 - 0.55 * e;
        plane.style.left = `${at.x - 60}px`; plane.style.top = `${at.y - 30}px`;
        plane.style.transform = `rotate(${ang}deg) scale(${size})`;
        mask.setAttribute('stroke-dashoffset', String(len * (1 - e)));
        t < 1 ? requestAnimationFrame(step) : done();
      })(t0);
    });
    trail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' });
    end();
  };
})();

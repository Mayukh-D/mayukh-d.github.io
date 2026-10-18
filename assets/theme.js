// Theme toggle: dark is the default; light only when chosen here, remembered on this device.
(() => {
  const root = document.documentElement;
  const sync = () => {
    const light = root.dataset.theme === 'light';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = light ? '<span class="tt-sym" aria-hidden="true">&lt;</span><svg class="tt-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg><span class="tt-word">dark</span>' : '<span class="tt-sym" aria-hidden="true">*</span><svg class="tt-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg><span class="tt-word">light</span>';
      btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      btn.title = light ? 'Dark mode' : 'Light mode';
    });
  };
  const flip = () => {
    if (root.dataset.theme === 'light') delete root.dataset.theme; else root.dataset.theme = 'light';
    try { localStorage.setItem('theme', root.dataset.theme || 'dark'); } catch (e) {}
    sync();
  };
  // Everything blends from one theme to the other (colours, glows, art); the side covers,
  // being screenshots, slide out first and come back in the new theme.
  let busy = false;
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => {
    if (busy) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return flip();
    busy = true;
    const covers = document.querySelector('.edge-tabs');
    root.classList.add('theme-anim');
    if (covers) root.classList.add('covers-away');
    setTimeout(() => {
      flip();
      setTimeout(() => root.classList.remove('covers-away'), 60);
      setTimeout(() => { root.classList.remove('theme-anim'); busy = false; }, 760);
    }, covers ? 320 : 0);
  }));
  sync();
})();

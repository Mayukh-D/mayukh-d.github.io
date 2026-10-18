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
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => {
    if (root.dataset.theme === 'light') delete root.dataset.theme; else root.dataset.theme = 'light';
    try { localStorage.setItem('theme', root.dataset.theme || 'dark'); } catch (e) {}
    sync();
  }));
  sync();
})();

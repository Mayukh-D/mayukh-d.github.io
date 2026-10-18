// Lantern demo: a monitor and an LED bar; pick a screen and the bar fades to its main colour, as Lantern does.
// Used in the Lantern tl;dr on the home page and on /projects/ (mounts into [data-lantern-demo]).
(() => {
  const SCENES = [
    ['sunset', '#ff8a3d', '<rect width="160" height="90" fill="#ff8a3d"/><rect y="52" width="160" height="38" fill="#c2541b"/><circle cx="110" cy="44" r="16" fill="#ffd27a"/><path d="M0 70 L40 56 L80 66 L120 52 L160 62 V90 H0Z" fill="#7a2f0e"/>'],
    ['forest', '#3dff7a', '<rect width="160" height="90" fill="#1f9d4a"/><rect width="160" height="34" fill="#9be3b2"/><path d="M20 90 L38 40 L56 90Z M60 90 L82 30 L104 90Z M106 90 L126 44 L146 90Z" fill="#0d5c2a"/>'],
    ['ocean', '#2f8fff', '<rect width="160" height="90" fill="#2f8fff"/><rect width="160" height="36" fill="#a7d3ff"/><path d="M0 50 Q20 44 40 50 T80 50 T120 50 T160 50 V90 H0Z" fill="#1559b8"/><path d="M0 66 Q20 60 40 66 T80 66 T120 66 T160 66 V90 H0Z" fill="#0d3f86"/>'],
    ['neon city', '#c43dff', '<rect width="160" height="90" fill="#2a0a3d"/><rect x="18" y="30" width="22" height="60" fill="#c43dff"/><rect x="48" y="16" width="26" height="74" fill="#8f1fd6"/><rect x="82" y="38" width="20" height="52" fill="#c43dff"/><rect x="110" y="24" width="30" height="66" fill="#a12be8"/><circle cx="136" cy="12" r="5" fill="#ff7af2"/>']
  ];
  const svgScene = body => `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;
  let n = 0;
  function mount(el) {
    const gid = 'lzg' + (++n);
    el.className = 'lantern-demo';
    el.style.setProperty('--lz', SCENES[0][1]);
    el.innerHTML = `<svg class="lz-stage" viewBox="0 0 300 132" aria-hidden="true">
        <defs><radialGradient id="${gid}"><stop offset="0" class="lz-g0"/><stop offset="1" class="lz-g1"/></radialGradient></defs>
        <ellipse cx="244" cy="66" rx="46" ry="66" fill="url(#${gid})"/>
        <rect class="lz-line" x="30" y="10" width="168" height="98" rx="5"/>
        ${SCENES.map((s, i) => `<g class="lz-scene${i ? '' : ' on'}" data-i="${i}"><svg x="34" y="14" width="160" height="90" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${s[2]}</svg></g>`).join('')}
        <path class="lz-line" d="M100 108 V118 M84 122 H130"/>
        <rect class="lz-bar" x="238" y="14" width="12" height="104" rx="6"/>
        <rect class="lz-line" x="238" y="14" width="12" height="104" rx="6"/>
        <path class="lz-line" d="M226 124 H262"/>
      </svg>
      <div class="lz-thumbs" role="group" aria-label="Pick a screen">
        ${SCENES.map((s, i) => `<button type="button" class="lz-thumb${i ? '' : ' on'}" aria-pressed="${!i}" aria-label="Show the ${s[0]} scene">${svgScene(s[2])}</button>`).join('')}
      </div>`;
    el.querySelectorAll('.lz-thumb').forEach((b, i) => b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      el.style.setProperty('--lz', SCENES[i][1]);
      el.querySelectorAll('.lz-thumb').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      el.querySelectorAll('.lz-scene').forEach(g => g.classList.toggle('on', +g.dataset.i === i));
    }));
  }
  window.mountLanternDemo = mount;
  document.querySelectorAll('[data-lantern-demo]').forEach(mount);
})();

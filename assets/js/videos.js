/* videos.js
 Videos: pressing play swaps the thumbnail for the YouTube player, so YouTube loads nothing until then.
 /videos/ carries the same handler for standalone visits; window.__ytPlay keeps it to one.
*/

// Videos: press play and the thumbnail becomes the player, so YouTube loads nothing until then.
// /videos/ carries the same handler for when it is opened on its own; the flag keeps it to one.
if (!window.__ytPlay) {
  window.__ytPlay = true;
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-yt]');
    if (!b) return;
    const f = document.createElement('div'), i = document.createElement('iframe');
    f.className = 'yt-frame';
    i.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
    i.title = b.getAttribute('aria-label').replace(/^Play: /, '');
    i.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    i.allowFullscreen = true;
    f.appendChild(i); b.replaceWith(f); i.focus();
  });
}

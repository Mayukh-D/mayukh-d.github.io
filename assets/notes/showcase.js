/* Gallery for /notes/sovereign-ai-showcase/: four photos from the day, one at a time. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }
  var demo = $('[data-demo="showcase"]'); if (!demo) return;

  var PHOTOS = [
    ['/assets/showcase/parliament-house.jpg', 'Outside Parliament House before the doors opened.', 'People standing on the forecourt of Parliament House under a clear sky'],
    ['/assets/showcase/program.jpg', 'The program for the day.', 'Event programs for the Inaugural Australian AI Parliamentary Showcase on a table'],
    ['/assets/showcase/stall.jpg', 'The Eccoi SAICOP stall in the Great Hall.', 'Two members of the Eccoi team standing behind the SAICOP stall'],
    ['/assets/showcase/conversation.jpg', 'At the stall, mid-conversation.', 'A conversation at the SAICOP stall']
  ];
  var img = $('[data-out="photo"]'), cap = $('[data-out="caption"]'), count = $('[data-out="count"]'), i = 0;
  function show(n) {
    i = (n + PHOTOS.length) % PHOTOS.length;
    img.src = PHOTOS[i][0]; img.alt = PHOTOS[i][2];
    cap.textContent = PHOTOS[i][1];
    count.textContent = (i + 1) + ' / ' + PHOTOS.length;
  }
  $('[data-act="prev"]').addEventListener('click', function () { show(i - 1); });
  $('[data-act="next"]').addEventListener('click', function () { show(i + 1); });
  img.addEventListener('click', function () { show(i + 1); });
  show(0);
})();

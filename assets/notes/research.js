/* The lineage on /research/: projects on the left, what they showed in the middle, Haizea on the right. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  var svg = root.querySelector('[data-out="lineage"]'), note = root.querySelector('[data-out="lineage-note"]'); if (!svg) return;
  var P = [['transformers', "Transformers' Revenge"], ['nanogpt', 'GPT from scratch'], ['flow', 'Flow matching'], ['hci', 'FoodLens · HCI'], ['pubs', 'Undergrad papers']];
  var Q = [['deliver', 'delivers real ML'], ['discipline', 'research discipline'], ['small', 'small-data work'], ['dl', 'DL skill & instinct']];
  var LINKS = { transformers: ['discipline', 'dl'], nanogpt: ['deliver', 'discipline', 'small', 'dl'], flow: ['discipline', 'dl'], hci: ['deliver', 'discipline'], pubs: ['discipline'] };
  var NOTE = {
    transformers: 'Predictions written down before 27 runs, and a Transformer I built myself.',
    nanogpt: 'Trained, ablated and shipped as a live demo, on 160 times less data than it wanted.',
    flow: 'Found why one target collapses, and what it costs to fix.',
    hci: 'Built, deployed, and tested with real participants.',
    pubs: 'Peer review, before ANU.'
  };
  var py = function (i) { return 30 + i * 58; }, qy = function (i) { return 50 + i * 66; };
  var sel = null;
  function draw() {
    var h = '';
    P.forEach(function (p, i) {
      LINKS[p[0]].forEach(function (q) {
        var j = Q.findIndex(function (x) { return x[0] === q; }), on = !sel || sel === p[0];
        h += '<path d="M190 ' + py(i) + ' C 260 ' + py(i) + ', 270 ' + qy(j) + ', 340 ' + qy(j) + '" fill="none" stroke="' + (on ? '#00e5ff' : '#10241a') + '" stroke-width="' + (sel === p[0] ? 2 : 1.2) + '" opacity="' + (on ? 0.85 : 0.6) + '"/>';
      });
    });
    Q.forEach(function (q, j) {
      var lit = !sel || LINKS[sel].indexOf(q[0]) >= 0;
      h += '<path d="M480 ' + qy(j) + ' C 530 ' + qy(j) + ', 530 150, 560 150" fill="none" stroke="' + (lit ? '#00ff41' : '#10241a') + '" stroke-width="1.4" opacity="0.8"/>';
      h += '<rect x="340" y="' + (qy(j) - 15) + '" width="140" height="30" rx="15" fill="#050a07" stroke="' + (lit ? '#00ff41' : '#1d4a2f') + '"/>';
      h += '<text x="410" y="' + (qy(j) + 4) + '" text-anchor="middle" font-size="11" font-family="JetBrains Mono" fill="' + (lit ? '#d8e4dc' : '#7d8f85') + '">' + q[1] + '</text>';
    });
    P.forEach(function (p, i) {
      var on = sel === p[0];
      h += '<g data-p="' + p[0] + '" style="cursor:pointer"><rect x="10" y="' + (py(i) - 17) + '" width="180" height="34" rx="8" fill="' + (on ? 'rgba(0,229,255,0.12)' : '#050a07') + '" stroke="' + (on ? '#00e5ff' : '#1d4a2f') + '"/>' +
        '<text x="100" y="' + (py(i) + 4) + '" text-anchor="middle" font-size="11.5" font-family="JetBrains Mono" fill="' + (on ? '#00e5ff' : '#d8e4dc') + '">' + p[1] + '</text></g>';
    });
    h += '<circle cx="590" cy="150" r="30" fill="#04140a" stroke="#00ff41" stroke-width="1.5"/><text x="590" y="146" text-anchor="middle" font-size="11" font-family="JetBrains Mono" fill="#00ff41">Haizea</text><text x="590" y="160" text-anchor="middle" font-size="8.5" font-family="JetBrains Mono" fill="#7d8f85">deep learning</text>';
    svg.innerHTML = h;
    note.innerHTML = sel ? '<b>' + P.find(function (p) { return p[0] === sel; })[1] + '</b> · ' + NOTE[sel] : 'Five projects, four things they showed, one job they led to.';
  }
  svg.addEventListener('click', function (e) {
    var g = e.target.closest('[data-p]'); if (!g) return;
    sel = sel === g.dataset.p ? null : g.dataset.p; draw();
  });
  draw();
})();

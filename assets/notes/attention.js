/* Diagrams and demo for /notes/attention-was-all-we-needed/.
   Each picture is a schematic of how the last character reaches back for what it needs:
   minGRU through one running summary, the gMLP through fixed glances inside a window,
   the Transformer by looking up a match. Not to scale. The verdicts in the demo are the
   induction-task results from the Transformers' Revenge report (accuracy; 0.04 is chance). */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }

  var N = 20, CW = 28, PITCH = 32, Y = 64, H = 30, LAST = N - 1, WINDOW_FROM = 6;
  var FILLER = 'RTBNWZHJCPVDGSLEAYFU';
  var GREEN = 'var(--green)', MUTED = 'var(--text-muted)', LINE = 'var(--border-bright)', RED = '#ff6b81', CYAN = 'var(--cyan)';
  var uid = 0;
  function cx(i) { return 2 + i * PITCH + CW / 2; }

  function arc(from, to, colour, width, opacity, marker) {
    var lift = Math.min(58, 14 + Math.abs(from - to) * 4.5);
    return '<path d="M' + cx(from) + ' ' + (Y - 2) + ' Q' + (cx(from) + cx(to)) / 2 + ' ' + (Y - 2 - lift * 1.9) + ' ' + cx(to) + ' ' + (Y - 4) +
      '" fill="none" stroke="' + colour + '" stroke-width="' + width + '" opacity="' + opacity + '"' + (marker ? ' marker-end="url(#' + marker + ')"' : '') + '/>';
  }

  // p: where the pattern K Q X M first appears. The model stands on the last cell and must answer M.
  function draw(svg, mode, p) {
    var id = 'seq-arrow-' + (uid++), ans = p + 3, reach = mode === 'attn' || (mode === 'gmlp' && ans >= WINDOW_FROM);
    var s = '<defs><marker id="' + id + '" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 0L8 4L0 8z" fill="' + GREEN + '"/></marker></defs>';
    var i, ch, stroke, fill, colour;

    if (mode === 'attn') {
      [2, 8, 13].forEach(function (k) { if (k !== ans) s += arc(LAST, k, MUTED, 1, 0.25); });
      s += arc(LAST, ans, GREEN, 2.4, 1, id);
    } else if (mode === 'gmlp') {
      for (i = WINDOW_FROM; i < LAST; i++) if (i !== ans) s += arc(LAST, i, MUTED, 0.6 + ((i * 7) % 5) * 0.4, 0.45);
      if (reach) s += arc(LAST, ans, GREEN, 2.4, 1, id);
      s += '<path d="M' + (cx(WINDOW_FROM) - CW / 2) + ' ' + (Y + H + 8) + 'v6H' + (cx(LAST) + CW / 2) + 'v-6" fill="none" stroke="' + MUTED + '" stroke-width="1"/>' +
        '<text x="' + (cx(WINDOW_FROM) + cx(LAST)) / 2 + '" y="' + (Y + H + 30) + '" text-anchor="middle" class="seq-note">256-character window · the same glances every time</text>';
    } else {
      for (i = 0; i < LAST; i++) {
        s += '<path d="M' + (cx(i) + 4) + ' ' + (Y - 9) + 'H' + (cx(i + 1) - 6) + '" stroke="' + MUTED + '" stroke-width="1.2" opacity="0.7"/>' +
          '<path d="M' + (cx(i + 1) - 9) + ' ' + (Y - 12) + 'l4 3l-4 3" fill="none" stroke="' + MUTED + '" stroke-width="1.2" opacity="0.7"/>';
      }
      s += '<path d="M' + cx(LAST) + ' ' + (Y + H) + 'v10" stroke="' + GREEN + '" stroke-width="1.5"/>' +
        '<rect x="' + (cx(LAST) + CW / 2 - 236) + '" y="' + (Y + H + 10) + '" width="236" height="24" rx="5" fill="none" stroke="' + GREEN + '" stroke-width="1.2"/>' +
        '<text x="' + (cx(LAST) + CW / 2 - 118) + '" y="' + (Y + H + 26) + '" text-anchor="middle" class="seq-note" style="fill:' + GREEN + '">the notepad: one running summary</text>';
    }

    for (i = 0; i < N; i++) {
      ch = FILLER.charAt(i); stroke = LINE; fill = 'none'; colour = MUTED;
      if (i >= p && i <= ans) { ch = 'KQXM'.charAt(i - p); stroke = CYAN; colour = 'var(--text)'; }
      if (i >= LAST - 3) { ch = 'KQX?'.charAt(i - (LAST - 3)); stroke = i === LAST ? GREEN : CYAN; colour = 'var(--text)'; }
      if (i === ans) { stroke = reach ? GREEN : RED; fill = reach ? 'rgba(0,255,65,0.14)' : 'rgba(255,107,129,0.10)'; }
      s += '<rect x="' + (cx(i) - CW / 2) + '" y="' + Y + '" width="' + CW + '" height="' + H + '" rx="4" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.3"/>' +
        '<text x="' + cx(i) + '" y="' + (Y + 20) + '" text-anchor="middle" class="seq-ch" style="fill:' + colour + '">' + ch + '</text>';
    }
    if (!reach) {
      s += '<text x="' + cx(ans) + '" y="' + (Y - (mode === 'gmlp' ? 10 : 20)) + '" text-anchor="middle" class="seq-note" style="fill:' + RED + '">' +
        (mode === 'gmlp' ? 'outside the window' : 'never looked at again') + '</text>';
    }
    svg.innerHTML = s;
  }

  // the three explainer figures
  root.querySelectorAll('svg[data-arch]').forEach(function (svg) { draw(svg, svg.getAttribute('data-arch'), 9); });

  var demo = $('[data-demo="lookup"]'); if (!demo) return;
  var svg = $('[data-out="lookup"]'), out = $('[data-out="verdict"]');
  var segModel = $('[data-seg="model"]'), segLen = $('[data-seg="length"]');
  var state = { model: 'gru', len: 'short' };
  var WHERE = { short: 11, medium: 7, long: 1 };
  var LEN = { short: '128 characters', medium: '256 characters', long: '2,048 characters' };
  var NAME = { gru: 'minGRU', gmlp: 'gMLP', attn: 'Transformer' };
  var HOW = {
    gru: 'It has only its notepad, and what went on the notepad was decided before the question existed.',
    gmlp: { hit: 'The answer is inside the window, so one of its fixed glances lands on it.', miss: 'The answer is further back than the window reaches.' },
    attn: 'It matches "K Q X" against everything it has read and goes straight to what followed.'
  };
  function result() {
    if (state.model === 'attn') return [true, 'solved (accuracy 0.97 or better at every length)'];
    if (state.model === 'gru') return [false, 'guessing (accuracy about 0.04, the same as chance)'];
    return state.len === 'long' ? [false, 'guessing (accuracy 0.044, the same as chance)'] : [true, 'solved, as well as the Transformer'];
  }
  function render() {
    draw(svg, state.model, WHERE[state.len]);
    var r = result(), how = state.model === 'gmlp' ? HOW.gmlp[r[0] ? 'hit' : 'miss'] : HOW[state.model];
    out.innerHTML = '';
    var b = document.createElement('b'); b.textContent = NAME[state.model] + ' at ' + LEN[state.len] + ': ';
    if (!r[0]) b.style.color = RED;
    out.appendChild(b); out.appendChild(document.createTextNode(r[1] + '. ' + how));
  }
  function wire(seg, key) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); state[key] = b.dataset.v; render();
    });
  }
  wire(segModel, 'model'); wire(segLen, 'len');
  render();
})();

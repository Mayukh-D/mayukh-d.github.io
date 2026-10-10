/* Holograms and demos for /notes/small-data-gpt/. Every size is taken from the report. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }
  function seg(el, onPick) {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      el.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      onPick(b.dataset.v, b);
    });
  }
  function fmt(n) { return n.toLocaleString('en-AU'); }

  /* 1. Tokenizer: the embedding table against everything else, at true proportion.
     Volume stands for parameters: one transformer layer of width d is about 12·d², the table is vocab·d. */
  var c1 = $('[data-holo="tokenizer"]');
  if (c1) {
    var D = 384, LH = 0.2, GAP = 0.06;
    var h1 = Holo.mount(c1, function (st, S) {
      var V = st.tok === 'mistral' ? 32000 : 50257, He = V / (12 * D) * LH;
      // embedding table: one slab, rows sliced so it reads as a lookup table
      S.box(-0.95, He / 2, 0, 0.62, He, 0.62, 'amber', 0.9, Math.round(He / 0.09), 'y');
      S.text([-0.95, He + 0.3, 0], 'embedding table', 'amber', 0.95, 12);
      S.text([-0.95, He + 0.06, 0], fmt(V) + ' × 384', 'amber', 0.7, 10);
      for (var i = 0; i < 7; i++) S.box(0.95, LH / 2 + i * (LH + GAP), 0, 0.62, LH, 0.62, 'cyan', 0.85, 4, 'x');
      var top = 7 * (LH + GAP);
      if (st.tok === 'mistral') {
        for (var j = 0; j < 4; j++) {
          S.box(0.95, top + LH / 2 + j * (LH + GAP), 0, 0.62, LH, 0.62, 'green', 0.45);
        }
        top += 4 * (LH + GAP);
        S.text([0.95, top + 0.2, 0], '~7M freed', 'green', 0.95, 12);
        S.text([0.95, top + 0.04, 0], 'room for ~4 more layers', 'green', 0.7, 10);
      } else {
        S.text([0.95, top + 0.2, 0], '7 transformer layers', 'cyan', 0.95, 12);
        S.text([0.95, top + 0.04, 0], 'everything else: 12.4M', 'cyan', 0.7, 10);
      }
      S.poly([[-1.6, 0, -0.7], [1.6, 0, -0.7], [1.6, 0, 0.7], [-1.6, 0, 0.7]], 'muted', 0.35);
    }, { tok: 'gpt2' });
    var R1 = {
      gpt2: '<b>19.3M</b> of 31.69M parameters (61%) sit in the lookup table. Test perplexity <b>28.62</b>.',
      mistral: 'The table shrinks to <b>12.3M</b>, freeing about 7M for layers that learn. Test perplexity <b>23.71</b>.'
    };
    seg($('[data-seg="tokenizer"]'), function (v) { h1.set({ tok: v }); $('[data-out="tokenizer"]').innerHTML = R1[v]; });
  }

  /* 2. Depth vs width: the four configurations near 31.7M parameters, each layer a slab whose
     face is its width (area ∝ parameters per layer), stacked to its real depth. */
  var CFG = [[7, 384, 25.77, '31.69M'], [11, 336, 25.45, '31.80M'], [16, 296, 25.17, '31.71M'], [20, 272, 25.12, '31.53M']];
  var c2 = $('[data-holo="depth"]');
  if (c2) {
    var h2 = Holo.mount(c2, function (st, S) {
      CFG.forEach(function (c, i) {
        var on = i === st.i, x = (i - 1.5) * 1.55, s = c[1] / 384 * 1.25, col = on ? 'green' : 'cyan', al = on ? 1 : 0.35;
        for (var l = 0; l < c[0]; l++) S.box(x, 0.04 + l * 0.115, 0, s, 0.05, s, col, al);
        S.text([x, c[0] * 0.115 + 0.2, 0], c[0] + ' × ' + c[1], col, on ? 1 : 0.55, on ? 12 : 10);
        S.text([x, -0.22, 0], c[2].toFixed(2), on ? 'green' : 'muted', on ? 1 : 0.6, on ? 13 : 10);
      });
      S.text([-3.3, -0.22, 0], 'PPL', 'muted', 0.6, 10);
    }, { i: 3 }, { pitch: 0.38 });
    var r2 = $('[data-range="depth"]');
    var upd2 = function () {
      var c = CFG[+r2.value];
      h2.set({ i: +r2.value });
      $('[data-out="depth"]').innerHTML = '<b>' + c[0] + ' layers × ' + c[1] + ' wide</b> · ' + c[3] + ' parameters · test perplexity <b>' + c[2].toFixed(2) + '</b>';
    };
    r2.addEventListener('input', upd2); upd2();
  }

  /* 3. One transformer block, rebuilt as each LLaMA component is switched on. */
  var c3 = $('[data-holo="block"]');
  if (c3) {
    var RES = { '': 25.33, rope: 24.69, rms: 25.01, swiglu: 25.62, 'rms+rope': 24.67 };
    var h3 = Holo.mount(c3, function (st, S) {
      var sx = -0.95, bx = 0.35;
      S.line([sx, -1.9, 0], [sx, 2.25, 0], 'pale', 0.7);                       // residual stream
      S.text([sx, 2.4, 0], 'residual stream', 'pale', 0.6, 10);
      if (!st.rope) {                                                            // learned position table
        S.box(sx, -2.05, 0, 0.5, 0.18, 0.5, 'amber', 0.9, 6, 'x');
        S.text([sx + 0.95, -2.05, 0], 'learned positions', 'amber', 0.8, 10);
      }
      function norm(y, label) {
        S.box(bx, y, 0, 0.9, 0.1, 0.5, st.rms ? 'green' : 'cyan', 0.9);
        S.text([bx + 1.25, y, 0], st.rms ? 'RMSNorm' : 'LayerNorm', st.rms ? 'green' : 'cyan', 0.85, 10);
        S.line([sx, y - 0.22, 0], [bx - 0.45, y - 0.22, 0], 'pale', 0.5); S.line([bx - 0.45, y - 0.22, 0], [bx - 0.45, y - 0.05, 0], 'pale', 0.5);
      }
      function add(y) { S.ring(sx, y, 0, 0.08, 'xy', 'pale', 0.9, 16); S.line([sx - 0.05, y, 0], [sx + 0.05, y, 0], 'pale', 0.9); S.line([sx, y - 0.05, 0], [sx, y + 0.05, 0], 'pale', 0.9); }
      norm(-1.45);
      // attention: 8 heads as slices; q, k, v enter from below
      S.box(bx, -0.6, 0, 1.2, 0.5, 0.6, 'cyan', 0.95, 8, 'z');
      S.text([bx + 1.45, -0.6, 0], 'attention · 8 heads', 'cyan', 0.85, 10);
      ['q', 'k', 'v'].forEach(function (n, i) {
        var x = bx - 0.4 + i * 0.4;
        S.line([x, -1.4, 0], [x, -0.85, 0], 'cyan', 0.7);
        if (st.rope && n !== 'v') { S.ring(x, -1.12, 0, 0.1, 'xz', 'amber', 1, 18); S.ring(x, -1.12, 0, 0.1, 'xy', 'amber', 0.6, 18); }
      });
      if (st.rope) S.text([bx + 1.35, -1.12, 0], 'RoPE rotates q, k', 'amber', 0.85, 10);
      S.line([bx - 0.6, -0.6, 0], [sx, -0.6, 0], 'cyan', 0.6); add(-0.6);
      norm(0.15);
      // feed-forward: d -> 4d -> d, or SwiGLU's two parallel up-projections joined by a gate
      if (st.swiglu) {
        S.box(bx - 0.35, 0.75, 0, 0.6, 0.35, 0.9, 'red', 0.9, 4, 'z'); S.box(bx + 0.35, 0.75, 0, 0.6, 0.35, 0.9, 'red', 0.9, 4, 'z');
        S.text([bx + 1.45, 0.75, 0], 'SwiGLU: gate × value', 'red', 0.85, 10);
        S.ring(bx, 1.22, 0, 0.08, 'xy', 'red', 1, 14);
        S.line([bx - 0.35, 0.93, 0], [bx - 0.06, 1.17, 0], 'red', 0.7); S.line([bx + 0.35, 0.93, 0], [bx + 0.06, 1.17, 0], 'red', 0.7);
      } else {
        S.box(bx, 0.8, 0, 1.3, 0.45, 1.0, 'cyan', 0.85, 6, 'z');
        S.text([bx + 1.45, 0.8, 0], 'MLP · GELU', 'cyan', 0.85, 10);
      }
      S.box(bx, 1.65, 0, 0.9, 0.18, 0.5, 'cyan', 0.85);                             // down-projection back to d
      S.line([bx - 0.45, 1.65, 0], [sx, 1.65, 0], 'cyan', 0.6); add(1.65);
    }, { rope: false, rms: false, swiglu: false }, { pitch: 0.22, yaw: -0.35 });
    var picks = $('[data-seg="block"]');
    picks.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      b.classList.toggle('on');
      var on = {}; picks.querySelectorAll('button.on').forEach(function (x) { on[x.dataset.v] = true; });
      h3.set({ rope: !!on.rope, rms: !!on.rms, swiglu: !!on.swiglu });
      var key = Object.keys(on).sort().join('+'), p = RES[key];
      $('[data-out="block"]').innerHTML = p == null
        ? 'This combination was not trained. Measured runs: each component alone, and RoPE with RMSNorm.'
        : 'Test perplexity <b>' + p.toFixed(2) + '</b>' + (key ? ' (baseline 25.33)' : ' · the baseline') + (key === 'swiglu' ? ', and it diverged after 6,500 steps.' : '');
    });
  }

  /* 4. Data strategies as towers of test perplexity, against the score each one had to beat. */
  var c4 = $('[data-holo="data"]');
  if (c4) {
    var G = [
      { base: 28.62, name: 'adding data', items: [['+2k synthetic', 30.35, 'red'], ['+20k synthetic', 30.16, 'red'], ['TinyStories first', 53.26, 'red']] },
      { base: 25.33, name: 'fine-tuning', items: [['Gemini stories', 27.16, 'amber'], ['quality-filtered', 24.92, 'green']] }
    ];
    var hgt = function (p) { return Math.min(p - 20, 13) * 0.17; };
    Holo.mount(c4, function (st, S) {
      var x = -3.2;
      G.forEach(function (g, gi) {
        var x0 = x - 0.5, n = g.items.length, x1 = x + (n - 1) * 1.45 + 0.5, hb = hgt(g.base);
        S.poly([[x0, hb, -0.5], [x1, hb, -0.5], [x1, hb, 0.5], [x0, hb, 0.5]], 'pale', 0.55);
        S.text([x0 - 0.25, hb, 0], g.base.toFixed(2), 'pale', 0.7, 10);
        S.text([(x0 + x1) / 2, -0.32, 0], g.name, 'muted', 0.8, 10);
        g.items.forEach(function (it) {
          var h = hgt(it[1]);
          S.box(x, h / 2, 0, 0.5, h, 0.5, it[2], 0.95, Math.max(1, Math.round(h / 0.17)), 'y');
          if (it[1] - 20 > 13) { S.line([x - 0.32, h + 0.04, 0], [x + 0.32, h + 0.14, 0], 'red', 1); S.line([x - 0.32, h + 0.14, 0], [x + 0.32, h + 0.24, 0], 'red', 1); }
          S.text([x, h + (it[1] - 20 > 13 ? 0.42 : 0.2), 0], it[1].toFixed(2), it[2], 1, 11);
          S.text([x, h + (it[1] - 20 > 13 ? 0.62 : 0.4), 0], it[0], it[2], 0.65, 9);
          x += 1.45;
        });
        x += 0.8;
      });
    }, {}, { pitch: 0.28, yaw: -0.25, spin: 0.12 });
  }

  /* 5. The two finalists: the submitted model and the one that wrote better stories. */
  var c5 = $('[data-holo="final"]');
  if (c5) {
    Holo.mount(c5, function (st, S) {
      [[-0.95, 256, '24.67', 'lower perplexity', 'cyan'], [0.95, 272, '24.84', 'better stories', 'green']].forEach(function (m) {
        var s = m[1] / 384 * 1.25;
        for (var l = 0; l < 20; l++) S.box(m[0], 0.04 + l * 0.115, 0, s, 0.05, s, m[4], 0.9);
        S.text([m[0], 20 * 0.115 + 0.38, 0], m[3], m[4], 1, 12);
        S.text([m[0], 20 * 0.115 + 0.18, 0], '20 × ' + m[1] + ' · PPL ' + m[2], m[4], 0.7, 10);
      });
    }, {}, { pitch: 0.3 });
  }

  /* Real samples from the submitted model at three temperatures (report, Appendix 9). */
  var STORIES = {
    '0.6': ["She wanted to bake a cake. Sarah went to the store to buy the cake. Sarah picked out a cake that she really liked. Sarah got the cake for her friend's birthday.",
            "She drove to the store and bought all the ingredients. Sarah then went home to bake the cake. She was excited to bake the cake. Sarah baked the cake and it was delicious."],
    '0.65': ["She wanted to bake a cake. Sarah went to the store to buy the cake. Sarah picked out a cake that she really liked. Sarah got the cake for her friend's birthday.",
             "She drove to the store and bought all the ingredients. Sarah then went home to bake the cake. She was pleased to see it was ready to be baked. She served the cake to her friend at the party."],
    '0.8': ["She wanted some chocolate but her mom was out of town so she called her mom. Her mom made her a pumpkin cake and put it in the oven. She looked at the pie and she found the crust. Sarah was glad she made the cake and she ate it.",
            "Sarah gathered all the ingredients together and made a cake. Sarah baked the cake and served it to her friend. The friend loved the cake and ate the cake. Sarah didn't feel so bad that she ate the cake."]
  };
  var NOTE = { '0.6': 'Too safe: near-identical stories every time.', '0.65': 'The setting I used: structured, with a real ending.', '0.8': 'Livelier, but details stop agreeing (the cake becomes a pie).' };
  var sOut = $('[data-out="stories"]');
  if (sOut) {
    var show = function (t) {
      sOut.innerHTML = STORIES[t].map(function (s) { return '<p class="story"><mark>Sarah wanted to bake a cake for her friend\'s birthday.</mark> ' + s + '</p>'; }).join('') +
        '<p class="demo-note">' + NOTE[t] + '</p>';
    };
    seg($('[data-seg="stories"]'), show); show('0.65');
  }

  var live = $('[data-live]');
  if (live) live.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://mayukh1999-nanogpt-story-generator.hf.space/';
    f.title = 'nanoGPT story generator'; f.loading = 'lazy';
    f.style.cssText = 'width:100%;height:640px;border:1px solid var(--border);border-radius:8px;background:#fff';
    live.replaceWith(f);
  });
})();

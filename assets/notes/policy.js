/* Demo for /notes/one-ai-policy/.
   Apply one rule to five courses and see where it fits. The verdicts are the author's own
   illustration of the note's argument, built from its examples. They are not ANU policy. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }
  var demo = $('[data-demo="policy"]'); if (!demo) return;

  // per course: [fits under a ban, what a ban does] [fits under allow-all, what that does] [what the convener would set]
  var COURSES = [
    ['Foreign policy reflection',
      [true, 'Fits. The reflection is the skill, so it has to be the student\'s own.'],
      [false, 'Breaks. The thinking being assessed can be handed to a machine.'],
      'No AI. The thinking is the point.'],
    ['Art',
      [true, 'Fits. The making is the point.'],
      [false, 'Breaks. The work stops being the student\'s.'],
      'No AI. The making is the point.'],
    ['Introductory programming',
      [false, 'Half right. Code is written by hand, but AI is lost for documentation too.'],
      [false, 'Breaks. Students never build the foundation the course exists to teach.'],
      'AI for documentation, not for writing the code.'],
    ['Systems engineering',
      [false, 'Breaks. Research and implementation that could be fast-tracked are done the slow way.'],
      [true, 'Fits, as long as the decisions stay with the student.'],
      'AI for research and implementation. The decisions are human.'],
    ['Deep learning',
      [false, 'Breaks. Graduates meet these tools on day one of the job, untrained.'],
      [true, 'Fits, as long as the decisions stay with the student.'],
      'AI for research and implementation. The decisions are human.']
  ];
  var RULES = { ban: 0, allow: 1, convener: 2 };
  var LABEL = { ban: 'Ban AI everywhere', allow: 'Allow AI for everything', convener: 'Let each convener decide' };

  var body = $('[data-out="courses"]'), out = $('[data-out="score"]'), seg = $('[data-seg="policy"]');

  function render(rule) {
    var fits = 0;
    body.innerHTML = '';
    COURSES.forEach(function (c) {
      var ok, text;
      if (rule === 'convener') { ok = true; text = c[3]; } else { ok = c[RULES[rule] + 1][0]; text = c[RULES[rule] + 1][1]; }
      if (ok) fits++;
      var tr = document.createElement('tr'), name = document.createElement('td'), verdict = document.createElement('td');
      var b = document.createElement('b'); b.textContent = c[0]; name.appendChild(b);
      verdict.textContent = text; verdict.className = ok ? 'ok' : 'bad';
      tr.appendChild(name); tr.appendChild(verdict); body.appendChild(tr);
    });
    out.innerHTML = '';
    var lead = document.createElement('b'); lead.textContent = LABEL[rule] + ': ';
    out.appendChild(lead);
    out.appendChild(document.createTextNode('fits ' + fits + ' of ' + COURSES.length + ' courses.'));
  }

  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on'); render(b.dataset.v);
  });
  render('ban');
})();

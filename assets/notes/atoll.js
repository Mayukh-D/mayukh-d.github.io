/* Demo for /notes/agent-atoll/.
   Walks one piece of work through the team, one hand-off per step. The steps restate the note's
   own description of each role; it is an illustration, not a log of a real run. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  function $(s) { return root.querySelector(s); }
  var demo = $('[data-demo="team"]'); if (!demo) return;

  var ROWS = [
    ['in charge', [['me', 'me'], ['orchestrator', 'orchestrator']]],
    ['delivery loop', [['coder', 'coder'], ['checker', 'checker'], ['evaluator', 'evaluator'], ['claim', 'claim-validator'], ['git', 'git-keeper']]],
    ['debate team', [['proposer', 'proposer'], ['optimist', 'optimist'], ['pessimist', 'pessimist'], ['realist', 'realist']]],
    ['oversight', [['challenger', 'challenger'], ['record', 'record-keeper'], ['adjudicator', 'adjudicator']]],
    ['no AI', [['gpu', 'GPU script'], ['hooks', 'hooks']]]
  ];

  // each step: [ids that light up, who, what happens]
  var PATHS = {
    experiment: [
      [['orchestrator'], 'Orchestrator', 'plans one task and writes a precise spec. It never writes the experiment code itself.'],
      [['challenger'], 'Review', 'other agents review the plan before it runs, so the orchestrator never approves its own work. The challenger attacks the big decisions.'],
      [['coder'], 'Coder', 'implements that one task from the spec.'],
      [['checker'], 'Checker', 'gets the same spec but not the coder\'s report, so it can\'t be talked into agreeing.'],
      [['hooks', 'gpu'], 'GPU script', 'a hook refuses any launch that doesn\'t name a signed plan. Then the script runs the trial, scores it with a fixed calculator and queues the next one.'],
      [['evaluator'], 'Evaluator', 'judges the results against the acceptance criteria. Its verdict is the only one that counts.'],
      [['claim'], 'Claim-validator', 'traces every sentence in the write-up back to a result file before it is published.'],
      [['git'], 'Git-keeper', 'pushes. It is the only one that can.'],
      [['record'], 'Record-keeper', 'brings every document back in line with the new result.']
    ],
    idea: [
      [['proposer'], 'Proposer', 'pitches ideas.'],
      [['optimist', 'pessimist'], 'Optimist and pessimist', 'argue for and against each idea, independently of each other.'],
      [['realist'], 'Realist', 'turns the argument into a ranked shortlist, with success thresholds set before any data exists.'],
      [['orchestrator'], 'Orchestrator', 'turns the top of the shortlist into a plan.'],
      [['challenger'], 'Challenger', 'attacks the plan before it is adopted.'],
      [['me'], 'Me', 'I only see it if it changes the protocol or the challenger objects strongly. Then I get one recommendation, never a menu.']
    ],
    breach: [
      [['gpu'], 'The breach', 'the GPU sits idle overnight because nothing was queued after the last job. Every agent knew the rule.'],
      [['me'], 'Me', 'I log it. It shows in red on the rulebook page until it is fixed.'],
      [['adjudicator'], 'Adjudicator', 'audits every decision once a week and reports to me, not to the orchestrator.'],
      [['orchestrator'], 'Orchestrator', 'writing the rule more firmly changes nothing. An agent deep in one task still forgets a rule about another.'],
      [['hooks', 'gpu'], 'Code', 'the rule becomes code: the GPU script queues its own next trial, so there is no hand-off to forget.'],
      [['record'], 'Rulebook', 'the rule is now marked as enforced by code. The text-only ones are the ones I watch.']
    ]
  };

  var board = $('[data-out="team"]'), out = $('[data-out="step"]');
  var slider = demo.querySelector('[data-k="step"]'), count = slider.parentNode.querySelector('output');
  var seg = $('[data-seg="team"]'), chips = {}, path = PATHS.experiment;

  ROWS.forEach(function (row) {
    var line = document.createElement('div'); line.className = 'team-row';
    var tag = document.createElement('span'); tag.className = 'team-tag'; tag.textContent = row[0];
    line.appendChild(tag);
    row[1].forEach(function (a) {
      var chip = document.createElement('span'); chip.className = 'chip'; chip.textContent = a[1];
      chips[a[0]] = chip; line.appendChild(chip);
    });
    board.appendChild(line);
  });

  function render() {
    var n = +slider.value, k;
    for (k in chips) chips[k].className = 'chip';
    path.slice(0, n - 1).forEach(function (s) { s[0].forEach(function (id) { chips[id].className = 'chip seen'; }); });
    var step = path[n - 1];
    step[0].forEach(function (id) { chips[id].className = 'chip on'; });
    count.textContent = n + ' / ' + path.length;
    out.innerHTML = '<b></b> ';
    out.firstChild.textContent = step[1] + ':';
    out.appendChild(document.createTextNode(step[2]));
  }

  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    path = PATHS[b.dataset.v]; slider.max = path.length; slider.value = 1; render();
  });
  slider.addEventListener('input', render);
  render();
})();

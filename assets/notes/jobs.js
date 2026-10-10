/* The road on /jobs/: tap a stop for the role and what it taught, then jump to its section. */
(function () {
  var root = (document.currentScript && document.currentScript.closest('main')) || document;
  var out = root.querySelector('[data-out="stop"]'); if (!out) return;
  var S = {
    manipal: ['B.Tech, Automobile Engineering', 'Manipal Institute of Technology · 2017 to 2021', 'Engineering on the mechanical side, with code on the side since high school. Projects and internships carried me towards computer science.', 'structural thinking, and how to adapt', 'manipal'],
    cognizant: ['Programmer Analyst', 'Cognizant · Oct 2021 to Jan 2022', 'First job, straight out of college: full-stack .NET and React, including a hospital logistics system for COVID-19 operations.', 'the switch into software was real', 'cognizant'],
    accenture: ['Advanced Application Engineering Analyst', 'Accenture · Jan 2022 to Feb 2025', 'Trained as a data engineer, then built the MLOps pipelines behind Ingrain, an AIOps tool, in a real production team.', 'data and pipeline design, and how real ML work runs', 'accenture'],
    anu: ['Master of Computing · Student Ambassador', 'Australian National University · 2025 to now', 'Going deeper into the foundations, and representing the College of Systems and Society to prospective students at recruitment events and school visits.', 'talk at their level: leave them with a sparkle, not a frown of worry', 'anu'],
    eccoi: ['ML Architect', 'Eccoi · Jul 2026 to now', 'Systems engineering for sovereign AI: architectural principles, the system context, platform choices, and an end-to-end proof.', 'owning what gets built', 'eccoi'],
    haizea: ['Satellite AI Research Trainee', 'Haizea Analytics · Sep 2026 to now', 'Deep learning on satellite imagery, mapping Australia\'s tree canopy.', 'owning what gets built', 'eccoi']
  };
  var stops = root.querySelectorAll('.stop');
  function show(k) {
    var s = S[k];
    stops.forEach(function (b) { b.classList.toggle('on', b.dataset.stop === k); });
    out.style.setProperty('--c', ['anu', 'eccoi', 'haizea'].indexOf(k) >= 0 ? 'var(--green)' : 'var(--cyan)');
    out.innerHTML = '<h3>' + s[0] + '</h3><div class="when">' + s[1] + '</div><p>' + s[2] + '</p>' +
      (s[3] ? '<div class="lesson">' + s[3] + '</div>' : '') +
      '<p style="margin-top:10px"><a href="#' + s[4] + '" data-jump="' + s[4] + '">read the story ↓</a></p>';
  }
  stops.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.stop); }); });
  out.addEventListener('click', function (e) {
    var a = e.target.closest('[data-jump]'); if (!a) return;
    e.preventDefault();
    var t = root.querySelector('#' + a.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  show('manipal');
})();

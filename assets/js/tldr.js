/* tldr.js
 tl;dr dialog (#tldr): each research card's short version, taken from the project's own report.
 Defines (global): TLDR (the content). Exposes: window.openTldr(key).
*/

// tl;dr: each research card's short version. Everything here comes from the
// project's own report; the full PDF is one click away.
const TLDR = {
  transformers: {
    video: ['OvVEqdIfFJs', 'The 5-minute presentation.'],
    title: "Transformers' Revenge", file: 'transformers-revenge',
    q: 'minGRU reportedly matches Transformers on language modelling ("Were RNNs All We Needed?"). Does that hold once the task needs real algorithmic reasoning?',
    setup: '~750-800K-parameter models, 4 layers each, identical optimiser and schedule. 3 models (minGRU, a causal gMLP we adapted, a LLaMA-recipe Transformer) × 3 tasks (language modelling, verbatim copy, induction) × 3 sequence lengths = 27 runs, with predictions written down before running.',
    findings: [
      '<b>minGRU cannot retrieve by content.</b> Induction accuracy stays at chance (~0.04) at every length: its input-only gating rules it out by construction.',
      '<b>The causal gMLP works inside its fixed spatial window</b> and fails beyond it.',
      '<b>Only the Transformer solves induction at every length</b> (0.97-1.00).',
      '<b>A phase transition:</b> on long induction the Transformer sits at chance for ~7,000 steps, then jumps to perfect between 8,000 and 10,000, consistent with circuit formation.'
    ],
    figs: [['assets/tldr/transformers-grid.jpg', 'All 27 runs. Green passes, red fails.'],
           ['assets/tldr/transformers-phase.jpg', 'The phase transition: 0.04 to 1.0 in about 2,000 steps.']],
    role: 'Team of four, with Vibhansh Gupta, Daniel Vaz and Adam Clark. I implemented the Transformer, designed the experiment grid and comparison framework, and wrote the report.',
    next: 'Train long copy past 5,000 steps to see whether the same phase transition appears there, and add seeds to separate real gaps from single-seed noise.',
    links: [['full report (PDF)', 'assets/reports/transformers-revenge.pdf'], ['code', 'https://github.com/Mayukh-D/Deep-Learning-Transformers-Revenge']]
  },
  nanogpt: {
    title: 'GPT from Scratch (nanoGPT)', file: 'nanogpt',
    q: 'How far can a 30M-parameter GPT get on 3.7M tokens of stories, roughly 160 times less data than Chinchilla scaling suggests for its size?',
    setup: 'A decoder-only GPT trained from scratch on ROCStories, changing one thing at a time against a fixed baseline, on a single L4 GPU.',
    findings: [
      '<b>The tokenizer was the biggest lever.</b> Mistral\'s 32k vocabulary cut perplexity from 28.62 to 23.71 by freeing ~7M parameters from the embedding table (a research finding; the graded evaluation required GPT-2 tokens).',
      '<b>Depth beat width</b> at matched parameter count (16 layers beat 11 by 0.28 PPL), unlike the neutral result at large scale.',
      '<b>Only two of three LLaMA components transfer to small data:</b> RoPE and RMSNorm helped, SwiGLU hurt, because its gates need more data to learn.',
      '<b>Distribution match beat data quantity:</b> TinyStories pretraining and synthetic stories both hurt; only quality-filtering ROCStories itself helped.',
      '<b>Perplexity is not quality:</b> a 24.84 model wrote better stories than the 24.67 winner.'
    ],
    table: [['baseline (GPT-2 tokens)', '25.33', ''], ['+ RoPE', '24.69', 'good'], ['+ RMSNorm', '25.01', 'good'], ['+ SwiGLU', '25.62', 'bad'], ['+ RoPE + RMSNorm (final)', '24.67', 'good']],
    tableCaption: 'Test perplexity, one change at a time (lower is better).',
    role: 'Solo: built, trained and ablated every variant, then added DPO fine-tuning in the repo.',
    links: [['full report (PDF)', 'assets/reports/nanogpt-report.pdf'], ['live demo (sleeps when unused: allow a minute to wake)', 'https://huggingface.co/spaces/Mayukh1999/nanogpt-story-generator'], ['code', 'https://github.com/Mayukh-D/story-generation-nanoGPT']]
  },
  flow: {
    title: 'Image Generation with Machine Learning', file: 'flow-matching',
    q: 'In flow matching, should the network predict the clean data (x) or the velocity (v)? And does the answer change as the data dimension grows?',
    setup: 'A 5-layer MLP on swiss roll, Gaussian mixture and circles, projected into D = 2, 8 and 32, across all four prediction/loss combinations. Then MeanFlow for few-step generation.',
    findings: [
      '<b>At D = 32, x-prediction still generates clean structure;</b> both v-prediction setups collapse into noise.',
      '<b>Why:</b> the clean data stays on a simple 2D manifold, while the velocity target scales with the full ambient dimension.',
      '<b>Not fundamental:</b> widening the network to 1024 rescues v-prediction, at ~16 times the parameters (330K to 5.2M).',
      '<b>MeanFlow</b> (one-step generation via Jacobian-vector products) handles manifold data in a single step but struggles on multi-modal data, and the paper\'s logit-normal sampler made that worse here.'
    ],
    figs: [['assets/tldr/flow-d32.jpg', 'D = 32. Columns: x-pred/x-loss, x-pred/v-loss, v-pred/v-loss, v-pred/x-loss.']],
    role: 'Solo: designed, implemented and evaluated every parameterisation, plus MeanFlow.',
    next: 'Recipes from large-scale work are tuned for failure modes that may not exist at small scale; the next step is checking where the crossover sits as models and data grow.',
    links: [['full report (PDF)', 'assets/reports/flow-matching-report.pdf'], ['code', 'https://github.com/Mayukh-D/image-generation-with-machine-learning']]
  },
  foodlens: {
    video: ['xmpeI2wWs6M', 'The research presentation: phone vs AR glasses.'],
    title: 'FoodLens · Smart Food Scanner', file: 'foodlens',
    q: 'Can information shown at the moment of purchase nudge people toward safer, less wasteful shopping, and does a hands-free wearable do it better than a phone?',
    setup: 'A phone-first PWA: scan a barcode, and allergens matched to your own profile, an expiry timeline against how fast you actually finish things, and a carbon band appear as an overlay. The same app runs in a hands-free glasses mode with voice and haptic alerts, logging every interaction for a within-subjects study (5 participants, phone vs glasses).',
    findings: [
      '<b>Tangible outcomes beat abstract ones:</b> food waste moved behaviour more than carbon footprint.',
      '<b>The glasses scored higher on usability</b> but ran into social acceptability barriers.',
      '<b>Allergen and additive information</b> was the most behaviourally influential feature.',
      '<b>Personal beats generic:</b> expiry estimates switch from a population average to your own measured pace once you log what was left.'
    ],
    figs: [[['assets/tldr/foodlens-scan.jpg', 'assets/tldr/foodlens-product.jpg', 'assets/tldr/foodlens-insights.jpg'], 'Scan, the product overlay with an allergen alert and freshness timeline, and carbon milestones.'],
           ['assets/tldr/foodlens-sus.jpg', 'System Usability Scale across 10 items (n = 5).']],
    role: 'Solo: designed, built and deployed the app, ran the study, and analysed it, for the ANU HCI final project. Graded HD.',
    links: [['live demo (first load can take ~30s)', 'https://foodlens-f281.onrender.com'], ['code', 'https://github.com/Mayukh-D/foodlens-ar-sustainable-shopping']]
  },
  hci: {
    video: ['sdzHHno41x4', 'The macaw smartwatch, a paper prototype walkthrough.'],
    title: 'HCI Design & Research', file: 'hci-design-and-research',
    q: 'Three projects across the full HCI pipeline: ideation and prototyping, user research with real participants, and the design and evaluation of a novel interactive system.',
    setup: 'ANU Human-Computer Interaction (2025). Each project combines quantitative and qualitative methods. Raw participant data has been removed from the repository to protect the students who took part; methods and aggregated findings remain.',
    findings: [
      '<b>Prototyping:</b> a fitness tracker for macaws. Touchscreens fail for beaks and navigation happens in 3D flight, so the design uses voice and physical buttons, aerial overlays and species-specific health telemetry on an ankle band.',
      '<b>User research (5 participants)</b> on an AI meal-photo calorie tracker: people expected near-perfect accuracy, trust dropped sharply after the first failed scan and did not recover, and speed over manual entry best predicted intent to keep using it.',
      '<b>Final project:</b> FoodLens, evaluated phone vs AR glasses within subjects, with structured observation, interviews and SUS scoring.'
    ],
    figs: [['assets/tldr/hci-watch.jpg', 'The macaw smartwatch, as a paper prototype.'],
           ['assets/tldr/hci-violin.jpg', 'User research: experienced vs new users across satisfaction, intent and perceived accuracy.']],
    role: 'Solo across all three projects. Graded HD.',
    links: [['code and write-ups', 'https://github.com/Mayukh-D/hci-design-and-research']]
  },
  yuma: {
    video: ['8i9f6ksx3xQ', 'The Hackathon 2 demo by team Dreamers.'],
    title: 'Yuma Social Platform', file: 'yuma',
    q: 'Turn a Java moderation backend from an earlier hackathon into a native Android social app, without breaking its models.',
    setup: 'A five-person team hackathon at ANU. Login with member and admin roles, a searchable post feed, reactions, pinned messages, direct messages with sorted inboxes, and admin moderation, all persisted across restarts.',
    findings: [
      '<b>Consistent patterns throughout:</b> Singletons for the data stores and session, Factories for every sort strategy, and Iterators for every query.',
      '<b>Open for extension, closed for modification:</b> reactions and pins live in their own stores keyed by message ID, so the core Message model is untouched.',
      '<b>Found and fixed a silent bug</b> from the first hackathon: moderation calls always failed at runtime because the message store was never populated outside tests.'
    ],
    figs: [[['assets/tldr/yuma-login.jpg', 'assets/tldr/yuma-architecture.svg'], 'The sign-in screen, and the layers underneath it.', 'app']],
    role: 'Team of five. I built the entire Android frontend, and on the backend the initial skeleton and its design patterns, including the Iterator-based queries. Graded HD.',
    links: [['code', 'https://github.com/Mayukh-D/yuma-social-platform']]
  },
  tokeneater: {
    title: 'TokenEater · Multi-Account', file: 'tokeneater',
    q: 'TokenEater, an open-source macOS menu bar app, tracks one Claude account. I use two, personal and work, so I made it track both side by side.',
    setup: 'A native SwiftUI and AppKit app. Each account gets its own usage store and appears everywhere the first does: menu bar, popover, dashboard and Studio.',
    findings: [
      '<b>Went upstream as pull request #284.</b> The maintainer kept my per-account usage store, the dashboard column and the Keychain token reader, then rebuilt the setup on my commits so it handles any number of accounts. The 6.1 beta\'s release notes credit us both.',
      '<b>A second fix shipped:</b> pull request #292, extra credits showing 0% on organisation seats with no monthly limit. Merged, and ships in 6.1, out now as a beta.',
      '<b>Before it lands, there\'s my fork,</b> with its own app identity so the official updater never overwrites it, and a red warning pointing people to the official app.',
      '<b>Kept the project\'s rules:</b> unit tests and the repository\'s own documentation checks pass before every push.'
    ],
    figs: [['assets/tldr/tokeneater-dashboard.jpg', 'The dashboard with both Claude accounts side by side (organisation names blurred).'], ['assets/tldr/tokeneater-athevon.jpg', 'AThevon asking me to test the beta built on my commits.']],
    role: 'Designed and built multi-account support and the fork build; the maintainer rebuilt it upstream on my commits.',
    links: [['pull request #284', 'https://github.com/AThevon/TokenEater/pull/284'], ['official app', 'https://github.com/AThevon/TokenEater/releases'], ['fork', 'https://github.com/Mayukh-D/TokenEater']]
  },
  lantern: {
    demo: 'lantern',
    video: ['/lantern/images/demo.mp4', 'The bar following the screen.', '/lantern/images/demo-poster.jpg', '540 / 1024'],
    title: 'Lantern · Screen Sync for a A$49 Light', file: 'lantern',
    q: 'Philips Hue can sync lights to your screen, for about A$550 in Australia. Can a A$49 Bluetooth LED bar do the same job?',
    setup: 'The bar only came with a phone app and a remote. I worked out the commands it understands over Bluetooth, then built a native macOS menu bar app in SwiftUI that reads a tiny copy of the screen 30 times a second and sends the dominant colour to the light.',
    findings: [
      '<b>Undocumented protocol, decoded:</b> colour, brightness and power commands, plus the bar\'s own effects, found by sweeping effect codes and watching the light.',
      '<b>Screens and LEDs mix colour differently:</b> screen colours look washed out on LEDs. A calibration tool showed that a strong gamma curve mattered far more than extra saturation.',
      '<b>A rule for dark scenes:</b> black, greys and colours compete by how much of the screen each covers, and a strong colour still beats a mostly black screen.',
      '<b>Shipped properly:</b> colour wheel, warmth scale, effects, an eyedropper, a website, a demo video and a downloadable release.'
    ],
    figs: [['assets/tldr/lantern-hero.jpg', 'Same bar, six screens: the light follows what covers the most of the display.']],
    role: 'Solo: reverse-engineered the light, designed and built the app, and published it.',
    links: [['website and video', 'https://mayukhdas.com/lantern/'], ['download', 'https://github.com/Mayukh-D/lantern/releases/latest'], ['code', 'https://github.com/Mayukh-D/lantern']]
  },
  'linkedin-poster': {
    title: 'linkedin-poster-mcp · Post from Claude', file: 'linkedin-poster-mcp',
    q: 'I already drafted my LinkedIn posts with Claude. Why copy them across by hand, and why did the photos keep going missing?',
    setup: 'The tools I tried could either read LinkedIn but not post, or post but quietly drop images. So I wrote a small MCP server, one Python file, that uses LinkedIn\'s official API and runs on my own machine.',
    findings: [
      '<b>Real photos, not link previews:</b> images go through LinkedIn\'s Images API and attach natively, up to 20 per post, with alt text.',
      '<b>Pages, hashtags and reposts:</b> company and school Pages become live tags, #words become real hashtags, and other people\'s posts can be reposted with commentary.',
      '<b>Honest limits:</b> LinkedIn only lets an app tag a person after that person signs in to it, so people are tagged by hand; sign-ins last 60 days.',
      '<b>Built to wait for a yes:</b> the tools tell the model to get explicit approval of the exact words and photos before posting or deleting anything.'
    ],
    figs: [['assets/tldr/linkedin-poster.jpg', 'Draft, review against three simulated hiring managers, then post: all from the terminal.']],
    role: 'Solo: designed and built it, and released it as open source.',
    links: [['install', 'https://github.com/Mayukh-D/linkedin-poster-mcp#install'], ['the 1 AM note', '/notes/post-from-the-terminal/'], ['code', 'https://github.com/Mayukh-D/linkedin-poster-mcp']]
  },
  'siteviews': {
    title: 'SiteViews · Views in the Menu Bar', file: 'siteviews',
    q: 'I added analytics to this site, then kept opening the dashboard every hour to see if anyone had read a new post. Could the number just sit in my menu bar?',
    setup: 'A native SwiftUI menu bar app. It asks Cloudflare\'s GraphQL Analytics API for this site\'s page views, one week at a time, and shows the running total next to an eye icon.',
    findings: [
      '<b>A total that keeps counting:</b> Cloudflare keeps about six months of data, so each finished week is saved on the Mac and the all-time total never shrinks.',
      '<b>Setup that catches mistakes:</b> Cloudflare calls two different things a token. The app recognises a pasted analytics snippet, checks the real token with Cloudflare, and only then saves it.',
      '<b>Private by design:</b> the analytics use no cookies, and the read-only token stays in a file only my account can read.'
    ],
    figs: [['assets/tldr/siteviews.jpg', 'The count in the menu bar, with the panel open.']],
    role: 'Solo: designed and built it, and released it as open source.',
    links: [['download', 'https://github.com/Mayukh-D/siteviews/releases/latest'], ['code', 'https://github.com/Mayukh-D/siteviews']]
  },
  website: {
    title: 'This Website', file: 'website',
    q: 'Can a portfolio be a small product in its own right, and not just a list of links?',
    setup: 'Plain HTML, CSS and JavaScript on GitHub Pages: no framework and no build step. One Cloudflare Worker runs the chatbot. I designed it and directed every decision; Claude Code wrote the code with me.',
    findings: [
      '<b>An AI that only knows what the pages say:</b> the chatbot\'s knowledge is rebuilt from the site itself on every deploy, so it cannot claim anything the site does not.',
      '<b>A hero that tracks your scroll:</b> the WELCOME push is tied to the scroll position by the browser, and the word is drawn once at full size so it never redraws mid-scroll. Checked by measuring it, not by eye.',
      '<b>Pages that swing in:</b> the stories behind my projects, research and jobs open from the screen edge, and each is also a real address you can share.',
      '<b>Write-ups you can play with:</b> every 1 AM note carries something interactive, including a real recorded run of a game.'
    ],
    figs: [['assets/tldr/website-hero.jpg', 'The front page: profiles fanned on the left, stories on the right.']],
    role: 'Designed it and directed every decision; built with Claude Code.',
    links: [['1 AM notes', '/notes/'], ['code', 'https://github.com/Mayukh-D/mayukh-d.github.io']]
  },
  growthscope: {
    title: 'GrowthScope · First Hackathon', file: 'growthscope',
    q: 'My first hackathon and first vibe-coded app (ANU, 2025): sales analytics for Australian small businesses. A year later, how good was it really?',
    setup: 'Built in a weekend by a team of four. Revisited in 2026 with tests, a check that has to pass before every push, and an honest look at every page.',
    findings: [
      '<b>It analysed only 41% of its own demo data:</b> Australian day-first dates were silently dropped. Now it reads all of it.',
      '<b>Security holes, fixed:</b> an API key in the source (scrubbed from history), an open redirect, and a route that let any visitor overwrite the login page.',
      '<b>Four new features:</b> a revenue forecast that reports its own error, unusual-day detection with no false alarms on random data, flexible column mapping, and CSV reports.'
    ],
    figs: [['assets/tldr/growthscope-forecast.jpg', 'The revenue forecast, scored on the three months it did not see.']],
    role: 'Hackathon team of four; the 2026 rebuild is mine. Kept on purpose as a benchmark of where I started.',
    links: [['live demo (first load can take ~30s)', 'https://growthscope-j85i.onrender.com'], ['code', 'https://github.com/Mayukh-D/GrowthScope']]
  }
};
(() => {
  const box = document.getElementById('tldr'), body = document.getElementById('tldr-body');
  const title = document.getElementById('tldr-title');
  let opener = null;
  const h = (tag, html, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  function open(key, from) {
    const t = TLDR[key]; if (!t) return;
    opener = from || null;
    title.textContent = '~/projects/' + t.file + '/tldr.md';
    body.innerHTML = '';
    const head = h('h3'); head.id = 'tldr-h'; head.textContent = t.title;
    body.append(head, h('p', t.q, 'tldr-q'), h('h4', 'setup'), h('p', t.setup), h('h4', 'findings'));
    const ul = h('ul'); t.findings.forEach(f => ul.append(h('li', f))); body.append(ul);
    if (t.demo === 'lantern' && window.mountLanternDemo) { const f = h('figure'); const d = h('div'); f.append(d, h('figcaption', 'Pick a screen: the bar takes its main colour, as Lantern does.')); body.append(f); window.mountLanternDemo(d); }
    if (t.video) {
      // a YouTube id plays in YouTube's privacy-enhanced player; a file path plays in the browser's own player
      const [vid, cap, poster, aspect] = t.video, f = h('figure'), box = h('div', '', 'yt');
      if (aspect) { box.style.aspectRatio = aspect; box.classList.add('tall'); }   // e.g. a portrait phone clip
      if (/\.(mp4|webm)$/.test(vid)) {
        const v = document.createElement('video');
        Object.assign(v, { src: vid, controls: true, playsInline: true, preload: 'none', poster: poster || '' });
        v.setAttribute('aria-label', cap); box.append(v);
      } else {
        const ifr = document.createElement('iframe');
        Object.assign(ifr, { src: `https://www.youtube-nocookie.com/embed/${vid}?rel=0`, title: cap, loading: 'lazy', allowFullscreen: true, referrerPolicy: 'strict-origin-when-cross-origin' });
        ifr.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        box.append(ifr);
      }
      f.append(box, h('figcaption', cap)); body.append(f);
    }
    if (t.figs) t.figs.forEach(([src, cap, kind]) => {
      const f = h('figure'), row = h('div', '', kind === 'app' ? 'tldr-app' : Array.isArray(src) ? 'tldr-row' : '');
      [].concat(src).forEach(u => { const img = h('img'); img.src = u; img.alt = cap; img.loading = 'lazy'; row.append(img); });
      f.append(row, h('figcaption', cap)); body.append(f);
    });
    if (t.table) {
      const tb = h('table'); t.table.forEach(([a, b, c]) => { const r = h('tr', '', c); r.append(h('td', a), h('td', b)); tb.append(r); });
      body.append(tb, h('p', t.tableCaption, 'tldr-cap'));
    }
    body.append(h('h4', 'my part'), h('p', t.role));
    if (t.next) body.append(h('h4', 'next'), h('p', t.next));
    const links = h('div', '', 'tldr-links');
    t.links.forEach(([label, href]) => { const a = h('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = label + ' →'; links.append(a); });
    body.append(links);
    box.hidden = false; body.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('.term-close').focus();
  }
  function close() {
    box.hidden = true; document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }
  document.querySelectorAll('[data-tldr]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); open(a.dataset.tldr, a); }));
  // A plain click on a card opens its tl;dr; ⌘/ctrl/middle-click still opens GitHub.
  document.querySelectorAll('.project-card').forEach(card => {
    const t = card.querySelector('[data-tldr]'), link = card.querySelector('.card-link');
    if (!t || !link) return;
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault(); open(t.dataset.tldr, link);
    });
  });
  box.addEventListener('click', e => { if (e.target === box || e.target.closest('[data-tldr-close]')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });
  window.openTldr = open;
})();

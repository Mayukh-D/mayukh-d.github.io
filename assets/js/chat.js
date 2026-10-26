/* chat.js
 Ask-me-anything terminal (#chat), opened from the nav prompt. Built-in commands answer from the page
 itself; anything else goes to the Cloudflare Worker (chat-worker/) that asks Gemini, grounded only in
 this site's content. Needs: SKILL_NOTES (skills.js), window.loadPaperPlane (contact-email.js).
*/

// Ask-me-anything terminal. Built-in commands answer from the page itself;
// anything else goes to a small Cloudflare Worker that asks Gemini, grounded
// only in this site's content (see chat-worker/).
const CHAT_ENDPOINT = 'https://mayukh-chat.mayukh-d.workers.dev/chat';
(() => {
  const panel = document.getElementById('chat');
  const log = document.getElementById('chat-log');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const history = [];          // {role: 'user'|'model', text} sent to the AI
  const typed = [];            // previous inputs, for the up arrow
  let cursor = 0, busy = false, greeted = false;

  const clean = el => el.textContent.replace(/\s+/g, ' ').trim();
  const projects = () => [...document.querySelectorAll('.project-card')].map(c => ({
    name: clean(c.querySelector('h3')),
    desc: clean(c.querySelector('p')),
    link: c.querySelector('.card-link')?.href }));

  function line(cls, text) {
    const d = document.createElement('div');
    d.className = cls;
    // linkify http(s) URLs and `code`, everything else as plain text
    text.split(/(https?:\/\/[^\s)]+|`[^`]+`)/g).forEach(part => {
      if (/^https?:\/\//.test(part)) {
        const url = part.replace(/[.,;:]+$/, ''), rest = part.slice(url.length);
        const a = document.createElement('a'); a.href = url; a.textContent = url; a.target = '_blank'; a.rel = 'noopener';
        d.append(a, rest);
      } else if (/^`[^`]+`$/.test(part)) {
        const c = document.createElement('code'); c.textContent = part.slice(1, -1); d.append(c);
      } else d.append(part);
    });
    log.append(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  const HELP = [
    'Ask anything about Mayukh in plain English, or try:',
    '  `whoami`         who he is, in a line',
    '  `ls projects`    his projects',
    '  `ls skills`      skills you can `cat`',
    '  `cat pytorch`    what he did with a skill',
    '  `experience`     where he has worked',
    '  `contact`        how to reach him',
    '  `resume`         his resume (PDF)',
    '  `make me dapper` you will see',
    '  `clear`, `exit`',
  ].join('\n');

  const COMMANDS = {
    help: () => HELP,
    whoami: () => clean(document.querySelector('#about p')),
    ls: arg => {
      if (/^skills?/.test(arg)) return Object.keys(SKILL_NOTES).join('  ·  ') + '\n\nTry `cat <skill>`.';
      return projects().map(p => '- ' + p.name).join('\n') + '\n\nAsk about any of them for details.';
    },
    projects: () => projects().map(p => `- ${p.name}: ${p.desc}\n  ${p.link}`).join('\n\n'),
    cat: arg => {
      const key = Object.keys(SKILL_NOTES).find(k => k.toLowerCase() === arg.replace(/\.md$/, '').trim().toLowerCase());
      if (!key) return arg ? `cat: ${arg}: no such skill. Try \`ls skills\`.` : 'usage: cat <skill>';
      const n = SKILL_NOTES[key];
      return `${key}  [${n.where.join(', ')}]\n${n.lead}\n${n.points.map(p => '- ' + p).join('\n')}`;
    },
    experience: () => [...document.querySelectorAll('#experience .timeline-item')].map(it =>
      `- ${clean(it.querySelector('h3'))}, ${clean(it.querySelector('.org'))} (${clean(it.querySelector('.timeline-date'))})`).join('\n'),
    contact: () => 'Email and links are in the contact section at the bottom of the page.\nLinkedIn: https://www.linkedin.com/in/mayukh-das-a38319148\nGitHub: https://github.com/Mayukh-D',
    resume: () => 'https://mayukhdas.com/assets/Mayukh_Das_Resume.pdf',
  };
  COMMANDS.ls.alias = true;

  function greet() {
    if (greeted) return;
    greeted = true;
    line('sys', 'Connected to mayukh. Ask anything about his work, studies or projects.');
    line('sys', 'Type `help` for built-in commands.');
  }

  function open() {
    panel.hidden = false; greet(); input.focus();
    if (!Site.reducedMotion()) window.loadPaperPlane().then(() => window.paperPlane.preload(), () => {});
  }
  function close() { panel.hidden = true; }
  // the close button folds the terminal into a paper plane and throws it; Esc and `exit` just close
  let flying = false;
  function flyAway() {
    if (panel.hidden || flying) return;
    flying = true;
    window.loadPaperPlane().then(() => window.paperPlane.fly(panel, { heading: -1, hide: () => { close(); flying = false; } }), () => { close(); flying = false; });
  }

  async function ask(q) {
    if (!CHAT_ENDPOINT) {
      line('err', "The AI side isn't switched on yet. Built-in commands work now: type `help`.");
      return;
    }
    history.push({ role: 'user', text: q });
    const t = line('ai thinking', '');
    busy = true;
    try {
      const res = await fetch(CHAT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8) }) });
      const data = await res.json().catch(() => ({}));
      t.remove();
      if (data.reply) { history.push({ role: 'model', text: data.reply }); line('ai', data.reply); }
      else { history.pop(); line('err', data.error || 'Something went wrong. Type `help` for built-in commands.'); }
    } catch {
      t.remove(); history.pop();
      line('err', "Couldn't reach the AI. Built-in commands still work: type `help`.");
    } finally { busy = false; }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || busy) return;
    input.value = '';
    typed.push(q); cursor = typed.length;
    line('q', q);
    const [cmd, ...rest] = q.split(/\s+/);
    const c = cmd.toLowerCase(), arg = rest.join(' ').toLowerCase();
    if (c === 'clear') { log.innerHTML = ''; return; }
    if (/^(sudo )?make me dapper$|^dapper$/i.test(q) && window.makeDapper) {
      window.makeDapper(true); scrollTo({ top: 0, behavior: 'smooth' });
      line('', 'Sketching a top hat, monocle, moustache and tie onto the portrait. Very distinguished.'); return;
    }
    if (/\bplanes?\b/i.test(q)) {
      line('', 'Folding the page...');
      window.loadPaperPlane().then(() => window.paperPlane(close), () => {});
      return;
    }
    if (c === 'exit' || c === 'quit') { close(); return; }
    if (COMMANDS[c] && (rest.length === 0 || c === 'ls' || c === 'cat')) { line('', COMMANDS[c](arg)); return; }
    ask(q);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && cursor > 0) { input.value = typed[--cursor]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { cursor = Math.min(typed.length, cursor + 1); input.value = typed[cursor] || ''; e.preventDefault(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  const hint = document.querySelector('.ask-hint');
  const syncHint = () => hint.classList.toggle('gone', scrollY > 120);
  addEventListener('scroll', syncHint, { passive: true }); syncHint();
  document.querySelectorAll('[data-chat-open]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(); }));
  panel.querySelector('[data-chat-close]').addEventListener('click', flyAway);
})();

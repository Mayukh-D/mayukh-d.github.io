// Builds profile.md, the only thing the chatbot knows about Mayukh, from the
// live site's index.html, so the bot can never drift from what the page says.
// Run after editing the site: node chat-worker/build-profile.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const here = new URL('.', import.meta.url);
const html = readFileSync(new URL('../index.html', here), 'utf8');

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&rarr;/g, '→');
const text = s => decode(s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const section = id => {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  if (!m) throw new Error(`section ${id} not found`);
  return m[0];
};
const items = (sec, cls) => [...sec.matchAll(new RegExp(`<div class="${cls}[^"]*"[\\s\\S]*?(?=<div class="${cls}|</section>)`, 'g'))].map(m => m[0]);

const out = ['# Mayukh Das', ''];
out.push('## About', text(section('about')).replace(/^about\s*/, ''), '');

for (const [id, title] of [['experience', 'Experience'], ['education', 'Education'], ['student-roles', 'Student roles'], ['internships', 'Internships'], ['beyond', 'Beyond the terminal']]) {
  out.push(`## ${title}`);
  for (const it of items(section(id), 'timeline-item')) out.push('- ' + text(it));
  out.push('');
}

out.push('## Projects');
for (const card of items(section('projects'), 'project-card')) {
  const links = [...card.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, href, inner]) => `${text(inner) || 'link'}: ${href.startsWith('http') ? href : 'https://mayukhdas.com/' + href}`);
  const title = text(card.match(/<h3>([\s\S]*?)<\/h3>/)[1]);
  const desc = text(card.match(/<p>([\s\S]*?)<\/p>/)[1]);
  const tech = text(card.match(/<span class="project-lang">([\s\S]*?)<\/span>\s*<span/)?.[1] || '');
  out.push(`### ${title}`, desc, `Tech: ${tech}`, `Links: ${[...new Set(links.filter(l => !l.startsWith('link: ') || true))].join(' | ')}`, '');
}

// How he works: his principles from the homepage's Rafale callouts, plus his one-line thesis.
const thesis = 'He builds models from first principles, then tries to break them.';
const rafaleJs = readFileSync(new URL('../assets/js/rafale.js', here), 'utf8');   // the callouts live with the jet's script
const rafale = [...rafaleJs.matchAll(/title: '([^']+)',\s*sub: '([^']+)'/g)];
out.push('## How he works (his own principles)', `In one line: ${thesis}`);
for (const [, t, sub] of rafale) out.push(`- ${sub.charAt(0).toUpperCase() + sub.slice(1)} ("${t.toLowerCase()}")`);
out.push('');

out.push('## Publications');
for (const it of items(section('publications'), 'timeline-item')) out.push('- ' + text(it));
out.push('');

out.push('## Interests');
for (const card of items(section('interests'), 'interest-card')) out.push('- ' + text(card).replace(/^\S+\s/, ''));
out.push('');

// the skill notes live with the skill chips' script
const skillsJs = readFileSync(new URL('../assets/js/skills.js', here), 'utf8');
const js = skillsJs.match(/const SKILL_NOTES = ([\s\S]*?\n\};)\n([\s\S]*?)\n\n\(\(\) => \{/);
const ctx = {};
vm.runInNewContext(`SKILL_NOTES = ${js[1].replace(/;$/, '')};\n${js[2].replace(/const DATA_ENG/, 'DATA_ENG')}`, ctx);
out.push('## Skills (what he actually did with each)');
for (const [name, n] of Object.entries(ctx.SKILL_NOTES)) {
  out.push(`### ${name} (${n.where.join(', ')})`, n.lead, ...n.points.map(p => '- ' + p), '');
}

// The deep pages (swung in from the homepage's side tabs): his own words on projects, research,
// jobs, and the 1 AM notes notes. Text only; demos and figures are skipped.
const deep = [
  ['projects/index.html', 'Projects page: how he builds (philosophy, favourite projects, design decisions)'],
  ['research/index.html', 'Research page: who set each project, what it taught him, how it led to Haizea'],
  ['jobs/index.html', 'Jobs page: his career journey and what each job taught him'],
  ['work/lantern/index.html', 'Lantern write-up'],
  ['work/transformers-revenge/index.html', "Transformers' Revenge write-up"],
  ['notes/gamma-beat-saturation/index.html', '1 AM notes: Gamma beat saturation'],
  ['notes/small-data-gpt/index.html', '1 AM notes: what transfers to a GPT trained on 3.7M tokens'],
  ['notes/x-vs-v-prediction/index.html', '1 AM notes: predict the data, not the velocity'],
  ['notes/agent-atoll/index.html', '1 AM notes: a rule my agents can\'t break is code, not a sentence'],
  ['notes/attention-was-all-we-needed/index.html', '1 AM notes: yes, attention definitely was all we needed'],
  ['notes/one-ai-policy/index.html', '1 AM notes: no single AI policy can fit a whole university'],
  ['notes/we-built-a-game/index.html', '1 AM notes: we built a game (OUTBREAK)'],
  ['notes/sovereign-ai-showcase/index.html', '1 AM notes: a day at Parliament House and sovereign AI'],
];
for (const [file, title] of deep) {
  const page = readFileSync(new URL('../' + file, here), 'utf8');
  const main = page.match(/<main class="deep"[\s\S]*?<\/main>/)[0]
    .replace(/<div class="demo"[\s\S]*?(?=<h2|<p>|<div class="links"|<\/main>)/g, ' ')
    .replace(/<(h1|h2|h3)[^>]*>/g, '\n$&').replace(/<\/(p|li|h1|h2|h3)>/g, '$&\n');
  const url = 'https://mayukhdas.com/' + file.replace(/index\.html$/, '');
  const body = decode(main.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' '))
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
  out.push(`## ${title}`, `URL: ${url}`, body, '');
}

out.push('## Contact',
  'Open to opportunities in software engineering and machine learning, based in Canberra, ACT.',
  'Email: use the contact section at the bottom of https://mayukhdas.com/',
  'LinkedIn: https://www.linkedin.com/in/mayukh-das-a38319148',
  'GitHub: https://github.com/Mayukh-D',
  'Resume (PDF): https://mayukhdas.com/assets/Mayukh_Das_Resume.pdf', '');

writeFileSync(new URL('profile.md', here), out.join('\n'));
console.log(`profile.md: ${out.join('\n').length} chars`);

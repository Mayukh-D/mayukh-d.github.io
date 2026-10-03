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
    .map(([, href, inner]) => `${text(inner) || 'link'}: ${href.startsWith('http') ? href : 'https://mayukh-d.github.io/' + href}`);
  const title = text(card.match(/<h3>([\s\S]*?)<\/h3>/)[1]);
  const desc = text(card.match(/<p>([\s\S]*?)<\/p>/)[1]);
  const tech = text(card.match(/<span class="project-lang">([\s\S]*?)<\/span>\s*<span/)?.[1] || '');
  out.push(`### ${title}`, desc, `Tech: ${tech}`, `Links: ${[...new Set(links.filter(l => !l.startsWith('link: ') || true))].join(' | ')}`, '');
}

out.push('## Publications');
for (const it of items(section('publications'), 'timeline-item')) out.push('- ' + text(it));
out.push('');

out.push('## Interests');
for (const card of items(section('interests'), 'interest-card')) out.push('- ' + text(card).replace(/^\S+\s/, ''));
out.push('');

const js = html.match(/const SKILL_NOTES = ([\s\S]*?\n    \};)\n([\s\S]*?)\n\n    \(\(\) => \{/);
const ctx = {};
vm.runInNewContext(`SKILL_NOTES = ${js[1].replace(/;$/, '')};\n${js[2].replace(/const DATA_ENG/, 'DATA_ENG')}`, ctx);
out.push('## Skills (what he actually did with each)');
for (const [name, n] of Object.entries(ctx.SKILL_NOTES)) {
  out.push(`### ${name} (${n.where.join(', ')})`, n.lead, ...n.points.map(p => '- ' + p), '');
}

out.push('## Contact',
  'Open to opportunities in software engineering and machine learning, based in Canberra, ACT.',
  'Email: use the contact section at the bottom of https://mayukh-d.github.io/',
  'LinkedIn: https://www.linkedin.com/in/mayukh-das-a38319148',
  'GitHub: https://github.com/Mayukh-D',
  'Resume (PDF): https://mayukh-d.github.io/assets/Mayukh_Das_Resume.pdf', '');

writeFileSync(new URL('profile.md', here), out.join('\n'));
console.log(`profile.md: ${out.join('\n').length} chars`);

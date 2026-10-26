/* skills.js
 Skill chips: clicking one opens a small terminal (#skill-note) with what was actually done with it.
 Defines (global): SKILL_NOTES, DATA_ENG. Used by: chat.js (the `skills` and `cat <skill>` commands).
*/

// Skills: click a chip to open what I actually did with it; click again to close.
const SKILL_NOTES = {
  'Python': { where: ['Accenture', 'ANU', 'Projects'],
    lead: 'My main language since 2020: production ML at Accenture, research code at ANU, and most of what I build for myself.',
    points: [
      'Accenture: built Ingrain, an AIOps tool generating predictive ML pipelines for automated IT ticket resolution, plus the MLOps pipelines around the models.',
      'Curiouz TechLabs: trained an ML pipeline on historical patient records, reaching ~80% accuracy on malignant breast cancer detection.',
      'ANU: flow matching, a GPT from scratch and the minGRU vs Transformer study, all in Python.',
      'GrowthScope: a Flask analytics app, rebuilt with tests, a self-scoring forecast and a gate that has to pass before every push.' ] },
  'Java': { where: ['ANU', 'Projects'],
    lead: 'Three ANU courses took me from imperative Java to medium-scale, well-engineered systems.',
    points: [
      'Structured Programming: lists, trees, hash tables and graphs, abstract data types, and reasoning about time and space complexity; imperative Java first, then object-oriented.',
      'Software Construction: OOP, design patterns, functional programming, persistence and data manipulation in medium-scale projects, with revision control and IDE tooling.',
      'Software Engineering: process models, requirements, design and modelling, formal code inspection and software quality.',
      'Yuma: a native Android social app (feed, reactions, DMs, admin moderation) using Singleton, Factory and Iterator patterns over a layered DAO architecture.' ] },
  'C#': { where: ['Cognizant'],
    lead: 'Full-stack .NET development at Cognizant.',
    points: [
      'Designed and implemented web systems on .NET MVC, with React, HTML, CSS and JavaScript front ends.',
      'Delivered a Hospital Logistics System to manage COVID-19 operational workflows.' ] },
  'JavaScript': { where: ['Projects', 'Accenture', 'Cognizant'],
    lead: 'Front end to back end, from enterprise web apps to a research PWA.',
    points: [
      'FoodLens: a PWA with real-time barcode scanning, live Open Food Facts lookups, allergen, expiry and carbon flagging, and A/B interaction logging for HCI research.',
      'Accenture: MERN stack development (MongoDB, Express, React, Node).',
      'Cognizant: React, HTML, CSS and JavaScript front ends for .NET MVC systems.' ] },
  'SQL': { where: ['Accenture', 'Cognizant'],
    lead: 'Day-to-day work at both Accenture and Cognizant.',
    points: [
      'Cognizant: the data side of full-stack .NET MVC systems, including the Hospital Logistics System.',
      'Accenture: data work alongside ML pipelines and the data engineering stack (Hadoop, PySpark, Cassandra).' ] },
  'PyTorch': { where: ['ANU', 'Haizea', 'Projects'],
    lead: 'Two ANU courses, Deep Learning and Advanced Machine Learning, every research project on this page, and my work at Haizea Analytics.',
    points: [
      'Deep Learning: CNNs, RNNs, transformers and generative models, built and trained in PyTorch.',
      'Advanced Machine Learning: generative AI, diffusion models and LLMs.',
      'Image Generation with Machine Learning: flow matching, with v- vs x-prediction compared across data dimensions (x-prediction stays stable where v-prediction collapses), plus MeanFlow with Jacobian-vector-product targets.',
      'nanoGPT: a 30M-parameter GPT trained on 3.7M tokens; depth over width plus RoPE + RMSNorm took test perplexity from 25.77 to 24.67, and DPO fine-tuning followed.',
      'Transformers\' Revenge: minGRU vs a LLaMA-recipe Transformer vs a causal gMLP in a 27-experiment grid, including a phase transition in copy learning.',
      'Haizea Analytics: U-TAE models (a U-Net with temporal attention) that map tree canopy from Sentinel-2 satellite time series, supervised by airborne LiDAR, trained and ablated across multiple seeds on GPU.' ] },
  'scikit-learn': { where: ['Accenture'],
    lead: 'The workhorse of my MLOps work at Accenture.',
    points: [
      'Built the ML pipelines end to end, from data preparation through training to deployment.',
      'The models behind the automated ticket resolution (ATR) system were built with scikit-learn.' ] },
  'Deep Learning': { where: ['ANU', 'Haizea', 'Projects'],
    lead: 'Studied it properly at ANU, then went deep in three research projects.',
    points: [
      'ANU Deep Learning: CNNs, RNNs, transformers and generative models.',
      'ANU Advanced Machine Learning: generative AI, diffusion models and LLMs.',
      'Research: flow matching parameterisation, a GPT trained in the data-scarce regime, and a 27-experiment architecture study.',
      'Haizea Analytics: deep learning for Earth observation, a U-TAE (a U-Net with temporal attention) predicting LiDAR-measured crown cover and forest extent at 10 m from satellite time series.' ] },
  'Transformers': { where: ['ANU', 'Projects'],
    lead: 'Built from scratch, then stress-tested against the alternatives.',
    points: [
      'nanoGPT: a 30M-parameter GPT with RoPE and RMSNorm, comparing depth against width, then DPO fine-tuning.',
      'Transformers\' Revenge: a LLaMA-recipe Transformer against minGRU and a causal gMLP on algorithmic reasoning, showing where each architecture breaks.',
      'Found a phase transition in how the Transformer learns to copy.' ] },
  'Diffusion Models': { where: ['ANU', 'Projects'],
    lead: 'Generative modelling is my happy place.',
    points: [
      'ANU Advanced Machine Learning: diffusion models and generative AI.',
      'Image Generation with Machine Learning: flow matching from first principles, v- vs x-prediction across data dimensions, and why x-prediction stays stable where v-prediction collapses.',
      'A MeanFlow implementation with Jacobian-vector-product targets.' ] },
  'LLMs': { where: ['ANU', 'Accenture', 'Projects'],
    lead: 'Trained one from scratch, and built a product on top of one.',
    points: [
      'nanoGPT: a 30M-parameter model on five-sentence stories, 25.77 to 24.67 test perplexity through depth and RoPE + RMSNorm, then DPO fine-tuning, with a live demo on Hugging Face.',
      'Accenture: built Quasar++, a ChatGPT API-based chatbot for querying internal documents.',
      'ANU Advanced Machine Learning: LLMs and generative AI.' ] },
  'Explainable AI': { where: ['Accenture'],
    lead: 'AI that people can actually understand and trust.',
    points: [
      'Integrated explainability into Ingrain, Accenture\'s AIOps tool for automated ticket resolution.',
      'Built dynamic model-performance reporting, and designed the supporting UIs from scratch.' ] },
  'React': { where: ['Accenture', 'Cognizant'],
    lead: 'Front ends at two companies.',
    points: [
      'Accenture: MERN stack development (MongoDB, Express, React, Node).',
      'Cognizant: React front ends for full-stack .NET MVC systems.' ] },
  'Node': { where: ['Accenture'],
    lead: 'The back end of my MERN stack work at Accenture.',
    points: [ 'MongoDB, Express, React and Node, built as full-stack applications.' ] },
  '.NET': { where: ['Cognizant'],
    lead: 'Full-stack web systems at Cognizant.',
    points: [
      '.NET MVC on the back end, React, HTML, CSS and JavaScript on the front.',
      'Delivered a Hospital Logistics System to manage COVID-19 operational workflows.' ] },
  'HCI': { where: ['ANU', 'Accenture', 'Projects'],
    lead: 'I study it, research it and now teach it.',
    points: [
      'Casual Sessional Academic at ANU: running HCI tutorials on design thinking, prototyping and evaluation.',
      'FoodLens: A/B interaction logging built in for HCI research.',
      'HCI Design & Research: prototyping and AR system evaluation.',
      'Rated Advanced in UX Design at Accenture, where I designed Ingrain\'s UIs from scratch.' ] },
  'Git': { where: ['Projects', 'ANU'],
    lead: 'Every project here lives in Git, and I treat the history as part of the work.',
    points: [
      'GrowthScope: a pre-push gate (lint, tests, a secret scan, a boot check) runs before anything leaves my machine, and a leaked key was scrubbed from history.',
      'TokenEater: contributed multi-account support upstream as pull request #284.',
      'ANU Software Construction: industry revision control on team projects.' ] },
  'Jupyter': { where: ['ANU', 'Projects'],
    lead: 'Where experiments get run and read.',
    points: [ 'Transformers\' Revenge: the 27-experiment grid comparing minGRU, gMLP and a Transformer lives in notebooks.' ] },
  'LLM APIs': { where: ['Accenture', 'Projects'],
    lead: 'Putting hosted models to work, safely.',
    points: [
      'Accenture: Quasar++, a ChatGPT API chatbot for querying internal documents.',
      'GrowthScope: plain-English questions about your own sales data, answered by Google Gemini on its free tier, rate-limited per visitor with the key kept server-side.' ] },
  'REST APIs': { where: ['Projects'],
    lead: 'Consuming and building them.',
    points: [
      'FoodLens: live product lookups from the Open Food Facts API as you scan.',
      'TokenEater: reads Claude\'s usage API to track two accounts side by side.' ] },
  'Solution Architecture': { where: ['Eccoi', 'Accenture'],
    lead: 'Now my day job: architecture for sovereign AI.',
    points: [
      'Eccoi: architecting the Sovereign AI Community of Practice (SAICOP), defining architectural principles and the system context model.',
      'Proving the conceptual architecture end to end, aligned to Australian Government delivery, security and procurement realities.',
      'Rated Advanced in Solution Architecture at Accenture.' ] },
  'Cloud Architecture': { where: ['Eccoi', 'Accenture'],
    lead: 'Choosing where systems should run, and why.',
    points: [
      'Eccoi: assessing and shortlisting platforms for SAICOP.',
      'Rated Advanced in Cloud Application Architecture at Accenture.' ] },
  'Agile': { where: ['Accenture'],
    lead: 'Three years of Agile delivery at Accenture.',
    points: [ 'Weekly sprints, a stand-up every morning, scrum meetings, user stories and story-point estimation.' ] },
};
const DATA_ENG = { where: ['Accenture'],
  lead: 'Trained as a data engineer at Accenture.',
  points: [ 'Hands-on with the big data stack: Hadoop, Scala, PySpark and Cassandra.' ] };
['Hadoop', 'Scala', 'PySpark', 'Cassandra'].forEach(k => { SKILL_NOTES[k] = DATA_ENG; });

(() => {
  const box = document.getElementById('skill-note');
  const title = box.querySelector('.term-title');
  const body = box.querySelector('.term-body');
  const still = Site.reducedMotion();
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  let open = null, timer = null;

  function show(chip) {
    const name = chip.textContent.trim();
    const n = SKILL_NOTES[name];
    const file = name.toLowerCase().replace(/[^a-z0-9#.+-]+/g, '-') + '.md';
    title.textContent = '~/skills/' + file;
    body.innerHTML = '';
    const cmd = el('div', 'term-cmd');
    const typed = el('span');
    cmd.append(el('span', 'term-prompt', '$ '), typed, el('span', 'term-cursor'));
    const out = el('div', 'term-out');
    const tags = el('div', 'term-tags');
    n.where.forEach(w => tags.append(el('span', 'term-tag', w)));
    const list = el('ul', 'term-points');
    n.points.forEach(p => list.append(el('li', null, p)));
    out.append(tags, el('p', 'term-lead', n.lead), list);
    body.append(cmd, out);
    box.hidden = false;

    const text = 'cat ' + file;
    clearInterval(timer);
    if (still) { typed.textContent = text; out.classList.add('shown'); return; }
    let i = 0;
    timer = setInterval(() => {
      typed.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(timer); out.classList.add('shown'); }
    }, 22);
    const r = box.getBoundingClientRect();
    if (r.bottom > innerHeight) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.querySelectorAll('button.skill').forEach(chip => {
    chip.addEventListener('click', () => {
      if (open) open.setAttribute('aria-expanded', 'false');
      if (open === chip) { open = null; box.hidden = true; clearInterval(timer); return; }
      open = chip;
      chip.setAttribute('aria-expanded', 'true');
      show(chip);
    });
  });
  box.querySelector('.term-close').addEventListener('click', () => open && open.click());
})();

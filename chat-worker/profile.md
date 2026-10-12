# Mayukh Das

## About
I'm a machine learning engineer and architect: from training generative models from scratch to designing AI systems that people can actually understand and trust. I spent over three years at Accenture building AIOps tooling, explainable AI systems, and internal chatbots. At ANU , I'm going deeper into the foundations: generative modelling, transformers, and human-computer interaction. Now I work on two fronts: as ML Architect at Eccoi , on sovereign AI architecture, and as a Satellite AI Research Trainee at Haizea Analytics , mapping Australia's tree canopy from satellite imagery. Alongside my studies, I teach Human-Computer Interaction at the ANU as a Casual Sessional Academic, serve as a Student Ambassador for the College of Systems and Society, and represent its postgraduate cohort as the elected ANUSA Postgraduate Representative . I've also published research on AI in material science, electric propulsion, and blockchain; see publications . Long term, I want to build products that democratise machine learning : from national-scale AI capability to creative solutions for problems in grassroots communities.

## Experience
- Sep 2026 – Present Satellite AI Research Trainee Haizea Analytics, Canberra, Australia Mapping live tree canopy cover across Australia at 10 m resolution: deep learning models that read four years of quarterly Sentinel-2 imagery and are trained on airborne LiDAR measurements, across more than 13,000 footprints. The goal is accurate amounts of canopy, not just a good-looking map, scored once on a held-out test set against Haizea's existing model. Run as a pre-registered, multi-seed experiment programme where every change has to beat the noise floor, handed over as a clean repository with the model, validation code and a ranked record of experiments.
- Jul 2026 – Present ML Architect · System Architect Intern Eccoi, Canberra, Australia Architecting the Sovereign AI Community of Practice (SAICOP): defining architectural principles and the system context model, assessing and shortlisting platforms, and proving the conceptual architecture end-to-end, aligned to Australian Government delivery, security, and procurement realities. Exhibited SAICOP with the team at the Inaugural Australian AI Parliamentary Showcase at Parliament House in September 2026.
- Jul 2026 – Present Casual Sessional Academic · Human-Computer Interaction ANU College of Systems and Society, Canberra, Australia Teaching HCI at the ANU from Semester 2, 2026: running tutorials and supporting students through design thinking, prototyping, and evaluation coursework.
- Jan 2022 – Feb 2025 Advanced Application Engineering Analyst Accenture, Bengaluru, India Built Ingrain, an AIOps tool generating predictive ML pipelines for automated IT ticket resolution. Integrated Explainable AI and dynamic model-performance reporting, designing the supporting UIs from scratch. Built Quasar++, a ChatGPT API-based chatbot for querying internal documents. Formally Specialized in Data Science & Machine Learning; rated Advanced in Machine Learning, Python, UX Design, Solution Architecture, and Cloud Application Architecture.
- Oct 2021 – Jan 2022 Programmer Analyst Cognizant, India Designed and implemented full-stack web systems using .NET, MVC, React, HTML, CSS, and JavaScript; delivered a Hospital Logistics System to manage COVID-19 operational workflows.

## Education
- Feb 2025 – Present Master of Computing Australian National University, Canberra, Australia Coursework in deep learning (CNNs, RNNs, transformers, generative models), advanced ML and generative AI (diffusion models, LLMs), statistical machine learning, HCI, and software engineering. Every coursework project on this site was graded High Distinction (HD).
- Aug 2017 – Sep 2021 B.Tech, Automobile Engineering Manipal Institute of Technology, Manipal, India Published peer-reviewed research on electric propulsion for fixed-wing aircraft during undergraduate studies.

## Student roles
- 2025 – Present Postgraduate Representative ANU Students' Association (ANUSA), Canberra, Australia Elected representative for the CSS postgraduate cohort, advocating for student interests and liaising with faculty and administration.
- 2025 – Present Student Ambassador ANU College of Systems and Society, Canberra, Australia Representing the College at recruitment events and school visits; supporting prospective-student transition and onboarding.

## Internships
- May 2020 – Jun 2020 Software Development Intern Curiouz TechLabs, India Trained an ML pipeline on historical patient records for early detection of threatening conditions, reaching ~80% accuracy on malignant breast cancer detection.
- Nov 2019 – Dec 2019 Intern Coal Mining and Planning Department, India Studied sensor-based mineral detection and drafted a feasibility study for automated coal grade determination using computer vision and AI.
- Jun 2019 – Jul 2019 Intern Ashok Leyland, Hosur, India Hands-on with just-in-time manufacturing; worked on CNC machine programming and cam design optimisation for higher efficiency using machine learning.

## Beyond the terminal
- 2017 – 2019 Staff Writer The MIT Post Covered institute events and wrote long-form pieces on global issues; op-eds on the Me-Too movement and gun control received recognition and acclaim.
- 2018 – 2019 Event Organiser Revels, Manipal Institute of Technology Led teams of five to ten organising cultural-fest events (EQ-IQ, Psychology-101): ideation, logistics, and participant engagement for an inclusive atmosphere.
- Community Volunteering & Outreach Rotary Club · Art of Living Regular visits to a home for children with intellectual and developmental disabilities with the Rotary Club; sourced and distributed food, medicine, and rebuilding materials in West Bengal after Cyclone Amphan (2020).

## Projects
### Image Generation with Machine Learning
Flow matching from first principles: comparing v- vs x-prediction across data dimensions (x-prediction stays stable where v-prediction collapses), plus a MeanFlow implementation with Jacobian-vector-product targets.
Tech: Python · PyTorch HD
Links: Image Generation with Machine Learning: https://github.com/Mayukh-D/image-generation-with-machine-learning | tl;dr: https://mayukhdas.com/#tldr-flow | report: https://mayukhdas.com/assets/reports/flow-matching-report.pdf | code: https://github.com/Mayukh-D/image-generation-with-machine-learning

### GPT from Scratch (nanoGPT)
A 30M-parameter GPT built from scratch in PyTorch and trained on just 3.7M tokens of five-sentence stories, testing depth vs width and RoPE + RMSNorm (25.77 → 24.67 PPL), plus DPO fine-tuning, in the data-scarce regime.
Tech: Python · PyTorch · CUDA HD
Links: GPT from Scratch (nanoGPT): https://github.com/Mayukh-D/story-generation-nanoGPT | tl;dr: https://mayukhdas.com/#tldr-nanogpt | demo: https://huggingface.co/spaces/Mayukh1999/nanogpt-story-generator | report: https://mayukhdas.com/assets/reports/nanogpt-report.pdf | code: https://github.com/Mayukh-D/story-generation-nanoGPT

### Transformers' Revenge
Stress-testing minGRU's "Were RNNs All We Needed?" claims against a LLaMA-recipe Transformer and a causal gMLP on algorithmic reasoning: a 27-experiment grid showing where each architecture breaks, plus a phase transition in Transformer copy learning.
Tech: Jupyter · PyTorch HD
Links: Transformers' Revenge: https://github.com/Mayukh-D/Deep-Learning-Transformers-Revenge | tl;dr: https://mayukhdas.com/#tldr-transformers | report: https://mayukhdas.com/assets/reports/transformers-revenge.pdf | code: https://github.com/Mayukh-D/Deep-Learning-Transformers-Revenge

### FoodLens · Smart Food Scanner
A PWA for sustainable food shopping: real-time barcode scanning, live product lookup via Open Food Facts, allergen/expiry/carbon flagging, and A/B interaction logging for HCI research.
Tech: JavaScript · PWA HD
Links: FoodLens · Smart Food Scanner: https://github.com/Mayukh-D/foodlens-ar-sustainable-shopping | tl;dr: https://mayukhdas.com/#tldr-foodlens | demo: https://foodlens-f281.onrender.com | code: https://github.com/Mayukh-D/foodlens-ar-sustainable-shopping

### Yuma Social Platform
A native Android social app (post feed, reactions, DMs, and admin moderation) applying Singleton, Factory, and Iterator patterns across a layered DAO architecture.
Tech: Java · Android HD
Links: Yuma Social Platform: https://github.com/Mayukh-D/yuma-social-platform | tl;dr: https://mayukhdas.com/#tldr-yuma | code: https://github.com/Mayukh-D/yuma-social-platform

### HCI Design & Research
A portfolio of human-computer interaction work, including prototyping and AR system evaluation.
Tech: Portfolio HD
Links: HCI Design & Research: https://github.com/Mayukh-D/hci-design-and-research | tl;dr: https://mayukhdas.com/#tldr-hci | code: https://github.com/Mayukh-D/hci-design-and-research

### TokenEater · Multi-Account Fork
An unofficial fork of a macOS menu bar app that tracks Claude usage, adding a second Claude account as a provider of its own across the menu bar, popover, dashboard and Studio. Proposed upstream as pull request #284. For everyday use, get the official TokenEater .
Tech: Swift · SwiftUI
Links: TokenEater · Multi-Account Fork: https://github.com/Mayukh-D/TokenEater | official TokenEater: https://github.com/AThevon/TokenEater | tl;dr: https://mayukhdas.com/#tldr-tokeneater | build: https://github.com/Mayukh-D/TokenEater/releases | code: https://github.com/Mayukh-D/TokenEater

### Lantern · Screen Sync for a A$49 Light
A Mac menu bar app that makes a cheap Bluetooth LED bar follow whatever is on screen, the feature Philips Hue sells for about A$550. I reverse-engineered the light's Bluetooth commands, calibrated LED colour against the screen, and shipped it with a website and a release.
Tech: Swift · SwiftUI
Links: Lantern · Screen Sync for a A$49 Light: https://github.com/Mayukh-D/lantern | tl;dr: https://mayukhdas.com/#tldr-lantern | site: https://mayukhdas.com/lantern/ | code: https://github.com/Mayukh-D/lantern

### GrowthScope · First Hackathon
My first hackathon and first vibe-coded app (ANU, 2025): sales analytics for small businesses. Kept as a benchmark, and revisited in 2026 with tests, a self-scoring revenue forecast, anomaly detection, and fixes for what I first shipped.
Tech: Python · Flask
Links: GrowthScope · First Hackathon: https://github.com/Mayukh-D/GrowthScope | tl;dr: https://mayukhdas.com/#tldr-growthscope | demo: https://growthscope-j85i.onrender.com | code: https://github.com/Mayukh-D/GrowthScope | More on GitHub → experiments, forks and side projects: https://github.com/Mayukh-D?tab=repositories

## How he works (his own principles)
In one line: He builds models from first principles, then tries to break them.
- Find the right question, then optimise for it ("see before you strike")
- One variable at a time, measured changes ("small surfaces, big control")
- Every run logged; a change must beat the noise ("the black box remembers")
- Finding the failure is half solving it ("find the threat first")
- Research and engineering, both at full thrust ("two engines, one airframe")
- Bold ideas, kept in the air by experiments ("unstable by design")

## Publications
- 2024 An Overview on the Role of AI in Modern Advancements of Material Science ES General, Vol. 5 · First author Das, M. · DOI 10.30919/esg1183 . Also presented in work-in-progress form at RTCMM 2023.
- 2023 Revolutionizing Organ Donation With Blockchain Technology J. of Computers, Mechanical and Management, Vol. 2(5) · Scopus-indexed Momaya, V.J., Das, M. et al. · DOI 10.57159/gadl.jcmm.2.5.23071
- 2021 Electric Propulsion for Fixed Wing Aircrafts: Classifications, Designs, and Challenges Engineered Science, Vol. 16 · Scopus Q1 Karthik, A., Das, M. et al. · DOI 10.30919/es8d573

## Interests
- Machine Learning Generative models are my happy place: flow matching, diffusion, and transformers built from scratch in PyTorch. I like knowing what's under the hood, not just calling the API.
- Problem Solving Give me a gnarly problem and I'm gone for the afternoon: algorithm puzzles, debugging sessions that turn into detective stories, and systems that finally click at 2am.
- Defence & Geopolitics Where most of my free time goes: airpower doctrine, procurement politics, and how sovereign capability actually gets built rather than announced. An automobile engineer by first degree, so I read it as an engineering problem first. Hence the Rafale at the foot of the page.
- History & Theology Away from the screen: political history, theology, and an ever-growing queue of long-form analysis. I like understanding why institutions, ideas, and power move the way they do.

## Skills (what he actually did with each)
### Python (Accenture, ANU, Projects)
My main language since 2020: production ML at Accenture, research code at ANU, and most of what I build for myself.
- Accenture: built Ingrain, an AIOps tool generating predictive ML pipelines for automated IT ticket resolution, plus the MLOps pipelines around the models.
- Curiouz TechLabs: trained an ML pipeline on historical patient records, reaching ~80% accuracy on malignant breast cancer detection.
- ANU: flow matching, a GPT from scratch and the minGRU vs Transformer study, all in Python.
- GrowthScope: a Flask analytics app, rebuilt with tests, a self-scoring forecast and a gate that has to pass before every push.

### Java (ANU, Projects)
Three ANU courses took me from imperative Java to medium-scale, well-engineered systems.
- Structured Programming: lists, trees, hash tables and graphs, abstract data types, and reasoning about time and space complexity; imperative Java first, then object-oriented.
- Software Construction: OOP, design patterns, functional programming, persistence and data manipulation in medium-scale projects, with revision control and IDE tooling.
- Software Engineering: process models, requirements, design and modelling, formal code inspection and software quality.
- Yuma: a native Android social app (feed, reactions, DMs, admin moderation) using Singleton, Factory and Iterator patterns over a layered DAO architecture.

### C# (Cognizant)
Full-stack .NET development at Cognizant.
- Designed and implemented web systems on .NET MVC, with React, HTML, CSS and JavaScript front ends.
- Delivered a Hospital Logistics System to manage COVID-19 operational workflows.

### JavaScript (Projects, Accenture, Cognizant)
Front end to back end, from enterprise web apps to a research PWA.
- FoodLens: a PWA with real-time barcode scanning, live Open Food Facts lookups, allergen, expiry and carbon flagging, and A/B interaction logging for HCI research.
- Accenture: MERN stack development (MongoDB, Express, React, Node).
- Cognizant: React, HTML, CSS and JavaScript front ends for .NET MVC systems.

### SQL (Accenture, Cognizant)
Day-to-day work at both Accenture and Cognizant.
- Cognizant: the data side of full-stack .NET MVC systems, including the Hospital Logistics System.
- Accenture: data work alongside ML pipelines and the data engineering stack (Hadoop, PySpark, Cassandra).

### PyTorch (ANU, Haizea, Projects)
Two ANU courses, Deep Learning and Advanced Machine Learning, every research project on this page, and my work at Haizea Analytics.
- Deep Learning: CNNs, RNNs, transformers and generative models, built and trained in PyTorch.
- Advanced Machine Learning: generative AI, diffusion models and LLMs.
- Image Generation with Machine Learning: flow matching, with v- vs x-prediction compared across data dimensions (x-prediction stays stable where v-prediction collapses), plus MeanFlow with Jacobian-vector-product targets.
- nanoGPT: a 30M-parameter GPT trained on 3.7M tokens; depth over width plus RoPE + RMSNorm took test perplexity from 25.77 to 24.67, and DPO fine-tuning followed.
- Transformers' Revenge: minGRU vs a LLaMA-recipe Transformer vs a causal gMLP in a 27-experiment grid, including a phase transition in copy learning.
- Haizea Analytics: U-TAE models (a U-Net with temporal attention) that map tree canopy from Sentinel-2 satellite time series, supervised by airborne LiDAR, trained and ablated across multiple seeds on GPU.

### scikit-learn (Accenture)
The workhorse of my MLOps work at Accenture.
- Built the ML pipelines end to end, from data preparation through training to deployment.
- The models behind the automated ticket resolution (ATR) system were built with scikit-learn.

### Deep Learning (ANU, Haizea, Projects)
Studied it properly at ANU, then went deep in three research projects.
- ANU Deep Learning: CNNs, RNNs, transformers and generative models.
- ANU Advanced Machine Learning: generative AI, diffusion models and LLMs.
- Research: flow matching parameterisation, a GPT trained in the data-scarce regime, and a 27-experiment architecture study.
- Haizea Analytics: deep learning for Earth observation, a U-TAE (a U-Net with temporal attention) predicting LiDAR-measured crown cover and forest extent at 10 m from satellite time series.

### Transformers (ANU, Projects)
Built from scratch, then stress-tested against the alternatives.
- nanoGPT: a 30M-parameter GPT with RoPE and RMSNorm, comparing depth against width, then DPO fine-tuning.
- Transformers' Revenge: a LLaMA-recipe Transformer against minGRU and a causal gMLP on algorithmic reasoning, showing where each architecture breaks.
- Found a phase transition in how the Transformer learns to copy.

### Diffusion Models (ANU, Projects)
Generative modelling is my happy place.
- ANU Advanced Machine Learning: diffusion models and generative AI.
- Image Generation with Machine Learning: flow matching from first principles, v- vs x-prediction across data dimensions, and why x-prediction stays stable where v-prediction collapses.
- A MeanFlow implementation with Jacobian-vector-product targets.

### LLMs (ANU, Accenture, Projects)
Trained one from scratch, and built a product on top of one.
- nanoGPT: a 30M-parameter model on five-sentence stories, 25.77 to 24.67 test perplexity through depth and RoPE + RMSNorm, then DPO fine-tuning, with a live demo on Hugging Face.
- Accenture: built Quasar++, a ChatGPT API-based chatbot for querying internal documents.
- ANU Advanced Machine Learning: LLMs and generative AI.

### Explainable AI (Accenture)
AI that people can actually understand and trust.
- Integrated explainability into Ingrain, Accenture's AIOps tool for automated ticket resolution.
- Built dynamic model-performance reporting, and designed the supporting UIs from scratch.

### React (Accenture, Cognizant)
Front ends at two companies.
- Accenture: MERN stack development (MongoDB, Express, React, Node).
- Cognizant: React front ends for full-stack .NET MVC systems.

### Node (Accenture)
The back end of my MERN stack work at Accenture.
- MongoDB, Express, React and Node, built as full-stack applications.

### .NET (Cognizant)
Full-stack web systems at Cognizant.
- .NET MVC on the back end, React, HTML, CSS and JavaScript on the front.
- Delivered a Hospital Logistics System to manage COVID-19 operational workflows.

### HCI (ANU, Accenture, Projects)
I study it, research it and now teach it.
- Casual Sessional Academic at ANU: running HCI tutorials on design thinking, prototyping and evaluation.
- FoodLens: A/B interaction logging built in for HCI research.
- HCI Design & Research: prototyping and AR system evaluation.
- Rated Advanced in UX Design at Accenture, where I designed Ingrain's UIs from scratch.

### Git (Projects, ANU)
Every project here lives in Git, and I treat the history as part of the work.
- GrowthScope: a pre-push gate (lint, tests, a secret scan, a boot check) runs before anything leaves my machine, and a leaked key was scrubbed from history.
- TokenEater: contributed multi-account support upstream as pull request #284.
- ANU Software Construction: industry revision control on team projects.

### Jupyter (ANU, Projects)
Where experiments get run and read.
- Transformers' Revenge: the 27-experiment grid comparing minGRU, gMLP and a Transformer lives in notebooks.

### LLM APIs (Accenture, Projects)
Putting hosted models to work, safely.
- Accenture: Quasar++, a ChatGPT API chatbot for querying internal documents.
- GrowthScope: plain-English questions about your own sales data, answered by Google Gemini on its free tier, rate-limited per visitor with the key kept server-side.

### REST APIs (Projects)
Consuming and building them.
- FoodLens: live product lookups from the Open Food Facts API as you scan.
- TokenEater: reads Claude's usage API to track two accounts side by side.

### Solution Architecture (Eccoi, Accenture)
Now my day job: architecture for sovereign AI.
- Eccoi: architecting the Sovereign AI Community of Practice (SAICOP), defining architectural principles and the system context model.
- Proving the conceptual architecture end to end, aligned to Australian Government delivery, security and procurement realities.
- Rated Advanced in Solution Architecture at Accenture.

### Cloud Architecture (Eccoi, Accenture)
Choosing where systems should run, and why.
- Eccoi: assessing and shortlisting platforms for SAICOP.
- Rated Advanced in Cloud Application Architecture at Accenture.

### Agile (Accenture)
Three years of Agile delivery at Accenture.
- Weekly sprints, a stand-up every morning, scrum meetings, user stories and story-point estimation.

### Hadoop (Accenture)
Trained as a data engineer at Accenture.
- Hands-on with the big data stack: Hadoop, Scala, PySpark and Cassandra.

### Scala (Accenture)
Trained as a data engineer at Accenture.
- Hands-on with the big data stack: Hadoop, Scala, PySpark and Cassandra.

### PySpark (Accenture)
Trained as a data engineer at Accenture.
- Hands-on with the big data stack: Hadoop, Scala, PySpark and Cassandra.

### Cassandra (Accenture)
Trained as a data engineer at Accenture.
- Hands-on with the big data stack: Hadoop, Scala, PySpark and Cassandra.

## Projects page: how he builds (philosophy, favourite projects, design decisions)
URL: https://mayukhdas.com/projects/
projects
Small, useful, and obvious once you use it
Claude can build something that looks like enterprise software in an afternoon, so that is no longer what I want my GitHub to show. I would rather build small things that are genuinely useful, where every decision was made on purpose, and where the person using it finds those decisions obvious.
01
Start from a real annoyance
Not from a gap in a portfolio. If it doesn't bother me, I won't build it well.
02
Small and finished
One problem, solved properly and shipped, beats a large app that does everything generically.
03
Thoughtful should feel effortless
If the user has to stop and think about a decision, it was the wrong one.
Under each project: the decisions you'd notice using it. Open one to see why it's built that way.
Lantern: the A$550 feature on a A$49 light
Same bar, six screens: the light follows whatever covers most of the display.
Philips Hue sells screen-synced lighting for about A$550 of hardware. I bought the cheapest Bluetooth LED bar I could find, worked out how it talks, and built the missing piece as a Mac menu bar app.
It lives in the menu bar Lighting is something you set and forget. A full window would ask for attention the job doesn't need, so Lantern stays one click away and otherwise out of sight.
A dark scene doesn't switch the room off Black often covers most of a film frame. If a strong colour covers even 10% of the screen, it wins, so the light follows the scene rather than dropping out whenever it gets dark.
Colours look right, not pastel A screen and an LED mix light differently. A calibration tool showed that gamma, not saturation, fixes it; the full story is in a note.
The calibration tool ships with the app My numbers suit my bar. Another bar will need its own, so the tuning tool is part of the app instead of my values being hard-coded.
the full write-up → the gamma note → website → code →
TokenEater, multi-account: two accounts, no confusion
Both Claude accounts side by side (organisation names blurred).
TokenEater is an open-source menu bar app that tracks Claude usage, for one account. I use two, personal and work, so I made it track both.
The second account appears everywhere the first does Menu bar, popover, dashboard and Studio. A second account that only shows up in one place is a feature you have to remember exists.
It never reads your secrets It finds the second login by the Keychain item's presence alone. A usage tracker has no reason to touch credentials, so it doesn't.
It can't overwrite the official app The fork ships with its own app identity, so installing it never replaces or breaks the real TokenEater, and a clear warning points people to the official version.
It went upstream, not just sideways I proposed it to the original project as pull request #284, so if it's useful, everyone gets it.
fork → official app →
FoodLens: the right fact at the moment of purchase
For my ANU HCI final project: scan a barcode in the shop and see what matters to you, before you buy. I built it, ran a study with it, and let the study shape it.
Allergens are matched to your profile A generic allergen list makes you do the matching in the aisle. FoodLens only alerts on what you said matters to you.
Expiry follows how fast you actually eat It starts from an average, then switches to your own measured pace once you log what was left. Personal beats generic.
Waste comes before carbon In the study, tangible outcomes like food waste changed behaviour more than an abstract carbon number, so the design leads with them.
It's a web app, not an install Nobody installs an app to check one yoghurt. A phone-first PWA opens from a link and works on the spot.
live demo → code →
GrowthScope: the benchmark I kept on purpose
The rebuilt forecast, scored on the three months it never saw.
My first hackathon and my first vibe-coded app. It looked finished. A year later I found it analysed only 41% of its own demo data, because Australian day-first dates were silently dropped. I keep it as a benchmark of the gap between looking finished and being thought through.
The forecast tells you how wrong it is It reports its own error on months it didn't see. A forecast without an error bar asks for trust it hasn't earned.
Unusual days, without crying wolf The anomaly detector was tuned to raise no alarms on random data, because a detector you learn to ignore is worse than none.
Your columns, your names Flexible column mapping means a shop's own spreadsheet works as it is, instead of being reformatted to suit the tool.
A check runs before every push Tests and a gate have to pass first. It's how the 41% bug would have been caught the first time.
live demo → code →
The thread
None of these is big. Each started from something that annoyed me, and each decision was made so that the person using it never has to wonder why. That's the bar: thoughtful enough to be effortless.
everything on GitHub →

## Research page: who set each project, what it taught him, how it led to Haizea
URL: https://mayukhdas.com/research/
research
Given a question, learn the discipline
Most of my research started as someone else's brief: a course project, a question a lecturer posed, a claim worth testing. What counts is what I did with it, what each one taught me, and how together they got me into deep learning research at Haizea Analytics.
Transformers' Revenge: where a bold claim breaks
set by ANU Deep Learning (2026), as a team of four A recent paper claimed a minimal recurrent model, minGRU, matches Transformers. We tested it on tasks that need real retrieval, with 27 runs across three architectures, and wrote our predictions down before running anything. I built the Transformer and designed the experiment grid.
what I learned Commit to a prediction before you see the result. Three of our four predictions held. We reported the one that didn't, along with a phase transition we hadn't predicted that may explain it.
the full write-up → report → code →
A GPT from scratch, on almost no data
set by ANU Advanced Machine Learning A 30M-parameter GPT trained on 3.7M tokens, about 160 times less data than scaling laws suggest. I changed one thing at a time against a fixed baseline, and shipped the model as a live demo.
what I learned Small data changes the rules. The tokenizer mattered more than the architecture, depth beat width, and a component that helps at scale (SwiGLU) hurt here.
the note → live demo → code →
Flow matching: what the network should predict
set by ANU Advanced Machine Learning Should a generative model predict the clean data or the velocity? I tested every combination as the data dimension grew, worked out why one collapses, found what it costs to rescue, and implemented one-step MeanFlow.
what I learned Ask why a result happens, not just whether. And recipes tuned at large scale solve problems a small model may not have.
the note → report → code →
FoodLens and HCI: research with real people
set by ANU Human-Computer Interaction (2025) Three projects across the HCI pipeline, ending with FoodLens: an app I built and deployed, then evaluated with participants, phone against smart glasses, with observation, interviews and usability scoring.
what I learned Measure what people do, not what you hope they do. Trust in an AI feature dropped after its first failure and did not come back.
FoodLens on the projects page → code and write-ups →
Before ANU: publishing as an undergraduate
At Manipal I co-authored peer-reviewed papers on electric propulsion for fixed-wing aircraft (2021) and blockchain for organ donation (2023), and was first author on a review of AI in material science (2024). They taught me to read a literature properly, write for reviewers, and take criticism in public.
publications →
How it added up: Haizea
This body of work is what got me into Haizea Analytics, where I now do deep learning on satellite imagery to map Australia's tree canopy. It showed four things:
I could deliver real ML , trained, evaluated and shipped, not left in a notebook.
Research discipline : predictions first, one change at a time, and honesty about what didn't work.
Small-data work : when data is scarce, every design choice becomes a question of efficiency.
Real deep learning skill, and instinct for which question to ask next.
The briefs were set by others. The discipline I took from them is mine, and it is what I bring to the work now.

## Jobs page: his career journey and what each job taught him
URL: https://mayukhdas.com/jobs/
jobs
From being handed the spec to owning it
I've loved machine learning since school. I studied engineering anyway, because my dad told me to be different. The road back to ML ran through every job below, and the jobs split cleanly in two: the ones where the work arrived defined, and the ones since ANU, where deciding what to build is the work.
Engineering: learning to think in structures
My degree was in automobile engineering at Manipal, on the mechanical side. It taught me to think structurally: to break a system into parts, understand how each part loads the others, and adapt when one of them gives. That habit has outlasted everything else I learned there.
I had been coding since high school, though, and near the end of the degree I moved towards computer science one step at a time: projects first, then internships, including an ML pipeline for early breast cancer detection, and eventually a job.
Cognizant: proof that the switch was real
My first job, straight out of college, building full-stack .NET and React systems, including a logistics system for hospitals running COVID-19 operations. Its real value was what it proved: that an engineering graduate could make the move into software. I was wanted, I could build, and I did well, all before AI tools existed to help. It is where I earned my first full-stack chops.
Accenture: how real ML gets done
I had loved machine learning since school, so when the chance came to work with data, I jumped. Accenture trained me as a data engineer (Hadoop, Scala, PySpark, Cassandra) and put me inside a real production environment: Agile sprints, a stand-up every morning, stories and story points, and seniors who were genuinely great to learn from.
I built the MLOps pipelines behind Ingrain, an AIOps tool for automated IT ticket resolution, along with its explainability and reporting. That is where I learned why data and pipeline design matter as much as the model, the language of real ML workflows, and how a strong team actually works together.
THEN ANU, AND AI
Up to this point, the work arrived defined. Someone decided what to implement, and my job was to implement it well. I did.
ANU: talking at their level
Alongside the Master's, I am a Student Ambassador for the College of Systems and Society, talking to prospective students at recruitment events and school visits. The lesson there was simple and harder than it sounds: talk at their level. A student should walk away with a sparkle about what they could study, not a frown of worry about whether they are good enough for it.
Eccoi and Haizea: nobody hands you the spec
My two jobs since ANU are new ground in both directions: systems engineering at Eccoi, where I architect sovereign AI, and deep learning at Haizea Analytics, where I map Australia's tree canopy from satellite imagery. Both began after AI changed how software gets built.
The difference is independence. When I ask what to implement, the answer is that it is mine to decide. I am in the driver's seat. I learned agentic frameworks along the way, and the work became human-in-the-loop: the tools do more of the building, while the judgement about what to build, and whether it is right, stays with me.
Before, my job was the answer. Now it starts with the question.
In September 2026 the Eccoi work left the building. We exhibited SAICOP at the Inaugural Australian AI Parliamentary Showcase, in the Great Hall of Parliament House, and I spent the day on our stall with the team, talking people through it.
The Eccoi SAICOP stall in the Great Hall of Parliament House, 17 September 2026.
At the stall, mid-conversation.
Outside Parliament House on the day.
What stayed with me was how plainly the room made one point. AI is increasingly used to augment what a professional can do, and used well it multiplies a person's output several times over. It is a genuine superpower, and it is fast becoming an essential part of how modern work gets done. Every stall in that hall was a version of the same argument.
That has consequences for Australia. If these tools are essential to how people work, then who builds them, who runs them and who is trained to use them stop being purely technical questions. They become questions about education, and about the tooling the country depends on.
The hall also showed how spread out the effort is. The founding partners, Elastic and AWS, sat alongside Australian companies building their own models, their own compute, and their own tools for trust and security. Each is doing a different piece of the work. That is all the more reason for something like SAICOP: a place that brings those partners together so their capabilities combine, and so that Australia moves faster from being a consumer of AI to being a producer of it.
The thread
Engineering taught me structure. Cognizant proved I could build. Accenture taught me how real machine learning runs. The jobs since ANU are teaching me the part no one can hand over: deciding what should be built at all.
full experience on the main page → resume →

## Lantern write-up
URL: https://mayukhdas.com/work/lantern/
work/lantern
The Hue feature on a A$49 light
Philips Hue can make your lights follow your screen. In Australia that means about A$550 of Hue hardware. I bought the cheapest Bluetooth LED bar I could find, for A$49, and built the missing piece myself.
The bar following the screen. Filmed on a phone; trimmed and cropped only.
The problem
The bar came with a phone app and a remote, and nothing else. There was no way for my Mac to talk to it, and no documentation for how it talks at all. What I wanted was simple to say: when the screen turns green, the room turns green.
Finding the protocol
A Bluetooth scan from a small Swift program found the bar advertising as MELK-OA10 . Connecting to it exposed one service, FFF0 , with a single writable characteristic, FFF3 . That pattern belongs to a family of cheap controllers (often called ELK-BLEDOM), which take short 9-byte commands. The colour command turned out to be 7E 07 05 03 RR GG BB 10 EF , and the first test flashed the bar red, green, blue and white.
The built-in rainbow effects were harder, because their codes vary between models and the standard ones did nothing useful. So I wrote a small sweep: a window that stepped through every effect code every four seconds, showing the code in large type, while I watched the bar. The flowing rainbow I wanted turned out to be 0x01 , and 0x02 is the same one running the other way.
The hard part: screens lie about colour
The first version worked and looked wrong. Every colour came out pastel, almost white. The reason is that a screen and an LED mix light differently: on a bar, even a small amount of the "other" channels in a colour (some red in a teal, say) shows up strongly and washes it out.
Rather than guess, I built a calibration window: pick any colour from a wheel, or grab one straight off the screen, and the bar shows it next to the on-screen swatch while sliders adjust the mapping. Tuning it by eye made the answer clear.
Gamma mattered far more than saturation. Raising saturation just pushed everything towards the same few primaries. A strong gamma curve (3.5) strips out the weak channels while keeping in-between hues distinct, and a lower blue gain (0.45) fixed this bar's blue cast.
Deciding what "the screen's colour" means
The app reads a tiny 96 × 54 copy of the screen 30 times a second and groups the pixels into colours. The obvious rule, "show the most common colour", broke in two ways:
Dark scenes: black often covers the most pixels, which switched the bar off even when something bright was on screen. Now, if any single colour covers at least 10% of the screen (adjustable), it beats black.
Greys: colours are spread over many hue buckets, while every grey pixel lands in one, so greys always won. Now all the colours compete together against the greys and against black, and the biggest single colour is shown when colour wins.
A toad photo on the website shows the rule working as intended: the bar matched the green background, not the toad, because the background covers far more of the screen.
Shipping it
Lantern is a native SwiftUI menu bar app: a colour wheel, a 2700 to 6500 K warmth scale, the bar's own effects plus a smooth whole-bar spectrum, the calibration tool, and screen sync. It is open source, with a website, a downloadable release and the protocol notes for anyone with a similar bar.
Screen Sync: the screen's top ten colours, and what is on the light.
What I'd do next
Fade between colours on the light itself rather than sending a stream of steps, to make transitions smoother.
Support more controllers in the same family, which needs owners of other bars to test their effect codes.
website and video →
download →
code →

## Transformers' Revenge write-up
URL: https://mayukhdas.com/work/transformers-revenge/
work/transformers-revenge
Transformers' Revenge: where "Were RNNs All We Needed?" breaks
A recent paper showed that a minimal recurrent model, minGRU, matches Transformers on language modelling while training in linear time. We asked whether that still holds when a task needs genuine algorithmic reasoning, and wrote down what we expected before running anything.
The question
Language modelling mostly rewards local statistical patterns, where even simple models do well. The tasks that separate architectures are the ones that need content-based retrieval : using what you see now as a query to find something specific from earlier. minGRU's gates depend only on the current input, which suggested it could not do this at all. We wanted to test that precisely, and to find where each architecture's limits are.
The setup
Three architectures at about 750–800K parameters, 4 layers each, with an identical optimiser and schedule: minGRU as published; a nanoGPT-based Transformer with the LLaMA recipe (RoPE, RMSNorm, no biases); and a causal gMLP, which we adapted from the original bidirectional design as a middle point that mixes across positions with fixed weights inside a 256-token window.
Three tasks: character-level Shakespeare (language modelling), verbatim copying of a sequence, and induction heads (complete a pattern seen earlier in the sequence).
Three sequence lengths per task, chosen to cross the gMLP's window. 3 × 3 × 3 = 27 runs.
Predictions, made before the runs
Transformer: succeeds on every task; attention can reach any earlier token by content.
minGRU: fails every algorithmic task at every length; input-only gating cannot retrieve by content, whatever its size.
gMLP: succeeds while the needed retrieval falls inside its window, and fails sharply beyond it.
Everyone: similar results on Shakespeare, since that is the domain where the original claim was made.
What happened
All 27 runs. Shakespeare: perplexity. Copy: recall perplexity (1.0 perfect, about 26 random). Induction: accuracy (1.0 perfect, about 0.04 random).
Prediction Observed
minGRU fails copy and induction at every length chance level throughout (induction accuracy ≈ 0.04) confirmed
gMLP succeeds inside its window, fails beyond copy-short perfect (perplexity 1.003); copy-medium and induction-long at chance confirmed
Transformer succeeds everywhere induction 0.97–1.00 at every length; copy-long failed (perplexity 26.1) one miss
Similar Shakespeare perplexity for all 3.7–4.4 confirmed
So the original claim holds where it was tested, on language modelling, and breaks exactly where the architecture analysis said it would: any task that needs data-dependent retrieval.
The surprise: a phase transition
Transformer, induction at length 2048: near chance for about 7,000 steps, then perfect between steps 8,000 and 10,000.
The Transformer did not learn long induction gradually. It sat near chance for about 7,000 steps and then jumped to perfect accuracy within about 2,000 more, which is consistent with the attention heads suddenly forming an induction circuit. That also offers an explanation for our one missed prediction: copy-long only had 5,000 training steps, possibly too few for the same jump. We say so as a hypothesis, because the copy-long training curve itself shows no sign of a transition starting.
What was weak
Single seeds per run, so small gaps (like the gMLP's slightly worse Shakespeare perplexity) are not conclusive.
The copy-long budget of 5,000 steps leaves the Transformer's one failure unexplained by evidence; the next step is to train it longer.
The tasks were chosen to expose limits. We think that is fair, since copy and induction are capabilities trained Transformers develop naturally, but it is a choice worth stating.
My part
A team of four at the ANU (Deep Learning, 2026), with Vibhansh Gupta, Daniel Vaz and Adam Clark. I implemented the Transformer, designed the 27-run experiment grid and the comparison framework, and wrote the report.
full report (PDF) →
code →

## 1 AM reflections: Gamma beat saturation
URL: https://mayukhdas.com/notes/gamma-beat-saturation/
1am/gamma-beat-saturation
Gamma beat saturation: why screen colours lie on cheap LEDs
4 Oct 2026 · from building Lantern · Mayukh Das
I built a small Mac app that makes a A$49 Bluetooth LED bar follow whatever is on my screen. Getting the bar to change colour took an afternoon. Getting it to show the right colour took much longer, and taught me something I didn't expect.
The problem: everything looked pastel
The first version simply sent the screen's colour straight to the light. A teal on screen, say red 40, green 180, blue 180, went to the bar as exactly those numbers. On the bar it looked minty white. So did most other colours: deep blue became pale blue, orange became peach. Everything drifted towards white.
The bar wasn't broken. A screen and an LED don't mix light the same way.
Why it happens
A screen is built to reproduce colours accurately: its red, green and blue are balanced, and it applies a gamma curve so that a value of 40 out of 255 really is dim. A cheap LED controller does neither. It roughly drives each channel in proportion to the number you send, and its green and blue are much stronger than its red.
So that small red 40 in a teal, nearly invisible on a screen, becomes a noticeable glow of red on the bar, and the weak channels together add up to white.
On a screen, the minor channels of a colour are a nuance. On an LED, they are contamination.
What I tried first: more saturation
The obvious fix was to boost saturation and push every colour away from grey. It helped a little and broke something else: everything collapsed towards the nearest primary. A dusty blue and a navy both became the same full blue. The bar was no longer pastel, but it had lost every in-between hue.
That was the giveaway. Saturation acts on the whole colour at once, while the actual problem was the small channels specifically.
What worked: gamma
Gamma correction raises each channel to a power. With a gamma of 3.5, a channel at full strength stays at full strength, but a channel at 20% drops to under 1%. That is the right shape for this problem: it suppresses the weak channels hard and barely touches the strong ones. The red in the teal all but disappears, so the bar shows teal, not mint, while a dusty blue keeps its slight green and stays distinct from navy.
One more adjustment was needed. Gamma also dims the colour overall, so after applying it I rescale the result back to its original brightness. Only the purity changes, not the brightness.
How I found the numbers
Not by theory. I built a calibration window: pick a colour from a wheel, or grab any pixel from the screen, and the bar shows it next to the on-screen swatch while sliders adjust saturation, gamma and each channel's strength. Then I tuned by eye until they matched.
The settings I landed on for this bar: gamma 3.5, saturation left unchanged, and blue turned down to 0.45 , because this bar runs blue. Another bar would need different numbers, which is why the calibration tool ships with the app instead of the values being hard-coded.
The general lesson
When an output disagrees with your input, it is tempting to reach for the control that sounds right: the colours look washed out, so add saturation. The better question is where the error comes from. Here it came from the smallest components of each colour, and the fix was the one that targets exactly those. It is the same instinct as debugging a model: find the part of the input the error actually lives in, rather than turning the global knob.
the Lantern write-up → code →

## 1 AM reflections: what transfers to a GPT trained on 3.7M tokens
URL: https://mayukhdas.com/notes/small-data-gpt/
1am/small-data-gpt
What transfers to a GPT trained on 3.7M tokens, and what doesn't
31 Mar 2026 · from Advanced Machine Learning, ANU · Mayukh Das
A GPT is a program that writes by guessing the next word, over and over. For an Advanced Machine Learning project at the ANU I built a small one from scratch and trained it on five-sentence stories. It had about 30 million parameters, the adjustable numbers it tunes as it learns, and only 3.7 million tokens to learn from, a token being the word or piece of a word it reads at a time.
That is very little. The usual rule of thumb for a model this size, known as Chinchilla scaling, suggests around 600 million tokens, so mine had roughly 160 times less data than it "wants". With so little to learn from, every design choice became a question of not wasting anything, and several habits from large models stopped working.
One number runs through everything below: perplexity , the score I was graded on. It measures how surprised the model is by text it has never seen, so lower is better.
The models below are drawn to scale from the real configurations: volume is parameters.
1. The tokenizer was the biggest lever
The largest single gain didn't come from the model's design at all. It came from the tokenizer, the dictionary that chops text into tokens. A model keeps a lookup table with one row for every token in that dictionary. With the standard GPT-2 dictionary of 50,257 tokens, that table alone held about 19.3 million parameters: over 60% of the model, spent on a lookup table. Switching to a dictionary of 32,000 tokens shrank it to about 12.3 million and freed about 7 million parameters for the layers that actually learn, and test perplexity fell from 28.62 to 23.71 on an otherwise identical model.
The graded evaluation required the GPT-2 dictionary, so the final model couldn't use the smaller one, but the lesson stands: when parameters are scarce, where they sit matters more than how many there are.
2. Depth beat width
A model of a fixed size can be shaped two ways: many thin layers stacked up (deep), or a few fat ones (wide). At the same parameter count, deeper and narrower won every time: 7 layers scored 25.77, 11 scored 25.45, 16 scored 25.17, and 20 layers at width 272 scored 25.12. That contradicts the finding from large models that the shape barely matters. My reading is that on small data each extra layer refines what the previous one worked out, while extra width adds parallel features that the data is too small to teach.
3. Only two of three modern upgrades transferred
Modern open models such as LLaMA add three upgrades to the original GPT design, and I tried each one. RoPE, a different way of telling the model where each word sits in the sentence, was the biggest win (25.33 to 24.69), and it costs no parameters: the table the model used to keep for positions disappears. RMSNorm, a simpler way of keeping the numbers inside the model in a steady range, helped modestly (25.01). SwiGLU, a more elaborate version of one of the model's inner steps, has extra parts that need enough data to learn anything useful, and 3.7 million tokens wasn't it: perplexity rose to 25.62 and training became unstable after 6,500 steps. RoPE and RMSNorm together reached 24.67 : they help each other, but their gains don't simply add up.
4. Matching the data beat having more of it
The obvious cure for too little data is more data, so I tried that. Training first on TinyStories, a much larger collection of simple children's stories, gave the worst result of the project (53.26), and adding machine-written stories also hurt. Continuing the training on stories written by Gemini worsened perplexity too, though the stories the model then wrote read better. The one strategy that improved both was filtering the original stories for quality (25.33 to 24.92). Data that doesn't resemble what the model will be tested on made things worse, however good or plentiful it was.
5. Perplexity is not quality
The submitted model (20 layers, with RoPE and RMSNorm) scored 24.67. A slightly wider sibling scored 24.84 and wrote noticeably better stories. Perplexity measures how well a model predicts the exact words of the test stories, not whether its own stories make sense. It is the right number to optimise, and the wrong one to stop looking past.
Try the model
The thread through all of it
Recipes from large-scale training are tuned for large-scale problems. At small scale, some of them are free wins (RoPE), some make no difference, and some actively hurt (SwiGLU). The only reliable way to know which is to change one thing at a time and measure.
full report (PDF) → live demo → code →

## 1 AM reflections: predict the data, not the velocity
URL: https://mayukhdas.com/notes/x-vs-v-prediction/
1am/x-vs-v-prediction
Predict the data, not the velocity, until you can't
10 May 2026 · from Advanced Machine Learning, ANU · Mayukh Das
AI image generators start from pure static and gradually turn it into a picture. Flow matching is one of the methods that teaches a network to do that, and it comes with a design choice that sounds like a detail: what, exactly, should the network be asked to predict? For an Advanced Machine Learning project at the ANU I tried both options. On paper they are the same thing. In practice they behaved completely differently.
The idea, without the maths
Take one real example from your data and one random blob of static, and imagine a straight line between them. Flow matching trains a network so that, dropped anywhere along a line like that, it knows how to carry on towards the data end. Train it on enough of these lines and it can start from brand-new static and find its own way to something that looks real.
start: pure static
the data
the network is dropped here
velocity: which way, how fast
destination: the clean data
One training example. The network is dropped somewhere on the line and asked either for the destination or for the arrow.
There are two natural things to ask the network for at each point on the line:
The destination. "Where does this end up?" The network predicts the clean data itself. This is called x-prediction, because x is the usual name for the data.
The velocity. "Which way do I move right now, and how fast?" The network predicts the arrow that carries static towards data. This is v-prediction.
These are two descriptions of the same line. If you know where you are and where you are going, you can work out the arrow, and the other way round. One detail turns out to matter a great deal, though: the arrow is the destination minus the static you started from, so the velocity has the static baked into it .
The experiment
I didn't use images. I used shapes simple enough to judge by eye: dots arranged in a spiral (a "swiss roll"), a ring of blobs, and circles. Each one is flat, like a drawing on a sheet of paper. Then I placed that sheet inside bigger and bigger spaces: 2, 8 and 32 dimensions. A sheet of paper in a room is still flat, even though the room has three dimensions; this is the same idea with a 32-dimensional room. Real images work like this too: a photo is millions of numbers, but real photos take up only a thin, structured slice of all the combinations those numbers could make.
The same small network (5 layers, 256 units wide) was trained with every combination of prediction target and loss, the loss being how its mistakes are scored.
What happened
At 2 dimensions, everything worked. At 8, v-prediction started to blur. At 32, both v-prediction setups failed completely, while both x-prediction setups still drew clean spirals, rings and clusters. How the mistakes were scored mattered much less than what was being predicted: matching the loss to the target helped a little, but never rescued v-prediction.
Why
However big the room, the clean data still lives on its flat sheet, so a network predicting the destination only ever has to learn that simple shape. The velocity is different. It has the static baked in, and static fills every direction of the room, all 32 of them. So a network predicting the velocity has to describe something that gets more complicated every time the room grows.
Same information, different difficulty: the destination stays as simple as the data, while the velocity gets harder as the space grows.
Can v-prediction be rescued?
Yes, so the failure is about the size of the network, not about what is possible. Making the network four times wider, from 256 to 1024 units, gave clean spirals with v-prediction. But that takes it from about 330 thousand adjustable numbers to 5.2 million: roughly 16 times the compute for what x-prediction managed at the small size. Changing how the static is mixed in during training, a trick from large-scale work called shifting the noise schedule, didn't help on its own.
So why do big image models predict velocity?
Because their world is different. Production models like Stable Diffusion 3 and FLUX don't work on pixels. They work on a compressed description of the image that another network has learned, and in that compressed space the data no longer sits on a simple flat sheet, so predicting the destination loses its advantage. Predicting the velocity also keeps the job about equally hard at every stage, whereas a network predicting the destination has to guess a whole clean image from almost pure static at the very start. At scale, that steadier training wins.
How many steps does sampling need?
Generating means starting from static and following the network's directions in small straight steps. With the best setup (x-prediction at 32 dimensions), recognisable structure appeared by about 10 steps, and quality stopped improving somewhere between 20 and 50. Beyond that, extra steps bought almost nothing.
A footnote on one-step generation
I also implemented MeanFlow, a method that learns the average velocity over a whole stretch of the journey, so it can make the trip in a single step. It drew the swiss roll and the circles in one step, but struggled with the separate clusters, where averaging pulls them together. The paper's recommended way of choosing which points along the line to train on made that worse here, which was a useful reminder in itself: recipes from large-scale work are tuned for failure modes that may not exist in a small problem.
MeanFlow at 1, 2 and 5 steps. The spiral and rings hold up in one step; the eight separate clusters smear together.
What I took from it
Two things can be identical on paper and very different to learn. Asking for the destination was easier here because the destination was simple and the route was noisy. When the destination stops being simple, as it does in large image models, the answer flips. A design choice is only right for the problem in front of it.
full report (PDF) → code →

## 1 AM reflections: a rule my agents can't break is code, not a sentence
URL: https://mayukhdas.com/notes/agent-atoll/
1am/agent-atoll
A rule my agents can't break is code, not a sentence
13 Oct 2026 · from running a research project with AI agents · Mayukh Das
My canopy-mapping work runs on a GPU box that trains models around the clock, and I spend about 45 minutes a day on it. Everything else is done by a team of Claude agents: one orchestrator I talk to, and a dozen specialists it hands work to. It works now. It didn't at first, and most of what I learned was about rules.
The team
Every agent has one job and a role file that says what it may and may not do. The orchestrator plans, delegates and keeps the record, and it never writes experiment code itself. The rest:
Delivery loop. A coder implements one task from a precise spec. A checker gets the same spec but not the coder's report, so it can't be talked into agreeing. An evaluator judges the results against the acceptance criteria, and its verdict is the only one that counts. A claim-validator traces every sentence in a write-up back to a result file before it's published, and a git-keeper is the only one that pushes.
Debate team. A proposer pitches ideas, an optimist and a pessimist argue for and against each one independently, and a realist turns that into a ranked shortlist with success thresholds set before any data exists.
Oversight. A challenger attacks big decisions before they're made, a record-keeper keeps every document consistent, and an adjudicator audits every decision once a week and reports to me, not to the orchestrator.
Judgement roles run on the strongest model; coders and checkers on a cheaper one. The GPU itself is driven by a plain script with no AI in it: it runs a trial, scores it with a fixed calculator, and moves on. Agents only appear at decision points.
The Agent Atoll
With a dozen agents running in the background I lost track of who was doing what, so I had one built: a small island world, served on my laptop. Each role has an island. An agent that's working stands at its island with a speech bubble saying what it's on; an agent with nothing to do walks to Idle Beach. Shirt colours show which model it runs on. A side panel lists what's on the GPU.
The Atoll mid-afternoon: three reviewers on a plan amendment, a coder implementing it, a checker on a fix, the claim-validator on a README.
No AI keeps it up to date. A hook fires every time an agent is dispatched or finishes, writes a line to the log, and a script redraws the board every minute. That matters: the first version was kept up by an agent, and it was always behind.
The rulebook
I give the team rules as I go: one variable per experiment, three seeds per change, never call something done until a test on data we already hold has passed, an idle GPU is a failure. They live in one file, numbered, newest wins, and a new rule goes in the same day I say it. There are 37 now.
Here is the hard-way part. A rule written as a sentence gets broken. Not out of malice: an agent deep in one task forgets a rule about another. I log every breach, and there have been 21. The most common, seven times, was the GPU sitting idle, once for 13 hours overnight because nothing had been queued after the last job. Each time the agent knew the rule. Writing it more firmly changed nothing.
What stopped the breaches was turning rules into code that runs whether or not anyone remembers it.
A hook refuses any GPU launch that doesn't name a signed plan. Another blocks deletes outside a scratch folder. Another stops the agents spending paid credits, and paces their usage across the week. The GPU script queues its own next trial, so there is no hand-off to forget. The rulebook page now shows, for every rule, how it's enforced: by code, by a reviewing agent, or by text only. The text-only ones are the ones I watch.
The rulebook: 17 rules enforced by code, 9 by an agent, 11 text only. Breaches show in red until fixed.
Where I stay in the loop
The orchestrator rules on routine reports itself. It brings me one recommendation, never a menu, and only for the things that are mine: what the model is for, changes to the protocol, and any strong objection the challenger raises. Every plan is reviewed by other agents before it runs, so the orchestrator never approves its own work. Even plans I write go through the panel.
Some actions stay with me by design. When we need new data from a government portal, the agents prepare the order and I check it and click submit myself. And when I tried to give the worker on the GPU box standing permission to launch jobs on its own, the safety layer refused, twice. I was annoyed at the time. Looking back, it was right: launching is exactly the kind of call that should have a signed plan and a person behind it.
The lesson I keep relearning: agents are good at doing the work and bad at remembering the rules around it. So I write the rules down, turn the important ones into code, and keep the decisions that matter for myself.
more 1 AM reflections → the research behind it →

## 1 AM reflections: yes, attention definitely was all we needed
URL: https://mayukhdas.com/notes/attention-was-all-we-needed/
1am/attention-was-all-we-needed
Yes, attention definitely was all we needed
7 Jun 2026 · from Deep Learning, ANU · Mayukh Das
In 2017 a paper called "Attention Is All You Need" introduced the Transformer, the design behind today's chatbots. In 2024 another paper asked a cheeky question back: "Were RNNs All We Needed?" Its authors, Feng and colleagues, took an older and simpler kind of model, stripped it down even further, called it minGRU, and showed it kept up with Transformers at predicting text while being cheaper to train.
For our Deep Learning project, four of us set out to find where that stops being true. This is what we built, and why the answer came out the way it did.
Three ways to remember
All three models do the same job: read text one character at a time and guess the next one. Where they differ is in how the current character gets to use what came before it. We built all three at roughly the same size, under a million adjustable numbers and four layers each, and trained them the same way, so that this was the only real difference between them.
In each picture below the model is standing on the last box, the question mark. It has just read "K Q X" and has to say what comes next. The answer, M, is sitting earlier in the text, where "K Q X M" appeared once before.
minGRU: a running notepad. minGRU reads left to right and keeps a single notepad. At each character it does two things: it drafts what it might write down, and it decides how much of the old notepad to overwrite with that draft. Then it moves on. It never looks back at the text; all it has is the notepad. The catch is in how it decides. The decision looks only at the character in front of it, not at what is already on the notepad, and not at what it will be asked later. We followed the paper's own recipe, in which each layer also sees the last four characters through a small filter.
minGRU passes one summary along the line. Nothing reaches back to the earlier "M".
gMLP: a fixed set of glances. The gMLP can look back, but only in a fixed way. For each position it holds a set of weights saying how much to take from one character back, two back, and so on, up to 256 characters. Those weights are learned once in training and then stay put: it glances at the same places with the same strength, no matter what is written there. The original gMLP reads its whole input at once, in both directions. We adapted it to read left to right so that it could be compared fairly, and that adaptation was our own addition.
The gMLP takes a fixed amount from every character in its window. Here the answer happens to be inside it.
Transformer: look it up. Attention lets the current character ask a question. Every earlier character carries a label describing itself. The current one sends out a query, scores it against every label, and pulls in information mostly from the best matches. Where it looks depends on what it is reading right now, and it works that out afresh for every character. Ours was a small GPT-style model built with the recipe current open models use.
Attention matches "K Q X" against everything it has read and reaches straight for what followed.
The test: find what came after
Predicting Shakespeare mostly needs a feel for local patterns: after "th" usually comes "e". To separate the models we added two tasks with no such shortcut. In copying, the model sees a string of random letters, then a marker, and has to write the whole string out again. In pattern completion, a short run of letters appears once, and when its beginning turns up again later the model has to finish it. Both need the same thing: use what you are reading now to find something specific from earlier.
What happened
We wrote our predictions down before running anything. Then we ran 27 experiments: three models, three tasks, three lengths.
Shakespeare. All three scored about the same. The paper's claim held exactly where the paper made it.
minGRU. No better than guessing on copying and on pattern completion, at every length, including the shortest.
gMLP. Perfect while the answer was inside its 256-character window, and guessing once it fell outside.
Transformer. Solved pattern completion at every length, up to 2,048 characters, and copying at the short and medium lengths.
Why attention won
The difference is when each model decides what matters.
minGRU decides while it is writing. It cannot keep everything, so it has to choose, and it has to choose before it knows the question. It is like taking notes in a lecture without knowing what the exam will ask: if you didn't happen to write it down, it is gone. Attention decides while it is reading back. It keeps the whole text available and searches it once the question arrives, which is an open-book exam. The gMLP sits in between: the book is open, but it can only turn to the same pages every time.
minGRU has to decide what to remember before it knows the question. Attention decides after.
That is also why minGRU does fine on Shakespeare. Guessing the next letter of ordinary text rarely needs one exact thing from far back. A running summary of the last few words is enough, and a notepad is good at that. The original paper was right about what it measured.
None of this is free. To let every character look at every earlier one, attention compares all the pairs, so doubling the text roughly quadruples the work. minGRU's work only doubles. That saving is the whole appeal of the paper, and it is real.
One thing surprised us. On the longest pattern task the Transformer did not improve gradually. It sat at guessing level for about 7,000 training steps, then went to perfect within about 2,000 more. The lookup is not something it has from the start. It is a mechanism the model has to assemble, and until the pieces click into place nothing works at all.
So, was attention all we needed?
For predicting text from local patterns, no: a far simpler model kept up, and Feng and colleagues deserve the credit for showing it. For anything that needs looking something up, yes, and it was not close.
The title is a joke with caveats attached:
The Transformer failed the longest copying task, scoring no better than guessing. It was the one prediction we got wrong. That run had only 5,000 training steps, and we suspect it needed longer to make the same sudden jump, but its training curve shows no sign of one starting, so that is a guess.
Each experiment ran once. Small gaps between the models, like the ones on Shakespeare, mean nothing.
We chose tasks designed to expose limits. We think that is fair, because trained Transformers pick up copying and pattern completion on their own, but it was a choice.
This was a team of four. My part was implementing the Transformer, designing the 27 experiments and the framework that held all three models to the same rules, and writing the report.
the full write-up → full report (PDF) → code →

## 1 AM reflections: no single AI policy can fit a whole university
URL: https://mayukhdas.com/notes/one-ai-policy/
1am/one-ai-policy
No single AI policy can fit a whole university
8 Oct 2026 · from a student consultation on AI at ANU · Mayukh Das
ANU is setting up an AI Oversight Committee, and one seat on it belongs to a student. In October the student representatives for my college ran an open consultation to work out what that student should bring to the table. I am one of those representatives, so I spent two hours listening to students talk about AI in their courses. I went in to collect opinions. I came out with one of my own.
The poster for the session.
AI is here, and it is not magic
The session made two things clear to me at once. The first is that AI is here to stay. The second is that it is not a machine that solves everything. These models are not deterministic: ask the same question twice and you can get two different answers. Reaching for a language model to solve every problem makes no sense.
Pretending it isn't there makes even less. The useful question is how we use it to augment what people can already do.
What students were worried about
The concerns were specific:
Cost. These tools are not free, and someone has to pay for them.
The environment. Running large models uses a great deal of energy.
Privacy. What happens to your work once it goes into an AI tool.
Poor early learning. Students who lean on AI from the start may never build the foundations.
Others sat at the opposite end and argued for allowing AI for everything.
One size does not fit all
What struck me was that each side was right about some course and wrong about another. A course built on personal reflection about foreign policy, or a course in art, might reasonably ban AI entirely, because the thinking or the making is the whole point. Systems engineering or deep learning is different. There, research and implementation can be fast-tracked with AI while the decisions stay human.
Different courses, and different colleges, will need to handle this differently, depending on what they are trying to teach. Try writing one rule for all of them:
What I believe now
Any single AI policy for a whole university would be fundamentally flawed. Different courses teach different skills. Those skills lead to different jobs, and those jobs already have different AI practices. The only person placed to judge all of that is an expert in the field, which means the course convener.
The principle I would hand them is simple. Foundational skills are taught without AI, and AI is used to speed up the rest. A coding course might allow AI for writing documentation but not for writing the code, because writing code is the skill being taught.
Teach the foundations without AI. Use AI to speed up everything built on top of them.
The part that falls to the teachers
This puts real weight on conveners, and not only the ones in computer science. As AI arrives in every discipline, academics from outside computing need to understand these tools intimately too. You cannot make a good call about a tool you have never used, and their students are walking into a world that is changing either way.
The future is already here. We learn to augment what we do with it, or we risk falling behind.
These are my own views, not a position of the student representatives or of the ANU.
more 1 AM reflections → the roles behind it →

## Contact
Open to opportunities in software engineering and machine learning, based in Canberra, ACT.
Email: use the contact section at the bottom of https://mayukhdas.com/
LinkedIn: https://www.linkedin.com/in/mayukh-das-a38319148
GitHub: https://github.com/Mayukh-D
Resume (PDF): https://mayukhdas.com/assets/Mayukh_Das_Resume.pdf

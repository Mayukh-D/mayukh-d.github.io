# Mayukh Das

## About
I'm a machine learning engineer and architect: from training generative models from scratch to designing AI systems that people can actually understand and trust. I spent over three years at Accenture building AIOps tooling, explainable AI systems, and internal chatbots. At ANU , I'm going deeper into the foundations: generative modelling, transformers, and human-computer interaction. Now I work on two fronts: as ML Architect at Eccoi , on sovereign AI architecture, and as a Satellite AI Research Trainee at Haizea Analytics , mapping Australia's tree canopy from satellite imagery. Alongside my studies, I teach Human-Computer Interaction at the ANU as a Casual Sessional Academic, serve as a Student Ambassador for the College of Systems and Society, and represent its postgraduate cohort as the elected ANUSA Postgraduate Representative . I've also published research on AI in material science, electric propulsion, and blockchain; see publications . Long term, I want to build products that democratise machine learning : from national-scale AI capability to creative solutions for problems in grassroots communities.

## Experience
- Sep 2026 – Present Satellite AI Research Trainee Haizea Analytics, Canberra, Australia Mapping live tree canopy cover across Australia at 10 m resolution: deep learning models that read four years of quarterly Sentinel-2 imagery and are trained on airborne LiDAR measurements, across more than 13,000 footprints. The goal is accurate amounts of canopy, not just a good-looking map, scored once on a held-out test set against Haizea's existing model. Run as a pre-registered, multi-seed experiment programme where every change has to beat the noise floor, handed over as a clean repository with the model, validation code and a ranked record of experiments.
- Jul 2026 – Present ML Architect · System Architect Intern Eccoi, Canberra, Australia Architecting the Sovereign AI Community of Practice (SAICOP): defining architectural principles and the system context model, assessing and shortlisting platforms, and proving the conceptual architecture end-to-end, aligned to Australian Government delivery, security, and procurement realities.
- Jul 2026 – Present Casual Sessional Academic · Human-Computer Interaction ANU College of Systems and Society, Canberra, Australia Teaching HCI at the ANU from Semester 2, 2026: running tutorials and supporting students through design thinking, prototyping, and evaluation coursework.
- Jan 2022 – Feb 2025 Advanced Application Engineering Analyst Accenture, Bengaluru, India Built Ingrain, an AIOps tool generating predictive ML pipelines for automated IT ticket resolution. Integrated Explainable AI and dynamic model-performance reporting, designing the supporting UIs from scratch. Built Quasar++, a ChatGPT API-based chatbot for querying internal documents. Formally Specialized in Data Science & Machine Learning; rated Advanced in Machine Learning, Python, UX Design, Solution Architecture, and Cloud Application Architecture.
- Oct 2021 – Jan 2022 Programmer Analyst Cognizant, India Designed and implemented full-stack web systems using .NET, MVC, React, HTML, CSS, and JavaScript; delivered a Hospital Logistics System to manage COVID-19 operational workflows.

## Education
- Feb 2025 – Present Master of Computing Australian National University, Canberra, Australia Coursework in deep learning (CNNs, RNNs, transformers, generative models), advanced ML and generative AI (diffusion models, LLMs), statistical machine learning, HCI, and software engineering.
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
### Flow Matching Parameterisation
Flow matching from first principles: comparing v- vs x-prediction across data dimensions (x-prediction stays stable where v-prediction collapses), plus a MeanFlow implementation with Jacobian-vector-product targets.
Tech: Python · PyTorch
Links: Flow Matching Parameterisation: https://github.com/Mayukh-D/image-generation-with-machine-learning | report: https://mayukh-d.github.io/assets/reports/flow-matching-report.pdf | code: https://github.com/Mayukh-D/image-generation-with-machine-learning

### GPT from Scratch (nanoGPT)
A 30M-parameter GPT built from scratch in PyTorch and trained on just 3.7M tokens of five-sentence stories, testing depth vs width, RoPE + RMSNorm, and DPO fine-tuning in the data-scarce regime (25.77 → 24.67 PPL).
Tech: Python · PyTorch · CUDA
Links: GPT from Scratch (nanoGPT): https://github.com/Mayukh-D/story-generation-nanoGPT | demo: https://huggingface.co/spaces/Mayukh1999/nanogpt-story-generator | report: https://mayukh-d.github.io/assets/reports/nanogpt-report.pdf | code: https://github.com/Mayukh-D/story-generation-nanoGPT

### Transformers' Revenge
Stress-testing minGRU's "Were RNNs All We Needed?" claims against a LLaMA-recipe Transformer and a causal gMLP on algorithmic reasoning: a 27-experiment grid showing where each architecture breaks, plus a phase transition in Transformer copy learning.
Tech: Jupyter · PyTorch
Links: Transformers' Revenge: https://github.com/Mayukh-D/Deep-Learning-Transformers-Revenge | report: https://mayukh-d.github.io/assets/reports/transformers-revenge.pdf | code: https://github.com/Mayukh-D/Deep-Learning-Transformers-Revenge

### FoodLens · Smart Food Scanner
A PWA for sustainable food shopping: real-time barcode scanning, live product lookup via Open Food Facts, allergen/expiry/carbon flagging, and A/B interaction logging for HCI research.
Tech: JavaScript · PWA
Links: FoodLens · Smart Food Scanner: https://github.com/Mayukh-D/foodlens-ar-sustainable-shopping | demo: https://foodlens-f281.onrender.com | code: https://github.com/Mayukh-D/foodlens-ar-sustainable-shopping

### Yuma Social Platform
A native Android social app (post feed, reactions, DMs, and admin moderation) applying Singleton, Factory, and Iterator patterns across a layered DAO architecture.
Tech: Java · Android
Links: Yuma Social Platform: https://github.com/Mayukh-D/yuma-social-platform | code: https://github.com/Mayukh-D/yuma-social-platform

### HCI Design & Research
A portfolio of human-computer interaction work, including prototyping and AR system evaluation.
Tech: Portfolio
Links: HCI Design & Research: https://github.com/Mayukh-D/hci-design-and-research | code: https://github.com/Mayukh-D/hci-design-and-research

### TokenEater · Multi-Account Fork
An unofficial fork of a macOS menu bar app that tracks Claude usage, adding a second Claude account as a provider of its own across the menu bar, popover, dashboard and Studio. Proposed upstream as pull request #284. For everyday use, get the official TokenEater .
Tech: Swift · SwiftUI
Links: TokenEater · Multi-Account Fork: https://github.com/Mayukh-D/TokenEater | official TokenEater: https://github.com/AThevon/TokenEater | build: https://github.com/Mayukh-D/TokenEater/releases | code: https://github.com/Mayukh-D/TokenEater

### GrowthScope · First Hackathon
My first hackathon and first vibe-coded app (ANU, 2025): sales analytics for small businesses. Kept as a benchmark, and revisited in 2026 with tests, a self-scoring revenue forecast, anomaly detection, and fixes for what I first shipped.
Tech: Python · Flask
Links: GrowthScope · First Hackathon: https://github.com/Mayukh-D/GrowthScope | demo: https://growthscope-j85i.onrender.com | code: https://github.com/Mayukh-D/GrowthScope

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
- Flow Matching: v- vs x-prediction compared across data dimensions (x-prediction stays stable where v-prediction collapses), plus MeanFlow with Jacobian-vector-product targets.
- nanoGPT: a 30M-parameter GPT trained on 3.7M tokens, testing depth vs width, RoPE + RMSNorm, and DPO fine-tuning (25.77 → 24.67 perplexity).
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
- Flow Matching from first principles: v- vs x-prediction across data dimensions, and why x-prediction stays stable where v-prediction collapses.
- A MeanFlow implementation with Jacobian-vector-product targets.

### LLMs (ANU, Accenture, Projects)
Trained one from scratch, and built a product on top of one.
- nanoGPT: a 30M-parameter model on five-sentence stories, DPO fine-tuned from 25.77 to 24.67 perplexity, with a live demo on Hugging Face.
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

## Contact
Open to opportunities in software engineering and machine learning, based in Canberra, ACT.
Email: use the contact section at the bottom of https://mayukh-d.github.io/
LinkedIn: https://www.linkedin.com/in/mayukh-das-a38319148
GitHub: https://github.com/Mayukh-D
Resume (PDF): https://mayukh-d.github.io/assets/Mayukh_Das_Resume.pdf

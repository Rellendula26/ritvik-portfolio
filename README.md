# Ritvik Ellendula

Personal portfolio site for engineering projects, research, hardware systems, software tools, and the side of college that is not just coursework.

**Live:** [ritvikellendula.dev](https://ritvikellendula.dev)  
**Repo:** [github.com/Rellendula26/ritvik-portfolio](https://github.com/Rellendula26/ritvik-portfolio)

---

## What this site is

I built this to present my work the way I want recruiters and engineers to evaluate it: systems thinking, design decisions, iterations, evidence, and reflection. It is not a static gallery of screenshots. It is a living archive of how I think, build, debug, and improve.

The core goal:

> Make every project understandable at a glance, but deep enough that an engineer can inspect the reasoning behind it.

Projects live as structured TypeScript data. Case studies attach by slug. Featured work and supporting builds get different homepage weight so smaller experiments stay archived without competing with flagship projects.

---

## About me

I'm Ritvik Ellendula, an Electrical Engineering student at the University of Pennsylvania. I keep coming back to:

- Embedded systems and robotics
- Systems / compilers
- Machine learning
- Human-computer interaction
- Medical devices and research-adjacent builds
- Dance and music (Penn Dhamaka, edits, YouTube)

I like work at the intersection of software and hardware: compilers and autodiff frameworks next to CAD, PCBs, IoT devices, and research tools.

---

## Featured projects

These carry the main attention on the homepage.

### C Compiler
C subset → x86 assembly, built from scratch in OCaml across lexing, parsing, semantic analysis, IR, and code generation.

### MiniTorch-OCaml
Lightweight deep learning framework in OCaml: tensors, reverse-mode autodiff, dynamic graphs.

### BloomBot IoT
IoT flower for long-distance friends/partners. Proximity opens the bloom; Morse LED heart for messages. Embedded control + web/app path.

### Analog Electromechanical Lightsaber
Handheld Detkin Lab build: custom CAD hilt, discrete analog audio, LED blade, and a packaging problem that broke twice before the redesign held.

### Vend-A-Shoe
Client-facing electromechanical dispensing platform from my BrainChild Engineering internship. Mechanical packaging, embedded control on Raspberry Pi, cloud-connected actuation, and a lot of integration pain across 40+ wires.

---

## Supporting builds

Smaller tools and experiments that still taught me something: first custom ultrasonic PCB, CIS 5450 loan-default ML, LabReach AI, Count Coach, Arduino TFT Tetris, Bhangra Coach, Penn Plates, this portfolio site itself, and earlier CAD / data work.

Supporting does not mean unimportant. It means different visual weight.

---

## Also on the site

- **Research** — DreamDiffusion, redlining, muscular dystrophy, econometrics
- **Life** — personalized 3D-printed gifts, Dance (Penn Dhamaka + TikTok), Edits / videography

---

## How project pages work

Each project can lead with an executive summary (one-liner, disciplines, stack, status, highlights, links, primary media), then open into a structured case study:

1. Motivation  
2. System overview  
3. Engineering breakdown by discipline  
4. Key design decisions  
5. Evolution / iteration  
6. Results and validation  
7. Reflection  

Writing emphasizes the actual system (control, sensing, PCB process, compiler pipeline, packaging) instead of generic labels like "IoT flower" or "PCB project."

---

## Site design notes

- Warm stone / cream / amber editorial look on purpose. Not the default dark-neon developer portfolio aesthetic.
- Homepage hierarchy: staged hero → featured band → supporting builds → personal engineering direction.
- Media system for images, videos, diagrams, demos, and custom visuals.
- Project-intake scripts so adding work becomes a publishing workflow, not a one-off UI rewrite.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| App | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, Framer Motion, Lucide React |
| Deploy | Vercel |
| Content | Typed project model in `src/data/projects.ts` + case studies in `src/data/case-studies/` |

---

## Running locally

```bash
git clone https://github.com/Rellendula26/ritvik-portfolio.git
cd ritvik-portfolio
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

Useful scripts:

```bash
npm run build
npm run lint
npm run compress:video
npm run projects:intake:new
npm run projects:intake:sync
npm run projects:intake:analyze
```

---

## Adding a project

1. Drop media under `public/projects/...`
2. Add a project object in `src/data/projects.ts` (or use the intake scripts)
3. Optionally add a case study in `src/data/case-studies/` and register it in `src/data/engineering-case-study.ts`
4. Set `featured: true` only if it should sit in the flagship homepage band

---

## Reflection

The biggest lesson from building this portfolio: technical work does not automatically communicate itself.

A strong project can look shallow when the page only shows the final product. A smaller project can become meaningful when the page explains the learning objective, what failed, and what comes next.

So this repo is as much a technical-communication design problem as it is a frontend one. The important work is deciding what a reader needs in the first minute, and what should reward a deeper look.

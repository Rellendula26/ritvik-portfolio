# Portfolio audit

Second pass, November 21, 2026. Source of truth is the repo, not the live site. The homepage was left unchanged on purpose. The entrance animation was not built. Three options are in the chat, waiting on a choice.

## How the site is built

- Homepage: `src/app/page.tsx`, `HomeHero.tsx`, `HomeHeroIntro.tsx`, `EngineeringWorkbench.tsx`. It reads `FEATURED_PROJECTS`, `MAJOR_PROJECTS`, and `SUPPORTING_PROJECTS`.
- Projects directory: `src/app/projects/page.tsx`. It now reads `PROJECT_DIRECTORY`, which does not reorder those homepage arrays.
- Project pages: `src/app/projects/[slug]/page.tsx`. Pages with a case study use `EngineeringCaseStudyLayout`. Others use the generic hero, highlights, and galleries.
- Experiences: `src/data/experiences.ts`, rendered by `ExperiencePage.tsx`.
- Research: `src/app/research/page.tsx` and the four article pages.
- Voice: `.cursor/rules/content-voice.mdc`. Architecture: `project-information-architecture.mdc`. Media: `engineering-media.mdc`.

## Findings

### Homepage still leads with a placeholder and with software

- Page: `/`. Files: `src/app/page.tsx`, `FEATURED_SLUG_ORDER` in `src/data/projects.ts`.
- Existing: featured order starts with Vend-A-Shoe, the C compiler, PER, the tennis shooter, the saber, BloomBot, MiniTorch, and Drift Balancer. Current work (Serpent, GRASP, ADAPT) is a separate band.
- Issue: Drift Balancer's own summary says it is a page template, not a robot. A recruiter who only scrolls the featured band meets the compiler and the template before the boards.
- Why it matters: the 15-second read can miss the hardware.
- Proposed: move Drift off the featured band and lead that band with the boards, the arm, and the EMG work.
- Media: the V2 board photos and the leader-follower bench photo already exist.
- Verification: none for the template claim. He wrote it. Homepage edits are blocked until he asks.

### Project pages repeat the same story in too many sections

- Page: every case study. File: `EngineeringCaseStudyLayout.tsx`.
- Existing order was motivation, system, contribution, challenge, an executive block, timeline, breakdown, decisions, root cause, evolution, schedule, version 2, results, transferable skills, reflection.
- Issue: Vend-A-Shoe and the saber bury the outcome under the journal. A manager looking for "what works" has to scroll past the schedule.
- Why it matters: the 30-second read and the 3-minute read were the same page.
- Change made: breakdown, decisions, faults, and results stay open. Timeline, evolution, schedule, version 2, skills, and reflection sit in a collapsed "Bench notes" block. Nothing was deleted.
- Media: unchanged.
- Verification: click Notes on Vend-A-Shoe and the logic board and confirm the old sections are inside.

### Directory was sorted by "unfinished" rather than by what the work is

- Page: `/projects`. File: `src/app/projects/page.tsx`.
- Existing intro: "Unfinished work is first..."
- Issue: completion is not the same as engineering strength. The C compiler sat with the featured hardware.
- Change made: Selected engineering, other hardware, software, earlier coursework. Filters stay. Homepage bands stay on the old arrays.
- Verification: confirm Vend-A-Shoe resolves. Its record is in the generated intake, not the hand-written `slug:` list.

### Cards still speak in part numbers on the homepage

- Component: `ProjectCard.tsx`, field `oneLine`.
- Example, logic board: "Power and logic boards for SR-01. The logic board's servo path is a Teensy 4.1 into a PCA9685 at 50 Hz..."
- Issue: true, and too dense for a card. The project page is the right place for the bus.
- Why it matters: a recruiter cannot tell what the board is for.
- Proposed directory treatment: organization name on directory cards only. Homepage `oneLine` was not rewritten, because that string is what the homepage renders.
- Verification: not required.

### Logic and power boards are the strongest page, and the ownership is careful

- Page: `/projects/logic-pcb`. Files: `logic-pcb` case study, `BoardArchitecture.tsx`, `ServoBringUpStory.tsx`.
- What is solid: V1 homework pair versus V2 boards he tested, 12 V and 6 V meter readings, OE on GPIO 6, the grip-test cascade, the unfinished brushed-to-BLDC saw.
- Gap: no redrawn Altium schematic. The `.rar` is still packed. Fuse markings 15, 5, and 30 are not mapped to branches.
- Media in use: `logic-populated.jpg`, `power-modules.jpg`, `both-boards.jpg`, `scope-pwm.jpg`, `teensy-i2c.jpg`. Experience page also has an earlier power board, `public/experiences/serpent/power-board.jpg`, which is not the V2 he tested.
- Do not merge those photos.

### Leader-follower is a bench pair, not a cut on the robot

- Page: `/projects/leader-follower-robotic-arm` and the Serpent experience.
- Solid: he wrote the bridge, blue leader, white follower, mDNS after the hotspot broke a fixed IP, dead battery, jitter still open.
- Gap: a simple joint-map diagram does not exist. The clips need a check that one of them shows the follower moving when the leader moves.
- Do not say the arms are mounted on SR-01.

### BLDC clips are a bench bring-up, not the saw

- Page: `/experiences/serpent-robotics` only. No project route.
- Clips: `bldc-supply.mp4`, `bldc-bench.mp4`, `bldc-scope.mp4`, `bldc-frame.mp4`, with posters.
- What they show: supply at 24.00 V, a RobStride and a Pi, a hand on the rotor, a Rigol scope, a motor in a frame.
- Not shown: a finished cut, CAN, a loaded current, a scope measurement.
- Left out on purpose: two duplicate desk clips and a blurry clip of a person.
- Verification: confirm the terminal is position and velocity, and whether the frame motor is the saw.

### Bionic arm: one board is built, eight channels are the plan

- Page: `/projects/bionic-arm`.
- Solid: he designs EMG boards and mounts. One sensor board is built. The team slide says SPI daisy-chain. The sensor sheet breaks out CS1 through CS8. Those two disagree, and the page says so.
- Missing: a one-screen signal chain from muscle to ADC, and a power tree. Do not draw either from memory.
- Media: schematic stills and a photo of a projector slide. The slide has glare. It is evidence of the team's slide, not a clean figure.

### Multimodal printer and the 360 imager

- Printer: rotating nozzle, encoder, PID split out of one Arduino file. A feedback diagram would help. Do not add a step-response plot unless a CSV exists.
- Imager: TSL1401, nRF54L15, 128 values, live plot and panorama still open. The card should say it is a line sensor for a panorama, before the part number. Homepage oneLine was left as-is.

### Vend-A-Shoe

- Page: `/projects/vend-a-shoe`.
- Strong media already: CAD, protoboard, Pi, motor clips, dispense clips under `public/projects/vend-a-shoe/`.
- Issue: the timeline, the evolution, and the debugging pass the same incidents. They now share the notes drawer, but the prose is still duplicated inside it.
- 24 V incident: do not retell it until the case study and the experience page are read side by side. Flagged, not rewritten this pass.
- Distinguish a motor that moved from a shoe that left the machine. The dispense clip is the evidence for the second. Confirm which file that is before calling the unit finished.

### Tennis ball shooter

- The flywheels and the stepper feed are the machine. PWM duty versus speed is repeated. Cut the repeat on a later copy pass. Do not assign a root cause to the electrical failure unless the notes already name the measurement that proved it.

### Lightsaber

- The motivation is personal and should stay. Media should carry the hilt break and the new hilt. The airport clip is travel, and the caption already says so.

### Software

- C compiler and MiniTorch have real implementations and should stay technical. The compiler pipeline visual is useful if it matches the passes he wrote. Drift Balancer's visual is not evidence of a robot.
- Penn Plates, Count Coach, LabReach, Bhangra, Afterthought, the loan model, and the site itself are software. They now sit in that directory group.

### Experiences

- Serpent, GRASP, ADAPT, and BrainChild now get named in the directory intro at `src/app/experiences/page.tsx`.
- The Serpent body is specific. The fuse photo and the V2 photos must stay distinct.
- GRASP and ADAPT pages were not rewritten this pass. Their long technical paragraphs are the source of truth.

### Research

- DreamDiffusion is labeled an arXiv preprint. Redlining is a coauthored review that does not pool an effect size. Muscular dystrophy and the wage paper are SSRN.
- Do not upgrade any of them to peer-reviewed.
- The gene-expression result ("a subset of genes") was not re-checked against the paper this pass.

## Media inventory

| Asset | Project | What it is | Use |
| --- | --- | --- | --- |
| `public/projects/logic-pcb/logic-populated.jpg` | Logic PCB | V2 logic board he tested | Hero |
| `public/projects/logic-pcb/power-modules.jpg` | Logic PCB | V2 power board he tested | Hero, beside the logic board |
| `public/projects/logic-pcb/both-boards.jpg` | Logic PCB | V1 pair on the homework sheet | Context, not the tested boards |
| `public/projects/logic-pcb/scope-pwm.jpg` | Logic PCB | Scope during servo bring-up | Debug, not a logged pulse width |
| `public/projects/logic-pcb/teensy-i2c.jpg` | Logic PCB | Teensy on the logic board | Bring-up |
| `public/experiences/serpent/power-board.jpg` | Serpent | Earlier power board, fuses marked 15 and 5 | Experience only. Not V2 |
| `public/experiences/serpent/bldc-*.mp4` | Serpent experience | Bench RobStride bring-up | Experience section only |
| `public/projects/leader-follower-robotic-arm/bench.jpg` | Arms | Blue leader, white follower | Hero of that work |
| `public/projects/bionic-arm/` stills | ADAPT | Schematics and a photographed slide | Keep the CS versus daisy-chain disagreement |
| `public/projects/vend-a-shoe/` | Vend-A-Shoe | CAD, wiring, motor clips, dispense clips | Dispense clip belongs near the top on a later pass |
| `public/ritvik.jpg` | Homepage | Portrait | Homepage only |

Duplicates to watch: the V1 pair versus V2 boards, the early Serpent power photo versus `power-modules.jpg`, and three near-identical BLDC desk clips of which only one is published.

## Claims that need his check

- BLDC terminal really is position and velocity.
- Whether the motor in the aluminum frame is the saw motor.
- Which Vend-A-Shoe file is a completed dispense, and who owned the 24 V incident.
- Tennis-ball failure: observation versus a proven cause.
- Muscular-dystrophy sentences against the preprint.
- Drift Balancer staying on the homepage featured band.

## Do not publish without a look

- The packed Altium `.rar`.
- BLDC clip `IMG_9507` (a person, and a blurry board).
- Any scope photo where a voltage label would be guessed.
- Client interiors in the Vend-A-Shoe set, if a frame shows more than the machine.

## Photos and diagrams still worth shooting

- Leader and follower moving in the same clip, plus a six-joint map.
- EMG signal chain and the regulator tree, drawn from the schematic he has.
- Printer encoder and nozzle in one photo, with the loop written next to it.
- Vend-A-Shoe dispense at the top of that page, once the clip is identified.
- Saber: finished blade on, and the broken hilt next to the new one.

## What this pass changed

- Projects directory groups, without touching homepage arrays or `oneLine`.
- Case-study journal sections collapsed into Bench notes.
- Experiences index now names the four organizations.
- Three Cursor rules. Homepage copy is marked frozen in the voice rule.

## What this pass did not change

- Homepage layout, text, workbench, featured set, and animations.
- Individual project prose, apart from where the sections moved.
- An entrance animation.

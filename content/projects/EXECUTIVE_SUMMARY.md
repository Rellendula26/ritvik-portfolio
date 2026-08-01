# Executive Summary / Project Card Guide

Use this when writing the hero card for any project (`project.md` → page hero).
Goal: a 30–60 second skim that shows **engineering judgment**, not a parts list.

Voice rules for this portfolio:
- Sound like Ritvik; concrete, direct, first person when it helps.
- No em dashes. Prefer semicolons and varied sentence length.
- Keep technical scope; cut fluff, not depth.
- Prefer numbers over vague adjectives.

---

## What the hero must communicate in ~2 seconds

1. What kind of work it is (hardware / systems / ML / product)
2. That something real exists (demo, ship, client, deployment)
3. The accomplishment, not the shopping list of parts

Hardware pages should lead with **video of the thing working**.

---

## Structure (top → bottom)

| Block | Job | Budget |
|-------|-----|--------|
| Badges | Category, status, featured | 1 line |
| Title | Project name | 1 line |
| One-liner | Engineering accomplishment | 1 sentence |
| Overview | Context + integration challenge | ~60–90 words |
| Engineering highlights | 3 concrete bullets with numbers | 3 lines |
| Meta grid | Date, Focus, Build stage, Disciplines/Stack | 4 cells |
| CTAs | Source / Live demo | buttons |
| Tech pills | Skimmable stack tags | 6–12 pills |
| Hero media | Demo video preferred | right column |

---

## One-liner (under the title)

**Do:** say you engineered / designed / fabricated / shipped a system and name the disciplines.
**Don't:** list parts with "ties X, Y, and Z together."

Pattern:

> Designed, fabricated, and shipped a [client-facing / research / production] [electromechanical / embedded / …] system integrating [mech], [electrical], [embedded], and [cloud/software].

Vend-A-Shoe example:

> Designed, fabricated, and shipped a client-facing electromechanical dispensing system integrating custom mechanical design, embedded control, electrical integration, and cloud connectivity.

---

## Overview paragraph

Keep it short enough to skim (~80 words). Two beats:

1. **Context + what you owned** (internship/client/course; enclosure; power; control; cloud)
2. **Integration as the real problem** (subsystems coupled; packaging ↔ wiring ↔ software ↔ tolerances)

Put **metrics** in the prose or the highlights:
- `4 MG996R servos` not "servos"
- `8 LED indicators` not "LEDs"
- `40+ wire interconnects` not "dense harness"
- counts of boards, bins, revisions, joints when true

Avoid dumping the full architecture here; that belongs in the case study below.

---

## Engineering highlights (required)

Three bullets right under the overview. Each should stand alone as a recruiter skim.

Good:

- Designed a custom enclosure with 3D-printed fixtures and laser-cut panels for manufacturable assembly
- Integrated 4 MG996R servos, 8 LEDs, and a fan through a centralized power-distribution architecture with Raspberry Pi GPIO control
- Merged a new backend with an existing production frontend for remote cloud-triggered dispensing

Weak:

- "Worked on hardware and software"
- "Used Raspberry Pi and Python"
- Bullets that only restate the tech pills

Write them under `## Technical highlights` in `project.md`.

---

## Meta labels

| Label | Meaning | Prefer |
|-------|---------|--------|
| **Focus** (was "Signal") | Domain / engineering focus | `Electromechanical Systems`, `Embedded Systems`, `ML Systems`, `Product Engineering` |
| **Build stage** | Where it sits in the real world | `Client Deployment`, `Production Prototype`, `Shipped Demo`, `Lab Prototype` |
| **Disciplines** | What kinds of engineering you did | `Mechanical Design`, `Electrical Integration`, `Embedded Systems`, `Cloud Software` |
| **Stack** (fallback) | If no disciplines | first 1–2 stack items |

Prefer full discipline names over bare `Mechanical, Electrical, IoT`.

---

## Tech pills / tags

Skim layer. Put concrete tools and protocols people recognize:

`Raspberry Pi 4`, `Python`, `Onshape`, `GPIO`, `PWM`, `Supabase`, `USB-C PD`

Do not use the pills as a substitute for the one-liner or highlights.

---

## Intake fields (`project.md`)

```yaml
signal: "Electromechanical Systems"   # shown as Focus
buildStage: "Client Deployment"
disciplines: "Mechanical Design, Electrical Integration, Embedded Systems, Cloud Software"
tags: "Raspberry Pi 4, Python, Onshape, GPIO, PWM, ..."
```

```md
## Summary
- One-liner: accomplishment, not parts list.

## What I built
Short overview (~60–90 words). Metrics. Integration challenge.

## Technical highlights
- Highlight with a number
- Highlight with a number
- Highlight with a number
```

Then run `npm run projects:intake:sync`.

---

## Quick scorecard before shipping a card

- [ ] One-liner sounds like "I engineered a system," not "I connected parts"
- [ ] Overview under ~90 words
- [ ] Three highlights with at least one number each when possible
- [ ] Focus / Build stage / Disciplines use industry-readable wording
- [ ] Tech pills are concrete
- [ ] Hardware: demo video is the hero media
- [ ] No em dashes; voice still sounds like you
- [ ] Case study below can carry depth; hero stays skim-first

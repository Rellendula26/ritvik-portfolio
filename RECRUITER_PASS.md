# Recruiter pass

Branch: `recruiter-pass`.

A recruiter can now answer who I am, what I build, and where the résumé is without scrolling. Class year and the internship I want stay blank until I fill `CLASS_YEAR` and `INTERNSHIP_SEEKING` in `src/data/site.ts`.

## Plan

1. Résumé link in the navbar, the hero, and the footer. File: `src/data/site.ts`, `Navbar.tsx`, `HomeHeroIntro.tsx`, `SocialLinks.tsx`. Recruiter step: 10 s.
2. Hero rewrite: Penn EE, embedded systems / PCBs / robots, three current roles after a colon, site sentence kept, persistence moved down. Files: `HomeHeroIntro.tsx`, `src/app/page.tsx`. 10 s.
3. Homepage order: hero, three current-work lines, six selected projects, experience (including ADAPT), coursework, thinking, one contact block. Drop the workbench strip and the second project band. Files: `HomeHero.tsx`, `src/app/page.tsx`, `projects.ts`, `experiences.ts`. 10 s.
4. Card lines, status pills, dates, Drift off the featured list. Files: `projects.ts`, `projects.generated.json`. 30 s.
5. Three-line summary on project and experience pages. File: `PageSummary.tsx`, layouts, `page-summaries.ts`. 3 min.
6. Titles, sitemap, alt text, empty headings. 3 min.

## Status pills

Mapped in `displayBuildStage`. Nothing was upgraded into a stronger stage.

| Source | Pill |
|---|---|
| In Development | In development |
| Working Prototype | Working prototype |
| Bench Validated | Working prototype |
| Design Complete, Fabrication files ready | Ready for fabrication |
| Delivered, Client delivered, Deployed | Delivered |
| Archived | Archived |

`Analysis complete` and `Page template` are left as written. Those are finished write-ups and a template, and neither word is in the five-pill set.

Dates run through `displayDate`: `August` becomes `Aug.`, a hyphen between years becomes an en dash, and `High School`, `Course project`, and `Template 2026` leave the date field. The card sentence still says what those are.

## Homepage

Before: the intro was the EE sentence, the long persistence paragraph, and the site sentence, then "Let's connect." Current work, a featured band, and "More builds" repeated the same boards and the leader arm. Experience stopped at three industry roles, so ADAPT was missing. "Let's connect" also sat in the footer.

After: "Hey, I'm Ritvik!" then the EE sentence, then "Right now that work is in three places: Serpent Robotics, the GRASP Lab, and Penn ADAPT." The site sentence stays. The action row is Résumé, Projects, Email, LinkedIn, GitHub. Current work is three lines. Selected projects are Vend-A-Shoe, the logic board, the leader-follower bench, the EMG arm, the printer toolhead, and the ECG board. Experience includes Penn ADAPT. Persistence sits under "What I'm usually thinking about." The footer is the only contact block.

The drawn workbench left the hero. The portrait stayed. Bench photos on the project cards are the evidence.

## Cards

Vend-A-Shoe. Before: a sentence that led with Next.js, Supabase, a poll interval, and the MG996R. After: "A client shoe dispenser: a web command reaches a Pi, and four servos move the shoe." What I did stays the Bin 3 PWM sentence.

Logic board. Before: the one-line mixed the board with the Teensy bring-up. After: "Power and logic boards for a climbing robot, so actuator current stays off the controller." Contribution: I modified both boards, metered 12 V and 6 V on V2, and got one servo moving after the output-enable pin.

Leader arm. Before: "A small leader on the ground, and a follower up on the robot..." After: "A small leader stays with the operator; the follower is meant to make the cut from the robot."

Printer. Before: "headed for a military demo." After: "A rotating nozzle for GRASP's multimodal printer: the screen has to show the angle the shaft reached." The military line is off the public copy until I confirm it.

EMG arm. Before the contribution ended on "Two longer wires still keep a board out of the CAD mount." After: "One board still will not sit in the CAD mount, because two of its wires are too long."

## Page summaries

Logic board. What it is: power and logic boards so actuator current stays off the controller. What I did: modified both, metered the rails, and moved one servo after the output-enable pin. Where it stands: one servo moved at 50 Hz on V2 after GPIO 6 went low. The grip-test control board still needs a replacement.

Vend-A-Shoe. What it is: a client shoe dispenser, a web command, four servos. What I did: the Bin 3 duty sentence. Where it stands: the assembled unit was delivered. Closed-loop sensing is still open.

## Files

Phase 0 and voice: `.cursor/rules/content-voice.mdc`, `.cursor/rules/portfolio-voice.mdc`, this file, `OPEN_QUESTIONS.md`.

Phase 1: `public/resume.pdf`, `src/data/site.ts`, `HomeHeroIntro.tsx`, `Navbar.tsx`, `SocialLinks.tsx`, `src/app/layout.tsx`.

Phase 2: `HomeHero.tsx`, `src/app/page.tsx`, `EngineeringWorkbench.tsx`, `experiences.ts` (homepage list), `projects.ts` (`HOMEPAGE_SELECTED_PROJECTS`).

Phase 3: `projects.ts` (card lines, stage and date maps, Drift `featured: false`), `projects.generated.json`, `src/app/projects/page.tsx`.

Phase 4: `PageSummary.tsx`, `page-summaries.ts`, `EngineeringCaseStudyLayout.tsx`, `EcgSignalConditioningPage.tsx`, `ExperiencePage.tsx`, `ProjectBrief.tsx`, `multimodal-printer.ts`, `project-briefs.ts`.

Phase 5: project and experience metadata, coursework titles, research and life metadata, `src/app/projects/layout.tsx`, `sitemap.ts`, research alt text, gallery captions on the generic project page.

## Left alone

- The 24 V write-up on Vend-A-Shoe. It is told in the timeline, the evolution, and the debugging section because each one carries a different fact. I did not rewrite it.
- The tennis-ball PWM explanation. The design card is the mechanism. The later card is the unmeasured current, the fuse that stayed closed, and the melted insulation. Those are not the same sentence.
- Drift Balancer stays in Earlier work, `devOnly`, and says it is a page template.
- ECG stays last in Selected engineering projects. The card uses the landscape thumbnail. The detail hero stays the portrait board. The board is still not built.
- `src/app/page111.tsx` and `src/app/life/hi.tsx` are not in the tree. Nothing to delete.
## Media over 10 MB

Left as-is. Largest: `public/projects/ccv1demo.mp4` (40 MB), `ccv2demo.mp4` (27 MB), `public/life/gift6_fixed.png` (26 MB), `saber.mp4` and `lightsaber/saber.mp4` (25 MB each), `lightsaber/DEMO3.MOV` (21 MB), `fixingtetrissolder.mp4` (22 MB), `vend-a-shoe/VAS.mp4` (30 MB). Also over 10 MB: `bcbackend.mp4`, `bcsupabase.mp4`, `formingtetrissolder.mp4`, `saberfirstdemo.mp4`, Vend-A-Shoe clips `fullvideoinitialdemo.mp4`, `IMG_5411.MOV`, `IMG_1487.mov`, `entireworkingmodel.mp4`, `IMG_4840.MOV` (intake and the `vend-a-shoe/` copies), `tennis-ball-shooter/demo-with-app.mp4`, `life/mich.mp4`, `life/atl.jpg`, `life/holi2026.mp4`, `experiences/quantum-opus/IMG_6363.mp4`.
- Pre-existing "not just" and "end-to-end" lines in older case studies are still in the repo. The 24 V sentence that contains "not just a motor" stays, because that incident was flagged rather than rewritten.

## ADAPT

Penn ADAPT was missing from the homepage experience list because that list took the first three `track: "industry"` roles. ADAPT is `track: "club"`. The homepage now names it explicitly, with Serpent, GRASP, and BrainChild.

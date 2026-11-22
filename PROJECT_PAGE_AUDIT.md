# Project page audit

Measured from the local render at `http://127.0.0.1:3018` on 21 Nov 2026. "Open" is the text outside collapsed bench notes. "Notes" is the text inside `<details>`. Headings are the open `h2`s. Images and videos are counts in the page, including figures inside notes.

The homepage was checked separately. It does not use the project-page class. The visible Logic and Power PCB card still uses the previous one-line summary.

These ranges are the editorial guide, not a quota. A major page can stay longer when the extra words are the boards, the measurements, and the failures.

| Project | Open words | Notes words | Open h2s | Images | Videos | Band |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Logic and Power PCB | 3508 | 1119 | 13 | 7 | 0 | Major, still long |
| 360° UAV Imaging | 3410 | 619 | 8 | 13 | 1 | Major, still long |
| Leader-Follower Robotic Arm | 3054 | 405 | 8 | 4 | 4 | Major, still long |
| Vend-A-Shoe | 2752 | 1697 | 7 | 15 | 13 | Major |
| PER Power Electronics | 2391 | 227 | 6 | 15 | 0 | Major, still long |
| Tennis Ball Shooter | 2371 | 592 | 6 | 11 | 7 | Major |
| Bionic Arm | 2180 | 188 | 8 | 8 | 0 | Major |
| Multimodal 3D Printer | 2083 | 216 | 7 | 6 | 2 | Major |
| Drift Balancer | 2057 | 424 | 6 | 12 | 0 | Template page, not a robot |
| C Compiler | 2044 | 275 | 6 | 8 | 0 | Software, still long |
| Lightsaber | 2037 | 421 | 6 | 9 | 9 | Intermediate, on the long side |
| Afterthought | 1872 | 323 | 6 | 13 | 0 | Software |
| Hyperloop VFD | 1515 | 224 | 6 | 20 | 0 | Intermediate |
| BloomBot | 1420 | 271 | 6 | 2 | 7 | Intermediate |
| MiniTorch | 1348 | 209 | 6 | 7 | 0 | Intermediate |
| CIS 5450 loan default | 1332 | 187 | 6 | 4 | 0 | Coursework |
| Website | 1263 | 248 | 6 | 6 | 3 | Software |
| Ultrasonic PCB | 1125 | 182 | 6 | 12 | 0 | Intermediate |
| LabReach | 750 | 109 | 6 | 0 | 0 | Small, no photos |
| Arduino Tetris | 655 | 112 | 6 | 1 | 3 | Small |
| Count Coach | 586 | 98 | 6 | 1 | 2 | Small |
| Bhangra Coach | 574 | 104 | 6 | 1 | 2 | Small |
| Penn Plates | 504 | 97 | 6 | 0 | 2 | Small |
| OIDD | 486 | 97 | 6 | 3 | 0 | Coursework |
| Brain | 484 | 92 | 6 | 3 | 0 | Coursework |

Before this pass, the same render of Logic and Power PCB was about 4365 open words, 389 in notes, and 17 open headings. Tennis was 2398, the bionic arm 2209, and the imager 3454. The other pages were already at the counts above. I did not have a saved render from before the earlier bench-notes collapse, so those four are the before-and-after pair for this pass.

## What was uneven

Most case-study pages used the same six or eight headings: why it exists, how it fits together, what I took on, a discipline breakdown, decisions, what failed, and what held up. The sticky nav listed those as separate stops, so a major page felt like a dozen overlapping sections.

Logic and Power PCB was the dense one. The board explorer and the servo bring-up are the real page, and then the motivation, the contribution, the discipline cards, and the decisions told the grip test, the 12 V and 6 V checks, and the servo path again.

Paragraphs on project pages could run the full content width, about 75rem. That is too wide for a sentence.

Projects that still use the older gallery layout kept architecture photos, build photos, and clips in fixed-height boxes at the bottom. Every current project has a case study, so that path is the fallback.

## Logic and Power PCB

The open page now starts with the robot, the two boards, and the V2 photos. Power flow and information flow stay separate. The power section, the logic section, the annotated photos, and the servo bring-up stay in the open page. The grip-test write-up stays in "The fault." Status stays open.

These moved into bench notes, and the sentences that only repeated them were cut:

- The motivation paragraph no longer retells the servo chain or the five-second delay.
- The power-discipline challenges no longer retell the grip cascade or the unfinished saw change.
- Contribution, the design-challenge block, the discipline breakdown, and the design decisions are inside notes.

Nav is Boards, Bring-up, The fault, Status, Notes.

The open page is still about 3500 words because the block pickers keep every block's copy in the page, and the bring-up is seven checks. That is the engineering record. I did not delete the rail list or the I2C path to force it under 1400.

The homepage card still says the previous one-line, including the fried control board. A project-page-only lead replaces that sentence on the project page.

## Repetition I removed

- Bionic arm: "I design the PCBs and the mounts" was in the why, the narrative, and the system summary. The role stays in the why. The narrative starts at the board that exists.
- 360° imager: the second paragraph no longer re-teaches the photon and the junction. The sensor and the nRF54L15 stay in the first paragraph. Later sections should use "the line sensor" and "the board" unless a new fact needs the part number.
- Tennis shooter: PWM physics stays in the MOSFET decision. The hero, the launcher line, and the electrical design paragraph no longer explain duty cycle and inductance again.
- Bionic arm, continued: the project-page overview and the first highlight no longer restate the role. The homepage card still says "I design the boards and the mounts," because that sentence is the card.

Vend-A-Shoe, the lightsaber, and the ultrasonic board still tell the servo fault, the mechanical break, and the schematic-to-fab path inside the discipline section and again in decisions. I did not merge those sections in this pass. Cutting them without rereading each claim would drop a measurement.

## Formatting

- Project pages get a `project-page` class. Headings and body paragraphs cap at 46rem. The homepage does not use that class.
- Case-study nav is five items on the logic page and six on the others: Overview, Architecture, My work, Challenges or Decisions, Results, Notes. The sections are still on the page. The nav is the skim.
- The legacy gallery, if a project has no case study, sits under the hero. Those images use `object-contain` in a 4:3 frame instead of a fixed 280px crop. Clips use a 16:9 frame.

## Media gaps

Do not invent these. They are the shots and exports that would help.

- Logic and Power PCB: a photo of the replacement control board once it exists. A meter photo next to the 12 V and 6 V claim. A fuse close-up that can be mapped to a branch. Leave the Altium project packed.
- Leader-follower: a clip of the follower matching a motion, and a photo of the leader arm and the follower arm in the same frame. Four images is thin for the length.
- Bionic arm: the built sensor board next to the September sheet, and a photo of the two wires that keep the board out of the mount.
- 360° imager: one live scan, pixel index against brightness, once that run exists. The current figures are the earlier finger pass and the still scene.
- Vend-A-Shoe: the photos and clips are already numerous. They need to stay next to the harness, the protoboard, and the dispense, not collected as a second gallery.
- LabReach, Penn Plates: no still images. A screenshot of the actual screen is enough. Do not add a stock illustration.
- Count Coach, Bhangra Coach, Tetris: one still each. A second screenshot of the state that matters (a count, a rep, a placed piece) would carry the page.
- Drift Balancer: the page says it is a template. It should not gain fake robot photos.

## Video pass, 21 Nov 2026

The logic and power page had no clips of the boards. The servo clip leads that page. The Rigol from that session and the header soldering stay in the logic section. The captions do not read a pulse width or a scope grid, and they do not say the horn moved. A still of both boards is under the two-board intro. The meter in that frame reads 0.000, which is not a rail check. The power section opens on a different board from the V2 ATAZ photo: yellow XT60, a grey part marked 220 and 2603, and fuses marked 7.5, 5, and 40, plus one marking I cannot read. The four BLDC bench clips are only on the Serpent experience page.

Clips that were already in `public/` and not on a page:

- Tennis: the Elegoo Mega breadboard, the ESP32 harness, the blurry yellow motor, and the setup screen. The MOSFET module clip was already next to the electrical section, so the bagged module clip was left out.
- Leader-follower: the bench teleop clip, next to the actuation section.
- Count Coach: the two Colab notebooks, ahead of the deployed demo.
- Bhangra Coach: the Railway service page and the Supabase dashboard, next to the feedback clip.

Pages that still have no video file in the repo: C compiler, MiniTorch, ultrasonic PCB, PER, Hyperloop VFD, Afterthought, LabReach, Brain, OIDD, Drift Balancer, and the bionic arm. Those need a recording. I did not add a stand-in.

Homepage card sentences were left as they are, including "kill leakage", "actually shipped", and "cues that actually mean something". The project pages use a separate lead for those four.

## Claims I did not upgrade

- The grip-test cascade is the shop note. I do not have a photo of the fried board.
- 12 V and 6 V are meter checks. Nominal 24 V is the sheet. The fuse photos are three different markings, 15 and 5, holders marked 30, and 7.5, 5, and 40. None of them is a branch map.
- The brushed-to-BLDC saw change is not finished.
- Tennis: a fast flywheel, a detached joint, and melted insulation are observations. I did not measure the current.
- The imager has not run a hardware readout or BLE. A panorama still needs an angle tag.
- Drift Balancer remains on the homepage until a homepage edit is explicitly requested.

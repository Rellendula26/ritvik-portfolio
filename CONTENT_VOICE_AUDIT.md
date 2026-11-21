# Content voice audit

Reviewed the visitor-facing copy in `src/data`, `src/app`, and the homepage components. The technical pages are often specific. The problem is the layer around them: slogan lessons, three-word sentences, and contrasts that announce a moral instead of saying what happened.

Factual numbers, part numbers, and ownership were left alone unless a sentence was only a slogan. Lines marked "verify" are places I was not willing to invent a smoother story.

## Homepage

### `src/components/HomeHeroIntro.tsx`

Current: "I made this site to keep a record of the work, not just the finished version."

Why: "Not just X" is the contrast pattern. The next sentence already says the projects include decisions and setbacks.

Replacement: "I made this site so the decisions and the setbacks stay with the finished version."

Verify: no.

### `src/app/page.tsx`

Current: "I keep coming back to a command, a sensor, and a motor or a rail that has to do what the code asked."

Why: It is trying to sound like a thesis. He does work on those things, but this sentence performs the interest instead of stating it.

Replacement: "A lot of what I work on is the same shape. A command or a sensor has to move something, and the supply has to stay up while it does."

Verify: no. This is a description of the work already on the site, not a new claim.

### `src/components/Footer.tsx`

Current: "Thanks for stopping by, always happy to talk about a project, idea, or something half-built on my desk."

Why: Stock portfolio closer. "Always happy" is the part that sounds generated.

Replacement: "If you want to talk about a project, or something still on the bench, email me."

Verify: no.

### `src/components/lab/EngineeringWorkbench.tsx`

Current scope tooltip: "Quantum Opus. I set the attenuation and captured the detector pulse. These shapes are not that trace."

Why: The second sentence is a disclaimer aimed at the website, not at a person looking at a scope.

Replacement: "At Quantum Opus I set the attenuation and captured the detector pulse on a scope. Switch the shape here if you want to see the kinds of signals I work with."

Verify: the page still must not present the drawn waveform as his captured trace. The replacement keeps that distinction without the defensive second sentence. Same treatment on the PWM, square, and I2C notes.

## Projects index

### `src/app/projects/page.tsx`

Current featured subtitle: "Physical systems first: robotics, embedded control, electronics, and low-level systems."

Why: A category slogan. The cards already show what the projects are.

Replacement: "The builds I spend the most time on."

Current supporting subtitle: "Smaller projects that still taught me something specific about architecture, debugging, or system behavior."

Why: Every portfolio says the small projects taught a lesson. It does not name one.

Replacement: "Smaller builds, including experiments and class projects."

Current archive subtitle: "Course and earlier builds. I keep them here for context because they show how my approach changed over time."

Why: Explains the website's information architecture instead of the work.

Replacement: "Older course projects and early builds."

Verify: no.

## Project cards and lessons

Source: `src/data/projects.ts`. Cards render `oneLine`. The lesson lists are where the voice breaks most often. Specific lessons (the leader arm packet, the PCA9685 enable pin, the tennis-ball PWM note) are fine and stay.

### MiniTorch card

Current oneLine: "Reverse-mode autodiff in OCaml. Forward builds a graph. Backward fills grads. Finite-difference gradcheck is how I catch a wrong gradient."

Why: This is the fragment pattern called out in the brief. The engineering is real. The rhythm is not how he talks.

Replacement: "Reverse-mode autodiff in OCaml. The forward pass builds a graph, backpropagation fills the gradients, and I check them with finite differences."

Current lessons: "Math correctness needs numerical checks, not confidence." / "Strong types catch structure issues, not calculus mistakes." / "Loss curves confirm integration; they do not replace gradcheck."

Replacement: three sentences about the finite-difference check, what the types do not catch, and why a falling loss is not enough.

### C compiler lessons

Current: "Compiler complexity is preserving meaning across representations, not recognizing syntax."

Why: Aphorism. The overview above it already tells the story in his voice.

Replacement: "The hard part is keeping the program's meaning while it moves from C to assembly."

### BloomBot lessons

Current: "Hardware reliability is mostly integration discipline." / "Live demo confidence comes from failure-mode rehearsal."

Why: Could sit on any hardware project. The overview already names brownouts, WiFi retries, and the LCD.

Replacement: sentences about servo current, rehearsing the WiFi failure, and using the LCD so the demo does not need a laptop.

### Lightsaber lessons

Current: "The schematic is rarely the schedule risk; packaging and structural reliability are." / "Failure analysis beats stronger glue when the load path is wrong."

Why: Poster lines. The hilt breaking is the actual story.

Replacement: the blade bent the printed hilt, glue would not have moved the load, and the short LED lead had to be salvaged.

### Ultrasonic PCB, PER, Hyperloop, Afterthought, CIS 5450, LabReach, Count Coach, Tetris, Bhangra Coach, Penn Plates, this website, the brain model, OIDD, Drift

Same issue: the lesson slot is a proverb ("Power stages are system decisions", "Shipping on time is an engineering constraint", "Technical work does not automatically communicate itself").

Replacement: one or two sentences that restate the specific decision already documented in that project's overview. No new results.

Verify: I did not add failures or numbers that were not already in the overview.

### Logic PCB lesson

Current: "The handwritten numbers under the boards in one photo are ESE 2150 homework. They are not rail measurements."

Why: Needed, because the photo is easy to misread. The tone is a correction aimed at a future editor.

Replacement: "The numbers written on the homework sheet under the boards are from ESE 2150. I measured 12 V and 6 V later, on V2."

Verify: yes if he wants that photo mentioned in the lesson list at all. The fact is already on the project page.

## Case study openings

These are the first paragraphs on the project pages.

### `src/data/case-studies/vend-a-shoe.ts`

Current: "A breadboard demo was never the finish line."

Why: The banned finish-line contrast. The client need is the real point.

Replacement: "The client needed a unit that could run outside the lab, so the breadboard was only the start."

### `src/data/case-studies/c-compiler.ts`

Current why: "Building a compiler seemed like the cleanest way to stop pretending."

Current summary: "If it does not, the architecture is lying."

Why: Both lines perform attitude. The passes are the interesting part.

Replacement: he used clang without knowing the passes, so he wrote them. Each stage should make the next one easier to write.

### `src/data/case-studies/minitorch.ts`

Current: "If backprop is the whole game, I wanted to implement it." / "Gradcheck is the real test."

Why: Contrast slogans on top of a clear project.

Replacement: he did not want backpropagation to stay a library call. The finite-difference check is what he trusts when the loss moves.

### `src/data/case-studies/cis5450.ts`

Current: "I wanted a tabular ML project where the scary part was not the model library. Leakage and bad metrics can make you look smart while being wrong."

Why: "Scary part" and "look smart" are written for effect.

Replacement: the work was keeping the split and the metric honest, because a leaked column makes the score meaningless.

### `src/data/case-studies/website.ts`

Current: "My earlier portfolio showed what I built without consistently showing why it mattered..."

Why: Essay about portfolios. He can just say the old site listed projects and left out the failures.

Replacement: "The old site listed projects and left out what failed and what I decided. I wanted those notes on the page."

### `src/data/case-studies/product-apps.ts`

Current: "Dining coordination for students, not a feature museum."

Why: Contrast joke, not an explanation.

Replacement: "A SPARK project for students coordinating dinner, with a small set of screens."

Current Bhangra why is good and should stay. It comes from dancing. Count Coach's "where's that count" line is also his and stays.

### `src/data/engineering-case-study.ts` (lightsaber, rendered)

Current caption: "Not evidence. Just me taking the blade through the airport; funny travel still, zero engineering substance."

Why: A disclaimer about the website's standards. The clip can just say what it is.

Replacement: "Carrying the blade through the airport. This is a travel clip, not a test."

Current: "Pad-soldered LED joint is robust enough for use; it is still a scar from a packaging miss."

Why: "Robust" and "scar" are doing style work.

Replacement: "The pad-soldered LED joint has held. It is still the repair from a lead that was too short."

### `src/data/case-studies/hyperloop-vfd.ts`

Current: "Without devices that can chop the bus cleanly, PWM control is fiction."

Why: "Fiction" is a punchline. The point is that PWM needs switches that can actually open and close the bus.

Replacement: "PWM only exists if the switches can connect the motor phases to the bus and disconnect them."

Verify: this is a restatement of the same design point, not a new measurement.

## Research, life, coursework

### `src/app/research/page.tsx`

Current subtitle: "Research work across EEG modeling, public-health evidence review, genomics ML, and labor-market econometrics."

Why: A keyword list.

Replacement: name the four projects in plain language.

Muscular dystrophy blurb: "reported model limits directly" sounds like a policy. Say the write-up includes where the models stop working.

Econometrics blurb: "interpretation discipline" is vague. Say the work was the model specification and the ANOVA assumptions.

Verify: do not upgrade the EEG preprint, the review, or the SSRN papers. Those limits stay.

### `src/app/life/page.tsx`

Current subtitle: "Some hobbies that add some spice to life."

Why: Filler. The hobbies are specific.

Replacement: "Dance, running, video, and gifts."

Gift blurb: "learning everything" and "stellar presents" oversell a real hobby.

Replacement: he likes making gifts, Penn has free printing, and he learned enough CAD to make something for a specific person.

The dance, edit, and endurance blurbs are already close to how he talks. They stay, including the race times.

### Coursework

`src/app/coursework/page.tsx` and `src/data/coursework.ts` are mostly measurements from the lab reports. That voice is already concrete. I am not smoothing the numbers into a story.

## Left alone on purpose

- Leader-follower, logic PCB, bionic arm, printer, and imager bodies. They already say what he did, what the team built, and what is open. Rewriting them into "warmer" prose would sand off the measurements.
- The persistence paragraph on the homepage. He wrote that version.
- "Building stuff I find cool."
- Experience pages that already separate his work from shop notes. A full second pass would risk merging those boundaries.
- `src/data/case-studies.ts` (`CASE_STUDIES`) does not appear to be imported by a page. I did not rewrite dead copy.

## Needs his verification

- Whether the airport lightsaber clip should stay on the page at all. I only changed the caption.
- Whether the ESE 2150 homework sentence belongs in the logic PCB lesson list or only next to the photo.
- Research cards: I did not re-read the papers in this pass. Blurb edits stay inside the claims already on the page.
- I did not confirm every "I" in older class projects (Penn Plates, OIDD, the brain print) against a lab notebook. Those lesson rewrites only repeat the overview.

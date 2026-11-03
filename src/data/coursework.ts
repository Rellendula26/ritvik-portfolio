/**
 * Coursework content.
 *
 * Add a course by appending a record here. Add a lab by appending a Lab
 * whose courseSlug matches the course. Pages read these records. They do
 * not need a new layout.
 *
 * Media and reports:
 * Put images and PDFs in public/coursework/<course-slug>/.
 * Point src and report.href at those site paths, for example
 * /coursework/ese-2150/lab-01/report.pdf.
 * Do not paste a raw Google Drive share link into src or href.
 * A Drive link is a webpage, not an image or a PDF the site can render.
 * Export the file, drop it in public/, and use the site path.
 *
 * Replacing a lab PDF is a one-line change to report.href.
 *
 * devOnly labs render only when NODE_ENV is development. They are sample
 * layout content, not published coursework.
 */

export type CourseMedia = {
  src: string;
  alt: string;
  caption?: string;
  /** Crop anchor, 0–100. Defaults to the center. */
  focal?: { x: number; y: number };
};

export type LabDownload = {
  href: string;
  label: string;
};

export type Lab = {
  slug: string;
  courseSlug: string;
  number: number;
  title: string;
  description: string;
  objective?: string;
  takeaway?: string;
  setup?: string;
  discussion?: string;
  /** LaTeX source, rendered as text until a typesetter is wired in. */
  equation?: string;
  thumbnail?: CourseMedia;
  media?: CourseMedia[];
  report?: { href: string; label?: string };
  latexSource?: LabDownload;
  data?: LabDownload;
  code?: LabDownload;
  simulation?: LabDownload;
  references?: string[];
  collaborators?: string[];
  /** Sample layout content. Hidden in production. */
  devOnly?: boolean;
};

export type Course = {
  slug: string;
  code: string;
  title: string;
  description: string;
  semester?: string;
  tools?: string[];
  /** Short measured results for the course card and the homepage. */
  highlights?: string[];
  /** Card image. Also the course-page banner unless `hero` is set. */
  cover?: CourseMedia;
  /** Course-page banner when it should differ from the card. */
  hero?: CourseMedia;
  /** Lab the cover image opens. The course page links the banner here. */
  coverLabSlug?: string;
  /** Lab slugs, in the order they should appear as featured cards. */
  featuredLabSlugs: string[];
};

const COURSES_ALL: Course[] = [
  {
    slug: "ese-2150",
    code: "ESE 2150",
    title: "Circuits & Systems",
    description:
      "Fall 2026. I build the circuit, then put a meter on it. A Wheatstone bridge, nodal and mesh checks, an LM324AN comparator that switches from about -5 V to about 3.76 V, a voltage follower that tracks to 3.5 V, and a 3-bit DAC. Labs 2 through 5 have reports. Lab 6, series RLC, is assigned and not written up yet.",
    semester: "Fall 2026",
    tools: ["Keysight E36441A", "Bench multimeters", "Oscilloscope", "LM324AN", "LTspice"],
    highlights: [
      "LM324AN comparator output sat near -4.997 V, then switched to about 3.758 V on ±5 V rails.",
      "The voltage follower tracked the input from 0 V to 3.5 V, then stopped near 3.75 V.",
      "Wheatstone bridge, nodal and mesh checks, and a 3-bit DAC, each with a report.",
    ],
    cover: {
      src: "/coursework/ese-2150/cover.jpg",
      alt: "Lab 4 plot of comparator output voltage against the non-inverting input",
      caption: "Lab 4. The LM324AN output switches from about -5 V to about 3.76 V. The dashed step is illustrative.",
    },
    featuredLabSlugs: [
      "wheatstone-bridge",
      "nodal-mesh",
      "op-amp-comparator",
      "voltage-follower-dac",
    ],
  },
  {
    slug: "ese-2180",
    code: "ESE 2180",
    title: "Electronic & Photonic Devices",
    description:
      "Fall 2026. I measure the optical and electrical behavior of real semiconductors: band gaps on a Cary 5000, photoluminescence of GaAs and InP, LED composition from emission spectra, and a silicon cell under a phone flashlight. Labs 2, 3, and 4 have reports.",
    semester: "Fall 2026",
    tools: ["Cary 5000", "405 nm and 633 nm lasers", "LEDs", "Silicon solar cell", "CdS photoresistor"],
    highlights: [
      "Absorption band gaps from Si at 1.125 eV (0.4% off 1.120) to GaAs at 1.393 eV (2.2% off 1.424).",
      "GaAs photoluminescence peaked at 871 nm, 1.424 eV, 0.03% from the known gap.",
      "Silicon cell under a phone flashlight: 545 mV open circuit, fill factor 0.79, about 16.7% estimated efficiency against the 1-sun label.",
    ],
    cover: {
      src: "/coursework/ese-2180/cover.jpg",
      alt: "Lab 4 plot of silicon-cell current against voltage, in the dark and under a phone flashlight",
      caption:
        "Lab 4. The illuminated cell holds near -26 mA, then turns on. The dark curve stays near zero until forward bias. Open the lab for the sweep and the fill factor.",
    },
    coverLabSlug: "photovoltaics",
    featuredLabSlugs: ["absorption-emission", "leds", "photovoltaics"],
  },
];

const LABS_ALL: Lab[] = [
  {
    slug: "wheatstone-bridge",
    courseSlug: "ese-2150",
    number: 2,
    title: "Wheatstone Bridge Characterization and LED Resistance",
    description:
      "I balanced a Wheatstone bridge with known resistors and recorded the bridge voltage, then measured LED resistance on the same bench.",
    objective:
      "Characterize the bridge with the bench supply and two voltmeters, then measure how an LED's resistance changes.",
    takeaway:
      "After the bridge was balanced, the voltage on the adjustable side fell as Rx increased, at both a 2 V supply and a 3 V supply.",
    setup:
      "Breadboard bridge, two benchtop multimeters, and the bench supply. Rx values in the report are 2.2 kΩ, 4.7 kΩ, and 10 kΩ.",
    collaborators: ["Ritvik Ellendula", "Sudhir Yelamarthy"],
    report: { href: "/coursework/ese-2150/lab-02/report.pdf", label: "Lab 2 report" },
  },
  {
    slug: "nodal-mesh",
    courseSlug: "ese-2150",
    number: 3,
    title: "Experimental Verification of Nodal and Mesh Analysis",
    description:
      "I built the resistor network and compared meter readings with nodal and mesh analysis.",
    objective:
      "Solve the circuit both ways, then measure node voltages and branch currents on the breadboard.",
    takeaway:
      "I measured the node voltages and the marked branch currents and set them next to the calculated values.",
    setup:
      "100 Ω, 470 Ω, and 1 kΩ resistors on a breadboard. Keysight E36441A with a 0.1 A current limit. A digital multimeter for node voltage and series current.",
    collaborators: ["Gonzalo Cuervo", "Ritvik Ellendula"],
    report: { href: "/coursework/ese-2150/lab-03/report.pdf", label: "Lab 3 report" },
  },
  {
    slug: "op-amp-comparator",
    courseSlug: "ese-2150",
    number: 4,
    title: "Op-Amp Comparators and an Intensity Display System",
    description:
      "Power an LM324AN and use one amplifier as a comparator, then use that comparator in an intensity display.",
    objective:
      "Bring the LM324AN up from +5 V and -5 V, confirm the comparator switches, and use it in an intensity display.",
    takeaway:
      "The inverting input stayed near 2.5 V. The output sat near -4.997 V, then switched to about 3.758 V. With ±5 V rails the LM324AN reaches the negative rail and stops short of the positive one.",
    setup:
      "LM324AN, 4.7 kΩ resistors checked with an ohmmeter, and a voltmeter referenced to circuit ground.",
    collaborators: ["Ronak Suchindra", "Ritvik Ellendula"],
    report: { href: "/coursework/ese-2150/lab-04/report.pdf", label: "Lab 4 report" },
  },
  {
    slug: "voltage-follower-dac",
    courseSlug: "ese-2150",
    number: 5,
    title: "Voltage Follower, Cascaded Amplifiers, and a 3-Bit DAC",
    description:
      "I closed an LM324AN as a voltage follower, cascaded amplifiers, and built a 3-bit DAC.",
    objective:
      "Measure follower input against output, then use the same amplifier family for the cascade and the DAC.",
    takeaway:
      "From 0 V to 3.5 V the follower output stayed with the input. Above that it stopped rising and sat near 3.75 V.",
    setup:
      "One amplifier in an LM324AN. Two supply channels tied into a ±5 V pair, with the shared node as ground. A trimmer sets the follower input.",
    collaborators: ["Yuki Qian", "Ritvik Ellendula"],
    report: { href: "/coursework/ese-2150/lab-05/report.pdf", label: "Lab 5 report" },
  },
  // No report yet. Drop the PDF at public/coursework/ese-2150/lab-06/report.pdf
  // and add report: { href: "/coursework/ese-2150/lab-06/report.pdf", label: "Lab 6 report" }.
  {
    slug: "rlc-damping",
    courseSlug: "ese-2150",
    number: 6,
    title: "Series RLC Damping, Measurement, and Resonance",
    description:
      "Assigned, not written up. Due November 6, 2026.",
    objective:
      "Simulate series RLC damping in LTspice, build and measure the circuit, then look at resonance.",
    takeaway: "I haven't posted measurements for this lab.",
    setup: "LTspice for the damping study. The bench build is the measurement section.",
  },
  {
    slug: "absorption-emission",
    courseSlug: "ese-2180",
    number: 2,
    title: "Semiconductor Absorption and Emission",
    description:
      "I measured transmission on a Cary 5000 and photoluminescence under 405 nm and 633 nm lasers, then pulled band gaps out of both.",
    objective:
      "Tell a direct gap from an indirect gap by the shape of the absorption edge, and check that edge against the light the crystal emits.",
    takeaway:
      "Silicon came out at 1.125 eV against a known 1.120 eV (0.4%). GaAs absorption was 1.393 eV against 1.424 eV (2.2%). GaAs photoluminescence peaked at 871 nm, 1.424 eV, 0.03% from that known gap. CdS emitted at 509.4 nm under 405 nm and not under 633 nm, because 1.96 eV is below its 2.42 eV gap.",
    setup:
      "Cary 5000, 4000 to 20000 cm⁻¹, on GaSb, Ge, Si, GaAs, GaP, and CdS. Photoluminescence on GaAs, InP, CdS, and ZnO with a 405 nm laser (3.06 eV) and a 633 nm laser (1.96 eV), grating 100, acquisition 5 s, four accumulations, laser power at 1% or lower.",
    discussion:
      "A direct edge drops within a few tens of meV because the transition needs no phonon. An indirect edge spreads over about 0.1 to 0.2 eV. Absorption and photoluminescence read the same band edges from opposite directions: a photon promotes an electron, then the carriers fall back and emit near the gap. They are not identical. The absorption fit on a thick sample extrapolates from the tail below the gap, and the linear region I chose moves the intercept. ZnO's gap is 3.20 eV, above both lasers, so there was no band-edge emission.",
    collaborators: ["Yuchang Liu", "Keyi Ma", "Camille Mou", "Ritvik Ellendula"],
    thumbnail: {
      src: "/coursework/ese-2180/lab-02/plot.jpg",
      alt: "Silicon absorption plot. The fit crosses 1.125 eV and the known gap is 1.120 eV.",
      caption: "Silicon, indirect. The linear fit crosses at 1.125 eV. The known gap is 1.120 eV.",
    },
    media: [
      {
        src: "/coursework/ese-2180/lab-02/plot.jpg",
        alt: "Silicon absorption plot. The fit crosses 1.125 eV and the known gap is 1.120 eV.",
        caption: "Silicon, indirect. The linear fit crosses at 1.125 eV. The known gap is 1.120 eV.",
      },
    ],
    report: { href: "/coursework/ese-2180/lab-02/report.pdf", label: "Lab 2 report" },
  },
  {
    slug: "leds",
    courseSlug: "ese-2180",
    number: 3,
    title: "Light-Emitting Diodes",
    description:
      "I measured red, green, blue, and white LEDs on the bench, then read composition off the emission peaks.",
    objective:
      "Get a forward voltage from the I-V curve, an ideality factor from the log plot, and a semiconductor composition from the spectrum.",
    takeaway:
      "On the continuous curves the forward voltages were 1.7 V red, 2.3 V green, 2.4 V blue, and 2.6 V white. Ideality factors at 300 K were 1.46, 1.88, 1.80, and 1.33. The peaks put the blue LED at In0.20Ga0.80N, the green at In0.28Ga0.72N, and the red at In0.46Ga0.54P.",
    setup:
      "Each LED in series with its current-limit resistor, ramped from 1 V to 3.5 V in 0.1 V steps, plus a continuous I-V set for the fit. Emission spectra at 3.5 V with a 220 Ω series resistor. A red laser and a phone flashlight as the comparison sources.",
    discussion:
      "The 0.1 V steps only locate turn-on to about that size, so the continuous set is the one I trust for forward voltage. The green LED's discrete turn-on sat near 2.5 V, above the continuous 2.3 V, and not where the band gap alone would have put it. The red laser peaked at the same wavelength as the red LED and was much narrower. The white LED had three peaks, 450.52 nm, 532.35 nm, and 555.19 nm. The phone flashlight was a broader pile of peaks, not three clean lines. For a red emitter I would pick InGaP over AlGaAs: a red AlGaAs composition sits near the direct-to-indirect crossover, and that cuts radiative efficiency.",
    collaborators: ["Joshua Mori", "Aadam Mulla", "Ritvik Ellendula", "Abhir Kewalramani"],
    thumbnail: {
      src: "/coursework/ese-2180/lab-03/plot.jpg",
      alt: "Green LED current against voltage, turning on near 2.5 V",
      caption: "Green LED. Current stays near zero until about 2.5 V, then climbs.",
    },
    media: [
      {
        src: "/coursework/ese-2180/lab-03/plot.jpg",
        alt: "Green LED current against voltage, turning on near 2.5 V",
        caption: "Green LED. Current stays near zero until about 2.5 V, then climbs.",
      },
    ],
    report: { href: "/coursework/ese-2180/lab-03/report.pdf", label: "Lab 3 report" },
  },
  {
    slug: "photovoltaics",
    courseSlug: "ese-2180",
    number: 4,
    title: "Photovoltaics and Photodetectors",
    description:
      "I swept a silicon solar cell in the dark and under a phone flashlight, then measured a CdS photoresistor under red, green, and blue LEDs.",
    objective:
      "Find open-circuit voltage, short-circuit current, fill factor, and an efficiency estimate, then see which color moves the CdS resistance.",
    takeaway:
      "Under the flashlight the cell gave 545 mV open circuit and a fill factor of 0.79. Maximum power was 11.24 mW. Scaling the short-circuit current against the 1-sun label (0.6 V, 312 mA, 8 cm²) put the optical input near 67 mW and the efficiency near 16.7%. That is an estimate. A phone flashlight is not the solar spectrum.",
    setup:
      "Silicon cell, supply, ammeter, and voltmeter. Dark sweep in 50 mV steps until about 20 mA, then reverse from -100 mV to -600 mV. The same sweep with the phone flashlight fixed in place. CdS photoresistor from -0.5 V to 0.5 V in the dark and under red, green, and blue LEDs.",
    discussion:
      "Short-circuit current fell with the flashlight, 26.2 mA to 14.3 mA to 5.47 mA. Open-circuit voltage only moved from 545 mV to 526 mV to 495 mV. Current tracks intensity. Voltage is logarithmic in that current. Under illumination the supply would not go below 268 mV, because the cell was already making a voltage. On the CdS, dark resistance was about 4545 Ω. Blue dropped it to 3289 Ω. Red and green landed near 4050 Ω and 4080 Ω. The gap is about 2.42 eV, a cutoff near 517 nm, so blue should win. The green LED voltages did not give a clean trend: 2.8 V read lower resistance than 2.6 V and 3 V, which I treated as an outlier, not a material result. A bigger cell or a brighter lamp raises power. Neither one raises efficiency by itself.",
    thumbnail: {
      src: "/coursework/ese-2180/lab-04/plot.jpg",
      alt: "Silicon cell current against voltage, dark and illuminated by a phone flashlight",
      caption:
        "Dark current stays near zero. Under the flashlight the cell sits near -26 mA until it turns on.",
    },
    media: [
      {
        src: "/coursework/ese-2180/lab-04/plot.jpg",
        alt: "Silicon cell current against voltage, dark and illuminated by a phone flashlight",
        caption:
          "Dark current stays near zero. Under the flashlight the cell sits near -26 mA until it turns on.",
      },
    ],
    report: { href: "/coursework/ese-2180/lab-04/report.pdf", label: "Lab 4 report" },
  },
];

function isLabVisible(lab: Lab) {
  return !lab.devOnly || process.env.NODE_ENV === "development";
}

export const LABS = LABS_ALL.filter(isLabVisible);

export const COURSES = COURSES_ALL;

export function getCourse(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}

export function getLabsForCourse(courseSlug: string) {
  return LABS.filter((lab) => lab.courseSlug === courseSlug).sort(
    (a, b) => a.number - b.number
  );
}

export function getFeaturedLabs(course: Course) {
  const labs = getLabsForCourse(course.slug);
  return course.featuredLabSlugs
    .map((slug) => labs.find((lab) => lab.slug === slug))
    .filter((lab): lab is Lab => Boolean(lab));
}

export function getLab(courseSlug: string, labSlug: string) {
  return getLabsForCourse(courseSlug).find((lab) => lab.slug === labSlug);
}

export function courseHref(slug: string) {
  return `/coursework/${slug}`;
}

export function labHref(courseSlug: string, labSlug: string) {
  return `/coursework/${courseSlug}/${labSlug}`;
}

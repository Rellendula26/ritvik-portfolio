import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Afterthought — film reflection / personal media archive.
 * Source: Afterthought_Project_Page.pdf + shipped app.
 * Media: public/projects/afterthought/ (each asset once).
 */
export const AFTERTHOUGHT_CASE_STUDY: EngineeringCaseStudy = {
  slug: "afterthought",
  motivation: {
    why: "I could remember whether a movie was an 8/10. What disappeared was why it stayed with me: a scene, a decision, a technique, or a question I wanted to keep.",
    interest:
      "Trackers answer “what did you watch and how much did you like it?” I wanted something that could also answer “what did you take away from it?”",
    learning:
      "How to model personal impact, how much structure helps before it becomes homework, where AI should organize instead of rewrite, and how to ship a local demo with a clean path to real cloud services.",
  },
  systemOverview: {
    summary:
      "A Next.js film journal: search real titles, score Overall vs Personal Impact, capture one primary reflection (“What stuck with you?”), optionally speak a voice note for AI organization, and browse the archive by themes like ambition or identity. TMDB owns media identity; Afterthought owns the user’s relationship to it. Demo mode runs on a seeded Zustand store when credentials are missing.",
    subsystems: [
      {
        name: "Discovery",
        role: "TMDB search / seeded catalog → normalized media page.",
      },
      {
        name: "Dual-axis ratings",
        role: "Overall quality and Personal Impact as independent fields.",
      },
      {
        name: "Reflection capture",
        role: "2–3 minute default: two scores + one free reflection + save.",
      },
      {
        name: "Voice + AI organize",
        role: "Browser recording → transcript → cleaned copy / summary / themes; original stays ground truth.",
      },
      {
        name: "Theme library",
        role: "Retrieve by ideas (ambition, mentorship, sacrifice) not only title or date.",
      },
      {
        name: "Persistence boundary",
        role: "Zustand demo store locally; Supabase auth/DB/storage when configured.",
      },
    ],
    dataFlow:
      "Search → TMDB media object → Overall + Personal Impact → write or voice → optional AI organization → themes / lists / library.",
    controlFlow:
      "External metadata answers what the title is. Private ratings, reflections, voice notes, and themes live on user-media records so they never get tangled into the catalog object.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/afterthought-architecture.svg",
      alt: "Afterthought architecture: user to Next.js to TMDB, OpenAI, and Supabase",
      label: "Architecture",
      caption:
        "Client owns search, detail, and reflection. App routes talk to TMDB for identity, OpenAI for organize/transcribe, Supabase for cloud persistence, or the local demo store when keys are absent.",
    },
  },
  disciplines: [
    {
      id: "fullstack",
      discipline: "Full-Stack Application Architecture",
      goal: "Ship a real multi-page product, not a static movie-review mock.",
      design:
        "Next.js App Router + TypeScript. Landing, dashboard, discover, media detail, reflection editor, library, lists, themes, voice notes, auth/onboarding. UI behavior stays separated from persistence and external APIs so demo content can exercise the product without mandatory credentials.",
      challenges: [
        "Portfolio demos die when every click requires TMDB + Supabase + OpenAI keys.",
        "Cloud multi-user paths still needed a clean migration story.",
      ],
      iterations: [
        "Coupled UI and credentials",
        "Persistence abstraction + seeded demo store",
        "Deployed MVP with production integration boundaries",
      ],
      finalImplementation:
        "Deployed app that can show the full flow in demo mode and swap in TMDB / Supabase / OpenAI when configured.",
      media: {
        kind: "image",
        src: "/projects/afterthought/dashboard.jpg",
        alt: "Afterthought dashboard after entering demo mode",
        label: "Dashboard",
        caption:
          "Authenticated demo shell: Home / Discover / Library / Lists / Voice Notes / Themes. Guest session with seeded onboarding preferences driving recommendations.",
      },
    },
    {
      id: "product",
      discipline: "Product & Interaction Design",
      goal: "Make meaningful reflection fast enough that someone would actually do it after a movie.",
      design:
        "Early editor exposed lessons, scenes, characters, quotes, techniques, applications, themes, tags, and voice. It felt like homework. Hard constraint: normal reflection ≤ 2–3 minutes. Default flow became two ratings + one primary field + save; deeper organization moved behind optional expansion or AI post-processing.",
      challenges: [
        "Richer data models made capture cognitively expensive.",
        "A journal that asks more than a star rating has to stay aggressively short.",
      ],
      iterations: [
        "Feature-rich multi-section editor",
        "2–3 minute product constraint",
        "Capture first, organize second",
      ],
      finalImplementation:
        "“What stuck with you?” as the primary surface; structure and AI help after the thought exists.",
      media: {
        kind: "image",
        src: "/projects/afterthought/reflection.jpg",
        alt: "Reflection editor with Overall and Personal Impact scores",
        label: "Reflection flow",
        caption:
          "After the credits: Overall and Personal Impact as separate sliders, then the primary prompt. Draft/save path stays short on purpose.",
      },
    },
    {
      id: "ratings",
      discipline: "Dual-Axis Rating Model",
      goal: "Represent perceived quality and personal meaning separately.",
      design:
        "Store Overall Rating and Personal Impact as independent attributes. Optional dimension ratings exist but are not forced, and they do not auto-collapse into a single score unless the user chooses that.",
      challenges: [
        "Two values add a little input friction.",
        "A single 1–10 erases the distinction the product is built on.",
      ],
      iterations: [
        "Traditional single score",
        "Weighted rubric experiments",
        "Two required scores only",
      ],
      finalImplementation:
        "Library can sort “best movies I watched” apart from “movies that mattered most to me.”",
      media: {
        kind: "image",
        src: "/projects/afterthought/movie-detail.jpg",
        alt: "Movie detail showing Overall and Personal Impact fields",
        label: "Media detail",
        caption:
          "Interstellar detail: YOUR OVERALL and YOUR IMPACT as separate slots, with community ratings as a secondary reference, not the product’s core.",
      },
    },
    {
      id: "tmdb",
      discipline: "Movie Metadata / TMDB Integration",
      goal: "Reflect on real films without maintaining a hand-built movie database.",
      design:
        "Media records key off external TMDB identifiers (title, year, poster, overview, genres, cast, director). Personal state lives on separate user-media rows.",
      challenges: [
        "External metadata and private data have different ownership and update lifecycles.",
        "Duplicating subjective data into the catalog object would poison both sides.",
      ],
      iterations: [
        "Manual seed-only catalog",
        "Normalized TMDB objects + user-media records",
        "Demo catalog fallback when the token is unset",
      ],
      finalImplementation:
        "Search → normalized media → personal ratings/reflections without stuffing the user’s thinking into the TMDB-shaped row.",
      media: {
        kind: "image",
        src: "/projects/afterthought/discover.jpg",
        alt: "Discover / search surface for films",
        label: "Discover",
        caption:
          "Discovery path into real (or seeded) titles before reflection. Catalog identity stays separate from the journal entry.",
      },
    },
    {
      id: "voice-ai",
      discipline: "Voice Reflection + AI Organization",
      goal: "Capture messy post-movie thoughts without forcing structured forms up front.",
      design:
        "Browser recording → transcription → AI cleaned reflection, takeaway, suggested themes, optional follow-up. Original transcript is never overwritten; AI outputs are secondary, editable, and dismissible.",
      challenges: [
        "Generative rewrite can sound polished and wrong.",
        "If AI is treated as authoritative, the archive stops being personal.",
      ],
      iterations: [
        "AI as writer",
        "AI as organizer on top of user text",
        "Approval step before themes stick",
      ],
      finalImplementation:
        "AI organizes the user’s thinking. It does not replace it.",
      media: {
        kind: "image",
        src: "/projects/afterthought/voice-notes.jpg",
        alt: "Voice notes interface for spoken reflections",
        label: "Voice notes",
        caption:
          "Speak-first capture surface. Transcription and theme suggestions are post-processing; the raw thought remains the source of truth.",
      },
    },
    {
      id: "themes",
      discipline: "Theme-Based Information Architecture",
      goal: "Make old reflections useful again months later.",
      design:
        "Associate reflections with themes such as ambition, identity, mentorship, leadership, sacrifice, grief, purpose, family, courage. Retrieval sits beside title, genre, year, and date watched.",
      challenges: [
        "A chronological journal gets hard to search as it grows.",
        "Theme value is weak on a cold-start empty account.",
      ],
      iterations: [
        "Date-ordered log only",
        "Manual categories",
        "Theme browsing as a first-class axis",
      ],
      finalImplementation:
        "Closer to a personal knowledge base for media than a conventional watch tracker.",
      media: {
        kind: "image",
        src: "/projects/afterthought/themes.jpg",
        alt: "Theme browsing for reflections by idea",
        label: "Themes",
        caption:
          "Browse by what the film taught you, not only by title. This is where the dual-axis journal pays rent after the fact.",
      },
    },
  ],
  designDecisions: [
    {
      id: "two-scores",
      title: "One rating or two?",
      problem: "Can a single rating accurately represent what I want to remember?",
      alternatives: [
        "Traditional 5-star",
        "Single 1–10",
        "Detailed weighted rubric",
        "Overall + Personal Impact",
      ],
      tradeoffs:
        "Two ratings add a little friction. One rating deletes the distinction the product exists to keep.",
      choice:
        "Overall Rating + Personal Impact. Enough structure to preserve meaning without a rubric tax.",
    },
    {
      id: "primary-prompt",
      title: "Structured form or free reflection?",
      problem: "How much structure should capture impose?",
      alternatives: [
        "Separate inputs for lessons, scenes, characters, quotes, techniques, applications",
        "One primary “What stuck with you?” field",
      ],
      tradeoffs:
        "Comprehensive forms are slow and cognitively expensive right after a movie.",
      choice:
        "One primary field. Capture should be frictionless; organization can happen afterward.",
    },
    {
      id: "ai-role",
      title: "AI writer or AI organizer?",
      problem: "What should AI actually do?",
      alternatives: [
        "Generate an interpretation",
        "Rewrite the user automatically",
        "Organize the user’s original reflection",
      ],
      tradeoffs:
        "More generative behavior sounds polished while drifting from the user’s meaning.",
      choice:
        "Original reflection is ground truth. AI proposes structure the user can accept or discard.",
    },
    {
      id: "demo-first",
      title: "Cloud-only or demo-first?",
      problem: "Should the prototype require full infrastructure to run?",
      alternatives: [
        "Require auth, DB, metadata API, and AI credentials for all behavior",
        "Seeded demo mode alongside production integrations",
      ],
      tradeoffs:
        "Cloud-only is a fragile portfolio demo. Demo-first must not fake a production architecture that does not exist.",
      choice:
        "Demo store + mocked AI/TMDB paths, with real Supabase/TMDB/OpenAI boundaries when keys are present.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "V0–V1",
      title: "Concept → feature-rich editor",
      description:
        "Started from Movie → Rating → Review, then exploded into lessons, profound moments, characters, scenes, techniques, quotes, applications, and voice. Powerful data model. Felt like a questionnaire.",
      media: {
        kind: "image",
        src: "/projects/afterthought/lists.jpg",
        alt: "Lists surface showing organizational structure",
        label: "Organization surfaces",
        caption:
          "Lists and structured organization were always part of the ambition. Early versions put too much of that structure in the first capture step.",
      },
    },
    {
      id: "e2",
      phase: "V2–V3",
      title: "Under three minutes, then AI as post-processing",
      description:
        "Asked a blunt question: can someone log a movie in under three minutes? Required path became two ratings + one reflection + save. Voice and AI routes summarize and suggest themes after the thought exists. Capture first, organize second.",
      media: {
        kind: "image",
        src: "/projects/afterthought/library.jpg",
        alt: "Library view of logged films",
        label: "Library",
        caption:
          "After the constraint, the library is an archive of short captures, not a graveyard of unfinished multi-section forms.",
      },
    },
    {
      id: "e3",
      phase: "V4",
      title: "Deployed MVP",
      description:
        "Landing, library, detail, simplified reflection, voice architecture, theme retrieval, and demo/production boundaries shipped as one product at afterthought-phi.vercel.app.",
      media: {
        kind: "image",
        src: "/projects/afterthought/landing.jpg",
        alt: "Afterthought marketing landing page",
        label: "Landing",
        caption:
          "Public entry: brand, dual-axis promise, and a one-click path into the demo journal.",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Functional MVP",
        body: "Landing, dashboard, library, detail, dual-axis ratings, written reflection, voice UI, themes, lists, seeded demo data, and external-service integration seams.",
        evidence: "Live demo",
        evidenceHref: "https://afterthought-phi.vercel.app",
      },
      {
        title: "Reflection-time target",
        body: "Standard flow minimized to two ratings + one reflection. Design target under three minutes; not yet a timed usability study.",
        evidence: "2 scores + 1 field",
      },
      {
        title: "Demo / production boundary",
        body: "App remains demonstrable without credentials while preserving paths to TMDB, Supabase, and OpenAI.",
        evidence: "Zustand demo store",
      },
    ],
    limitations: [
      "Real multi-user production behavior depends on completed TMDB, Supabase, and OpenAI configuration.",
      "AI organization can distort nuance if treated as authoritative.",
      "Theme retrieval is weak on a cold-start archive.",
      "MVP validates implementation and interaction flow, not long-term retention.",
    ],
  },
  reflection: {
    surprises: [
      "The hardest product problem was deciding what not to ask. More structure made a richer schema and a worse experience.",
      "Separating capture from organization fixed more than any new AI feature.",
    ],
    redesign: [
      "Lean harder into retrieval: rediscovery across the last hundred watches, not more logging fields.",
      "Stronger cloud persistence and unified movie + TV search (TV support is already starting to land).",
    ],
    future: [
      "Semantic search across reflections",
      "Connections between reflections from different titles",
      "Theme evolution over time and “you wrote this six months ago” resurfacing",
      "Exportable personal film journal",
      "Embedding-based similarity between reflections",
    ],
    questions: [
      "How should software help people remember experiences without turning the experience itself into data entry?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Personal impact and perceived quality are different dimensions. One score lies about both.",
    },
    {
      kind: "design-insight",
      text: "Capture → organize. AI post-processes an existing thought instead of demanding structured input upfront.",
    },
    {
      kind: "observation",
      text: "External ID ≠ user record. TMDB identifies the media; Afterthought stores the relationship.",
    },
    {
      kind: "engineering-note",
      text: "The 2–3 minute constraint is an architecture decision disguised as UX.",
    },
  ],
};

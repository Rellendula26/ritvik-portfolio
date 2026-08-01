import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * MiniTorch-OCaml case study.
 * Software systems framing: graph construction, reverse-mode AD,
 * numerical validation. Claims match lib/tensor.ml + main.ml demos.
 */
export const MINITORCH_CASE_STUDY: EngineeringCaseStudy = {
  slug: "minitorch-ocaml",
  motivation: {
    why: "I was tired of treating PyTorch as a calculator I did not understand. If backprop is the whole game, I wanted to implement it.",
    interest:
      "Calling backward() is easy. Keeping parent links and local derivatives correct when a node is reused is not. Wrong grads still train for a bit, which is worse.",
    learning:
      "OCaml made the graph nodes explicit. Gradcheck against finite differences is what actually caught my calculus mistakes.",
  },
  systemOverview: {
    summary:
      "MiniTorch is reverse-mode autodiff in OCaml. Forward ops grow a graph. Backward walks parents and fills grads. A tiny MLP with SGD/Adam is the smoke test. Gradcheck is the real test.",
    subsystems: [
      {
        name: "Tensor / graph nodes",
        role: "Hold values, gradients, parents, and operation tags that define the local backward rule.",
      },
      {
        name: "Forward ops",
        role: "Elementwise arithmetic, activations, reductions, transpose, and matmul that extend the graph.",
      },
      {
        name: "Reverse engine",
        role: "Topological reverse traversal that applies local gradients and accumulates into parents.",
      },
      {
        name: "Gradcheck",
        role: "Central-difference numerical checks that catch calculus bugs types cannot see.",
      },
      {
        name: "Training demo",
        role: "Toy MLP with SGD/Adam showing loss decrease when autodiff is correct.",
      },
    ],
    dataFlow:
      "Inputs → forward ops (graph grow) → scalar loss → reverse traversal → parameter gradients → optimizer step.",
    controlFlow:
      "Forward is eager graph building. Backward is an explicit reverse walk. Gradcheck samples perturbations around a point and compares analytic vs numerical derivatives.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/minitorch-graph.svg",
      alt: "MiniTorch computation graph overview",
      label: "Computation graph",
      caption: "Each op records parents so reverse-mode can propagate local derivatives.",
    },
  },
  disciplines: [
    {
      id: "graph-frontend",
      discipline: "Graph Construction",
      goal: "Make every forward operation an explicit node that records enough metadata for a correct local backward rule.",
      design:
        "Typed graph nodes store value, grad, parents, and op. Arithmetic, activations (ReLU, Tanh, Exp, Log, Sigmoid, Pow), Sum, Transpose, and MatMul each extend the graph during the forward pass instead of mutating values in place without history.",
      challenges: [
        "API surface had to stay small while remaining extensible for new ops.",
        "Shape and broadcasting mistakes look like training instability rather than type errors.",
        "Forgetting a parent edge produces silent zero gradients.",
      ],
      iterations: [
        "Scalar-friendly arithmetic nodes.",
        "Activations with simple local derivatives.",
        "Reductions and matmul once multi-dimensional training demos mattered.",
      ],
      finalImplementation:
        "A forward API that grows a directed graph suitable for reverse-mode accumulation without hiding parent structure.",
      media: {
        kind: "image",
        src: "/projects/gallery/minitorch-forward.svg",
        alt: "Forward pass building the computation graph",
        label: "Forward pass",
        caption: "Ops append nodes; values alone are not enough for backward.",
      },
    },
    {
      id: "reverse-mode",
      discipline: "Reverse-Mode AD",
      goal: "Propagate gradients from a scalar loss back to parameters with correct local Jacobians.",
      design:
        "Seed the loss gradient, walk parents in reverse, and apply each op's local rule. Accumulation must respect multiple consumers of the same node. This is the systems core: autodiff as graph algorithm plus calculus tables.",
      challenges: [
        "Gradient bugs rarely show up in forward outputs.",
        "Shared subgraphs require careful accumulation, not overwrite.",
        "Matmul and reductions have local rules that are easy to transpose wrong.",
      ],
      iterations: [
        "Elementwise reverse rules.",
        "Activation derivatives.",
        "Reduction and matmul reverse paths used by the MLP demo.",
      ],
      finalImplementation:
        "A reverse engine that fills .grad fields from parent references so optimizers see usable parameter updates.",
      media: {
        kind: "image",
        src: "/projects/gallery/minitorch-backprop.svg",
        alt: "Reverse-mode gradient propagation",
        label: "Backprop",
        caption: "Reverse traversal applies local rules and accumulates into parents.",
      },
    },
    {
      id: "numerical-validation",
      discipline: "Numerical Validation",
      goal: "Prove analytic gradients against finite differences before trusting a training curve.",
      design:
        "Central-difference gradcheck in the demo harness compares engine gradients to numerical estimates. New operators are expected to ship with forward, backward, and a check. Types catch structure; numerics catch calculus.",
      challenges: [
        "Finite differences are noisy near non-smooth points like ReLU kinks.",
        "Passing a loss curve without gradcheck can still hide a wrong op that rarely activates.",
        "The current harness prints check output; hardening toward asserted CI tests is future work.",
      ],
      iterations: [
        "Manual derivative spot checks.",
        "Central-difference sweeps for core ops.",
        "Training-loop smoke tests as an integration signal, not a substitute for gradcheck.",
      ],
      finalImplementation:
        "A gradcheck workflow used whenever operators change, plus demo training that shows loss decrease when the engine is healthy.",
      media: {
        kind: "image",
        src: "/projects/gallery/minitorch-gradcheck.svg",
        alt: "Gradient checking against finite differences",
        label: "Gradcheck",
        caption: "Numerical agreement is the proof types cannot provide.",
      },
    },
  ],
  designDecisions: [
    {
      id: "ocaml-ad",
      title: "OCaml for an autodiff engine",
      problem: "Which language keeps graph nodes explicit without drowning in boilerplate?",
      alternatives: ["Python/NumPy", "C++", "OCaml"],
      tradeoffs:
        "Python is the ML default and soft on invariants. OCaml makes node variants and exhaustive matches hard to leave incomplete.",
      choice: "OCaml. Exhaustiveness on ops is part of the safety story.",
    },
    {
      id: "reverse-vs-forward",
      title: "Reverse-mode versus forward-mode",
      problem: "Which AD mode matches neural training?",
      alternatives: ["Forward-mode", "Reverse-mode", "Mixed"],
      tradeoffs:
        "Forward-mode scales with inputs; reverse-mode scales with outputs. Training needs reverse.",
      choice: "Reverse-mode. One scalar loss to many parameters is the target workload.",
    },
    {
      id: "eager-graph",
      title: "Eager graph building",
      problem: "When is the graph constructed?",
      alternatives: ["Define-and-run static graph", "Eager ops that record parents"],
      tradeoffs:
        "Static graphs optimize earlier; eager graphs match how students debug PyTorch-style code.",
      choice: "Eager recording. Debuggability beat premature graph compilers.",
    },
    {
      id: "gradcheck-gate",
      title: "Gradcheck as the operator gate",
      problem: "How do you know a new op is correct?",
      alternatives: ["Trust training loss", "Unit tests on hand values only", "Finite-difference gradcheck"],
      tradeoffs:
        "Loss curves are necessary but insufficient. Gradcheck is slower and catches silent calculus bugs.",
      choice: "Require forward + backward + gradcheck when adding operators.",
    },
  ],
  evolution: [
    {
      id: "m1",
      phase: "Stage 1",
      title: "Core tensor nodes",
      description: "Values, grads, parents, and arithmetic ops that prove the graph idea.",
    },
    {
      id: "m2",
      phase: "Stage 2",
      title: "Activations and reductions",
      description: "Local derivatives beyond +, *, and the first non-elementwise paths.",
    },
    {
      id: "m3",
      phase: "Stage 3",
      title: "Matmul + MLP demo",
      description: "Enough linear algebra for a tiny network and optimizer loop.",
    },
    {
      id: "m4",
      phase: "Next",
      title: "Hardened tests and broader ops",
      description:
        "Asserting gradchecks in CI, richer broadcasting, and a vectorized backend once the operator set is stable.",
    },
  ],
  results: {
    items: [
      {
        title: "Reverse-mode engine",
        body: "Forward builds a graph; backward fills gradients for supported ops including matmul and common activations.",
        evidence: "lib/tensor.ml operator set and reverse traversal",
      },
      {
        title: "Numerical checks",
        body: "Central-difference gradcheck exercises analytic gradients for the implemented ops.",
        evidence: "Gradcheck path in the demo harness",
      },
      {
        title: "Training smoke signal",
        body: "Toy MLP with SGD/Adam shows loss decrease when autodiff and updates agree.",
        evidence: "Demo training loop in main.ml",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/gallery/minitorch-gradcheck.svg",
        alt: "Gradcheck evidence visual",
        label: "Validation",
        caption: "Finite differences keep reverse-mode honest.",
      },
    ],
    limitations: [
      "No GPU backend, convolutions, or production framework surface.",
      "test/ is still thin; gradcheck prints today rather than a full asserted suite.",
      "Broadcasting and operator coverage are intentionally incomplete.",
    ],
  },
  reflection: {
    surprises: [
      "Most bugs were local Jacobian mistakes that still produced plausible forward values.",
      "Types prevented structural holes more than calculus holes.",
    ],
    redesign: [
      "Asserted gradcheck CI for every op.",
      "Clearer shape error messages at op construction time.",
      "Separate pure math tables from graph mutation code.",
    ],
    future: [
      "Broader operator set with broadcasting rules.",
      "Vectorized backend once correctness is boring.",
      "Richer optimizers and serialization for experiment replay.",
    ],
    questions: [
      "Where should broadcasting live: op nodes or a lowering pass?",
      "How do frameworks keep reverse-mode fast without losing debuggability?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Autodiff bugs hide in forward outputs. Gradcheck is the plant test.",
    },
    {
      kind: "design-insight",
      text: "A tensor without parent metadata is just an array; reverse-mode needs the graph.",
    },
    {
      kind: "observation",
      text: "Loss curves confirm integration; they do not replace operator-level numerical proofs.",
    },
  ],
};

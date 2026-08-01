import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * C Compiler case study.
 * Software translation of the hardware case-study format:
 * stages = disciplines; broken invariants = physical failures.
 * Scope claims track the public README / official tests, not scaffolding.
 */
export const C_COMPILER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "c-compiler",
  motivation: {
    why: "I was calling clang for years without knowing what it actually did. Building a compiler seemed like the cleanest way to stop pretending.",
    interest:
      "Parsing is not the hard part. Keeping the same program meaning while the representation gets less human and more machine-shaped is.",
    learning:
      "Nora Sandler's book was the map. I still had to write the passes, break them, and debug the assembly myself.",
  },
  systemOverview: {
    summary:
      "mycc is my OCaml compiler for a small C subset. Source to tokens to AST to TACKY to x86 with fixups, then the host assembler and linker. Each stage should make the next one simpler. If it does not, the architecture is lying.",
    subsystems: [
      {
        name: "Lexer",
        role: "Turns characters into typed tokens. Removes character-level noise before grammar work begins.",
      },
      {
        name: "Parser",
        role: "Builds an AST that preserves precedence, associativity, and nesting for the supported grammar.",
      },
      {
        name: "Semantic / resolve passes",
        role: "Resolves names and control-flow targets so syntax-valid programs are checked for contextual meaning.",
      },
      {
        name: "TACKY IR",
        role: "Flattens nested expressions into three-address form with temporaries. Separates C syntax from x86 constraints.",
      },
      {
        name: "x86-64 backend",
        role: "Lowers IR to AT&T assembly, stack-backed temporaries, prologue/epilogue, and scratch-register fixups.",
      },
      {
        name: "Toolchain glue",
        role: "Assembles and links generated assembly into a runnable binary; Make orchestrates the build.",
      },
    ],
    dataFlow:
      "C source → tokens → AST → resolved AST → TACKY IR → x86 pseudo-assembly → operand/instruction fixups → AT&T x86-64 → assembler/linker → executable.",
    controlFlow:
      "Driver invokes passes in order. Early passes fail closed on malformed input; later passes assume prior invariants hold. Official tests currently lock return constants and nested unaries such as return ~(-2);.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/c-compiler-pipeline.svg",
      alt: "C compiler end-to-end pipeline with running example",
      label: "Compilation pipeline",
      caption:
        "Running example return ~(-2); shown from source through TACKY and stack-backed x86 with a scratch fixup.",
    },
  },
  disciplines: [
    {
      id: "lexing-parsing",
      discipline: "Lexing & Parsing",
      goal: "Convert raw C source into a structured AST that preserves operator precedence, associativity, and nesting for the supported subset.",
      design:
        "The lexer emits typed tokens. A recursive-descent parser maps tokens into AST nodes. Unary and binary uses of the same operator are disambiguated by grammar position. Surface syntax stays separate from later machine-specific concerns.",
      challenges: [
        "Nested unary expressions such as ~(-2) force careful consume/produce order in the parser.",
        "Malformed token streams need useful errors without poisoning later stages.",
        "Precedence and associativity must be encoded in the parse structure, not patched during codegen.",
      ],
      iterations: [
        "Return integer literals.",
        "Unary negation and complement.",
        "Nested unary combinations.",
        "Scaffolding toward binary operators, statements, and control flow as the language grows.",
      ],
      finalImplementation:
        "A deterministic parser that produces an AST suitable for resolution and lowering. Syntax structure is frozen before semantic meaning is decided.",
      media: {
        kind: "image",
        src: "/projects/gallery/c-compiler-ast.svg",
        alt: "AST representation for nested unary expressions",
        label: "AST shape",
        caption: "Nested unaries become explicit tree structure before IR lowering.",
      },
    },
    {
      id: "semantic-analysis",
      discipline: "Semantic Analysis",
      goal: "Determine whether a syntactically valid program is also contextually meaningful before generating assembly.",
      design:
        "Resolve identifiers to declarations, track lexical scopes, detect invalid or duplicate symbols, assign unique internal names where needed, and validate context-sensitive constructs as those features land. Syntax alone cannot decide whether a name exists or which declaration it refers to.",
      challenges: [
        "Shadowing and nested scopes reuse source identifiers that must map to distinct internals.",
        "Control-flow statements are only valid inside particular contexts; catching that late looks like broken assembly.",
        "Errors should fail before lowering so the backend is not debugging frontend mistakes.",
      ],
      iterations: [
        "Global symbol handling for the current subset.",
        "Local scope maps and unique renaming as variables arrive.",
        "Loop-label and control-flow resolution on the roadmap once statements expand.",
      ],
      finalImplementation:
        "A resolved AST where names and control-flow targets are explicit before TACKY generation. Semantic validity is an invariant the IR pass can trust.",
      media: {
        kind: "image",
        src: "/projects/gallery/c-compiler-source.svg",
        alt: "Source program entering semantic analysis",
        label: "Source contract",
        caption: "Syntax-valid input still needs contextual checks before lowering.",
      },
    },
    {
      id: "tacky-ir",
      discipline: "Intermediate Representation",
      goal: "Separate the meaning of the C program from both surface syntax and x86-64 operand restrictions.",
      design:
        "Lower AST expressions into three-address-style TACKY instructions. Replace nesting with temporaries. Represent operations and control flow in a linear, architecture-independent form so register, stack, and instruction constraints stay in the backend. Example: return ~(-2); becomes tmp.0 = -2; tmp.1 = ~tmp.0; return tmp.1.",
      challenges: [
        "Preserving evaluation order while deleting tree nesting.",
        "Generating unique temporaries and labels without leaking AST shape into the backend.",
        "Direct AST-to-assembly works for return 2; and collapses once expressions and control flow grow.",
      ],
      iterations: [
        "Direct assembly for constant returns.",
        "Recognition that nested expressions duplicated backend logic.",
        "Introduction of temporaries and explicit TACKY instructions.",
        "Expansion path toward structured control flow and locals.",
      ],
      finalImplementation:
        "A linear IR that acts as the contract between frontend and backend. The IR is where the compiler becomes intellectually interesting: meaning is explicit, target constraints are still deferred.",
      media: {
        kind: "image",
        src: "/projects/gallery/c-compiler-tacky.svg",
        alt: "TACKY IR flattening nested expressions",
        label: "TACKY lowering",
        caption: "Nesting becomes temporaries; the backend sees a linear instruction stream.",
      },
    },
    {
      id: "x86-backend",
      discipline: "x86-64 Backend",
      goal: "Translate architecture-independent IR into legal x86-64 assembly that follows the target ABI and preserves semantics.",
      design:
        "Map temporaries to stack slots. Emit AT&T syntax. Generate function prologue and epilogue. Place return values in %eax. Use scratch registers when an IR instruction cannot map to one legal machine instruction. Assemble and link with the system toolchain. Developing on Apple Silicon while targeting x86-64 requires explicit architecture handling.",
      challenges: [
        "x86-64 generally forbids memory-to-memory arithmetic and moves; illegal forms must be rewritten through a scratch such as %r10d.",
        "One IR op often becomes several machine instructions.",
        "Stack offsets, widths, and calling convention details must stay consistent or the program returns the wrong code while still assembling.",
      ],
      iterations: [
        "Emit assembly for constants.",
        "Allocate each temporary to a stack slot.",
        "Introduce pseudo-instructions.",
        "Add a fixup pass that rewrites illegal memory-to-memory ops through %r10d.",
        "Compare generated exit codes against expected behavior.",
      ],
      finalImplementation:
        "A backend that lowers TACKY into valid x86-64, applies instruction fixups, and produces executables through the host assembler and linker.",
      media: {
        kind: "image",
        src: "/projects/gallery/c-compiler-asm.svg",
        alt: "Generated x86-64 assembly with stack slots and fixups",
        label: "Assembly output",
        caption: "Illegal memory-to-memory forms are rewritten through a scratch register.",
      },
    },
    {
      id: "testing",
      discipline: "Testing & Validation",
      goal: "Prove each stage preserves meaning, not only that the final binary runs.",
      design:
        "Unit coverage for lexer tokens, AST snapshots for parser output, IR snapshots for lowering, assembly inspection for the backend, and end-to-end compile-and-run checks. Differential comparison against clang/gcc for supported programs. Stage tests localize defects that end-to-end tests bury.",
      challenges: [
        "A compiler can emit a plausible AST, wrong IR, illegal operands, or legal assembly with the wrong exit status.",
        "End-to-end failures alone do not identify which pass broke the invariant.",
        "Official regression currently concentrates on return constants and nested unaries; broader features need matching fixtures as they land.",
      ],
      iterations: [
        "Start with return constants.",
        "Add unary cases including ~(-2).",
        "Freeze expected intermediates when a stage stabilizes.",
        "Read generated assembly on failure before guessing at the frontend.",
      ],
      finalImplementation:
        "An incremental validation workflow that isolates frontend, IR, and backend defects. Correctness and clean lowering stay ahead of optimization.",
    },
  ],
  designDecisions: [
    {
      id: "ocaml",
      title: "OCaml for the implementation language",
      problem: "Which language makes compiler data structures and pattern matching honest?",
      alternatives: ["C++", "Rust", "Python", "OCaml"],
      tradeoffs:
        "Python is fast to sketch and weak for algebraic IR/AST work. C++/Rust add systems power and more ceremony. OCaml matches AST/IR variants and recursive passes.",
      choice:
        "OCaml. Pattern matching on AST and TACKY variants keeps each pass readable and hard to leave incomplete.",
    },
    {
      id: "recursive-descent",
      title: "Recursive descent versus a parser generator",
      problem: "How should the grammar become an AST?",
      alternatives: ["Parser generator", "Parser combinator library", "Hand-written recursive descent"],
      tradeoffs:
        "Generators scale for large grammars but hide control. Hand-written descent makes precedence and error paths explicit while learning.",
      choice:
        "Recursive descent. Ownership of token consumption matters more than grammar-file convenience at this scale.",
    },
    {
      id: "tacky",
      title: "Introduce TACKY IR versus direct AST-to-assembly",
      problem: "Where should architecture constraints enter?",
      alternatives: ["Direct AST lowering", "Early SSA", "TACKY-style three-address IR"],
      tradeoffs:
        "Direct lowering works for literals and explodes for nesting. Full SSA is valuable later; TACKY is the right intermediate contract now.",
      choice:
        "TACKY IR. Flatten expressions once; keep the backend focused on ISA and ABI legality.",
    },
    {
      id: "stack-temps",
      title: "Stack-backed temporaries versus early register allocation",
      problem: "How should IR values map to machine storage?",
      alternatives: ["Immediate register allocation", "Stack slots for all temporaries", "Hybrid with a simple allocator"],
      tradeoffs:
        "Early allocation couples correctness work to a hard optimization problem. Stack slots are slower and make fixups and ABI behavior easier to reason about.",
      choice:
        "Stack-backed temporaries first. Register allocation is a later pass once lowering is trusted.",
    },
    {
      id: "correctness-first",
      title: "Correctness before optimization",
      problem: "When should speed work start?",
      alternatives: ["Peephole early", "Constant folding during AST", "Correct lowering then optimize"],
      tradeoffs:
        "Fast wrong code teaches nothing useful. Optimization without stable IR invariants is churn.",
      choice:
        "Correctness-first. Expand the language subset with stage tests; optimize after meaning is preserved.",
    },
    {
      id: "incremental-subset",
      title: "Incremental language features",
      problem: "How wide should the supported C subset be at once?",
      alternatives: ["Broad subset immediately", "One feature family per milestone"],
      tradeoffs:
        "Broad subsets create entangled bugs across passes. Incremental growth forces each new construct to earn frontend, IR, backend, and test support.",
      choice:
        "Incremental features. Official tests currently lock constants and nested unaries; binaries, locals, and calls expand with matching fixtures.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Stage 1",
      title: "Return integer constants",
      description:
        "End-to-end path from source through assembly for return N;. Proved the driver, emit path, and toolchain glue before expression complexity arrived.",
    },
    {
      id: "e2",
      phase: "Stage 2",
      title: "Unary operators",
      description:
        "Negation and complement required nested AST nodes and forced the first real lowering decisions.",
    },
    {
      id: "e3",
      phase: "Stage 3",
      title: "TACKY and stack lowering",
      description:
        "Nested expressions stopped going straight to assembly. Temporaries and linear IR became the contract.",
    },
    {
      id: "e4",
      phase: "Stage 4",
      title: "Instruction fixups",
      description:
        "Illegal memory-to-memory forms surfaced during real x86 emission. Scratch-register rewrite became a dedicated pass.",
    },
    {
      id: "e5",
      phase: "Next",
      title: "Locals, control flow, calls",
      description:
        "Each new language feature must extend resolve, TACKY, backend, and stage tests together. Optimization and register allocation stay future work.",
    },
  ],
  results: {
    items: [
      {
        title: "Source-to-executable path",
        body: "Supported programs compile through mycc into linked x86-64 binaries via the host toolchain.",
        evidence: "Official fixtures include return_42.c and unary.c with return ~(-2);",
      },
      {
        title: "Stage-local debugging",
        body: "Failures are inspected as AST, TACKY, or assembly mismatches instead of treating compilation as one opaque step.",
        evidence: "Snapshot-style intermediates and assembly reading during bring-up",
      },
      {
        title: "Honest scope",
        body: "The public claim stays at constants and nested unaries until broader fixtures land. Scaffolding is not marketed as shipped language coverage.",
        evidence: "README current-support notes and official test set",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/gallery/c-compiler-pipeline.svg",
        alt: "Full compiler pipeline diagram",
        label: "E2E view",
        caption: "Every arrow adds an invariant and removes a class of complexity.",
      },
    ],
    limitations: [
      "Supported C subset is intentionally narrow today; do not read scaffolding as full C.",
      "No register allocation, SSA, or optimization pipeline yet.",
      "Apple Silicon hosts still require explicit x86-64 target handling for generated binaries.",
    ],
  },
  reflection: {
    surprises: [
      "Most complexity is preserving meaning across representations, not recognizing syntax.",
      "Direct AST-to-assembly felt productive until one nested unary forced a redesign.",
    ],
    redesign: [
      "Stronger source-location tracking on every diagnostic.",
      "Clearer typed errors between resolve and TACKY.",
      "Sharper separation between IR construction and backend lowering helpers.",
    ],
    future: [
      "Binary operators, locals, conditionals, loops, and function calls with ABI-correct lowering.",
      "Register allocation after stack lowering is trusted.",
      "Constant folding and dead-code elimination only after correctness fixtures cover the new features.",
    ],
    questions: [
      "How do production compilers optimize while proving semantic preservation?",
      "Where does SSA pay for itself relative to a simple three-address IR?",
      "How should ABIs shape IR design before the backend exists?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Syntax is not semantics. A parser can accept x + 1 without knowing whether x exists.",
    },
    {
      kind: "design-insight",
      text: "An AST preserves structure; IR makes execution explicit.",
    },
    {
      kind: "engineering-note",
      text: "Every compiler pass should establish an invariant the next pass can trust.",
    },
    {
      kind: "observation",
      text: "x86-64 is not a one-to-one encoding of the IR; operand constraints force multi-instruction expansions.",
    },
    {
      kind: "design-insight",
      text: "Correctness comes before optimization. Fast wrong code is not a compiler.",
    },
    {
      kind: "observation",
      text: "Reading generated assembly is often the fastest debugging loop.",
    },
  ],
};

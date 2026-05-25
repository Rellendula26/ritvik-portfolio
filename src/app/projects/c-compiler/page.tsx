import ProductCaseStudyLayout from "@/components/project-page/ProductCaseStudyLayout";
import type { SystemSection } from "@/components/project-page/SystemBlock";
import CompilerPipelineVisual from "@/components/visuals/CompilerPipelineVisual";
import { CASE_STUDIES } from "@/data/case-studies";

export const metadata = {
  title: "C Compiler | Ritvik Ellendula",
  description:
    "OCaml C compiler: lexer, recursive descent parser, TACKY IR, x86-64 codegen.",
};

const systems: SystemSection[] = [
  {
    id: "problem",
    step: "01",
    title: "Frameworks hide the machine",
    subtitle: "Problem",
    summary:
      "Calling clang is not understanding compilation. I built a minimal pipeline to internalize how source becomes stack frames, temporaries, and real x86-64 instructions.",
    responsibilities: [
      "Lexer → parser → AST for nested unary ops",
      "TACKY IR before codegen",
      "Stack-backed lowering with fixups",
    ],
    tools: ["OCaml", "Recursive Descent", "TACKY IR", "x86-64"],
    media: {
      kind: "image",
      src: "/projects/gallery/c-compiler-source.svg",
      alt: "C source input",
    },
    visual: <CompilerPipelineVisual className="h-full w-full" />,
  },
  {
    id: "technical",
    step: "02",
    title: "Pipeline architecture",
    subtitle: "Technical deep dive",
    summary:
      "TACKY IR flattens nested expressions into temporaries before instruction selection — the key abstraction between AST and AT&T assembly.",
    responsibilities: [
      "Recursive descent: ~(-(~2))",
      "TACKY temps → -4(%rbp) slots",
      "movl mem,mem fixups via %r10d",
    ],
    tools: ["OCaml", "TACKY IR", "x86-64 AT&T", "Make"],
    media: {
      kind: "image",
      src: "/projects/gallery/c-compiler-tacky.svg",
      alt: "TACKY intermediate representation",
    },
    visual: <CompilerPipelineVisual className="h-full w-full" />,
  },
  {
    id: "build",
    step: "03",
    title: "Incremental correctness",
    subtitle: "Build process",
    summary:
      "Started with return 42, added unary ops, introduced TACKY when AST→asm became unmaintainable, then debugged stack slots on real hardware.",
    responsibilities: [
      "return 42 → negation → complement",
      "driver.ml end-to-end orchestration",
      "Verified exit codes on Apple Silicon via x86_64 target",
    ],
    tools: ["OCaml", "Make", "clang", "x86-64"],
    media: {
      kind: "image",
      src: "/projects/gallery/c-compiler-asm.svg",
      alt: "Emitted x86-64 assembly",
    },
    visual: <CompilerPipelineVisual className="h-full w-full" />,
  },
];

export default function CCompilerPage() {
  return (
    <ProductCaseStudyLayout
      study={CASE_STUDIES["c-compiler"]}
      systems={systems}
      heroVisual={<CompilerPipelineVisual className="h-full w-full" />}
    />
  );
}

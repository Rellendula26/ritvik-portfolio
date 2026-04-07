"use client";

import React from "react";
import {
  ArrowUpRight,
  Github,
  CheckCircle2,
  Binary,
  GitBranch,
  Sigma,
  Boxes,
} from "lucide-react";

const tags = ["OCaml", "Autodiff", "Computational Graphs", "ML Systems"];

const systems = [
  {
    title: "Autodiff Engine",
    body: "I implemented reverse-mode automatic differentiation and verified gradient correctness numerically. This was the core mechanism that made backpropagation work across the graph.",
    image: "/projects/gradient.png",
    alt: "Gradient check output from MiniTorch-OCaml",
  },
  {
    title: "Computational Graph Representation",
    body: "Each node stores its value, gradient, generating operation, and parent references. That graph structure is what makes reverse traversal and gradient propagation possible.",
    image: "/projects/coretypes.png",
    alt: "Core tensor and computational graph type definitions in OCaml",
  },
  {
    title: "Model Architecture",
    body: "On top of the tensor and autodiff layers, I built enough structure to define multi-layer models and reason about parameter counts, shapes, and network organization.",
    image: "/projects/model.png",
    alt: "Model summary output from MiniTorch-OCaml",
  },
  {
    title: "Predictions and Behavior",
    body: "Once training converged, the model could fit the training data closely and produce sensible outputs, which helped validate that the engine was doing real learning rather than just running code.",
    image: "/projects/predictions.png",
    alt: "Predictions versus true values from MiniTorch-OCaml",
  },
];

const results = [
  "Built a PyTorch-style autodiff engine in OCaml from scratch.",
  "Implemented graph-based gradient propagation over custom tensor operations.",
  "Validated gradients numerically through gradient checking.",
  "Trained small neural networks and observed convergence through decreasing loss.",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-black/10 bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="text-base leading-7 text-neutral-600 md:text-lg">{body}</p>
      ) : null}
    </div>
  );
}

function MediaImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-black/10 bg-neutral-100 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export default function MiniTorchProjectPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ee] text-neutral-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(224, 161, 53, 0.22) 1.2px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-8 lg:px-10">
        <section className="space-y-8">
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full bg-[#f0d86b] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
                Systems Project
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-neutral-950 md:text-7xl">
                MiniTorch-OCaml
              </h1>

              <p className="max-w-2xl text-xl leading-8 text-neutral-700 md:text-2xl md:leading-9">
                A PyTorch-inspired automatic differentiation engine written in
                OCaml to understand computational graphs, gradient propagation,
                and neural network training from first principles.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#systems"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white"
                >
                  Explore subsystems <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/Rellendula26/minitorch-ocaml"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-800"
                >
                  GitHub <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            <Card className="overflow-hidden p-4">
              <div className="rounded-[24px] border border-black/10 bg-[#fbfbfa] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Hero Snapshot
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      Training convergence
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <MediaImage
                  src="/projects/torchiterations.png"
                  alt="MiniTorch OCaml training loss decreasing over iterations"
                  className="h-[320px] md:h-[420px]"
                />
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-24 space-y-10">
          <SectionHeading
            eyebrow="Motivation"
            title="Why I built it"
            body="I wanted to understand machine learning systems below the framework level. Instead of only calling PyTorch APIs, I wanted to work through how graph construction, gradients, and training mechanics are actually implemented."
          />
        </section>

        <section id="systems" className="mt-24 space-y-10">
          <SectionHeading
            eyebrow="Core Systems"
            title="Breaking the engine into its important pieces"
            body="This project makes more sense as a set of interacting internals than as one polished end product. Each section below focuses on one important subsystem."
          />

          <div className="space-y-8">
            {systems.map((item, idx) => {
              const icons = [Sigma, GitBranch, Boxes, Binary];
              const Icon = icons[idx % icons.length];

              return (
                <Card key={item.title} className="p-6 md:p-8">
                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3cf] text-neutral-900">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-3xl font-semibold tracking-tight text-neutral-950">
                        {item.title}
                      </h3>
                      <p className="text-base leading-7 text-neutral-700">
                        {item.body}
                      </p>
                    </div>

                    <MediaImage
                      src={item.image}
                      alt={item.alt}
                      className="h-[260px] md:h-[320px]"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-24 grid gap-8 lg:grid-cols-2">
          <Card className="p-6 md:p-8">
            <SectionHeading
              eyebrow="Results"
              title="What the project demonstrates"
            />
            <div className="mt-8 space-y-4">
              {results.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 text-base leading-7 text-neutral-700"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#b78410]" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <SectionHeading
              eyebrow="Takeaways"
              title="What I learned"
              body="The difficult part was not just the math. It was translating those ideas into abstractions that were clean enough to extend while still preserving correct gradient behavior."
            />
          </Card>
        </section>
      </div>
    </main>
  );
}
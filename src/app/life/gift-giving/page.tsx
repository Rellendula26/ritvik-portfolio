import Image from "next/image";
import React from "react";

type LinkItem = { label: string; href: string };

type GalleryItem = {
  src: string;
  title: string;
  synopsis: string;
  tags?: string[];
  links?: LinkItem[];
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function ActionLink({ label, href }: LinkItem) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

function HoverCard({ item }: { item: GalleryItem }) {
  const isVideo = /\.(mp4|mov|webm)$/i.test(item.src);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* Media (image OR video) */}
      <div className="relative h-64 w-full md:h-72">
        {isVideo ? (
          <video
            src={item.src}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {item.tags?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
            {item.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-white/85">
            {item.synopsis}
          </p>

          {/* Optional links (become clickable) */}
          {item.links?.length ? (
            <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
              {item.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 backdrop-blur"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Always-visible tiny caption (optional) */}
      <div className="flex items-center justify-between gap-3 border-t border-zinc-200/70 px-5 py-3">
        <p className="truncate text-sm font-medium text-zinc-900">
          {item.title}
        </p>
        <span className="text-xs text-zinc-500">Hover</span>
      </div>
    </div>
  );
}

export default function Page() {
  const title = "Compilation of 3D Printed Gifts!";
  const subtitle =
    "Pretty much once I heard free 3D printing @ Penn, I knew the plan.\nWhether it's a friend's birthday or just a special occasion, I got into the habit of making lil' trinkets.";

  const coverSrc = "/life/gift-giving.jpg"; // must exist in /public

  const badges = [
    "Fusion 360",
    "3D Printing",
    "Penn",
    "Gift-Giving",
    "#MYFRIENDSAREGOATED",
    "Trinkets",
  ];

  const actions: LinkItem[] = [{ label: "GALLERY", href: "#gallery" }];

  const items: GalleryItem[] = [
    {
      src: "/life/gift1.png",
      title: "Fat Penguin & Yellow Umbrella",
      synopsis:
        "The fat penguin is from an inside joke with a friend with a pickup line about a fat penguin, and the yellow umbrella is a How I Met Your Mother Reference. ",
      tags: ["Fusion 360", "Spray Paint", "HIMYM"],
    },
    {
      src: "/life/gift2_fixed.png",
      title: "Blue French Horn",
      synopsis:
        "Blue French Horn from How I Met Your Mother for my friend who loves the show.",
      tags: ["Supports", "HIMYM"],
      links: [{ label: "Model Notes", href: "/life/gifts" }],
    },
    {
      src: "/life/gift3.png",
      title: "Tan Cannon",
      synopsis:
        "Gift for my SAS Big after his dance show -- a little pun on words and emphasizing that he's #1 big.",
      tags: ["Fusion 360", "Supports", "Text Embossing"],
    },
    {
      src: "/life/gift4_fixed.png",
      title: "Aladdin Lamp",
      synopsis:
        "Similarly, a gift for my friend after his dance show, where he played the Genie from Aladdin.",
      tags: ["Aladdin!"],
    },
    {
      src: "/life/gift5_fixed.png",
      title: "Hakuna Matata",
      synopsis:
        "Gift for my friend who played Simba from the Lion King in his dance show!",
      tags: ["TinkerCAD", "Text Embossing"],
    },
    {
      src: "/life/gift6_fixed.png",
      title: "Penn Dhamaka Logo",
      synopsis:
        "Couple of my friends' birthdays on Dhamaka, so I printed them V1 of our Logo!",
      tags: ["Fusion 360", "Image Overlay", "Sketch", "Extruding"],
    },
    {
      src: "/life/gift7.mp4",
      title: "Solar Fidget Spinner",
      synopsis: "One of my friends really likes the Sun",
      tags: ["Fusion 360", "STL Scaling"],
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-14">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl whitespace-pre-line text-base leading-relaxed text-zinc-600">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        </div>

        {/* Hero media */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[320px] w-full md:h-[420px]">
            <Image
              src={coverSrc}
              alt={`${title} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1000px"
              priority
            />
          </div>
        </div>

        {/* Info strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-900">
            PHOTO COMPILATION
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {actions.map((a) => (
              <ActionLink key={a.label} {...a} />
            ))}
          </div>
        </div>
      </header>

      {/* Gallery-first layout */}
      <section id="gallery" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
            GALLERY
          </h2>
          <p className="text-sm text-zinc-500">
            Hover to see the story behind each print.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <HoverCard key={item.src} item={item} />
          ))}
        </div>

        <div className="mt-10">
          <a
            href="/life"
            className="text-sm font-medium text-amber-800 hover:text-amber-900 hover:underline"
          >
            ← Back
          </a>
        </div>
      </section>
    </main>
  );
}

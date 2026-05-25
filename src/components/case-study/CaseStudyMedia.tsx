import Image from "next/image";

export type CaseStudyGalleryItem = { src: string; alt: string };

export function CaseStudyHeroImage({
  src,
  alt,
  className = "aspect-video",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-zinc-200 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 896px"
        priority
      />
    </div>
  );
}

export function CaseStudyHeroVideo({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) {
  return (
    <video
      src={src}
      poster={poster}
      className="aspect-video w-full rounded-2xl border border-zinc-200 object-cover"
      controls
      playsInline
      preload="metadata"
    />
  );
}

export function CaseStudyGallery({
  images,
  title = "Gallery",
}: {
  images: CaseStudyGalleryItem[];
  title?: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="scroll-mt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {images.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

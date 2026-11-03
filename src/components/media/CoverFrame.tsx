import Image from "next/image";
import type { FocalPoint } from "@/data/experiences";

export type CoverFrameMedia = {
  src: string;
  alt: string;
  focal?: FocalPoint;
  kind?: "image" | "video";
  poster?: string;
  fit?: "cover" | "contain";
};

export function coverObjectPosition(focal?: FocalPoint) {
  if (!focal) return "50% 50%";
  return `${focal.x}% ${focal.y}%`;
}

/**
 * Shared 16:10 cover. Cards and page heroes both use this so a focal point
 * crops the same way. No src means a quiet panel, with no caption.
 */
export default function CoverFrame({
  media,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: {
  media?: CoverFrameMedia | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const position = coverObjectPosition(media?.focal);
  const fitClass = media?.fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#f3ebe1] ${className}`}
    >
      {media?.src ? (
        media.kind === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            aria-label={media.alt}
            muted
            playsInline
            preload="metadata"
            className={`absolute inset-0 h-full w-full ${fitClass}`}
            style={{ objectPosition: position }}
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority={priority}
            unoptimized={media.src.endsWith(".svg")}
            sizes={sizes}
            className={fitClass}
            style={{ objectPosition: position }}
          />
        )
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.75),transparent_42%),linear-gradient(155deg,#f7f1e8_0%,#e7d3b4_100%)]"
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

function isSvg(src: string) {
  return src.endsWith(".svg");
}

/**
 * Local portfolio photos (especially large iPhone JPEGs) are more reliable as
 * native <img>. next/image optimization has been returning 400 for some of them,
 * which tripped onError and showed "Missing media" even when the file existed.
 */
function preferNativeImg(src: string) {
  return isSvg(src) || src.startsWith("/projects/");
}

export default function ProjectMediaImage({
  src,
  alt,
  className = "object-cover object-top",
  sizes = "(max-width: 768px) 100vw, 520px",
  priority = false,
  fill = true,
  expandable = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  /** Opens the image uncropped. Use for schematics and plots. */
  expandable?: boolean;
}) {
  // Track which src failed so a src change clears the error without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const failed = failedSrc === src;

  if (failed || !src) {
    return null;
  }

  let image;
  if (preferNativeImg(src)) {
    image = fill ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    );
  } else if (fill) {
    image = (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFailedSrc(src)}
      />
    );
  } else {
    image = (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  if (!expandable) return image;

  return (
    <>
      {image}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-3 right-3 z-10 rounded-full border border-stone-200 bg-white/95 px-3 py-1 text-xs font-medium text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        Enlarge
      </button>
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/80 p-4"
            >
              <button
                type="button"
                aria-label="Close enlarged image"
                className="absolute inset-0"
                onClick={() => setOpen(false)}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="relative max-h-[90vh] max-w-[92vw] object-contain"
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
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
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#111] px-4 text-center">
        <p className="text-xs text-stone-400">
          Missing media: <span className="font-mono text-stone-300">{src}</span>
        </p>
      </div>
    );
  }

  if (preferNativeImg(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

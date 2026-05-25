import Image from "next/image";

function isSvg(src: string) {
  return src.endsWith(".svg");
}

/** next/image does not render public SVGs reliably — use native img */
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
  if (isSvg(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${className}`}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
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
    />
  );
}

/** Eager video for hero/system previews (LazyVideo skips src when playWhenVisible=false). */
export default function CaseStudyVideo({
  src,
  poster,
  className = "h-full w-full object-cover object-top",
  autoPlay = true,
}: {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}) {
  return (
    <video
      src={src}
      poster={poster}
      className={className}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
}

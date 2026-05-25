"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  playWhenVisible?: boolean;
  playOnHover?: boolean;
};

function attachSrc(el: HTMLVideoElement, src: string) {
  if (el.src !== new URL(src, window.location.origin).href) {
    el.src = src;
    el.load();
  }
}

export default function LazyVideo({
  src,
  poster,
  className = "",
  playWhenVisible = true,
  playOnHover = false,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const autoplayInView = !playOnHover && playWhenVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.pause();
          return;
        }

        if (!ready) {
          attachSrc(el, src);
          setReady(true);
        }

        if (autoplayInView) {
          void el.play().catch(() => {});
        }
      },
      { rootMargin: "120px", threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, ready, autoplayInView]);

  function play() {
    const el = ref.current;
    if (!el) return;
    if (!ready) {
      attachSrc(el, src);
      setReady(true);
    }
    void el.play().catch(() => {});
  }

  function pause() {
    const el = ref.current;
    if (!el) return;
    el.pause();
    if (poster) el.currentTime = 0;
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload={poster ? "metadata" : "none"}
      onMouseEnter={playOnHover ? play : undefined}
      onMouseLeave={playOnHover ? pause : undefined}
      onTouchStart={playOnHover ? play : undefined}
    />
  );
}

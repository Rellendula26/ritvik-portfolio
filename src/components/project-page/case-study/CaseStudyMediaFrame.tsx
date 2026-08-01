"use client";

import { useState } from "react";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import type { CaseStudyMedia } from "@/data/engineering-case-study";

/** Shared media chrome used across case-study sections. */
export default function CaseStudyMediaFrame({
  media,
  className = "h-[240px] md:h-[300px]",
}: {
  media: CaseStudyMedia;
  className?: string;
}) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
      <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
        {media.label ?? "Figure"}
      </div>
      <div className={`relative w-full bg-[#070707] ${className}`}>
        {media.kind === "video" ? (
          videoFailed ? (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <p className="text-xs text-stone-400">
                Missing media:{" "}
                <span className="font-mono text-stone-300">{media.src}</span>
              </p>
            </div>
          ) : (
            <video
              src={media.src}
              className="h-full w-full object-contain object-center"
              controls
              playsInline
              preload="metadata"
              poster={media.poster}
              onError={() => setVideoFailed(true)}
            />
          )
        ) : (
          <ProjectMediaImage
            src={media.src}
            alt={media.alt}
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-contain object-center p-2"
          />
        )}
      </div>
      {media.caption && (
        <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs leading-relaxed text-zinc-600">
          {media.caption}
        </p>
      )}
    </div>
  );
}

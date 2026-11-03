"use client";

import { useState } from "react";

export default function ReportReader({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Open PDF
        </a>
        <a
          href={href}
          download
          className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Download PDF
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden items-center rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 md:inline-flex"
        >
          Read on this page
        </button>
      </div>
      {open ? (
        <iframe
          title={title}
          src={href}
          className="mt-4 hidden h-[80vh] w-full rounded-2xl border border-stone-200 bg-white md:block"
        />
      ) : null}
    </div>
  );
}

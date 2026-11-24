const ROWS = [
  ["What it is", "what"],
  ["What I did", "did"],
  ["Where it stands", "stands"],
] as const;

export default function PageSummary({
  what,
  did,
  stands,
}: {
  what: string;
  did: string;
  stands: string;
}) {
  const copy = { what, did, stands };
  return (
    <section
      aria-label="Summary"
      className="rounded-[1.25rem] border border-zinc-200 bg-white px-5 py-4"
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
        Summary
      </h2>
      <dl className="mt-3 space-y-3">
        {ROWS.filter(([, key]) => copy[key].trim()).map(([label, key]) => (
          <div key={key}>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              {label}
            </dt>
            <dd className="mt-1 text-base leading-relaxed text-zinc-800">{copy[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

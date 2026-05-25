"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Life", href: "/life" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 md:px-8 md:pt-8">
        <div className="rounded-2xl border border-stone-200/60 bg-white/55 shadow-sm backdrop-blur-md">
          <nav className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.18em] uppercase text-stone-900 hover:text-stone-950"
            >
              Ritvik Ellendula
            </Link>

            <div className="flex items-center gap-6 sm:gap-7">
              {nav.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "group relative text-xs font-medium uppercase tracking-[0.18em] text-stone-700 transition-colors hover:text-stone-950",
                      active && "text-stone-950"
                    )}
                  >
                    {item.label}
                    <span
                      className={cx(
                        "absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-amber-500 transition-all",
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-hover:-bottom-[7px]"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

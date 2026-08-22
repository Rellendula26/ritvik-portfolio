"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experiences", href: "/experiences" },
  { label: "Research", href: "/research" },
  { label: "Life", href: "/life" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 md:px-8 md:pt-8">
        <div
          className={cx(
            "rounded-2xl border backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ease-out",
            scrolled
              ? "border-stone-200/80 bg-white/80 shadow-md"
              : "border-stone-200/60 bg-white/55 shadow-sm"
          )}
        >
          <nav className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.18em] uppercase text-stone-900 transition-colors duration-300 hover:text-amber-800"
            >
              Ritvik Ellendula
            </Link>

            <div className="flex items-center gap-4 overflow-x-auto sm:gap-7">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active ? "true" : "false"}
                    className={cx(
                      "nav-underline text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                      active
                        ? "text-stone-950"
                        : "text-stone-700 hover:text-stone-950"
                    )}
                  >
                    {item.label}
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

"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "About Us", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Services", href: "/#services" },
  { label: "Blog", href: "/blog" },
];

// Blog and Contact Us are real pages, not in-page sections - plain anchors
// (not next/link) throughout this menu, same reason as everywhere else in
// this site: GSAP's ScrollTrigger pins don't survive a client-side route
// change cleanly, so every cross-page link here is a full navigation.
//
// Matches https://dermalife-3d.norma313.chatgpt.site/'s header structure:
// exactly two flex children under justify-between - the logo alone, and one
// nav element grouping the section links + Blog + the Contact Us pill
// together - so the logo sits isolated on the far left instead of the nav
// links floating toward the header's center.
//
// Absolutely positioned over the hero (not sticky/in-flow, and no bg/border)
// so it reads as part of the hero section instead of a separate bar sitting
// on top of it - the hero's own content is vertically centered in its
// h-screen block, which leaves clear space at the top for this to overlay.
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[100]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/social-logo.png"
            alt="DermaLife"
            className="h-16 w-auto md:h-20 lg:h-28"
          />
        </a>

        <nav className="hidden items-center gap-7 font-sans text-sm font-medium uppercase tracking-[0.15em] text-[#2B302B] lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative inline-block py-1 transition-colors duration-150 hover:text-[#6B8F71]"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </a>
          ))}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#2B302B] px-5 py-2.5 tracking-[0.1em] transition-colors duration-150 hover:bg-[#2B302B] hover:text-white"
          >
            Contact Us
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-[#2B302B] transition-transform duration-150 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-[#2B302B] transition-opacity duration-150 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-[#2B302B] transition-transform duration-150 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[#2B302B]/10 bg-white px-4 py-4 font-sans lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium uppercase tracking-[0.15em] text-[#2B302B]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#2B302B] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.1em] text-[#2B302B]"
          >
            Contact Us
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      )}
    </header>
  );
}

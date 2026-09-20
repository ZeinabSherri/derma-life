"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Bounded } from "@/components/Bounded";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Bring your vision to life" CTA callout - ported from the reference
 * site's matching section, but on a white ground instead of its tan/gold
 * one (per request). Left-aligned copy + stacked CTAs on the right,
 * with the reference's soft circle/arc motifs re-created as low-opacity
 * brand-tint shapes so they read against white instead of disappearing.
 */
export function ContactTeaser() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  useGSAP(() => {
    if (!isDesktop) {
      // Defensive: useMediaQuery's serverFallback briefly reports
      // isDesktop:true on first render even on mobile (until the real
      // client-side match resolves), so the animation below can run once
      // and apply its opacity:0/translateY "from" state before this
      // effect re-runs with the correct value - explicitly clear it
      // rather than relying on cleanup timing.
      gsap.set(
        [
          ".contact-teaser-kicker",
          ".contact-teaser-heading",
          ".contact-teaser-body",
          ".contact-teaser-button",
          ".contact-teaser-phone",
        ],
        { clearProps: "all" },
      );
      return;
    }

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      })
      .from(".contact-teaser-kicker", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
      .from(
        ".contact-teaser-heading",
        { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
        "-=0.25",
      )
      .from(
        ".contact-teaser-body",
        { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      )
      .from(
        ".contact-teaser-button",
        { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      )
      .from(
        ".contact-teaser-phone",
        { y: 16, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );
  }, { dependencies: [isDesktop] });

  return (
    <Bounded className="contact-teaser relative flex items-center overflow-hidden bg-white py-16 text-[#2B302B] lg:h-screen lg:py-0">
      {/* Decorative motifs from the reference - re-tinted as soft brand
          washes instead of the reference's opaque tan shapes so they read
          against white. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-[#6B8F71]/10"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-24 -top-24 size-96 text-[#2B302B]/10"
      >
        <circle cx="200" cy="200" r="199" fill="none" stroke="currentColor" />
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[28%] top-1/2 hidden size-6 -translate-y-1/2 rounded-full border border-[#2B302B]/15 lg:block"
      />

      <div className="relative grid w-full items-center gap-10 lg:grid-cols-[1fr,auto] lg:gap-8">
        <div>
          <p className="contact-teaser-kicker font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
            Let&apos;s Create Together.
          </p>
          <h2 className="contact-teaser-heading mt-4 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
            Bring your vision{" "}
            <em className="block font-normal italic">to life.</em>
          </h2>
          <p className="contact-teaser-body mt-6 max-w-lg text-lg font-normal text-[#2B302B]/80 lg:text-xl">
            DermaLife delivers everything you need to conquer the world,
            including expert guidance at each step along the way. We can
            also plug into your own product development process at any
            stage.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          {/* Plain anchor (full navigation), not next/link - see
              BlogTeaser.tsx for why: GSAP's ScrollTrigger pins elsewhere on
              this page don't survive a client-side unmount cleanly. */}
          <a
            href="/contact"
            className="contact-teaser-button inline-flex items-center gap-10 rounded-full bg-[#1F3A2E] py-3 pl-6 pr-3 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-[#16291f]"
          >
            Contact Us
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-white/15 text-lg"
            >
              ↗
            </span>
          </a>
          <a
            href="tel:+393515846229"
            className="contact-teaser-phone font-serif text-xl italic text-[#2B302B] underline decoration-[#2B302B]/40 underline-offset-4 transition-colors duration-150 hover:text-[#6B8F71]"
          >
            +39 351 584 6229
          </a>
        </div>
      </div>
    </Bounded>
  );
}

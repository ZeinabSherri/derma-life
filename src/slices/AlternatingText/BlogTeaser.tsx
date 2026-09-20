"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Bounded } from "@/components/Bounded";
import { WavyCircles } from "@/slices/Carousel/WavyCircles";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A lightweight, non-3D "read the blog" callout. Deliberately different from
 * the section above it (no pinned/scrolling bottle) - just a one-time
 * reveal-on-scroll animation, kept in the same on-brand visual language
 * (sage green, the WavyCircles motif from the Carousel) so it still feels
 * part of the same site. Structured like every other numbered section
 * (kicker + animated line, eyebrow, two-column heading/intro) instead of
 * the old plain centered layout, so it reads as part of the same site.
 */
export function BlogTeaser() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  useGSAP(
    () => {
      if (!isDesktop) {
        // Defensive: useMediaQuery's serverFallback briefly reports
        // isDesktop:true on first render even on mobile (until the real
        // client-side match resolves), so these opacity-animated tweens
        // can run once and apply their hidden "from" state before this
        // effect re-runs with the correct value - explicitly clear it
        // rather than relying on cleanup timing.
        gsap.set(
          [".blog-teaser-heading", ".blog-teaser-body", ".blog-teaser-button"],
          { clearProps: "all" },
        );
        return;
      }

      gsap.from(".section-kicker-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".blog-teaser",
            start: "top 75%",
          },
        })
        .from(".blog-teaser-heading", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(
          ".blog-teaser-body",
          { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          ".blog-teaser-button",
          { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        );
    },
    { scope: sectionRef, dependencies: [isDesktop] },
  );

  return (
    <Bounded className="blog-teaser relative flex items-center overflow-hidden bg-white py-16 text-[#2B302B]">
      <WavyCircles className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] -translate-x-1/2 -translate-y-1/2 text-[#6B8F71]/10" />

      <div ref={sectionRef} className="relative z-10 w-full">
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
            05 &mdash; Our Blog
          </p>
          <span className="section-kicker-line h-px w-full bg-[#2B302B]/20" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
              Our Blog
            </p>
            <h2 className="blog-teaser-heading mt-2 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
              From our <em className="font-normal italic">blog.</em>
            </h2>
          </div>
          <p className="blog-teaser-body text-lg font-normal text-[#2B302B]/80 lg:text-xl">
            Insights on skincare science, formulation trends, and industry
            updates &mdash; stay ahead with DermaLife&apos;s latest articles.
          </p>
        </div>

        {/*
          Plain anchor (not next/link) - this triggers a full page
          navigation instead of a client-side transition. The homepage's
          GSAP ScrollTrigger pins mutate the DOM directly, which conflicts
          with React's unmount process during client-side routing; a full
          navigation sidesteps that entirely and also means we're not
          keeping the heavy 3D/WebGL scene alive when leaving for a plain
          content page.
        */}
        <a
          href="/blog"
          className="blog-teaser-button mt-10 inline-flex items-center gap-10 rounded-full bg-[#1F3A2E] py-3 pl-6 pr-3 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-[#16291f]"
        >
          Visit Our Blog
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-lg"
          >
            &#8599;
          </span>
        </a>
      </div>
    </Bounded>
  );
}

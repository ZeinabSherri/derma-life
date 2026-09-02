"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Bounded } from "@/components/Bounded";
import { WavyCircles } from "@/slices/Carousel/WavyCircles";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A lightweight, non-3D "read the blog" callout. Deliberately different from
 * the section above it (no pinned/scrolling bottle) - just a one-time
 * reveal-on-scroll animation, kept in the same on-brand visual language
 * (sage green, the WavyCircles motif from the Carousel) so it still feels
 * part of the same site.
 */
export function BlogTeaser() {
  useGSAP(() => {
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
  });

  return (
    <Bounded className="blog-teaser relative overflow-hidden bg-[#6B8F71] text-[#FAFAF8]">
      <WavyCircles className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] -translate-x-1/2 -translate-y-1/2 text-white/10" />

      <div className="relative mx-auto grid max-w-2xl place-items-center gap-4 py-24 text-center">
        <h2 className="blog-teaser-heading text-balance text-5xl font-bold lg:text-6xl">
          From Our Blog
        </h2>
        <p className="blog-teaser-body max-w-xl text-balance text-xl font-normal opacity-90">
          Insights on skincare science, formulation trends, and industry updates
          — stay ahead with DermaLife&apos;s latest articles.
        </p>
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
          className="blog-teaser-button mt-4 rounded-xl bg-[#FAFAF8] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-[#2B302B] transition-colors duration-150 hover:bg-white"
        >
          Visit Our Blog
        </a>
      </div>
    </Bounded>
  );
}

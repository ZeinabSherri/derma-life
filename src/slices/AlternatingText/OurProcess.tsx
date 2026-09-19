"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    title: "Order Samples + Determine Products",
    text: "Choose from our curated selection of high-quality products.",
    parallax: 0.025,
  },
  {
    title: "Consult with us on Packaging",
    text: "Select packaging that complements your product and brand.",
    parallax: 0.037,
  },
  {
    title: "Design Your Label",
    text: "Create labels with our design team or your own designer.",
    parallax: 0.048,
  },
  {
    title: "Consider Finishing Touches",
    text: "Complete your range with boxes, shrink-wrap, inserts, and more.",
    parallax: 0.06,
  },
];

export default function OurProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Kicker line draws in from the left, same treatment every section
      // with this pattern (Who We Are / What We Do / The Process) shares.
      gsap.from(".section-kicker-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      // Intro block: fade + lift, matching the reference's .reveal timing
      // (opacity/transform, .9s, cubic-bezier(.22,1,.36,1) - approximated
      // with power3.out since no CustomEase plugin is registered here).
      gsap.from(".our-process-heading", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      // Each step: the reference's more dramatic card variant - a slight
      // 3D tilt/lift settling into place, staggered.
      gsap.from(".our-process-row", {
        y: 55,
        z: -90,
        rotateX: 7,
        scale: 0.975,
        opacity: 0,
        transformPerspective: 800,
        transformOrigin: "top center",
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      // Subtle continuous parallax drift as the section scrolls by, scaled
      // per-row the same way the reference's data-parallax factors do.
      document.querySelectorAll<HTMLElement>(".our-process-row").forEach((row) => {
        const factor = Number(row.dataset.parallax || 0);
        gsap.to(row, {
          y: () => -factor * 900,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="our-process relative overflow-hidden py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 hidden size-96 rounded-full bg-[#6B8F71]/10 lg:block"
      />

      <div className="relative flex items-center gap-4">
        <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
          04 &mdash; The Process
        </p>
        <span className="section-kicker-line h-px w-full bg-[#2B302B]/20" />
      </div>

      <div className="our-process-heading relative mt-10 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Here&apos;s How To Get Started.
          </p>
          <h2 className="mt-2 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
            Your vision, <em className="font-normal italic">made real.</em>
          </h2>
        </div>
        <p className="text-lg font-normal text-[#2B302B]/80 lg:text-xl">
          We collaborate with you to create a private label line that
          reflects your brand.
        </p>
      </div>

      <div className="relative mt-12 border-t border-[#2B302B]/10">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            data-parallax={step.parallax}
            className="our-process-row group relative grid items-center gap-3 overflow-hidden border-b border-[#2B302B]/10 bg-[length:200%_100%] bg-[position:0%_0] bg-[linear-gradient(90deg,transparent,rgba(107,143,113,.12),transparent)] py-6 transition-[background-position,padding-left] duration-500 hover:bg-[position:100%_0] hover:pl-3 md:grid-cols-[auto,auto,1fr,1fr] md:gap-6"
          >
            <span className="font-serif text-3xl italic text-[#2B302B]/25">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "size-3 shrink-0 rounded-full transition-colors duration-300",
                i === 0
                  ? "bg-[#6B8F71]"
                  : "bg-[#2B302B]/15 group-hover:bg-[#6B8F71]/60",
              )}
            />
            <p className="text-xl font-bold text-[#2B302B]">{step.title}</p>
            <p className="text-[#2B302B]/70 md:text-right">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

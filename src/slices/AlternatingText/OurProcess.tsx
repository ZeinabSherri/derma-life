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
  const listRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

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

      // Reference's cursor-follow circle: a small ring that tracks the
      // mouse while it's over the step list, fading in/out at the edges.
      // Desktop/hover-capable only - there's no cursor to follow on touch.
      const mm = gsap.matchMedia();
      mm.add("(hover: hover)", () => {
        const list = listRef.current;
        const cursor = cursorRef.current;
        if (!list || !cursor) return;

        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

        const handleMove = (e: MouseEvent) => {
          const rect = list.getBoundingClientRect();
          xTo(e.clientX - rect.left);
          yTo(e.clientY - rect.top);
        };
        const handleEnter = () =>
          gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
        const handleLeave = () =>
          gsap.to(cursor, { opacity: 0, scale: 0.7, duration: 0.3, ease: "power2.in" });

        list.addEventListener("mousemove", handleMove);
        list.addEventListener("mouseenter", handleEnter);
        list.addEventListener("mouseleave", handleLeave);

        return () => {
          list.removeEventListener("mousemove", handleMove);
          list.removeEventListener("mouseenter", handleEnter);
          list.removeEventListener("mouseleave", handleLeave);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="our-process relative w-full overflow-hidden py-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-16 hidden size-[30rem] rounded-full bg-[#6B8F71]/10 lg:block"
      />

      <div className="relative flex items-center gap-4">
        <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
          04 &mdash; The Process
        </p>
        <span className="section-kicker-line h-px w-full bg-[#2B302B]/20" />
      </div>

      <div className="our-process-heading relative mt-4 grid gap-2 lg:mt-6 lg:grid-cols-2 lg:items-end lg:gap-12">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Here&apos;s How To Get Started.
          </p>
          <h2 className="mt-1 text-balance font-serif text-2xl font-bold leading-[1.05] text-[#2B302B] lg:mt-2 lg:text-6xl">
            Your vision, <em className="font-normal italic">made real.</em>
          </h2>
        </div>
        <p className="hidden text-base font-normal text-[#2B302B]/80 sm:block lg:text-lg">
          We collaborate with you to create a private label line that
          reflects your brand.
        </p>
      </div>

      <div
        ref={listRef}
        className="relative mt-4 border-t border-[#2B302B]/10 lg:mt-6"
      >
        <span
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden size-9 items-center justify-center rounded-full border border-[#2B302B]/25 bg-white/40 opacity-0 backdrop-blur-sm lg:flex"
        >
          <span className="size-1.5 rounded-full bg-[#B9803A]" />
        </span>
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            data-parallax={step.parallax}
            className="our-process-row group relative grid grid-cols-[auto,auto,1fr] items-center gap-x-2 gap-y-0.5 overflow-hidden border-b border-[#2B302B]/10 bg-[length:200%_100%] bg-[position:0%_0] bg-[linear-gradient(90deg,transparent,rgba(107,143,113,.12),transparent)] py-2 transition-[background-position,padding-left] duration-500 hover:bg-[position:100%_0] hover:pl-3 md:grid-cols-[auto,auto,1fr,1fr] md:gap-6 md:py-3"
          >
            <span className="font-serif text-lg italic text-[#2B302B]/25 md:text-2xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "size-2.5 shrink-0 rounded-full transition-colors duration-300 md:size-3",
                i === 0
                  ? "bg-[#6B8F71]"
                  : "bg-[#2B302B]/15 group-hover:bg-[#6B8F71]/60",
              )}
            />
            <p className="text-sm font-bold text-[#2B302B] md:text-lg">
              {step.title}
            </p>
            <p className="col-span-3 pl-9 text-xs text-[#2B302B]/70 md:col-span-1 md:pl-0 md:text-sm md:text-right">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

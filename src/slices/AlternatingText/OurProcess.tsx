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
  },
  {
    title: "Consult with us on Packaging",
    text: "Select packaging that complements your product and brand.",
  },
  {
    title: "Design Your Label",
    text: "Create labels with our design team or your own designer.",
  },
  {
    title: "Consider Finishing Touches",
    text: "Complete your range with boxes, shrink-wrap, inserts, and more.",
  },
];

export default function OurProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".our-process-heading", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".our-process-row", {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
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
        <span className="h-px w-full bg-[#2B302B]/20" />
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
            className="our-process-row grid items-center gap-3 border-b border-[#2B302B]/10 py-6 md:grid-cols-[auto,auto,1fr,1fr] md:gap-6"
          >
            <span className="font-serif text-3xl italic text-[#2B302B]/25">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className={clsx(
                "size-3 shrink-0 rounded-full",
                i === 0 ? "bg-[#6B8F71]" : "bg-[#2B302B]/15",
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

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Copy, structure and every measurement below (colors, font-sizes, grid
// splits, hover treatment, the decorative circle's position/gradient, the
// short breathing kicker line) are pulled directly from the reference
// site's own compiled CSS/HTML for this section, not eyeballed from
// screenshots - see ref.css/.process, .process-step, .section-number,
// .cursor-* if this ever needs re-diffing against a reference update.
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
    parallax: 0.049,
  },
  {
    title: "Consider Finishing Touches",
    text: "Complete your range with boxes, shrink-wrap, inserts, and more.",
    parallax: 0.061,
  },
];

export default function OurProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const kickerLineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      // The reference's kicker line isn't a scroll-triggered draw-in - it's
      // a short 42px rule that continuously "breathes" (scaleX 1<->1.8,
      // opacity 1<->.4) on an infinite 3.4s loop the whole time it's on
      // screen.
      gsap.to(kickerLineRef.current, {
        scaleX: 1.8,
        opacity: 0.4,
        duration: 1.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "left center",
      });

      gsap.from(".our-process-heading", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

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
    <div ref={sectionRef} className="our-process relative w-full overflow-hidden py-4">
      <div className="relative border-t border-[#17231D]/[0.16] pt-4">
        <p className="flex items-center text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#17231D]">
          04 &mdash; The Process
          <span
            ref={kickerLineRef}
            aria-hidden="true"
            className="ml-4 inline-block h-px w-[42px] bg-current"
          />
        </p>
      </div>

      <div className="our-process-heading relative mt-[clamp(1.5rem,4vw,2.5rem)] grid gap-2 lg:grid-cols-2 lg:items-start lg:gap-[7rem]">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Here&apos;s How To Get Started.
          </p>
          <h2 className="mt-1 text-balance font-serif text-[clamp(1.75rem,3.6vw,3.5rem)] font-bold leading-[1.05] text-[#17231D] lg:mt-2">
            Your vision, <em className="font-normal italic">made real.</em>
          </h2>
        </div>
        <p className="mt-2 max-w-[34rem] text-[0.98rem] font-normal leading-[1.5] text-[#637067] lg:mt-3 lg:text-[1.06rem] lg:leading-[1.6]">
          We collaborate with you to create a private label line that
          reflects your brand.
        </p>
      </div>

      <div className="relative mt-4 lg:mt-6">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            data-parallax={step.parallax}
            className="our-process-row relative grid grid-cols-[12%,1fr] items-start gap-8 border-t border-[#17231D]/[0.16] bg-[linear-gradient(90deg,#dceadd00,#dceadd3d,#dceadd00)] bg-[length:200%_100%] bg-[position:0%_0] py-[1.1rem] transition-[padding,background-position,box-shadow] duration-500 hover:bg-[position:100%_0] hover:pl-6 hover:shadow-[0_24px_70px_#173f3112] lg:py-[1.5rem]"
          >
            <span className="font-serif text-[1.3rem] italic text-[#6B8F71]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-16">
              <h3 className="text-[1.22rem] font-bold tracking-[-0.02em] text-[#17231D] lg:text-[1.5rem]">
                {step.title}
              </h3>
              <p className="text-[0.84rem] leading-[1.45] text-[#667269] lg:text-[0.92rem] lg:leading-[1.65] lg:text-right">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CHECKLIST = [
  "Automated machinery ensures top-quality production.",
  "Our expert quality team maintains the highest standards.",
  "Premium ingredient combinations help products stand apart.",
  "We ethically source over 500 high-quality ingredients.",
  "GMP and ISO compliant, with FDA licensing.",
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".why-choose-image", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".why-choose-heading", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".why-choose-item", {
        opacity: 0,
        x: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="why-choose-us grid gap-12 overflow-hidden py-24 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      <div className="why-choose-image relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/blog/trending-ingredients.jpg"
          alt="DermaLife formulation lab"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 hidden size-56 rounded-full bg-[#6B8F71]/10 lg:block"
        />
        <div className="why-choose-heading relative">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Why Choose Us?
          </p>
          <h2 className="mt-2 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
            Science.
            <br />
            Innovation.
            <br />
            <em className="font-normal italic">Skincare.</em>
          </h2>
        </div>

        <ul className="relative mt-10 border-t border-[#2B302B]/10">
          {CHECKLIST.map((item) => (
            <li
              key={item}
              className="why-choose-item flex items-start gap-4 border-b border-[#2B302B]/10 py-4"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 text-lg leading-none text-[#6B8F71]"
              >
                +
              </span>
              <span className="text-lg text-[#2B302B]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

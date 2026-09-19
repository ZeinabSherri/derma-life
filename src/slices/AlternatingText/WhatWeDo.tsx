"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ICONS: Record<string, JSX.Element> = {
  flask: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  ),
  sparkle: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
    </svg>
  ),
  microscope: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M9 18h8" />
      <path d="M12 18v-4" />
      <path d="M8 14a5 5 0 1 1 6-4.9" />
      <path d="M13 4l4 4" />
      <path d="M5 21h12" />
    </svg>
  ),
  cube: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="m16.5 10.5 2-3" />
    </svg>
  ),
};

const SERVICES: {
  number: string;
  icon: keyof typeof ICONS;
  title: string;
  text: string;
}[] = [
  {
    number: "01",
    icon: "flask",
    title: "Skin Care & Hair Care Manufacturing",
    text: "Crafting distinctive skincare and salon-quality hair products tailored to your brand with top-tier ingredients and contemporary manufacturing techniques.",
  },
  {
    number: "02",
    icon: "sparkle",
    title: "New Product Development",
    text: "As pioneers in natural solutions, we transform your product concept into reality, guiding its development every step of the way, starting from inception.",
  },
  {
    number: "03",
    icon: "microscope",
    title: "Quality Assurance & Product Testing",
    text: "We meticulously test every product to ensure its quality, consistency, and accuracy, guaranteeing excellence in each item we deliver to our customers.",
  },
  {
    number: "04",
    icon: "cube",
    title: "Switching Manufacturers",
    text: "Ready for a change? Transition smoothly with us. Contact for a no-obligation chat; you'll be pleasantly surprised by how effortless we make it.",
  },
];

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".what-we-do-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".what-we-do-heading", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      id="services"
      className="what-we-do scroll-mt-24 py-24"
    >
      <div className="flex items-center gap-4">
        <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
          03 &mdash; What We Do
        </p>
        <span className="h-px w-full bg-[#2B302B]/20" />
      </div>

      <div className="what-we-do-heading mt-10 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Services
          </p>
          <h2 className="mt-2 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
            From concept to <em className="font-normal italic">consumer.</em>
          </h2>
        </div>
        <p className="text-lg font-normal text-[#2B302B]/80 lg:text-xl">
          We utilize innovative ingredients, ongoing research, and creativity
          to develop the most imaginative, distinctive natural and organic
          products for various skincare and cosmetic brands.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-[#2B302B]/10 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => (
          <div
            key={service.number}
            className={clsx(
              "what-we-do-card group flex min-h-72 flex-col justify-between p-8 transition-colors duration-300",
              i === 0
                ? "bg-[#1F3A2E] text-white"
                : "bg-[#F5F3EE] text-[#2B302B] hover:bg-[#1F3A2E] hover:text-white",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={clsx(
                  "text-xs font-bold uppercase tracking-wide transition-colors duration-300",
                  i === 0
                    ? "text-white/60"
                    : "text-[#2B302B]/50 group-hover:text-white/60",
                )}
              >
                {service.number}
              </span>
              {ICONS[service.icon]}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p
                className={clsx(
                  "mt-3 text-sm transition-colors duration-300",
                  i === 0
                    ? "text-white/80"
                    : "text-[#2B302B]/70 group-hover:text-white/80",
                )}
              >
                {service.text}
              </p>
              <span aria-hidden="true" className="mt-6 inline-block text-lg">
                &#8599;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

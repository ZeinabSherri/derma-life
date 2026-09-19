"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Center, Environment, View } from "@react-three/drei";

import { Bounded } from "@/components/Bounded";
import { TextSplitter } from "@/components/TextSplitter";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import CategoryTicker from "@/components/CategoryTicker";
import Scene from "./Scene";
import { useStore } from "@/hooks/useStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Mobile/tablet-only: the desktop hero-scene below is a sticky full-bleed
// canvas whose 9 bottles are driven entirely by a scroll-scrubbed GSAP
// timeline tuned for wide screens - the positions crowd/overlap on narrower
// canvases (less horizontal 3D world-space for the same vertical FOV) below
// ~1024px, so this is a small, self-contained, non-scroll-tied pair instead
// (same pattern as Carousel/ContactTeaser) that just floats in place.
const MOBILE_FIRST_SECTION_BOTTLES: {
  flavor: SodaCanProps["flavor"];
  position: [number, number, number];
  floatSpeed: number;
}[] = [
  { flavor: "blackCherry", position: [0.35, 0, 0], floatSpeed: 1.4 },
  { flavor: "strawberryLemonade", position: [0.85, 0, 0], floatSpeed: 1.7 },
];

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const ready = useStore((state) => state.ready);
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  useGSAP(
    () => {
      if (!ready && isDesktop) return;

      const introTl = gsap.timeline();

      introTl
        .set(".hero", { opacity: 1 })
        .from(".hero-eyebrow", {
          opacity: 0,
          y: 10,
        })
        .from(".hero-header-word", {
          scale: 3,
          opacity: 0,
          ease: "power4.in",
          delay: 0.3,
          stagger: 1,
        })
        .from(
          ".hero-subheading",
          {
            opacity: 0,
            y: 30,
          },
          "+=.8",
        )
        .from(".hero-body", {
          opacity: 0,
          y: 10,
        });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      scrollTl
        .fromTo(
          "body",
          {
            backgroundColor: "#FFFFFF",
          },
          {
            backgroundColor: "#F7F8F5",
            overwrite: "auto",
          },
          1,
        )
        // Starts alongside the body-color tween (position "1", not
        // sequentially after it) and uses a tighter stagger/duration - the
        // #about nav link jumps straight to the top of this section, and
        // this scrub-linked reveal needs to already be finished by then or
        // the last few characters land visibly faded/half-revealed.
        .from(
          ".text-side-heading .split-char",
          {
            scale: 1.3,
            y: 40,
            rotate: -25,
            opacity: 0,
            stagger: 0.03,
            ease: "back.out(3)",
            duration: 0.3,
          },
          1,
        )
        .from(".text-side-body", {
          y: 20,
          opacity: 0,
        });

      // Kicker line draws in from the left - same treatment as every other
      // "0X - Label" kicker across the site (What We Do, The Process).
      gsap.from(".hero-kicker-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "#about", start: "top 85%" },
      });
    },
    { dependencies: [ready, isDesktop] },
  );

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero opacity-0"
    >
      {isDesktop && (
        <View className="hero-scene pointer-events-none sticky top-0 z-50 -mt-[100vh] hidden h-screen w-screen lg:block">
          <Scene />
        </View>
      )}

      <div className="grid">
        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            {/*
              Mobile/tablet only: the desktop hero-scene above is a sticky
              full-bleed canvas whose 9 bottles are driven entirely by a
              scroll-scrubbed GSAP timeline tuned for wide screens - the
              positions crowd/overlap on narrower viewports (see the isDesktop
              comment below) and the scroll-hijack style pin is heavy on
              touch scrolling anyway. Rather than showing nothing here, this
              is a small, self-contained, non-scroll-tied pair of bottles
              (same pattern as Carousel/ContactTeaser) that just floats in
              place - no position/rotation tween keyed to scroll progress.
              Desktop is untouched: this block doesn't render there at all.
            */}
            {!isDesktop && (
              <View className="mb-4 aspect-[2/1] h-[26vh] max-h-56 w-full max-w-sm">
                <Center>
                  {MOBILE_FIRST_SECTION_BOTTLES.map((bottle, i) => (
                    <FloatingCan
                      key={i}
                      flavor={bottle.flavor}
                      position={bottle.position}
                      scale={1.1}
                      floatIntensity={1.1}
                      rotationIntensity={0.8}
                      floatSpeed={bottle.floatSpeed}
                    />
                  ))}
                </Center>
                <Environment
                  files="/hdr/lobby.hdr"
                  environmentIntensity={1.2}
                />
                <directionalLight intensity={5} position={[0, 1, 1]} />
              </View>
            )}
            <p className="hero-eyebrow font-sans text-xs font-medium uppercase tracking-[0.3em] text-[#6B8F71]">
              Innovation Skin Technology
            </p>
            <h1 className="hero-header text-7xl font-black uppercase leading-[.8] text-[#2B302B] md:text-[9rem] lg:text-[13rem]">
              <TextSplitter
                text="Beauty"
                wordDisplayStyle="block"
                className="hero-header-word"
              />
            </h1>
            <div className="hero-subheading mt-12 font-serif text-5xl text-[#2B302B] lg:text-6xl">
              <p>
                <span className="font-bold">Formulating</span>{" "}
                <span className="italic">for success.</span>
              </p>
            </div>
            <div className="hero-body text-2xl font-normal text-[#2B302B]">
              <p>
                Skincare. Haircare. Body care. World-class, worldwide.
              </p>
            </div>
          </div>
        </div>

        <CategoryTicker />

        <div
          id="about"
          className="text-side relative z-[80] grid items-center gap-16 py-24 md:grid-cols-2 md:gap-8 md:py-32"
        >
          <div>
            <div className="flex items-center gap-4">
              <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
                01 &mdash; Who We Are
              </p>
              <span className="hero-kicker-line h-px w-full bg-[#2B302B]/20" />
            </div>
            <p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
              Who We Are.
            </p>
            <h2 className="text-side-heading mt-2 text-balance font-serif text-5xl font-bold leading-[1.05] text-[#2B302B] lg:text-7xl">
              <TextSplitter text="Where science meets" />{" "}
              <span className="font-normal italic">
                <TextSplitter text="beauty." />
              </span>
            </h2>
            <div className="text-side-body mt-6 max-w-xl space-y-4 text-lg font-normal text-[#2B302B]">
              <p>
                DermaLife is dedicated to crafting world-class skincare,
                haircare, and body care products for renowned brands
                worldwide.
              </p>
              <p>
                As experts in contract manufacturing, we specialize in
                producing cosmetics and cosmeceuticals that not only make a
                difference but also leave a lasting impression.
              </p>
              <p>
                Our commitment to excellence ensures that every product we
                create meets the highest standards of quality and efficacy,
                setting your brand apart in the competitive market.
              </p>
            </div>
            <a
              href="/#services"
              className="mt-8 inline-flex items-center gap-2 border-b border-[#2B302B] pb-1 font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#2B302B] transition-colors duration-150 hover:border-[#6B8F71] hover:text-[#6B8F71]"
            >
              Read More
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            {/* Empty spacer - just holds the aspect ratio the badge/cards
                below are positioned against. The sticky hero-scene canvas
                above already keeps bottles visible through this whole
                section as the user scrolls, so this column doesn't need
                its own separate bottle group too. */}
            <div className="aspect-[4/5] w-full" />

            <svg
              viewBox="0 0 200 200"
              className="absolute left-2 top-2 h-24 w-24 drop-shadow-lg lg:-left-8 lg:-top-8 lg:h-32 lg:w-32"
            >
              <circle cx="100" cy="100" r="98" fill="#1F3A2E" />
              <path
                id="who-we-are-badge-ring"
                d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
                fill="none"
              />
              <text
                fill="white"
                fontSize="11"
                fontWeight="700"
                letterSpacing="2.5"
              >
                <textPath href="#who-we-are-badge-ring" startOffset="0%">
                  SCIENCE &bull; INNOVATION &bull; SKINCARE &bull; SCIENCE
                  &bull; INNOVATION &bull; SKINCARE &bull;
                </textPath>
              </text>
              <text
                x="100"
                y="114"
                textAnchor="middle"
                fontSize="38"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fill="white"
              >
                DL
              </text>
            </svg>

            <div className="absolute right-3 bottom-24 rounded-2xl bg-white px-5 py-4 shadow-xl lg:-right-8">
              <p className="font-serif text-2xl font-bold text-[#2B302B]">
                500+
              </p>
              <p className="font-sans text-[0.65rem] font-bold uppercase tracking-wide text-[#2B302B]/60">
                Ingredients
              </p>
            </div>

            <div className="absolute left-3 bottom-6 rounded-2xl bg-white px-5 py-4 shadow-xl lg:-left-8">
              <p className="font-serif text-lg font-bold text-[#2B302B]">
                GMP &middot; ISO
              </p>
              <p className="font-sans text-[0.65rem] font-bold uppercase tracking-wide text-[#2B302B]/60">
                Standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;

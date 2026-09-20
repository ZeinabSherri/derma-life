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
import { HERO_TL } from "./heroScrollTimeline";

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

// Screen-space (vh/vw) waypoints for the sparkle trail, roughly tracing
// the surviving bottle's downward-and-right path from center screen
// toward the "Who We Are" column as it descends.
const SPARK_POSITIONS: { top: string; left: string }[] = [
  { top: "42vh", left: "54vw" },
  { top: "52vh", left: "60vw" },
  { top: "62vh", left: "66vw" },
  { top: "70vh", left: "70vw" },
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

      // The section-visibility flip (opacity-0 -> 1) is not itself an
      // animation to remove - it's what makes the section visible at all
      // - so it always runs. Only the fade/scale/stagger entrance below it
      // is desktop-only; mobile gets everything visible immediately.
      gsap.set(".hero", { opacity: 1 });

      if (isDesktop) {
        gsap
          .timeline()
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
      }

      // Scroll-scrubbed choreography (body color, text reveal, blur,
      // sparkle, ripple) is desktop-only, synced to Scene.tsx's bottle
      // sequence which also only mounts on desktop - mobile has no such
      // sequence to sync with (its bottles are a separate, non-scroll-tied
      // pair) and gets all of this content simply visible, no scrub.
      if (isDesktop) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        scrollTl.fromTo(
          ".hero-header",
          { filter: "blur(0px)" },
          {
            filter: "blur(14px)",
            overwrite: "auto",
            duration: HERO_TL.blurDone - HERO_TL.blurStart,
          },
          HERO_TL.blurStart,
        );

        scrollTl
          .fromTo(
            "body",
            { backgroundColor: "#FFFFFF" },
            {
              backgroundColor: "#F7F8F5",
              overwrite: "auto",
              duration: 0.3,
            },
            HERO_TL.descendDone,
          )
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
            HERO_TL.descendDone,
          )
          .from(
            ".text-side-body",
            { y: 20, opacity: 0, duration: 0.3 },
            HERO_TL.descendDone + 0.3,
          );

        // Sparkle trail: a few small gold dots (same warm-gold spark used
        // in Why Choose Us) fade in/out with a slight downward drift,
        // staggered across the bottle's descent so they read as
        // intermittent trailing dust rather than one blob.
        [".hero-spark-1", ".hero-spark-2", ".hero-spark-3", ".hero-spark-4"].forEach(
          (sel, i) => {
            const t = HERO_TL.sparkleStart + i * 0.25;
            // immediateRender:false - these tweens sit well past position 0
            // in an already-scrubbing timeline; without this, GSAP renders
            // their target state as soon as they're added instead of
            // waiting for the scrubbed playhead to actually reach them.
            scrollTl.fromTo(
              sel,
              { opacity: 0, y: 0 },
              {
                opacity: 1,
                y: 40,
                duration: 0.4,
                ease: "power1.out",
                immediateRender: false,
              },
              t,
            );
            scrollTl.to(
              sel,
              {
                opacity: 0,
                duration: 0.3,
                ease: "power1.in",
                immediateRender: false,
              },
              t + 0.4,
            );
          },
        );

        // Ripple/puddle cue: two expanding rings fire once the bottle
        // nears its final resting spot, echoing Why Choose Us's
        // impact-ring visual but driven by scroll position so it
        // scrubs/reverses cleanly. Timed to land fully within HERO_TL.end
        // so the trailing anchor tween below is the timeline's true
        // latest end time.
        [".hero-ripple-1", ".hero-ripple-2"].forEach((sel, i) => {
          const t = HERO_TL.rippleFire + i * 0.1;
          scrollTl.fromTo(
            sel,
            { scale: 0.3, opacity: 0.7 },
            {
              scale: 4,
              opacity: 0,
              duration: 0.45,
              ease: "power1.out",
              immediateRender: false,
            },
            t,
          );
        });

        // Anchor this timeline's total duration to HERO_TL.end so it
        // stays proportionally in sync with Scene.tsx's separate scrollTl.
        scrollTl.to({}, { duration: 0 }, HERO_TL.end);

        // Kicker line draws in from the left - same treatment as every
        // other "0X - Label" kicker across the site (What We Do, The
        // Process). Desktop-only along with the rest of this scroll
        // choreography; mobile shows it static/fully drawn (see the
        // .hero-kicker-line CSS default, not animated from scaleX(0)).
        gsap.from(".hero-kicker-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "#about", start: "top 85%" },
        });
      }
    },
    { dependencies: [ready, isDesktop] },
  );

  return (
    <>
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

      {isDesktop && (
        <div className="hero-sparkles pointer-events-none sticky top-0 z-[55] -mt-[100vh] hidden h-screen w-screen lg:block">
          {SPARK_POSITIONS.map((pos, i) => (
            <span
              key={i}
              className={`hero-spark-${i + 1} absolute size-3 rounded-full opacity-0`}
              style={{
                top: pos.top,
                left: pos.left,
                background:
                  "radial-gradient(circle at 35% 35%, #E3B575, #B9803A)",
                boxShadow: "0 0 14px rgba(185,128,58,.75)",
              }}
            />
          ))}
        </div>
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

        <div
          id="about"
          className="text-side relative z-[80] grid h-screen items-center gap-4 overflow-hidden py-6 md:grid-cols-2 md:gap-8 md:py-10"
        >
          <div>
            <div className="flex items-center gap-4">
              <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
                01 &mdash; Who We Are
              </p>
              <span className="hero-kicker-line h-px w-full bg-[#2B302B]/20" />
            </div>
            <p className="mt-4 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
              Who We Are.
            </p>
            <h2 className="text-side-heading mt-2 text-balance font-serif text-3xl font-bold leading-[1.05] text-[#2B302B] md:text-4xl lg:text-6xl">
              <TextSplitter text="Where science meets" />{" "}
              <span className="font-normal italic">
                <TextSplitter text="beauty." />
              </span>
            </h2>
            <div className="text-side-body mt-3 max-w-xl space-y-2 text-sm font-normal text-[#2B302B] md:text-base lg:text-lg">
              <p>
                DermaLife is dedicated to crafting world-class skincare,
                haircare, and body care products for renowned brands
                worldwide.
              </p>
              <p className="hidden md:block">
                As experts in contract manufacturing, we specialize in
                producing cosmetics and cosmeceuticals that not only make a
                difference but also leave a lasting impression.
              </p>
              <p className="hidden lg:block">
                Our commitment to excellence ensures that every product we
                create meets the highest standards of quality and efficacy,
                setting your brand apart in the competitive market.
              </p>
            </div>
            <a
              href="/#services"
              className="mt-4 inline-flex items-center gap-2 border-b border-[#2B302B] pb-1 font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#2B302B] transition-colors duration-150 hover:border-[#6B8F71] hover:text-[#6B8F71] md:mt-8"
            >
              Read More
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="relative mx-auto h-[22vh] w-full max-w-md md:h-auto">
            {/* Empty spacer - just holds the aspect ratio the badge/cards
                below are positioned against. The sticky hero-scene canvas
                above already keeps bottles visible through this whole
                section as the user scrolls, so this column doesn't need
                its own separate bottle group too. */}
            <div className="aspect-[4/5] h-full w-full md:h-auto" />

            {/* Rippling puddle cue: fires once the descending bottle in
                Scene.tsx nears this column, via the shared HERO_TL
                position map. Desktop-only, same as Scene.tsx's canvas. */}
            {isDesktop && (
              <>
                <span
                  className="hero-ripple-1 pointer-events-none absolute bottom-6 left-1/2 size-10 -translate-x-1/2 rounded-full opacity-0"
                  style={{ border: "1.5px solid rgba(47,79,67,.4)" }}
                />
                <span
                  className="hero-ripple-2 pointer-events-none absolute bottom-6 left-1/2 size-10 -translate-x-1/2 rounded-full opacity-0"
                  style={{ border: "1.5px solid rgba(47,79,67,.4)" }}
                />
              </>
            )}

            <svg
              viewBox="0 0 200 200"
              className="absolute left-2 top-2 h-14 w-14 drop-shadow-lg md:h-24 md:w-24 lg:-left-8 lg:-top-8 lg:h-32 lg:w-32"
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

            <div className="absolute right-2 bottom-10 rounded-xl bg-white px-3 py-2 shadow-xl md:right-3 md:bottom-24 md:rounded-2xl md:px-5 md:py-4 lg:-right-8">
              <p className="font-serif text-base font-bold text-[#2B302B] md:text-2xl">
                500+
              </p>
              <p className="font-sans text-[0.55rem] font-bold uppercase tracking-wide text-[#2B302B]/60 md:text-[0.65rem]">
                Ingredients
              </p>
            </div>

            <div className="absolute left-2 bottom-2 rounded-xl bg-white px-3 py-2 shadow-xl md:left-3 md:bottom-6 md:rounded-2xl md:px-5 md:py-4 lg:-left-8">
              <p className="font-serif text-sm font-bold text-[#2B302B] md:text-lg">
                GMP &middot; ISO
              </p>
              <p className="font-sans text-[0.55rem] font-bold uppercase tracking-wide text-[#2B302B]/60 md:text-[0.65rem]">
                Standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
    {/* Full-bleed, outside the Bounded's max-w-7xl content column so it
        truly spans edge to edge - sits between Who We Are and Our
        Products (Carousel is the next slice after Hero in the page). */}
    <CategoryTicker />
    </>
  );
};

export default Hero;

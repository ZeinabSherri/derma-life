"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Center, Environment, View } from "@react-three/drei";

import { Bounded } from "@/components/Bounded";
import Button from "@/components/Button";
import { TextSplitter } from "@/components/TextSplitter";
import FloatingCan from "@/components/FloatingCan";
import Scene from "./Scene";
import { useStore } from "@/hooks/useStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const ready = useStore((state) => state.ready);
  // The 5 floating bottles are positioned in fixed 3D world coordinates
  // tuned for wide desktop screens - on a narrower canvas the camera shows
  // less horizontal world-space for the same vertical FOV, so they crowd
  // and overlap below ~1024px (this bites tablets in the 768-1023px range
  // even though that's normally treated as "desktop"). Gate the 3D scene at
  // lg instead of md so tablets get the simpler text-only hero too.
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
        })
        .from(".hero-button", {
          opacity: 0,
          y: 10,
          duration: 0.6,
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
              full-bleed canvas whose 7 bottles are driven entirely by a
              scroll-scrubbed GSAP timeline tuned for wide screens - the
              positions crowd/overlap on narrow viewports (see the isDesktop
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
                  <FloatingCan
                    flavor="blackCherry"
                    position={[-0.55, 0, 0]}
                    scale={1.3}
                    floatIntensity={1.1}
                    rotationIntensity={0.8}
                    floatSpeed={1.4}
                  />
                  <FloatingCan
                    flavor="lemonLime"
                    position={[0.55, 0, 0]}
                    scale={1.3}
                    floatIntensity={1.1}
                    rotationIntensity={0.8}
                    floatSpeed={1.7}
                  />
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
            <Button
              buttonLink={slice.primary.button_link}
              buttonText="Read More"
              className="hero-button mt-12"
            />
          </div>
        </div>

        <div
          id="about"
          className="text-side relative z-[80] grid h-screen scroll-mt-24 items-center gap-4 md:grid-cols-2"
        >
          <div>
            <h2 className="text-side-heading text-balance font-serif text-6xl font-bold text-[#2B302B] lg:text-8xl">
              <TextSplitter text="Where Science Meets Beauty" />
            </h2>
            <div className="text-side-body mt-4 max-w-xl text-balance text-xl font-normal text-[#2B302B]">
              <p>
                DermaLife is a skincare leader in contract manufacturing, crafting world-class skincare, haircare, and 
body care products for renowned brands worldwide with the quality and innovation to set your brand 
apart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;

"use client";

import { useRef } from "react";
import { Group } from "three";
import { Center, Environment, View } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Bounded } from "@/components/Bounded";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ClusterBottle = {
  flavor: SodaCanProps["flavor"];
  position: [number, number, number];
  floatSpeed: number;
};

// Small loose clusters instead of one bottle per side - each entry gets its
// own float speed so the group bobs asynchronously rather than in lockstep,
// which reads as much more clearly "alive" than a single bottle did.
const LEFT_CLUSTER: ClusterBottle[] = [
  { flavor: "blackCherry", position: [-0.4, 0.15, 0], floatSpeed: 1.4 },
  { flavor: "grape", position: [0.3, -0.2, -0.35], floatSpeed: 1.9 },
  { flavor: "lemonLime", position: [0, 0.42, 0.3], floatSpeed: 1.1 },
];

const RIGHT_CLUSTER: ClusterBottle[] = [
  { flavor: "watermelon", position: [0.4, 0.1, 0], floatSpeed: 1.3 },
  {
    flavor: "strawberryLemonade",
    position: [-0.3, -0.25, -0.35],
    floatSpeed: 1.7,
  },
  { flavor: "blackCherry", position: [0, 0.4, 0.3], floatSpeed: 1.0 },
];

/**
 * "Get In Touch" callout. Same lightweight, non-pinned concept as
 * BlogTeaser (different color, own copy), but brings the 3D bottles back in
 * for this one - a small floating cluster on each side of the centered
 * text. All of them pop in with a spin-and-scale reveal (staggered) the
 * first time the section scrolls into view, then settle into their own
 * asynchronous gentle float. No pin, no scroll-scrubbed side-swap (that's
 * AlternatingText's thing above), and each side uses its own small
 * contained <View> (same approach as the Carousel bottle) rather than a
 * full-width canvas with world-unit offsets, so it doesn't repeat the
 * tablet-crowding bug that pattern caused elsewhere. The three grid
 * children are DOM-ordered cluster/text/cluster, so "text in the middle,
 * bottles on both sides" holds true whether the grid is a single stacked
 * column (mobile) or three side-by-side columns (lg+) - no responsive
 * order overrides needed.
 */
export function ContactTeaser() {
  const leftRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];
  const rightRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  useGSAP(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      })
      .from(".contact-teaser-heading", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
      .from(
        ".contact-teaser-body",
        { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      )
      .from(
        ".contact-teaser-button",
        { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );

    // Every bottle pops in with a spin-and-scale reveal the first time this
    // section scrolls into view (staggered across the whole set), then
    // settles into FloatingCan's own idle float.
    [...leftRefs, ...rightRefs].forEach((canRef, i) => {
      if (!canRef.current) return;
      const delay = i * 0.1;
      gsap.from(canRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.1,
        delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      });
      gsap.from(canRef.current.rotation, {
        y: Math.PI * 3,
        duration: 1.3,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      });
    });
  });

  return (
    <Bounded className="contact-teaser relative overflow-hidden bg-[#C4915B] text-[#FAFAF8]">
      <div className="relative grid w-full items-center gap-8 py-16 lg:grid-cols-[1fr,auto,1fr] lg:gap-6 lg:py-24">
        <View className="aspect-square h-[42vmin] min-h-56 justify-self-center">
          <Center>
            {LEFT_CLUSTER.map((bottle, i) => (
              <FloatingCan
                key={i}
                ref={leftRefs[i]}
                flavor={bottle.flavor}
                position={bottle.position}
                scale={1.5}
                floatIntensity={1.3}
                rotationIntensity={1.1}
                floatingRange={[-0.15, 0.15]}
                floatSpeed={bottle.floatSpeed}
              />
            ))}
          </Center>
          <Environment
            files="/hdr/lobby.hdr"
            environmentIntensity={0.7}
            environmentRotation={[0, 3, 0]}
          />
          <directionalLight intensity={5} position={[0, 1, 1]} />
        </View>

        <div className="text-center">
          <h2 className="contact-teaser-heading text-balance text-5xl font-bold lg:text-6xl">
            Get In Touch
          </h2>
          <p className="contact-teaser-body mx-auto mt-4 max-w-md text-balance text-xl font-normal opacity-90">
            Ready to bring your brand to life? Let&apos;s talk about your
            product, packaging, and manufacturing needs.
          </p>
          {/* Plain anchor (full navigation), not next/link - see
              BlogTeaser.tsx for why: GSAP's ScrollTrigger pins elsewhere on
              this page don't survive a client-side unmount cleanly. */}
          <a
            href="/contact"
            className="contact-teaser-button mt-8 inline-block rounded-xl bg-[#2B302B] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-[#FAFAF8] transition-colors duration-150 hover:bg-[#1c201c]"
          >
            Contact Us
          </a>
        </div>

        <View className="aspect-square h-[42vmin] min-h-56 justify-self-center">
          <Center>
            {RIGHT_CLUSTER.map((bottle, i) => (
              <FloatingCan
                key={i}
                ref={rightRefs[i]}
                flavor={bottle.flavor}
                position={bottle.position}
                scale={1.5}
                floatIntensity={1.3}
                rotationIntensity={1.1}
                floatingRange={[-0.15, 0.15]}
                floatSpeed={bottle.floatSpeed}
              />
            ))}
          </Center>
          <Environment
            files="/hdr/lobby.hdr"
            environmentIntensity={0.7}
            environmentRotation={[0, 3, 0]}
          />
          <directionalLight intensity={5} position={[0, 1, 1]} />
        </View>
      </div>
    </Bounded>
  );
}

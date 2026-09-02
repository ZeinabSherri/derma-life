"use client";

import { Environment, Scroll } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {};

export default function Scene({}: Props) {
  const canRef = useRef<Group>(null);
  // Same reasoning as Hero: the side-offset position is a fixed 3D world
  // unit tuned for wide desktop screens, so at 768-1023px it doesn't shift
  // far enough to actually clear the text column - text and bottle overlap.
  // Use lg instead of md so tablets get the simpler centered/no-pin version.
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  const bgColors = ["#EDE3DD", "#E3E0EA", "#DCE8D5", "#E4EBE0"];

  useGSAP(
    () => {
      if (!canRef.current) return;

      const sections = gsap.utils.toArray<HTMLElement>(".alternating-section");

      // Pins the 3D scene for the entire scrollable height of the text
      // container, independent of how tall each section actually is. Skipped
      // on mobile: pinning + scroll-hijacking a (now 4-section-long) range
      // is heavy/disorienting on touch scrolling, and the can doesn't move
      // side to side there anyway (see xPosition/yRotation below), so it
      // isn't buying much - the can just scrolls with the page instead.
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: ".alternating-text-view",
          endTrigger: ".alternating-text-container",
          pin: true,
          start: "top top",
          end: "bottom bottom",
        });
      }

      // Each section gets its own trigger tied to its own boundaries, so the
      // can/background transition lines up correctly no matter how tall a
      // given section's text content is.
      sections.forEach((section, index) => {
        if (!canRef.current) return;
        if (index === 0) return;

        const isOdd = index % 2 !== 0;

        const xPosition = isDesktop ? (isOdd ? "-1" : "1") : 0;
        const yRotation = isDesktop ? (isOdd ? ".4" : "-.4") : 0;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top center",
              scrub: true,
            },
          })
          .to(canRef.current.position, {
            x: xPosition,
            ease: "circ.inOut",
          })
          .to(
            canRef.current.rotation,
            {
              y: yRotation,
              ease: "back.inOut",
            },
            "<",
          )
          .to(
            ".alternating-text-container",
            {
              backgroundColor: gsap.utils.wrap(bgColors, index),
            },
            "<",
          );
      });
    },
    { dependencies: [isDesktop] },
  );

  return (
    <group
      ref={canRef}
      position-x={isDesktop ? 1 : 0}
      rotation-y={isDesktop ? -0.3 : 0}
    >
      <FloatingCan flavor="strawberryLemonade" />
      <Environment files={"/hdr/lobby.hdr"} environmentIntensity={1.5} />
    </group>
  );
}

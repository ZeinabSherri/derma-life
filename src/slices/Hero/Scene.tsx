"use client";

import { useRef } from "react";
import { Environment } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);
  const can5Ref = useRef<Group>(null);
  const can6Ref = useRef<Group>(null);
  const can7Ref = useRef<Group>(null);
  const can8Ref = useRef<Group>(null);
  const can9Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can3Ref.current ||
      !can4Ref.current ||
      !can5Ref.current ||
      !can6Ref.current ||
      !can7Ref.current ||
      !can8Ref.current ||
      !can9Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Set can starting location
    gsap.set(can1Ref.current.position, { x: -1.5 });
    gsap.set(can1Ref.current.rotation, { z: -0.5 });

    gsap.set(can2Ref.current.position, { x: 1.5 });
    gsap.set(can2Ref.current.rotation, { z: 0.5 });

    gsap.set(can3Ref.current.position, { y: 5, z: 2 });
    gsap.set(can4Ref.current.position, { x: 2, y: 4, z: 2 });
    gsap.set(can5Ref.current.position, { y: -5 });
    gsap.set(can6Ref.current.position, { x: -2, y: -4, z: 2 });
    gsap.set(can7Ref.current.position, { x: 2, y: -5, z: 1 });
    gsap.set(can8Ref.current.position, { x: -2.5, y: 2, z: 1 });
    gsap.set(can9Ref.current.position, { x: 2.5, y: -2, z: 2 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "back.out(1.4)",
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(can1GroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(can1GroupRef.current.rotation, { z: 3 }, 0)
        .from(can2GroupRef.current.position, { y: 5, x: 1 }, 0)
        .from(can2GroupRef.current.rotation, { z: 3 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    scrollTl
      // Rotate can group
      .to(groupRef.current.rotation, { y: Math.PI * 2 })

      // Final layout: still one tight cluster (no gaps between neighbors),
      // but each bottle's y/z/rotation is its own irregular offset instead
      // of a mechanical alternating up/down pattern - reads as bottles that
      // landed beside each other naturally rather than a rigid zigzag.
      .to(can1Ref.current.position, { x: -1.25, y: 0.08, z: -1.1 }, 0)
      .to(can1Ref.current.rotation, { z: 0.15 }, 0)

      .to(can2Ref.current.position, { x: -0.95, y: -0.18, z: -1.3 }, 0)
      .to(can2Ref.current.rotation, { z: -0.22 }, 0)

      .to(can3Ref.current.position, { x: -0.68, y: 0.2, z: -0.95 }, 0)
      .to(can3Ref.current.rotation, { z: 0.08 }, 0)

      .to(can4Ref.current.position, { x: -0.3, y: -0.05, z: -1.25 }, 0)
      .to(can4Ref.current.rotation, { z: -0.1 }, 0)

      .to(can5Ref.current.position, { x: 0.05, y: 0.15, z: -1 }, 0)
      .to(can5Ref.current.rotation, { z: 0.2 }, 0)

      .to(can6Ref.current.position, { x: 0.35, y: -0.2, z: -1.3 }, 0)
      .to(can6Ref.current.rotation, { z: -0.15 }, 0)

      .to(can7Ref.current.position, { x: 0.6, y: 0.1, z: -1.05 }, 0)
      .to(can7Ref.current.rotation, { z: 0.1 }, 0)

      .to(can8Ref.current.position, { x: 0.92, y: -0.12, z: -1.2 }, 0)
      .to(can8Ref.current.rotation, { z: -0.08 }, 0)

      .to(can9Ref.current.position, { x: 1.3, y: 0.18, z: -1 }, 0)
      .to(can9Ref.current.rotation, { z: 0.18 }, 0)
      .to(
        groupRef.current.position,
        { x: 1, y: 0.15, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  // Smaller than SodaCan's default (2.3) so all 9 bottles read as a compact,
  // fully-visible cluster next to the text-side content instead of
  // overlapping/crowding each other or clipping the section's bottom edge.
  const BOTTLE_SCALE = 1.2;

  // Just the two site-wide bottle colors (blackCherry = white/cream,
  // strawberryLemonade = tan/peach), alternating across all 9 bottles.
  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          scale={BOTTLE_SCALE}
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="strawberryLemonade"
          scale={BOTTLE_SCALE}
          floatSpeed={FLOAT_SPEED}
        />
      </group>

      <FloatingCan
        ref={can3Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can4Ref}
        flavor="strawberryLemonade"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can5Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can6Ref}
        flavor="strawberryLemonade"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can7Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can8Ref}
        flavor="strawberryLemonade"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <FloatingCan
        ref={can9Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED}
      />

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}

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

      // Final layout: a loose floating cluster, not a lined-up row - x/y
      // both vary irregularly (not just a left-to-right sweep) so the six
      // bottles read as scattered/floating at different heights and
      // depths, like they're drifting near each other rather than parked
      // in a line.
      .to(can1Ref.current.position, { x: -1.1, y: 0.4, z: -0.9 }, 0)
      .to(can1Ref.current.rotation, { z: 0.15 }, 0)

      .to(can2Ref.current.position, { x: 0.55, y: 0.55, z: -1.3 }, 0)
      .to(can2Ref.current.rotation, { z: -0.22 }, 0)

      .to(can3Ref.current.position, { x: -0.55, y: -0.2, z: -1.15 }, 0)
      .to(can3Ref.current.rotation, { z: 0.1 }, 0)

      .to(can4Ref.current.position, { x: 0.95, y: -0.1, z: -0.95 }, 0)
      .to(can4Ref.current.rotation, { z: -0.12 }, 0)

      .to(can5Ref.current.position, { x: -0.05, y: -0.55, z: -1.25 }, 0)
      .to(can5Ref.current.rotation, { z: 0.2 }, 0)

      .to(can6Ref.current.position, { x: 1.15, y: 0.2, z: -1.1 }, 0)
      .to(can6Ref.current.rotation, { z: -0.15 }, 0)
      .to(
        groupRef.current.position,
        { x: 1, y: 0.15, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  // Smaller than SodaCan's default (2.3) so all 6 bottles read as a compact,
  // fully-visible cluster next to the text-side content instead of
  // overlapping/crowding each other or clipping the section's bottom edge.
  const BOTTLE_SCALE = 1.2;

  // Bumped up from FloatingCan's defaults (floatIntensity 1,
  // floatingRange [-0.1,0.1], rotationIntensity 1) so each bottle visibly
  // bobs/drifts in place instead of sitting nearly static - reinforces the
  // "floating" read now that they're no longer lined up in a row.
  const FLOAT_PROPS = {
    floatIntensity: 1.6,
    floatingRange: [-0.28, 0.28] as [number, number],
    rotationIntensity: 1.4,
  };

  // Just the two site-wide bottle colors (blackCherry = white/cream,
  // strawberryLemonade = tan/peach), alternating across all 6 bottles.
  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          scale={BOTTLE_SCALE}
          floatSpeed={FLOAT_SPEED}
          {...FLOAT_PROPS}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="strawberryLemonade"
          scale={BOTTLE_SCALE}
          floatSpeed={FLOAT_SPEED}
          {...FLOAT_PROPS}
        />
      </group>

      <FloatingCan
        ref={can3Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED * 0.85}
        {...FLOAT_PROPS}
      />

      <FloatingCan
        ref={can4Ref}
        flavor="strawberryLemonade"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED * 1.15}
        {...FLOAT_PROPS}
      />

      <FloatingCan
        ref={can5Ref}
        flavor="blackCherry"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED * 0.7}
        {...FLOAT_PROPS}
      />

      <FloatingCan
        ref={can6Ref}
        flavor="strawberryLemonade"
        scale={BOTTLE_SCALE}
        floatSpeed={FLOAT_SPEED * 1.3}
        {...FLOAT_PROPS}
      />

      {/* Environment-only lighting left the far side of every bottle
          falling off to near-black/tan, since the HDR's own bright spot
          only lights one side - a soft ambient fill (matching the
          directional fill every other bottle scene on the site already
          has) keeps the off-white body color reading as off-white all the
          way around instead of just on the lit highlight. */}
      <ambientLight intensity={1.4} />
      <directionalLight intensity={2.5} position={[0, 1, 1]} />
      <directionalLight intensity={1.2} position={[0, -1, -1]} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}

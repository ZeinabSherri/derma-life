"use client";

import { useRef } from "react";
import { Environment } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";
import { HERO_TL } from "./heroScrollTimeline";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Set can starting location - both bottles cross diagonally over
    // "BEAUTY", same as before.
    gsap.set(can1Ref.current.position, { x: -1.5 });
    gsap.set(can1Ref.current.rotation, { z: -0.5 });

    gsap.set(can2Ref.current.position, { x: 1.5 });
    gsap.set(can2Ref.current.rotation, { z: 0.5 });

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
      // can2 exits: scales down and drifts further out/back - reads as
      // "vanishing" via perspective shrink + scale, no material/opacity
      // work needed on the shared bottle meshes. Explicit durations here
      // (overriding the timeline's own `defaults:{duration:2}`) are what
      // keep each beat confined to its own HERO_TL window instead of
      // bleeding into the next one.
      .to(
        can2Ref.current.position,
        { x: 5, z: -5, duration: HERO_TL.exitDone - HERO_TL.exitStart },
        HERO_TL.exitStart,
      )
      .to(
        can2Ref.current.scale,
        {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: HERO_TL.exitDone - HERO_TL.exitStart,
        },
        HERO_TL.exitStart,
      )
      .to(
        can2Ref.current.rotation,
        { z: 1.4, duration: HERO_TL.exitDone - HERO_TL.exitStart },
        HERO_TL.exitStart,
      )

      // can1 uncrosses and comes upright, toward camera, slightly larger -
      // the "one bottle, alone, large" beat.
      .to(
        can1Ref.current.position,
        {
          x: 0,
          z: 0.5,
          duration: HERO_TL.uprightPeak - HERO_TL.uprightStart,
        },
        HERO_TL.uprightStart,
      )
      .to(
        can1Ref.current.rotation,
        { z: 0, duration: HERO_TL.uprightPeak - HERO_TL.uprightStart },
        HERO_TL.uprightStart,
      )
      .to(
        can1Ref.current.scale,
        {
          x: 1.25,
          y: 1.25,
          z: 1.25,
          duration: HERO_TL.uprightPeak - HERO_TL.uprightStart,
        },
        HERO_TL.uprightStart,
      )

      // can1 descends and settles centered in the "Who We Are" visual
      // column (badge above, stat cards below), a bit larger than before
      // now that it's the only bottle left to fill that space.
      .to(
        can1Ref.current.position,
        {
          x: 0.7,
          y: -0.3,
          z: 0.2,
          duration: HERO_TL.descendDone - HERO_TL.descendStart,
        },
        HERO_TL.descendStart,
      )
      .to(
        can1Ref.current.scale,
        {
          x: 1.35,
          y: 1.35,
          z: 1.35,
          duration: HERO_TL.descendDone - HERO_TL.descendStart,
        },
        HERO_TL.descendStart,
      )

      // Anchor this timeline's total duration to HERO_TL.end so it stays
      // proportionally in sync with index.tsx's separate scrollTl.
      .to({}, { duration: 0 }, HERO_TL.end);
  });

  // Smaller than SodaCan's default (2.3) so the bottle reads at a
  // deliberate, controlled size next to the text-side content instead of
  // overwhelming it.
  const BOTTLE_SCALE = 1.2;

  const FLOAT_PROPS = {
    floatIntensity: 1.6,
    floatingRange: [-0.28, 0.28] as [number, number],
    rotationIntensity: 1.4,
  };

  // Two bottles cross over "BEAUTY" at the top; as the user scrolls, can2
  // shrinks/recedes away and can1 uncrosses, comes upright, and descends
  // to settle near the "Who We Are" content - see the scrollTl above.
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

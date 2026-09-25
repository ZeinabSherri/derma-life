"use client";

import { useMemo, useRef } from "react";
import { Environment } from "@react-three/drei";
import { CanvasTexture, Group, Mesh, MeshBasicMaterial } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { flavorColors } from "@/components/SodaCan";
import LiquidSurface from "@/components/LiquidSurface";
import { useStore } from "@/hooks/useStore";
import { HERO_TL } from "./heroScrollTimeline";

// Cheap soft ground shadow: a black-to-transparent radial gradient baked
// into a canvas texture once and reused for both bottles' shadow discs,
// rather than shipping/decoding an external shadow image for what's a
// generic, non-brand-specific blur.
function createShadowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0.45)");
  gradient.addColorStop(0.7, "rgba(0,0,0,0.18)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const shadowRef = useRef<Mesh>(null);
  const shadowMaterialRef = useRef<MeshBasicMaterial>(null);
  const shadowTexture = useMemo(
    () => (typeof document !== "undefined" ? createShadowTexture() : null),
    [],
  );

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

    if (shadowMaterialRef.current) {
      gsap.set(shadowMaterialRef.current, { opacity: 0 });
    }
    if (shadowRef.current) {
      gsap.set(shadowRef.current.scale, { x: 0.5, y: 0.5, z: 0.5 });
    }

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

    // Soft ground shadow fades/grows in under can1 as it lands - only
    // can1 gets one, since can2 has already vanished by this point.
    if (shadowMaterialRef.current && shadowRef.current) {
      scrollTl
        .to(
          shadowMaterialRef.current,
          {
            opacity: 0.9,
            duration: HERO_TL.descendDone - HERO_TL.descendStart,
            immediateRender: false,
          },
          HERO_TL.descendStart,
        )
        .to(
          shadowRef.current.scale,
          {
            x: 1.35,
            y: 1.35,
            z: 1.35,
            duration: HERO_TL.descendDone - HERO_TL.descendStart,
            immediateRender: false,
          },
          HERO_TL.descendStart,
        );
    }
  });

  // Smaller than SodaCan's default (2.3) so the bottle reads at a
  // deliberate, controlled size next to the text-side content instead of
  // overwhelming it.
  const BOTTLE_SCALE = 1.2;

  // Only these two Hero bottles get a frosted, slightly translucent glass
  // (every other SodaCan site-wide defaults to fully opaque) - opaque glass
  // would otherwise hide the LiquidSurface mesh rendered inside it entirely.
  const BOTTLE_OPACITY = 0.88;

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
          bottleOpacity={BOTTLE_OPACITY}
          floatSpeed={FLOAT_SPEED}
          {...FLOAT_PROPS}
        >
          <LiquidSurface
            motionRef={can1Ref}
            color={flavorColors.blackCherry}
            radius={0.17 * BOTTLE_SCALE}
            y={-0.18 * BOTTLE_SCALE}
          />
          {shadowTexture && (
            <mesh
              ref={shadowRef}
              position={[0, -0.5 * BOTTLE_SCALE, 0]}
              rotation-x={-Math.PI / 2}
            >
              <circleGeometry args={[0.45 * BOTTLE_SCALE, 24]} />
              <meshBasicMaterial
                ref={shadowMaterialRef}
                map={shadowTexture}
                transparent
                opacity={0}
                depthWrite={false}
              />
            </mesh>
          )}
        </FloatingCan>
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="strawberryLemonade"
          scale={BOTTLE_SCALE}
          bottleOpacity={BOTTLE_OPACITY}
          floatSpeed={FLOAT_SPEED}
          {...FLOAT_PROPS}
        >
          <LiquidSurface
            motionRef={can2Ref}
            color={flavorColors.strawberryLemonade}
            radius={0.17 * BOTTLE_SCALE}
            y={-0.18 * BOTTLE_SCALE}
          />
        </FloatingCan>
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

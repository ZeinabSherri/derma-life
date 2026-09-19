"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group } from "three";

import FloatingCan from "@/components/FloatingCan";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Rendered inside the <View> (a separate React-Three-Fiber render tree that
// commits asynchronously relative to the outer DOM tree), not from Hero's
// own top-level useGSAP - refs to 3D objects set from the outer component
// are racy since the Canvas's own reconciler may not have mounted this
// subtree yet when that effect runs. A dedicated component living inside
// the View (matching the old Scene.tsx's pattern) gets its refs reliably,
// since its own useGSAP fires after its own subtree has committed.
export default function CrossingBottles() {
  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);

  useGSAP(() => {
    if (!can1Ref.current || !can2Ref.current) return;

    // Start crossing diagonally over the "BEAUTY" heading.
    gsap.set(can1Ref.current.position, { x: -1.3, y: 0.3, z: 0 });
    gsap.set(can1Ref.current.rotation, { z: -0.4 });
    gsap.set(can2Ref.current.position, { x: 1.3, y: -0.2, z: 0 });
    gsap.set(can2Ref.current.rotation, { z: 0.4 });

    // Scoped to just this row's own height (trigger is ".hero-first-section",
    // end is "+=100%" - one viewport height, not "bottom bottom" of the
    // whole multi-section ".hero") and only the canvas itself is pinned (not
    // the trigger row), so once this section's own scroll distance is used
    // up the pin releases and nothing lingers/bleeds into CategoryTicker or
    // Who We Are below it - that was the bug with the old full-slice-length
    // sticky scene.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".hero-first-section",
          start: "top top",
          end: "+=100%",
          scrub: 1.5,
          pin: ".hero-first-scene",
          pinSpacing: false,
        },
      })
      .to(can1Ref.current.position, { x: -0.4, y: 1.1, z: -0.6 }, 0)
      .to(can1Ref.current.rotation, { z: 0.15 }, 0)
      .to(can2Ref.current.position, { x: 0.4, y: -1.1, z: -0.6 }, 0)
      .to(can2Ref.current.rotation, { z: -0.15 }, 0);
  });

  return (
    <>
      <FloatingCan
        ref={can1Ref}
        flavor="blackCherry"
        scale={1.2}
        floatIntensity={0.5}
        rotationIntensity={0.3}
        floatSpeed={1.4}
      />
      <FloatingCan
        ref={can2Ref}
        flavor="strawberryLemonade"
        scale={1.2}
        floatIntensity={0.5}
        rotationIntensity={0.3}
        floatSpeed={1.7}
      />
    </>
  );
}

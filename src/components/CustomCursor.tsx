"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useMediaQuery } from "@/hooks/useMediaQuery";

// Global custom-cursor replacement lifted from the reference site: a big
// soft mint glow, a bordered ring, and a small gold dot, all fixed and
// following the mouse everywhere on the page (not scoped to any one
// section - the ring+dot pair is the "circle" visible near the process
// rows in a screenshot taken mid-hover, but it's active site-wide).
// Desktop/hover-capable only, since there's no cursor to follow on touch.
export default function CustomCursor() {
  const isHoverCapable = useMediaQuery("(hover: hover)", false);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHoverCapable) return;
    const glow = glowRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!glow || !ring || !dot) return;

    const glowXTo = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3" });
    const glowYTo = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3" });
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power3" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power3" });
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });

    const handleMove = (e: MouseEvent) => {
      glowXTo(e.clientX);
      glowYTo(e.clientY);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isHoverCapable]);

  if (!isHoverCapable) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply"
        style={{
          background:
            "radial-gradient(circle, #cbe8cd21, transparent 68%)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] size-[38px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#173F31]/50 transition-[width,height,background] duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C99B62] shadow-[0_0_14px_#c99b62b3]"
      />
    </>
  );
}

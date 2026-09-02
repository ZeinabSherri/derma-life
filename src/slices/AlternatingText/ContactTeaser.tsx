"use client";

import { useRef } from "react";
import { Group } from "three";
import { Center, Environment, View } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Bounded } from "@/components/Bounded";
import FloatingCan from "@/components/FloatingCan";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Get In Touch" callout. Same lightweight, non-pinned concept as
 * BlogTeaser (different color, own copy), but brings the 3D bottle back in
 * for this one - it pops in with a spin-and-scale reveal the first time the
 * section scrolls into view, then settles into its usual gentle float. No
 * pin, no scroll-scrubbed side-swap (that's AlternatingText's thing above),
 * and it uses the same small contained <View> approach as the Carousel
 * bottle rather than a full-width canvas with world-unit offsets, so it
 * doesn't repeat the tablet-crowding bug that pattern caused elsewhere.
 */
export function ContactTeaser() {
  const canRef = useRef<Group>(null);

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

    // The bottle pops in with a spin-and-scale reveal the first time this
    // section scrolls into view, then settles into FloatingCan's usual
    // gentle idle float.
    if (canRef.current) {
      gsap.from(canRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      });
      gsap.from(canRef.current.rotation, {
        y: Math.PI * 4,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-teaser",
          start: "top 75%",
        },
      });
    }
  });

  return (
    <Bounded className="contact-teaser relative overflow-hidden bg-[#C4915B] text-[#FAFAF8]">
      <div className="relative grid w-full items-center gap-8 py-16 lg:grid-cols-2 lg:gap-4 lg:py-24">
        <div className="text-center lg:text-left">
          <h2 className="contact-teaser-heading text-balance text-5xl font-bold lg:text-6xl">
            Get In Touch
          </h2>
          <p className="contact-teaser-body mx-auto mt-4 max-w-md text-balance text-xl font-normal opacity-90 lg:mx-0">
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

        <View className="aspect-square h-[55vmin] min-h-64 justify-self-center">
          <Center>
            <FloatingCan
              ref={canRef}
              flavor="watermelon"
              floatIntensity={0.6}
              rotationIntensity={0.8}
              floatSpeed={1.5}
            />
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

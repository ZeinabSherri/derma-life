"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SPINS_ON_CHANGE = 8;
// A bit slower than a flat 1s - keeps the other tweens below (background
// color, text swap) proportionally timed to it instead of drifting out of
// sync with the now-longer spin.
const SPIN_DURATION = 1.35;
const FLAVORS: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
}[] = [
  { flavor: "blackCherry", color: "#A9746E", name: "Skincare" },
  { flavor: "grape", color: "#7C6A8E", name: "Hair Care" },
  { flavor: "lemonLime", color: "#6E8B5A", name: "Personal Care" },
  {
    flavor: "strawberryLemonade",
    color: "#C4915B",
    name: "Baby Care",
  },
  { flavor: "watermelon", color: "#7FA8A0", name: "Cosmeceuticals" },
];

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): JSX.Element => {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const sodaCanRef = useRef<Group>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  useGSAP(
    () => {
      if (!isDesktop) return;

      gsap.from(".section-kicker-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });
    },
    { scope: sectionRef, dependencies: [isDesktop] },
  );

  function changeFlavor(index: number) {
    if (!sodaCanRef.current) return;

    const nextIndex = (index + FLAVORS.length) % FLAVORS.length;

    const tl = gsap.timeline();

    tl.to(
      sodaCanRef.current.rotation,
      {
        y:
          index > currentFlavorIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: SPIN_DURATION,
      },
      0,
    )
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to(
        {},
        { onStart: () => setCurrentFlavorIndex(nextIndex) },
        0.5 * SPIN_DURATION,
      )
      .to(
        ".text-wrapper",
        { duration: 0.2, y: 0, opacity: 1 },
        0.7 * SPIN_DURATION,
      );
  }

  return (
    <section
      ref={sectionRef}
      id="products"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel relative grid scroll-mt-20 grid-rows-[auto,auto,auto,auto] justify-center overflow-hidden py-14 text-[#2B302B]"
      style={{
        background:
          "linear-gradient(to bottom, #ffffff 0%, transparent 14%, transparent 86%, #ffffff 100%), linear-gradient(135deg, #FDFBF7 0%, #FFB88C 100%)",
      }}
    >
      <WavyCircles className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#2B302B]/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#2B302B]/70">
            02 &mdash; Our Products
          </p>
          <span className="section-kicker-line h-px w-full bg-[#2B302B]/20" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-12">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
              Our Products
            </p>
            <h2 className="mt-2 text-balance font-serif text-4xl font-bold leading-[1.05] text-[#2B302B] lg:text-6xl">
              Premium care, <em className="font-normal italic">engineered.</em>
            </h2>
          </div>
          <p className="text-base font-normal text-[#2B302B]/80 lg:text-lg">
            DermaLife crafts premium skincare and haircare products with
            consistent quality.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-[auto,auto,auto] items-center justify-center">
        {/* Left */}
        <ArrowButton
          onClick={() => changeFlavor(currentFlavorIndex + 1)}
          direction="left"
          label="Previous Flavor"
        />
        {/* Can */}
        <View className="aspect-square h-[42vh] max-h-96 min-h-40">
          <Center position={[0, 0, 0]}>
            <FloatingCan
              ref={sodaCanRef}
              floatIntensity={0.3}
              rotationIntensity={1}
              flavor={FLAVORS[currentFlavorIndex].flavor}
            />
          </Center>

          <Environment
            files="/hdr/lobby.hdr"
            environmentIntensity={0.6}
            environmentRotation={[0, 3, 0]}
          />
          <directionalLight intensity={6} position={[0, 1, 1]} />
        </View>
        {/* Right */}
        <ArrowButton
          onClick={() => changeFlavor(currentFlavorIndex - 1)}
          direction="right"
          label="Next Flavor"
        />
      </div>

      <div className="text-area relative z-10 mx-auto text-center">
        <div className="text-wrapper font-serif text-3xl font-bold text-[#2B302B]">
          <p>{FLAVORS[currentFlavorIndex].name}</p>
        </div>
        <div className="mt-1 text-lg font-normal text-[#2B302B]/80">
          <p>Private label &amp; custom formulation available</p>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left";
  label: string;
  onClick: () => void;
};

function ArrowButton({
  label,
  onClick,
  direction = "right",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-9 rounded-full border-2 border-[#2B302B] bg-[#2B302B]/10 p-2 text-[#2B302B] opacity-85 ring-[#2B302B] focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-11 lg:size-12"
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

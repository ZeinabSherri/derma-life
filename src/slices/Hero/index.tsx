"use client";

import { useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Center, Environment, Float, View } from "@react-three/drei";
import { Group } from "three";

import CategoryTicker from "@/components/CategoryTicker";
import { SodaCan } from "@/components/SodaCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/hooks/useStore";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

// Ported 1:1 from the reference design's own imperative rAF loop (a fixed
// 1212x678 "stage" scaled to fit the viewport, exactly like the reference)
// rather than the rest of the site's GSAP ScrollTrigger convention - this
// section's whole point is to reproduce that file's numbers and timing
// faithfully, not adapt them. Liquid-surface physics from the source were
// intentionally dropped per explicit request; only bottle
// position/rotation/scale and the arc/float beats are ported.
const STAGE_W = 1212;
const STAGE_H = 678;
const SCROLL_HEIGHT_VH = 400; // "Medium" scrollLength preset in the source

// [x, y, tilt(deg), scale] per keyframe, in stage-local px - identical to
// the source's K.A / K.R.
const KEYFRAMES = {
  A: [
    [818, 376, -30.5, 0.84],
    [206, 372, -30.5, 0.84],
    // Landed tilt was -18.6 (still leaning) - upright once settled, so not
    // every state reads as oblique.
    [1057, 463, 0, 0.66],
  ],
  R: [
    [370, 478, 48.6, 0.7],
    // Was [370, 466, ...], nearly touching bottle A's own mid-scroll
    // waypoint [206, 372, ...] once both bottles' tilt/size are accounted
    // for - moved further right/down so the two don't visually cross.
    [470, 560, 48.6, 0.7],
    // Landed tilt was 18 (still leaning) - upright once settled.
    [844, 550, 0, 0.62],
  ],
} as const;

const FLOAT_AMT = 1; // source's default `float` prop
const BOTTLE_BOX = { w: 560, h: 760 };

function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Component for "Hero" Slices.
 *
 * A literal port of an external reference design: a fixed 1212x678 design
 * canvas, scaled to fit the viewport, scrubbed by a single scroll-driven
 * progress value `p` (0-2) computed every frame from this section's own
 * bounding rect - not Prismic content, not GSAP. See KEYFRAMES above for
 * the exact source numbers.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const isReady = useStore((state) => state.isReady);
  // The fixed 1212x678 stage is scaled to fit by width, so on a narrow/tall
  // phone viewport it shrinks to a tiny letterboxed strip with huge blank
  // space above/below it. Below the same 1024px breakpoint the rest of the
  // site treats as "desktop", this renders a normal-flow, non-scroll-scrubbed
  // layout instead of trying to force the scaled canvas to fit.
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const t0Ref = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const bARef = useRef<HTMLDivElement>(null);
  const bRRef = useRef<HTMLDivElement>(null);
  // The tilt has to be applied to the 3D content itself, not the tracked
  // DOM wrapper below - <View> sizes/positions the render viewport off
  // that wrapper's axis-aligned getBoundingClientRect(), which a CSS
  // rotate() on the wrapper doesn't change, so a DOM-level rotation was
  // silently ignored and the bottle always rendered upright.
  const groupARef = useRef<Group>(null);
  const groupRRef = useRef<Group>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Mobile: instead of scroll-scrubbing through the 3 keyframes like
  // desktop, auto-advance through them on a timer, carousel-style - the
  // bottles keep the same per-section lean (KEYFRAMES[..][section][2]),
  // just reached by an automatic slide instead of scroll position.
  const [mobileSection, setMobileSection] = useState(0);
  const mobileSectionRef = useRef(0);
  const mobileGroupARef = useRef<Group>(null);
  const mobileGroupRRef = useRef<Group>(null);

  useEffect(() => {
    isReady();
    if (!isDesktop) return;

    let raf = 0;
    let p = 0;
    let last = performance.now();
    let time = 0;
    const ph = { A: 0, R: 1.7 };

    function frame() {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) {
        raf = requestAnimationFrame(frame);
        return;
      }

      const now = performance.now();
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      time += dt;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = stage.parentElement?.clientWidth ?? window.innerWidth;
      const target = clamp(-rect.top / Math.max(1, rect.height - vh)) * 2;
      p += (target - p) * (1 - Math.exp(-dt * 5));

      const s = Math.min(vw / STAGE_W, vh / STAGE_H);
      stage.style.transform = `translate(-50%,-50%) scale(${s})`;

      const seg = Math.min(1, Math.floor(p));
      const e = ease(clamp((p - seg - 0.1) / 0.8));
      const land = clamp((p - 1.55) / 0.45);
      const arcK = Math.sin(Math.PI * e);

      (
        [
          ["A", bARef, groupARef],
          ["R", bRRef, groupRRef],
        ] as const
      ).forEach(([id, bottleRef, groupRef]) => {
        const a = KEYFRAMES[id][seg];
        const b = KEYFRAMES[id][seg + 1];
        let x = lerp(a[0], b[0], e);
        let y = lerp(a[1], b[1], e);
        let tilt = lerp(a[2], b[2], e);
        let sc = lerp(a[3], b[3], e);

        if (id === "A") {
          y -= arcK * 80;
          tilt -= arcK * 22;
          sc *= 1 - arcK * 0.12;
        } else {
          // Pushed opposite A's arc (down instead of up) so the two
          // bottles clear each other vertically while their paths cross
          // horizontally mid-scroll, instead of visually overlapping.
          y += arcK * 70;
          tilt += arcK * 10;
        }

        const fl = (1 - land) * FLOAT_AMT;
        y += Math.sin(time * 1.1 + ph[id]) * 10 * fl;
        tilt += Math.sin(time * 0.75 + ph[id]) * 2.2 * fl;

        const bottleEl = bottleRef.current;
        if (bottleEl) {
          bottleEl.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
        }
        if (groupRef.current) {
          groupRef.current.rotation.z = (-tilt * Math.PI) / 180;
        }
      });

      [t0Ref, t1Ref, t2Ref].forEach((ref, i) => {
        const d = p - i;
        const el = ref.current;
        if (!el) return;
        el.style.opacity = clamp(1 - Math.abs(d) * 2.6).toFixed(3);
        el.style.transform = `translateY(${(-d * 50).toFixed(1)}px)`;
      });

      if (fillRef.current) {
        fillRef.current.style.height = ((p / 2) * 100).toFixed(1) + "%";
      }
      const n = "0" + (Math.round(p) + 1);
      if (numRef.current && numRef.current.textContent !== n) {
        numRef.current.textContent = n;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = clamp(1 - p * 4).toFixed(3);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  useEffect(() => {
    if (isDesktop) return;

    const advance = setInterval(() => {
      mobileSectionRef.current = (mobileSectionRef.current + 1) % 3;
      setMobileSection(mobileSectionRef.current);
    }, 3000);

    let raf = 0;
    function frame() {
      const i = mobileSectionRef.current;
      const targetA = (-KEYFRAMES.A[i][2] * Math.PI) / 180;
      const targetR = (-KEYFRAMES.R[i][2] * Math.PI) / 180;
      const groupA = mobileGroupARef.current;
      const groupR = mobileGroupRRef.current;
      if (groupA) groupA.rotation.z += (targetA - groupA.rotation.z) * 0.06;
      if (groupR) groupR.rotation.z += (targetR - groupR.rotation.z) * 0.06;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      clearInterval(advance);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop]);

  if (!isDesktop) {
    return (
      <>
        <div
          id="about"
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="font-heading"
          style={{
            position: "relative",
            background: "#FFFFFF",
            color: "#141414",
            padding: "72px 24px 56px",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Who We Are
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
            }}
          >
            Skincare Leaders. Formulating For Success.
          </div>
          <div
            style={{
              marginTop: 16,
              maxWidth: 420,
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#3a4247",
              fontFamily: "var(--font-body)",
              opacity: mobileSection === 2 ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            Science &middot; Innovation &middot; Skincare
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 4,
              height: 220,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", width: 150, height: 220 }}>
              <View style={{ position: "absolute", inset: 0 }}>
                <group ref={mobileGroupARef}>
                  <Float speed={1.6} floatIntensity={1.1} rotationIntensity={0.6}>
                    <Center>
                      <SodaCan flavor="ageless" scale={1.4} />
                    </Center>
                  </Float>
                </group>
                <ambientLight intensity={1.4} />
                <directionalLight intensity={2.5} position={[0, 1, 1]} />
                <directionalLight intensity={1.2} position={[0, -1, -1]} />
                <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
              </View>
            </div>
            <div
              style={{
                position: "relative",
                width: 150,
                height: 220,
                marginLeft: -32,
              }}
            >
              <View style={{ position: "absolute", inset: 0 }}>
                {/* Slightly different speed/phase than the bottle above so
                    the two don't bob in lockstep. */}
                <group ref={mobileGroupRRef}>
                  <Float speed={1.2} floatIntensity={1.3} rotationIntensity={0.6}>
                    <Center>
                      <SodaCan flavor="radiance" scale={1.4} />
                    </Center>
                  </Float>
                </group>
                <ambientLight intensity={1.4} />
                <directionalLight intensity={2.5} position={[0, 1, 1]} />
                <directionalLight intensity={1.2} position={[0, -1, -1]} />
                <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
              </View>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === mobileSection ? "#6B8F71" : "rgba(20,20,20,0.15)",
                  transition: "background 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>
        <CategoryTicker />
      </>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        id="about"
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="hero font-heading"
        style={{
          position: "relative",
          height: `${SCROLL_HEIGHT_VH}vh`,
          background: "#FFFFFF",
          color: "#141414",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#FFFFFF",
          }}
        >
          <div
            ref={stageRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: STAGE_W,
              height: STAGE_H,
              transform: "translate(-50%,-50%) scale(0.7)",
              transformOrigin: "50% 50%",
              background: "#FFFFFF",
            }}
          >
            {/* Three crossfading text states - same "WHO WE ARE" eyebrow +
                headline, repositioned each beat; t2 adds the extra subtext
                line. Identical copy/positions/sizes to the source. */}
            <div
              ref={t0Ref}
              style={{
                position: "absolute",
                left: 60,
                top: 160,
                width: 640,
                willChange: "transform,opacity",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  marginBottom: 26,
                }}
              >
                WHO WE ARE
              </div>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 500,
                  lineHeight: 1.02,
                  letterSpacing: "-0.01em",
                }}
              >
                Skincare Leaders.
                <br />
                Formulating For
                <br />
                Success.
              </div>
            </div>
            <div
              ref={t1Ref}
              style={{
                position: "absolute",
                right: 56,
                top: 84,
                width: 640,
                textAlign: "right",
                opacity: 0,
                willChange: "transform,opacity",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  marginBottom: 26,
                }}
              >
                WHO WE ARE
              </div>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 500,
                  lineHeight: 1.02,
                  letterSpacing: "-0.01em",
                }}
              >
                Skincare Leaders.
                <br />
                Formulating For
                <br />
                Success.
              </div>
            </div>
            <div
              ref={t2Ref}
              style={{
                position: "absolute",
                left: 60,
                top: 120,
                width: 680,
                opacity: 0,
                willChange: "transform,opacity",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  marginBottom: 26,
                }}
              >
                WHO WE ARE
              </div>
              <div
                style={{
                  fontSize: 66,
                  fontWeight: 500,
                  lineHeight: 1.02,
                  letterSpacing: "-0.01em",
                }}
              >
                Skincare Leaders.
                <br />
                Formulating For
                <br />
                Success.
              </div>
              <div
                style={{
                  marginTop: 34,
                  maxWidth: 420,
                  fontSize: 22,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "#3a4247",
                  fontFamily: "var(--font-body)",
                }}
              >
                Science &middot; Innovation &middot; Skincare
              </div>
            </div>

            {/* Bottle A - real 3D product model, positioned/rotated/scaled
                every frame exactly like the source moved its flat photo. */}
            <div
              ref={bARef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                willChange: "transform",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: -BOTTLE_BOX.w / 2,
                  top: -BOTTLE_BOX.h / 2,
                  width: BOTTLE_BOX.w,
                  height: BOTTLE_BOX.h,
                }}
              >
                <group ref={groupARef}>
                  <Center>
                    {/* "Ageless Skin" bottle in the reference - near-white glass. */}
                    <SodaCan flavor="ageless" scale={1.4} />
                  </Center>
                </group>
                <ambientLight intensity={1.4} />
                <directionalLight intensity={2.5} position={[0, 1, 1]} />
                <directionalLight intensity={1.2} position={[0, -1, -1]} />
                <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
              </View>
            </div>
            <div
              ref={bRRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                willChange: "transform",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: -BOTTLE_BOX.w / 2,
                  top: -BOTTLE_BOX.h / 2,
                  width: BOTTLE_BOX.w,
                  height: BOTTLE_BOX.h,
                }}
              >
                <group ref={groupRRef}>
                  <Center>
                    {/* "Radiance" bottle in the reference - light peach. */}
                    <SodaCan flavor="radiance" scale={1.4} />
                  </Center>
                </group>
                <ambientLight intensity={1.4} />
                <directionalLight intensity={2.5} position={[0, 1, 1]} />
                <directionalLight intensity={1.2} position={[0, -1, -1]} />
                <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
              </View>
            </div>

            {/* Left-edge progress rail. */}
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 250,
                height: 220,
                width: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  width: 2,
                  background: "rgba(20,20,20,0.12)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  ref={fillRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 2,
                    height: "0%",
                    background: "#6B8F71",
                  }}
                />
              </div>
              <div
                ref={numRef}
                style={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 500 }}
              >
                01
              </div>
            </div>

            <div
              ref={hintRef}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 28,
                transform: "translateX(-50%)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.3em",
                color: "#5a6268",
              }}
            >
              SCROLL
            </div>
          </div>
        </div>
      </div>
      <CategoryTicker />
    </>
  );
};

export default Hero;

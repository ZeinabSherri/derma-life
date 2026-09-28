"use client";

import { useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import CategoryTicker from "@/components/CategoryTicker";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/hooks/useStore";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

// Literal port of the reference design (DermaLife Hero.dc.html) - a fixed
// 1212x678 "stage" scaled to fit the viewport, scrubbed by a single
// scroll-driven progress value `p` (0-2), with the two bottles as flat
// photos (not a 3D model - an earlier pass tried adapting this onto the
// site's 3D bottle and it never read as convincing liquid, so this now
// matches the reference exactly: real bottle images + an SVG wave/fill
// path for the liquid, driven by the same spring-wobble physics).
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

// Bottle photo box + liquid mask geometry - identical to the source's BODY
// (used for the liquid math below) and the img/mask left/top/width/height
// in its markup.
const PHOTO_BOX = { w: 420, h: 620 };
const BODY = {
  A: { w: 142, h: 224 },
  R: { w: 172, h: 246 },
} as const;
const MASK = {
  A: { left: 145, top: 268, width: 142, height: 224, radius: "18px 18px 12px 12px" },
  R: { left: 126, top: 262, width: 172, height: 246, radius: "20px 20px 14px 14px" },
} as const;
const LIQUID_COLOR = {
  A: { fill: "oklch(0.80 0.09 225)", stroke: "oklch(0.6 0.11 225)" },
  R: { fill: "oklch(0.80 0.1 65)", stroke: "oklch(0.6 0.12 60)" },
} as const;

const FILL_LEVEL = 0.7; // source's default `fillLevel` prop
const FLOAT_AMT = 1; // source's default `float` prop

function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type LiquidSim = { w: number; v: number; wp: number; px: number | null; pt: number | null };
function makeSim(): LiquidSim {
  return { w: 0, v: 0, wp: 0, px: null, pt: null };
}

// Liquid surface: a wavy top line across the bottle's width, rotated to the
// current wobble angle and extended far past it in the same direction, so
// it reads as "everything below the surface is filled" once clipped by the
// mask div - identical math to the source's own per-frame path builder.
function updateLiquid(
  sim: LiquidSim,
  x: number,
  tilt: number,
  dt: number,
  body: { w: number; h: number },
  slosh: number,
  lEl: SVGPathElement | null,
  mEl: SVGPathElement | null,
) {
  const xv = sim.px == null ? 0 : (x - sim.px) / dt;
  const tv = sim.pt == null ? 0 : (tilt - sim.pt) / dt;
  sim.px = x;
  sim.pt = tilt;

  const wT = clamp((-xv * 0.035 + tv * 0.35) * slosh, -30, 30);
  const acc = (wT - sim.w) * 110 - sim.v * 6;
  sim.v += acc * dt;
  sim.w += sim.v * dt;
  const amp =
    (1.5 + Math.min(9, Math.abs(sim.v) * 0.06 + Math.abs(wT - sim.w) * 0.25)) *
    Math.min(1.5, 0.4 + slosh);
  sim.wp += dt * (2.2 + Math.min(6, Math.abs(sim.v) * 0.04));

  const th = ((sim.w - tilt) * Math.PI) / 180;
  const cx = body.w / 2;
  const cy = body.h * (1 - FILL_LEVEL);
  const ux = Math.cos(th);
  const uy = Math.sin(th);
  const nx = Math.sin(th);
  const ny = -Math.cos(th);
  const L = 260;
  const N = 36;
  let top = "";
  let first: [number, number] = [0, 0];
  let lastPt: [number, number] = [0, 0];
  for (let i = 0; i <= N; i++) {
    const t = -L + (2 * L * i) / N;
    const w = amp * Math.sin(t * 0.045 + sim.wp) + amp * 0.4 * Math.sin(t * 0.11 - sim.wp * 1.6);
    const px = cx + t * ux + w * nx;
    const py = cy + t * uy + w * ny;
    top += (i ? " L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
    if (i === 0) first = [px, py];
    lastPt = [px, py];
  }
  const D = 2 * L;
  const fillD =
    top +
    ` L${(lastPt[0] - nx * D).toFixed(1)} ${(lastPt[1] - ny * D).toFixed(1)} L${(first[0] - nx * D).toFixed(1)} ${(first[1] - ny * D).toFixed(1)} Z`;
  lEl?.setAttribute("d", fillD);
  mEl?.setAttribute("d", top);
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
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", false);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const t0Ref = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const bARef = useRef<HTMLDivElement>(null);
  const bRRef = useRef<HTMLDivElement>(null);
  const lARef = useRef<SVGPathElement>(null);
  const mARef = useRef<SVGPathElement>(null);
  const lRRef = useRef<SVGPathElement>(null);
  const mRRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Mobile: instead of scroll-scrubbing through the 3 keyframes like
  // desktop, auto-advance through them on a timer, carousel-style - the
  // bottles keep the same per-section lean (KEYFRAMES[..][section][2]),
  // just reached by an automatic slide instead of scroll position.
  const [mobileSection, setMobileSection] = useState(0);
  const mobileSectionRef = useRef(0);
  const mobileBARef = useRef<HTMLDivElement>(null);
  const mobileBRRef = useRef<HTMLDivElement>(null);
  const mobileLARef = useRef<SVGPathElement>(null);
  const mobileMARef = useRef<SVGPathElement>(null);
  const mobileLRRef = useRef<SVGPathElement>(null);
  const mobileMRRef = useRef<SVGPathElement>(null);
  const mobileTiltRef = useRef({ A: 0, R: 0 });

  useEffect(() => {
    isReady();
    if (!isDesktop) return;

    let raf = 0;
    let p = 0;
    let last = performance.now();
    let time = 0;
    const ph = { A: 0, R: 1.7 };
    const sim = { A: makeSim(), R: makeSim() };

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
      const slosh = reducedMotion ? 0.3 : 1;

      (
        [
          ["A", bARef, lARef, mARef],
          ["R", bRRef, lRRef, mRRef],
        ] as const
      ).forEach(([id, bottleRef, lRef, mRef]) => {
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

        const fl = (1 - land) * (reducedMotion ? 0 : FLOAT_AMT);
        y += Math.sin(time * 1.1 + ph[id]) * 10 * fl;
        tilt += Math.sin(time * 0.75 + ph[id]) * 2.2 * fl;

        const bottleEl = bottleRef.current;
        if (bottleEl) {
          bottleEl.style.transform = `translate(${x}px,${y}px) rotate(${tilt}deg) scale(${sc})`;
        }
        updateLiquid(sim[id], x, tilt, dt, BODY[id], slosh, lRef.current, mRef.current);
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
  }, [isDesktop, reducedMotion]);

  useEffect(() => {
    if (isDesktop) return;

    const advance = setInterval(() => {
      mobileSectionRef.current = (mobileSectionRef.current + 1) % 3;
      setMobileSection(mobileSectionRef.current);
    }, 3000);

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const ph = { A: 0, R: 1.7 };
    const sim = { A: makeSim(), R: makeSim() };
    // Small fixed side-by-side layout (no scroll-driven x/y like desktop -
    // just the two bottles leaning to the current auto-slide section). The
    // two centers need real separation - too close and the second bottle
    // (drawn on top in DOM order) mostly covers the first.
    const pos = { A: { x: 95, y: 120, scale: 0.3 }, R: { x: 230, y: 120, scale: 0.27 } };

    function frame() {
      const now = performance.now();
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      time += dt;
      const slosh = reducedMotion ? 0.3 : 1;

      (
        [
          ["A", mobileBARef, mobileLARef, mobileMARef],
          ["R", mobileBRRef, mobileLRRef, mobileMRRef],
        ] as const
      ).forEach(([id, bottleRef, lRef, mRef]) => {
        const i = mobileSectionRef.current;
        const targetTilt = KEYFRAMES[id][i][2];
        mobileTiltRef.current[id] += (targetTilt - mobileTiltRef.current[id]) * 0.06;
        let tilt = mobileTiltRef.current[id];

        const fl = reducedMotion ? 0 : FLOAT_AMT;
        const y = pos[id].y + Math.sin(time * 1.1 + ph[id]) * 4 * fl;
        tilt += Math.sin(time * 0.75 + ph[id]) * 2 * fl;

        const bottleEl = bottleRef.current;
        if (bottleEl) {
          bottleEl.style.transform = `translate(${pos[id].x}px,${y}px) rotate(${tilt}deg) scale(${pos[id].scale})`;
        }
        updateLiquid(sim[id], 0, tilt, dt, BODY[id], slosh, lRef.current, mRef.current);
      });

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      clearInterval(advance);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop, reducedMotion]);

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
              overflow: "hidden",
            }}
          >
            <div
              ref={mobileBARef}
              style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, willChange: "transform" }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -PHOTO_BOX.w / 2,
                  top: -PHOTO_BOX.h / 2,
                  width: PHOTO_BOX.w,
                  height: PHOTO_BOX.h,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/ageless.webp"
                  alt="Ageless Skin serum"
                  style={{ position: "absolute", left: 0, top: 0, width: PHOTO_BOX.w, height: PHOTO_BOX.h, display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: MASK.A.left,
                    top: MASK.A.top,
                    width: MASK.A.width,
                    height: MASK.A.height,
                    borderRadius: MASK.A.radius,
                    overflow: "hidden",
                    mixBlendMode: "multiply",
                  }}
                >
                  <svg width={MASK.A.width} height={MASK.A.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <path ref={mobileLARef} fill={LIQUID_COLOR.A.fill} fillOpacity={0.6} />
                    <path ref={mobileMARef} fill="none" stroke={LIQUID_COLOR.A.stroke} strokeWidth={2.5} strokeOpacity={0.55} />
                  </svg>
                </div>
              </div>
            </div>
            <div
              ref={mobileBRRef}
              style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, willChange: "transform" }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -PHOTO_BOX.w / 2,
                  top: -PHOTO_BOX.h / 2,
                  width: PHOTO_BOX.w,
                  height: PHOTO_BOX.h,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/radiance.webp"
                  alt="Radiance Vitamin C serum"
                  style={{ position: "absolute", left: 0, top: 0, width: PHOTO_BOX.w, height: PHOTO_BOX.h, display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: MASK.R.left,
                    top: MASK.R.top,
                    width: MASK.R.width,
                    height: MASK.R.height,
                    borderRadius: MASK.R.radius,
                    overflow: "hidden",
                    mixBlendMode: "multiply",
                  }}
                >
                  <svg width={MASK.R.width} height={MASK.R.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <path ref={mobileLRRef} fill={LIQUID_COLOR.R.fill} fillOpacity={0.55} />
                    <path ref={mobileMRRef} fill="none" stroke={LIQUID_COLOR.R.stroke} strokeWidth={2.5} strokeOpacity={0.55} />
                  </svg>
                </div>
              </div>
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

            {/* Bottle A - a flat photo positioned/rotated/scaled every
                frame exactly like the source, with an SVG liquid surface
                clipped into a mask window over the glass. */}
            <div
              ref={bARef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                mixBlendMode: "multiply",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -PHOTO_BOX.w / 2,
                  top: -PHOTO_BOX.h / 2,
                  width: PHOTO_BOX.w,
                  height: PHOTO_BOX.h,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/ageless.webp"
                  alt="Ageless Skin serum"
                  style={{ position: "absolute", left: 0, top: 0, width: PHOTO_BOX.w, height: PHOTO_BOX.h, display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: MASK.A.left,
                    top: MASK.A.top,
                    width: MASK.A.width,
                    height: MASK.A.height,
                    borderRadius: MASK.A.radius,
                    overflow: "hidden",
                    mixBlendMode: "multiply",
                  }}
                >
                  <svg width={MASK.A.width} height={MASK.A.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <path ref={lARef} fill={LIQUID_COLOR.A.fill} fillOpacity={0.6} />
                    <path ref={mARef} fill="none" stroke={LIQUID_COLOR.A.stroke} strokeWidth={2.5} strokeOpacity={0.55} />
                  </svg>
                </div>
              </div>
            </div>
            <div
              ref={bRRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                mixBlendMode: "multiply",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -PHOTO_BOX.w / 2,
                  top: -PHOTO_BOX.h / 2,
                  width: PHOTO_BOX.w,
                  height: PHOTO_BOX.h,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero/radiance.webp"
                  alt="Radiance Vitamin C serum"
                  style={{ position: "absolute", left: 0, top: 0, width: PHOTO_BOX.w, height: PHOTO_BOX.h, display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: MASK.R.left,
                    top: MASK.R.top,
                    width: MASK.R.width,
                    height: MASK.R.height,
                    borderRadius: MASK.R.radius,
                    overflow: "hidden",
                    mixBlendMode: "multiply",
                  }}
                >
                  <svg width={MASK.R.width} height={MASK.R.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <path ref={lRRef} fill={LIQUID_COLOR.R.fill} fillOpacity={0.55} />
                    <path ref={mRRef} fill="none" stroke={LIQUID_COLOR.R.stroke} strokeWidth={2.5} strokeOpacity={0.55} />
                  </svg>
                </div>
              </div>
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

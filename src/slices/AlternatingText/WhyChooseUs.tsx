"use client";

import { useEffect, useRef } from "react";

type Row = {
  title: string;
  desc: string;
  val: string;
  suf: string;
  cap: string;
  image: string;
};

const ROWS: Row[] = [
  {
    title: "Automated machinery ensures top-quality production.",
    desc: "Precision filling lines dose to the microlitre, so the fifty-thousandth unit is identical to the first.",
    val: "99.8",
    suf: "%",
    cap: "Batch consistency",
    image: "/derma-life-science-innovation-skincare-product-body-care-4.webp",
  },
  {
    title: "Our expert quality team maintains the highest standards.",
    desc: "Stability, microbial and compatibility testing on every formula — before it ever meets a label.",
    val: "32",
    suf: "",
    cap: "Checks per batch",
    image: "/derma-life-science-innovation-skincare-switching-manufacturers-1.webp",
  },
  {
    title: "Premium ingredient combinations help products stand apart.",
    desc: "Actives are paired for synergy, not for the label — concentrations chosen to perform on real skin.",
    val: "48",
    suf: "h",
    cap: "Measured hydration",
    image: "/derma-life-science-innovation-skincare-product-testing-1.webp",
  },
  {
    title: "We ethically source over 500 high-quality ingredients.",
    desc: "A traceable library of botanicals, actives and bases from partners we audit in person.",
    val: "500",
    suf: "+",
    cap: "Traceable ingredients",
    image: "/derma-life-science-innovation-skincare-product-body-care-1.webp",
  },
  {
    title: "GMP and ISO compliant, with FDA licensing.",
    desc: "Certified systems, documented end to end, and cleared for export markets from day one.",
    val: "100",
    suf: "%",
    cap: "Documented traceability",
    image: "/derma-life-science-innovation-skincare-product-testing-2.webp",
  },
];

const CHIPS = [
  "Automation",
  "Quality control",
  "Formulation",
  "Sourcing",
  "Compliance",
];
const COLORS = ["#B4295A", "#9CC63B", "#E2A32B", "#F1EBE0", "#C7B9A2", "#E8762A"];

/**
 * A faithful port of a standalone motion-design reference (same keyframes,
 * delays, easings, and interaction logic - not a GSAP re-interpretation).
 * It's deliberately imperative (raw refs + the Web Animations API in a
 * single mount-time effect) rather than React-state-driven, because the
 * choreography directly mutates style/class outside React's render cycle;
 * re-deriving it as declarative state would risk subtly desyncing from the
 * reference's exact timing. All CSS classes/keyframes are prefixed `wcu-`
 * and scoped under the `.wcu` wrapper so nothing leaks into the rest of the
 * site (the source file targeted `:root`/`html,body` directly, which this
 * intentionally does not).
 */
export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const chipWrapRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const orbsBoxRef = useRef<HTMLDivElement>(null);
  const ripRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const l1CharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const l2SpanRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const l3SpanRef = useRef<HTMLSpanElement>(null);
  const ulRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLLIElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hairRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const idxRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const plusRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // Treat mobile/tablet the same as prefers-reduced-motion: the whole
    // entrance choreography (drop/ripple/frame-reveal/text-reveal) and the
    // auto-advancing row cycle short-circuit to their settled end state
    // instead of animating - same breakpoint as this component's own
    // mobile CSS override below (max-width:900px).
    const reduced =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 900px)").matches;
    const sec = sectionRef.current;
    const visual = visualRef.current;
    const frame = frameRef.current;
    const copy = copyRef.current;
    const chip = chipRef.current;
    const chipWrap = chipWrapRef.current;
    const stamp = stampRef.current;
    const count = countRef.current;
    const spark = sparkRef.current;
    const scan = scanRef.current;
    const drop = dropRef.current;
    const orbsBox = orbsBoxRef.current;
    if (
      !sec ||
      !visual ||
      !frame ||
      !copy ||
      !chip ||
      !chipWrap ||
      !stamp ||
      !count ||
      !spark ||
      !scan ||
      !drop ||
      !orbsBox
    )
      return;

    const rows = rowRefs.current.filter((r): r is HTMLLIElement => !!r);
    const layers = layerRefs.current.filter(
      (l): l is HTMLDivElement => !!l,
    );

    let DUR = 6000;
    let active = -1;
    let zi = 1;
    let prog: Animation | null = null;
    let paused = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let anims: Animation[] = [];

    function at(ms: number, fn: () => void) {
      timers.push(setTimeout(fn, ms));
    }
    function clearAllTimersAndAnims() {
      timers.forEach(clearTimeout);
      timers = [];
      anims.forEach((a) => {
        try {
          a.cancel();
        } catch {
          // already finished/cancelled
        }
      });
      anims = [];
    }
    function play(
      el: Element,
      k: Keyframe[],
      o: KeyframeAnimationOptions,
    ): Animation {
      const a = el.animate(k, o);
      anims.push(a);
      return a;
    }

    function odometer(el: HTMLElement, str: string, base?: number) {
      el.innerHTML = "";
      let d = 0;
      str.split("").forEach((c) => {
        if (/[0-9]/.test(c)) {
          const w = document.createElement("span");
          w.className = "wcu-reel";
          const st = document.createElement("span");
          st.className = "wcu-strip";
          for (let n = 0; n <= 9; n++) {
            const b = document.createElement("b");
            b.textContent = String(n);
            st.appendChild(b);
          }
          w.appendChild(st);
          el.appendChild(w);
          const target = "translateY(-" + Number(c) * 10 + "%)";
          if (reduced) {
            st.style.transform = target;
          } else {
            play(
              st,
              [
                {
                  transform:
                    "translateY(-" + (((Number(c) + 4) % 10) * 10) + "%)",
                },
                { transform: target },
              ],
              {
                duration: (base || 900) + d * 130,
                delay: d * 70,
                easing: "cubic-bezier(.16,1,.3,1)",
                fill: "forwards",
              },
            );
          }
          d++;
        } else {
          const s = document.createElement("span");
          s.textContent = c;
          if (c === "%" || c === "+" || c === "h") s.className = "wcu-suf";
          el.appendChild(s);
        }
      });
    }

    let orbs: HTMLSpanElement[] = [];
    function buildOrbs() {
      orbsBox!.innerHTML = "";
      orbs = [];
      COLORS.forEach((c) => {
        const o = document.createElement("span");
        o.className = "wcu-orb";
        o.style.background = "linear-gradient(155deg, " + shade(c, 16) + ", " + c + ")";
        orbsBox!.appendChild(o);
        orbs.push(o);
      });
    }
    function shade(hex: string, amt: number) {
      const n = parseInt(hex.slice(1), 16);
      const r = (n >> 16) + amt;
      const g = ((n >> 8) & 255) + amt;
      const b = (n & 255) + amt;
      const cl = (v: number) => Math.max(0, Math.min(255, v));
      return (
        "#" +
        ((1 << 24) + (cl(r) << 16) + (cl(g) << 8) + cl(b)).toString(16).slice(1)
      );
    }
    function orbPos(i: number) {
      const R = visual!.clientWidth * 0.3;
      const a = -Math.PI / 2 + i * ((Math.PI * 2) / 6);
      return { x: Math.cos(a) * R, y: Math.sin(a) * R };
    }

    function setBody() {
      rows.forEach((r, i) => {
        const b = bodyRefs.current[i];
        const inner = inRefs.current[i];
        if (!b || !inner) return;
        b.style.maxHeight = r.classList.contains("wcu-on")
          ? inner.offsetHeight + "px"
          : "0px";
      });
    }
    const onResize = () => setBody();
    addEventListener("resize", onResize);

    function sendSpark(i: number, cb: () => void) {
      if (reduced) {
        cb();
        return;
      }
      const sr = sec!.getBoundingClientRect();
      const idxEl = idxRefs.current[i];
      if (!idxEl) {
        cb();
        return;
      }
      const from = idxEl.getBoundingClientRect();
      const to = frame!.getBoundingClientRect();
      const x0 = from.left - sr.left + from.width / 2;
      const y0 = from.top - sr.top + from.height / 2;
      const x1 = to.left - sr.left + to.width * 0.86;
      const y1 = to.top - sr.top + to.height * (0.18 + i * 0.16);
      const mx = (x0 + x1) / 2;
      const my = Math.min(y0, y1) - 110;
      play(
        spark!,
        [
          { transform: `translate(${x0}px,${y0}px) scale(.3)`, opacity: 0 },
          {
            transform: `translate(${x0}px,${y0}px) scale(1)`,
            opacity: 1,
            offset: 0.1,
          },
          {
            transform: `translate(${mx}px,${my}px) scale(1.25)`,
            opacity: 1,
            offset: 0.55,
          },
          { transform: `translate(${x1}px,${y1}px) scale(.25)`, opacity: 0 },
        ],
        { duration: 820, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
      );
      at(560, cb);
    }

    function reveal(i: number) {
      const y = 18 + i * 16;
      const lay = layers[i];
      const img = imgRefs.current[i];
      if (!lay || !img) return;
      lay.style.zIndex = String(++zi);
      layers.forEach((l) => l.classList.remove("wcu-on"));
      lay.classList.add("wcu-on");
      if (reduced) {
        lay.style.clipPath = "none";
        img.style.transform = "none";
        return;
      }
      play(
        lay,
        [
          {
            clipPath: `circle(0% at 88% ${y}%)`,
            filter: "blur(14px) saturate(1.3)",
          },
          {
            clipPath: `circle(152% at 88% ${y}%)`,
            filter: "blur(0px) saturate(1)",
          },
        ],
        { duration: 1150, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
      );
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    }

    function runProg(i: number) {
      rows.forEach((_, n) => {
        const p = progRefs.current[n];
        p?.getAnimations().forEach((a) => a.cancel());
      });
      if (reduced) return;
      const p = progRefs.current[i];
      if (!p) return;
      prog = p.animate(
        [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: DUR, easing: "linear", fill: "forwards" },
      );
      prog.onfinish = () => go((active + 1) % rows.length);
      if (paused) prog.pause();
    }

    function go(i: number) {
      active = i;
      rows.forEach((r, n) => {
        r.classList.toggle("wcu-on", n === i);
        r.querySelector(".wcu-row-btn")?.setAttribute(
          "aria-expanded",
          n === i ? "true" : "false",
        );
      });
      setBody();
      sendSpark(i, () => reveal(i));
      chip!.textContent = CHIPS[i];
      chip!.classList.remove("wcu-swap");
      void chip!.offsetWidth;
      chip!.classList.add("wcu-swap");
      odometer(count!, "0" + (i + 1) + " / 05", 700);
      stamp!.innerHTML = "FIG.&nbsp;";
      const s = document.createElement("span");
      stamp!.appendChild(s);
      odometer(s, "0" + (i + 1), 600);
      const num = numRefs.current[i];
      if (num) {
        odometer(num, ROWS[i].val, 1000);
        const suf = document.createElement("span");
        suf.className = "wcu-suf";
        suf.textContent = ROWS[i].suf;
        num.appendChild(suf);
      }
      runProg(i);
    }

    function sequence() {
      sec!.classList.add("wcu-in");
      buildOrbs();

      if (reduced) {
        frame!.style.clipPath = "none";
        if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1";
        if (footRef.current) footRef.current.style.opacity = "1";
        l1CharRefs.current.forEach((c) => {
          if (c) c.style.opacity = "1";
        });
        hairRefs.current.forEach((h) => {
          if (h) h.style.transform = "scaleX(1)";
        });
        if (endRef.current) endRef.current.style.transform = "scaleX(1)";
        idxRefs.current.forEach((e) => {
          if (e) e.style.opacity = "1";
        });
        titleRefs.current.forEach((e) => {
          if (e) e.style.opacity = "1";
        });
        plusRefs.current.forEach((e) => {
          if (e) e.style.opacity = "1";
        });
        chipWrap!.classList.add("wcu-show");
        stamp!.classList.add("wcu-show");
        go(0);
        return;
      }

      // 1 - the drop falls and breaks the surface
      play(
        drop!,
        [
          {
            transform: `translateY(-${visual!.clientHeight * 0.62}px) scaleY(.8) scaleX(1.1)`,
            opacity: 0,
          },
          {
            transform: `translateY(-${visual!.clientHeight * 0.5}px) scaleY(1) scaleX(1)`,
            opacity: 1,
            offset: 0.12,
          },
          {
            transform: "translateY(-14px) scaleY(1.7) scaleX(.72)",
            opacity: 1,
            offset: 0.82,
          },
          {
            transform: "translateY(0) scaleY(.35) scaleX(1.6)",
            opacity: 1,
          },
        ],
        {
          duration: 820,
          delay: 120,
          easing: "cubic-bezier(.55,0,.85,.4)",
          fill: "both",
        },
      );
      play(drop!, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 160,
        delay: 940,
        fill: "forwards",
      });

      // 2 - impact rings
      [0, 1, 2].forEach((n) => {
        const r = ripRefs.current[n];
        if (!r) return;
        play(
          r,
          [
            { transform: "scale(.2)", opacity: 0.85 },
            {
              transform: `scale(${(visual!.clientWidth / 40) * 0.9})`,
              opacity: 0,
            },
          ],
          {
            duration: 1100,
            delay: 920 + (n + 1) * 130,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "forwards",
          },
        );
      });

      // 3 - the surface opens into the photograph
      play(
        frame!,
        [
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)" },
        ],
        {
          duration: 1150,
          delay: 980,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "forwards",
        },
      );
      const first = layers[0];
      if (first) {
        first.classList.add("wcu-on");
        first.style.zIndex = "1";
        play(
          first,
          [
            { filter: "blur(18px) saturate(1.4)" },
            { filter: "blur(0) saturate(1)" },
          ],
          { duration: 1300, delay: 980, easing: "ease-out", fill: "forwards" },
        );
      }

      // 4 - six ingredients fly out, hold, then dissolve into the formula
      orbs.forEach((o, i) => {
        const p = orbPos(i);
        play(
          o,
          [
            {
              transform: "translate(0,0) scale(0) rotate(0deg)",
              opacity: 0,
            },
            {
              transform: `translate(${p.x * 1.14}px,${p.y * 1.14}px) scale(1.1) rotate(160deg)`,
              opacity: 1,
              offset: 0.7,
            },
            {
              transform: `translate(${p.x}px,${p.y}px) scale(1) rotate(180deg)`,
              opacity: 1,
            },
          ],
          {
            duration: 1000,
            delay: 1250 + i * 70,
            easing: "cubic-bezier(.2,1.25,.3,1)",
            fill: "both",
          },
        );
        play(
          o,
          [
            { transform: `translate(${p.x}px,${p.y}px) scale(1)`, opacity: 1 },
            {
              transform: `translate(${p.x * 0.45}px,${p.y * 0.45}px) scale(.55)`,
              opacity: 0.9,
              offset: 0.6,
            },
            { transform: "translate(0,0) scale(.1)", opacity: 0 },
          ],
          {
            duration: 760,
            delay: 2950 + i * 45,
            easing: "cubic-bezier(.6,0,.35,1)",
            fill: "forwards",
          },
        );
      });

      // 5 - a pulse of light as the formula lands
      at(3700, () => {
        play(
          frame!,
          [
            { transform: "scale(1)" },
            { transform: "scale(1.016)" },
            { transform: "scale(1)" },
          ],
          { duration: 620, easing: "ease-out" },
        );
      });

      // 6 - the words arrive
      if (eyebrowRef.current) {
        play(
          eyebrowRef.current,
          [
            {
              opacity: 0,
              letterSpacing: "1.4em",
              transform: "translateY(6px)",
            },
            { opacity: 1, letterSpacing: ".32em", transform: "none" },
          ],
          {
            duration: 1100,
            delay: 1300,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      }

      l1CharRefs.current.forEach((c, i) => {
        if (!c) return;
        play(
          c,
          [
            {
              transform: "translateY(-130%) rotate(-10deg)",
              opacity: 0,
              filter: "blur(7px)",
            },
            {
              transform: "translateY(8%) rotate(2deg)",
              opacity: 1,
              filter: "blur(0)",
              offset: 0.72,
            },
            { transform: "none", opacity: 1, filter: "blur(0)" },
          ],
          {
            duration: 950,
            delay: 1700 + i * 45,
            easing: "cubic-bezier(.22,1.3,.36,1)",
            fill: "both",
          },
        );
      });

      if (l2SpanRef.current && barRef.current) {
        play(
          barRef.current,
          [
            { width: "0%", opacity: 0, left: "0%" },
            { width: "16%", opacity: 1, offset: 0.12 },
            { width: "16%", opacity: 1, left: "84%", offset: 0.9 },
            { width: "0%", opacity: 0, left: "100%" },
          ],
          {
            duration: 1000,
            delay: 2250,
            easing: "cubic-bezier(.65,0,.35,1)",
            fill: "both",
          },
        );
        play(
          l2SpanRef.current,
          [
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)" },
          ],
          {
            duration: 900,
            delay: 2330,
            easing: "cubic-bezier(.65,0,.35,1)",
            fill: "both",
          },
        );
      }

      if (l3SpanRef.current && ulRef.current) {
        play(
          l3SpanRef.current,
          [
            {
              transform: "translateY(110%)",
              opacity: 0,
              filter: "blur(6px)",
            },
            { transform: "none", opacity: 1, filter: "blur(0)" },
          ],
          {
            duration: 1000,
            delay: 2900,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
        play(
          ulRef.current,
          [
            { width: "0%", opacity: 0 },
            { width: "0%", opacity: 1, offset: 0.05 },
            { width: "96%", opacity: 1, offset: 0.7 },
            { width: "96%", opacity: 0 },
          ],
          {
            duration: 1400,
            delay: 3500,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      }

      // 7 - the index writes itself
      hairRefs.current.forEach((h, i) => {
        if (!h) return;
        play(
          h,
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          {
            duration: 760,
            delay: 3350 + i * 95,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      });
      if (endRef.current) {
        play(
          endRef.current,
          [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
          {
            duration: 760,
            delay: 3350 + 5 * 95,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      }

      rows.forEach((_, i) => {
        const idxEl = idxRefs.current[i];
        const titleEl = titleRefs.current[i];
        const plusEl = plusRefs.current[i];
        if (idxEl) {
          play(
            idxEl,
            [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 0.8, transform: "none" },
            ],
            {
              duration: 700,
              delay: 3450 + i * 95,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "both",
            },
          );
        }
        if (titleEl) {
          play(
            titleEl,
            [
              {
                opacity: 0,
                transform: "translateX(34px)",
                filter: "blur(5px)",
              },
              { opacity: 1, transform: "none", filter: "blur(0)" },
            ],
            {
              duration: 900,
              delay: 3480 + i * 95,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "both",
            },
          );
        }
        if (plusEl) {
          play(
            plusEl,
            [
              { opacity: 0, transform: "rotate(-90deg) scale(.4)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 800,
              delay: 3560 + i * 95,
              easing: "cubic-bezier(.2,1.25,.3,1)",
              fill: "both",
            },
          );
        }
      });

      // 8 - one scanning pass across the index
      at(4050, () => {
        const h = listRef.current?.offsetHeight ?? 0;
        play(
          scan!,
          [
            { transform: "translateY(-70px)", opacity: 0 },
            { opacity: 1, offset: 0.12 },
            { opacity: 1, offset: 0.8 },
            { transform: `translateY(${h}px)`, opacity: 0 },
          ],
          {
            duration: 1250,
            easing: "cubic-bezier(.45,0,.3,1)",
            fill: "forwards",
          },
        );
      });

      at(4300, () => {
        chipWrap!.classList.add("wcu-show");
        stamp!.classList.add("wcu-show");
      });
      if (footRef.current) {
        play(
          footRef.current,
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 800,
            delay: 4600,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "both",
          },
        );
      }

      // 9 - hand over to the cycling index
      at(4950, () => go(0));
    }

    rows.forEach((r, i) => {
      const btn = r.querySelector(".wcu-row-btn");
      const onClick = () => {
        if (i === active) runProg(i);
        else go(i);
      };
      btn?.addEventListener("click", onClick);
      (r as HTMLLIElement & { __wcuClick?: () => void }).__wcuClick = onClick;
    });

    function pause() {
      paused = true;
      if (prog && prog.playState === "running") prog.pause();
    }
    function resume() {
      paused = false;
      if (prog && prog.playState === "paused") prog.play();
    }
    copy.addEventListener("mouseenter", pause);
    copy.addEventListener("mouseleave", resume);
    copy.addEventListener("focusin", pause);
    copy.addEventListener("focusout", resume);
    const onVis = () => (document.hidden ? pause() : resume());
    document.addEventListener("visibilitychange", onVis);

    let onMove: ((e: MouseEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;
    if (matchMedia("(hover: hover)").matches && !reduced) {
      onMove = (e: MouseEvent) => {
        const b = visual!.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5;
        const y = (e.clientY - b.top) / b.height - 0.5;
        frame!.style.transform = `rotateY(${x * 4.5}deg) rotateX(${-y * 4.5}deg) translate3d(0,-4px,0)`;
      };
      onLeave = () => {
        frame!.style.transform = "";
      };
      visual.addEventListener("mousemove", onMove);
      visual.addEventListener("mouseleave", onLeave);
    }

    function onReplay() {
      clearAllTimersAndAnims();
      if (prog) {
        prog.cancel();
        prog = null;
      }
      sec!.classList.remove("wcu-in");
      layers.forEach((l) => {
        l.classList.remove("wcu-on");
        l.style.zIndex = "0";
        l.style.clipPath = "";
        l.style.filter = "";
      });
      rows.forEach((r, i) => {
        r.classList.remove("wcu-on");
        const b = bodyRefs.current[i];
        if (b) b.style.maxHeight = "0px";
      });
      chipWrap!.classList.remove("wcu-show");
      stamp!.classList.remove("wcu-show");
      frame!.style.clipPath = "circle(0% at 50% 50%)";
      active = -1;
      zi = 1;
      void sec!.offsetWidth;
      sequence();
    }
    replayRef.current?.addEventListener("click", onReplay);

    let started = false;
    function start() {
      if (started) return;
      started = true;
      sequence();
    }
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              start();
              io?.disconnect();
            }
          });
        },
        { threshold: 0.25 },
      );
      io.observe(sec);
    } else {
      start();
    }

    return () => {
      clearAllTimersAndAnims();
      if (prog) prog.cancel();
      removeEventListener("resize", onResize);
      io?.disconnect();
      copy.removeEventListener("mouseenter", pause);
      copy.removeEventListener("mouseleave", resume);
      copy.removeEventListener("focusin", pause);
      copy.removeEventListener("focusout", resume);
      document.removeEventListener("visibilitychange", onVis);
      if (onMove) visual.removeEventListener("mousemove", onMove);
      if (onLeave) visual.removeEventListener("mouseleave", onLeave);
      replayRef.current?.removeEventListener("click", onReplay);
      rows.forEach((r) => {
        const withClick = r as HTMLLIElement & { __wcuClick?: () => void };
        if (withClick.__wcuClick) {
          r.querySelector(".wcu-row-btn")?.removeEventListener(
            "click",
            withClick.__wcuClick,
          );
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wcu">
      <style>{WCU_CSS}</style>
      <h2 className="wcu-sr">Why choose us — science, innovation, skincare</h2>

      <section className="wcu-section" ref={sectionRef}>
        <div className="wcu-grain" />
        <span className="wcu-spark" ref={sparkRef} />

        <div className="wcu-wrap">
          {/* VISUAL */}
          <div className="wcu-visual" ref={visualRef}>
            <div className="wcu-frame" ref={frameRef}>
              {ROWS.map((row, i) => (
                <div
                  key={row.title}
                  className="wcu-layer"
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                >
                  <i
                    ref={(el) => {
                      imgRefs.current[i] = el;
                    }}
                    style={{ backgroundImage: `url(${row.image})` }}
                  />
                </div>
              ))}
              <div className="wcu-vig" />
              <div className="wcu-sheen" />
              <div className="wcu-chip" ref={chipWrapRef}>
                <span className="wcu-dot" />
                <span className="wcu-win">
                  <span className="wcu-txt" ref={chipRef}>
                    {CHIPS[0]}
                  </span>
                </span>
              </div>
              <div className="wcu-stamp" ref={stampRef} />
            </div>
            <div ref={orbsBoxRef} />
            <span
              className="wcu-ripple"
              ref={(el) => {
                ripRefs.current[0] = el;
              }}
            />
            <span
              className="wcu-ripple"
              ref={(el) => {
                ripRefs.current[1] = el;
              }}
            />
            <span
              className="wcu-ripple"
              ref={(el) => {
                ripRefs.current[2] = el;
              }}
            />
            <span className="wcu-drop" ref={dropRef} />
          </div>

          {/* COPY */}
          <div className="wcu-copy" ref={copyRef}>
            <p className="wcu-eyebrow" ref={eyebrowRef}>
              Why choose us?
            </p>
            <h2 className="wcu-display">
              <span className="wcu-ln">
                {"Science.".split("").map((c, i) => (
                  <span
                    key={i}
                    className="wcu-ch"
                    ref={(el) => {
                      l1CharRefs.current[i] = el;
                    }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <span className="wcu-ln wcu-mask">
                <span ref={l2SpanRef}>Innovation.</span>
                <i className="wcu-bar" ref={barRef} />
              </span>
              <span className="wcu-ln wcu-it">
                <span className="wcu-shimmer" ref={l3SpanRef}>
                  Skincare.
                </span>
                <i className="wcu-ul" ref={ulRef} />
              </span>
            </h2>

            <ul className="wcu-list" ref={listRef}>
              {ROWS.map((row, i) => (
                <li
                  key={row.title}
                  className="wcu-row"
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                >
                  <span
                    className="wcu-hair"
                    ref={(el) => {
                      hairRefs.current[i] = el;
                    }}
                  />
                  <button className="wcu-row-btn" type="button" aria-expanded="false">
                    <span
                      className="wcu-idx"
                      ref={(el) => {
                        idxRefs.current[i] = el;
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="wcu-row-title"
                      ref={(el) => {
                        titleRefs.current[i] = el;
                      }}
                    >
                      {row.title}
                      <i className="wcu-tul" />
                    </span>
                    <span
                      className="wcu-plus"
                      ref={(el) => {
                        plusRefs.current[i] = el;
                      }}
                    >
                      <b />
                      <b />
                    </span>
                  </button>
                  <div
                    className="wcu-row-body"
                    ref={(el) => {
                      bodyRefs.current[i] = el;
                    }}
                  >
                    <div
                      className="wcu-row-in"
                      ref={(el) => {
                        inRefs.current[i] = el;
                      }}
                    >
                      <p>{row.desc}</p>
                      <div className="wcu-metric">
                        <span
                          className="wcu-num"
                          ref={(el) => {
                            numRefs.current[i] = el;
                          }}
                        />
                        <span className="wcu-cap">{row.cap}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="wcu-prog"
                    ref={(el) => {
                      progRefs.current[i] = el;
                    }}
                  />
                </li>
              ))}
              <li className="wcu-end" ref={endRef} />
            </ul>

            <div className="wcu-scan" ref={scanRef} />

            <div className="wcu-foot" ref={footRef}>
              <p className="wcu-hint">
                <span className="wcu-only-d">
                  Hover to pause &middot; <b>click a line</b> to explore
                </span>
                <span className="wcu-only-m">
                  <b>Tap a line</b> to explore
                </span>
              </p>
              <div className="wcu-tools">
                <span className="wcu-count" ref={countRef} />
                <button className="wcu-replay" type="button" ref={replayRef}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                  Replay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const WCU_CSS = `
.wcu{
  --paper:#FBFAF8; --surface:#F2F0EB; --line:#E4E1DA;
  --ink:#1C2621; --ink-2:#5F6762;
  --accent:#2F4F43; --spark:#B9803A;
  --serif:Georgia,"Times New Roman",serif;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --mono:"SFMono-Regular",Menlo,Consolas,monospace;
  --e:cubic-bezier(.16,1,.3,1);
  --back:cubic-bezier(.2,1.25,.3,1);
  color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;
}
.wcu *{box-sizing:border-box}
.wcu-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wcu-grain{position:absolute;inset:0;z-index:9;pointer-events:none;opacity:.045;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.wcu-section{position:relative;height:100vh;display:flex;align-items:center;padding:44px 48px;overflow:hidden}
.wcu-wrap{position:relative;z-index:1;max-width:1160px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;width:100%}

.wcu-amb{position:absolute;border-radius:50%;filter:blur(46px);opacity:0;transition:opacity 1.4s ease}
.wcu-in .wcu-amb{opacity:1}
.wcu-amb-1{width:440px;height:440px;top:-120px;right:-80px;background:rgba(47,79,67,.07);animation:wcu-drift1 22s ease-in-out infinite}
.wcu-amb-2{width:300px;height:300px;bottom:-90px;left:8%;background:rgba(185,128,58,.08);animation:wcu-drift2 27s ease-in-out infinite}
.wcu-amb-3{width:240px;height:240px;top:30%;left:44%;background:rgba(47,79,67,.05);animation:wcu-drift1 19s ease-in-out infinite reverse}
@keyframes wcu-drift1{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-30px,36px,0) scale(1.12)}}
@keyframes wcu-drift2{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(40px,-28px,0) scale(.9)}}
.wcu-ring{position:absolute;right:-70px;top:-96px;width:300px;height:300px;border:1px solid var(--line);border-radius:50%;opacity:0;transition:opacity 1.6s ease}
.wcu-in .wcu-ring{opacity:1;animation:wcu-spin 46s linear infinite}
@keyframes wcu-spin{to{transform:rotate(360deg)}}

.wcu-visual{position:relative;perspective:1300px}
.wcu-frame{position:relative;aspect-ratio:1/1;max-height:min(500px,58vh);max-width:min(500px,58vh);margin:0 auto;border-radius:12px;overflow:hidden;background:var(--surface);
  box-shadow:0 1px 2px rgba(0,0,0,.05),0 22px 48px rgba(28,38,33,.08);
  clip-path:circle(0% at 50% 50%);transition:transform .5s var(--e)}
.wcu-layer{position:absolute;inset:0;overflow:hidden}
.wcu-layer i{position:absolute;inset:0;display:block;background-size:cover;background-position:center;transform:scale(1.11)}
.wcu-layer.wcu-on i{animation:wcu-kb 11s var(--e) forwards}
@keyframes wcu-kb{from{transform:scale(1.11)}to{transform:scale(1) translate3d(0,-1.5%,0)}}
.wcu-vig{position:absolute;inset:0;z-index:6;background:radial-gradient(120% 90% at 30% 20%,rgba(255,255,255,.22),rgba(28,38,33,.10) 100%)}
.wcu-sheen{position:absolute;inset:-40% -60%;z-index:7;background:linear-gradient(104deg,transparent 42%,rgba(255,255,255,.55) 50%,transparent 58%);transform:translateX(-70%);opacity:0}
.wcu-in .wcu-sheen{opacity:1;animation:wcu-sweep 7.5s ease-in-out 5.5s infinite}
@keyframes wcu-sweep{0%{transform:translateX(-70%)}55%,100%{transform:translateX(70%)}}

.wcu-chip{position:absolute;left:18px;bottom:18px;z-index:8;display:flex;align-items:center;gap:9px;height:38px;padding:0 16px;border-radius:999px;
  background:rgba(251,250,248,.86);backdrop-filter:blur(10px);box-shadow:0 4px 16px rgba(28,38,33,.10);opacity:0;transform:translateY(12px)}
.wcu-chip.wcu-show{opacity:1;transform:none;transition:opacity .6s var(--e),transform .6s var(--e)}
.wcu-dot{width:7px;height:7px;border-radius:50%;background:var(--spark);animation:wcu-pulse 2.2s ease-in-out infinite}
@keyframes wcu-pulse{0%,100%{opacity:.45;transform:scale(.85)}50%{opacity:1;transform:scale(1.15)}}
.wcu-win{display:block;height:15px;overflow:hidden}
.wcu-txt{display:block;font:600 12px/15px var(--sans);letter-spacing:.15em;text-transform:uppercase;white-space:nowrap}
.wcu-txt.wcu-swap{animation:wcu-swap .5s var(--e)}
@keyframes wcu-swap{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
.wcu-stamp{position:absolute;right:18px;bottom:18px;z-index:8;display:flex;gap:1px;padding:6px 10px;border-radius:5px;background:rgba(251,250,248,.78);
  font:500 11px/1 var(--mono);letter-spacing:.16em;color:rgba(28,38,33,.62);opacity:0;transition:opacity .6s ease}
.wcu-stamp.wcu-show{opacity:1}

.wcu-drop{position:absolute;left:50%;top:50%;z-index:12;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;
  background:linear-gradient(160deg,#D9A25C,#8E5E22);box-shadow:0 6px 18px rgba(142,94,34,.35);opacity:0}
.wcu-ripple{position:absolute;left:50%;top:50%;z-index:11;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:1.5px solid rgba(47,79,67,.4);opacity:0}

.wcu-orb{position:absolute;left:50%;top:50%;z-index:14;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;opacity:0;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 6px 18px rgba(28,38,33,.16)}
.wcu-orb::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1px solid rgba(255,255,255,.55)}

.wcu-copy{position:relative}
.wcu-eyebrow{margin:0 0 14px;font:600 12px/1 var(--sans);letter-spacing:.9em;text-transform:uppercase;color:var(--ink-2);opacity:0}
.wcu-display{font-family:var(--serif);font-size:clamp(32px,4vw,54px);line-height:1.05;letter-spacing:-.022em;margin:0 0 22px}
.wcu-ln{display:block;position:relative;overflow:hidden;padding:2px 0}
.wcu-ln .wcu-ch{display:inline-block;opacity:0;will-change:transform}
.wcu-ln.wcu-mask > span{display:inline-block;clip-path:inset(0 100% 0 0)}
.wcu-bar{position:absolute;left:0;top:6%;height:88%;width:0;background:linear-gradient(90deg,rgba(185,128,58,.15),rgba(185,128,58,.55));opacity:0}
.wcu-ln.wcu-it{font-style:italic}
.wcu-ln.wcu-it > span{display:inline-block;transform:translateY(110%);opacity:0}
.wcu-ul{position:absolute;left:2px;bottom:6px;height:2px;width:0;background:linear-gradient(90deg,var(--accent),var(--spark));opacity:0}
.wcu-shimmer{background-image:linear-gradient(100deg,var(--ink) 38%,#C79A55 50%,var(--ink) 62%);background-size:320% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wcu-sheenTxt 9s ease-in-out 1s infinite}
@keyframes wcu-sheenTxt{0%{background-position:150% 0}55%,100%{background-position:-50% 0}}

.wcu-list{position:relative;list-style:none;margin:0;padding:0}
.wcu-row{position:relative}
.wcu-hair{position:absolute;left:0;top:0;width:100%;height:1px;background:var(--line);transform:scaleX(0);transform-origin:left}
.wcu-list .wcu-end{position:relative;height:1px;background:var(--line);transform:scaleX(0);transform-origin:left}
.wcu-row-btn{display:grid;grid-template-columns:36px 1fr 24px;gap:14px;align-items:center;width:100%;min-height:40px;padding:9px 2px;border:0;background:none;text-align:left;cursor:pointer;font:inherit;color:inherit}
.wcu-row-btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.wcu-idx{font:500 11px/1 var(--mono);letter-spacing:.12em;color:var(--ink-2);opacity:0;transition:color .4s ease,transform .4s var(--e)}
.wcu-row.wcu-on .wcu-idx{color:var(--spark);transform:translateX(2px)}
.wcu-row-title{position:relative;display:inline-block;font-size:17px;line-height:1.4;color:var(--ink-2);opacity:0;transition:color .5s ease,transform .6s var(--e)}
.wcu-row.wcu-on .wcu-row-title{color:var(--ink);transform:translateX(5px)}
.wcu-tul{position:absolute;left:0;bottom:-3px;height:1px;width:100%;background:var(--spark);transform:scaleX(0);transform-origin:left;transition:transform .6s var(--e)}
.wcu-row.wcu-on .wcu-tul{transform:scaleX(1)}
.wcu-plus{position:relative;width:15px;height:15px;justify-self:end;opacity:0;transition:transform .6s var(--e)}
.wcu-plus b{position:absolute;background:var(--ink-2);transition:background .4s ease,transform .5s var(--e)}
.wcu-plus b:first-child{left:0;top:7px;width:15px;height:1px}
.wcu-plus b:last-child{left:7px;top:0;width:1px;height:15px}
.wcu-row.wcu-on .wcu-plus{transform:rotate(180deg)}
.wcu-row.wcu-on .wcu-plus b{background:var(--accent)}
.wcu-row.wcu-on .wcu-plus b:last-child{transform:scaleY(0)}
.wcu-prog{position:absolute;left:0;bottom:-1px;height:1px;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,var(--accent),var(--spark))}
.wcu-row-body{overflow:hidden;max-height:0;transition:max-height .75s var(--e)}
.wcu-row-in{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;padding:0 2px 12px 50px;opacity:0;transform:translateY(10px);transition:opacity .5s var(--e),transform .5s var(--e)}
.wcu-row.wcu-on .wcu-row-in{opacity:1;transform:none;transition-delay:.12s}
.wcu-row-in p{margin:0;max-width:40ch;font-size:15px;line-height:1.6;color:var(--ink-2)}
.wcu-metric{text-align:right;white-space:nowrap}
.wcu-metric .wcu-num{display:flex;align-items:baseline;justify-content:flex-end;font:400 30px/1 var(--serif);color:var(--ink)}
.wcu-metric .wcu-suf{color:var(--spark)}
.wcu-metric span.wcu-cap{display:block;margin-top:8px;font:600 11px/1.4 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2)}
.wcu-reel{display:inline-block;height:1em;overflow:hidden;vertical-align:baseline}
.wcu-reel .wcu-strip{display:block}
.wcu-reel .wcu-strip b{display:block;height:1em;line-height:1em;font-weight:400}

.wcu-scan{position:absolute;left:-10px;right:-10px;top:0;height:64px;z-index:2;pointer-events:none;opacity:0;
  background:linear-gradient(180deg,transparent,rgba(185,128,58,.12) 45%,rgba(47,79,67,.22) 50%,rgba(185,128,58,.12) 55%,transparent)}

.wcu-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:10px;opacity:0}
.wcu-hint{margin:0;font-size:13px;color:var(--ink-2)}
.wcu-hint b{font-weight:600;color:var(--ink)}
.wcu-only-m{display:none}
.wcu-tools{display:flex;align-items:center;gap:16px}
.wcu-count{display:flex;gap:1px;font:500 12px/1 var(--mono);letter-spacing:.12em;color:var(--ink-2);white-space:nowrap}
.wcu-replay{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:44px;min-width:44px;padding:0 6px;border:0;background:none;cursor:pointer;
  font:600 11px/1 var(--sans);letter-spacing:.13em;text-transform:uppercase;color:var(--ink-2);transition:color .3s ease}
.wcu-replay:hover{color:var(--ink)}
.wcu-replay svg{transition:transform .6s var(--e)}
.wcu-replay:hover svg{transform:rotate(-180deg)}

.wcu-spark{position:absolute;left:0;top:0;z-index:20;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%,#E3B575,var(--spark));box-shadow:0 0 14px rgba(185,128,58,.75);opacity:0;pointer-events:none}

@media (max-width:900px){
  .wcu-section{height:100vh;padding:10px 14px;overflow:hidden}
  .wcu-wrap{grid-template-columns:1fr;gap:4px}
  .wcu-frame{max-height:14vh}
  .wcu-visual{max-width:420px;margin:0 auto;width:100%}
  .wcu-ring{width:190px;height:190px;right:-60px;top:-60px}
  .wcu-display{font-size:clamp(19px,6vw,28px);margin-bottom:4px}
  .wcu-eyebrow{margin-bottom:4px;letter-spacing:.5em}
  .wcu-row-btn{min-height:28px;padding:4px 2px}
  .wcu-row-title{font-size:13px;line-height:1.25}
  .wcu-row-in{flex-direction:column;align-items:flex-start;gap:4px;padding:0 2px 4px 0}
  .wcu-row-in p{font-size:10.5px;line-height:1.3}
  .wcu-metric{text-align:left}
  .wcu-metric .wcu-num{justify-content:flex-start;font-size:18px}
  .wcu-only-d{display:none}
  .wcu-only-m{display:inline}
  .wcu-foot{margin-top:2px}
  .wcu-hint{font-size:10px}
  .wcu-orb{width:42px;height:42px;margin:-21px 0 0 -21px}

  /* Same "settle immediately, no animation" treatment as the
     prefers-reduced-motion block below - the JS side already treats
     this breakpoint as reduced motion too, this is its CSS half. */
  .wcu *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .wcu-frame{clip-path:none}
  .wcu-sheen,.wcu-drop,.wcu-ripple,.wcu-orb,.wcu-scan,.wcu-spark{display:none}
  .wcu-eyebrow,.wcu-foot,.wcu-idx,.wcu-row-title,.wcu-plus{opacity:1}
  .wcu-ln .wcu-ch{opacity:1}
  .wcu-ln.wcu-mask > span{clip-path:none}
  .wcu-ln.wcu-it > span{transform:none;opacity:1}
}
@media (prefers-reduced-motion:reduce){
  .wcu *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .wcu-frame{clip-path:none}
  .wcu-sheen,.wcu-drop,.wcu-ripple,.wcu-orb,.wcu-scan,.wcu-spark{display:none}
  .wcu-eyebrow,.wcu-foot,.wcu-idx,.wcu-row-title,.wcu-plus{opacity:1}
  .wcu-ln .wcu-ch{opacity:1}
  .wcu-ln.wcu-mask > span{clip-path:none}
  .wcu-ln.wcu-it > span{transform:none;opacity:1}
}
`;

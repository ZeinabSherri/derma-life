"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Ported from the reference design's own frame() method (DermaLife
// Hero.dc.html) - same spring/wobble/wave formulas, evaluated on a 3D
// mesh instead of an SVG path, since this site's bottles are a real 3D
// model rather than the reference's flat bottle photos. Structurally this
// mirrors the reference exactly: a wavy top line across the bottle's
// width, rotated to the current wobble angle, extended far down in the
// same rotated direction so it reads as "liquid filling everything below
// the surface" rather than a literal disc (a flat disc lying horizontally
// is nearly edge-on to a camera looking at the bottle from the side, and
// is effectively invisible - a front-facing fill shape is what the
// reference actually draws). The bottle (in Hero/index.tsx) writes its own
// live x/tilt into `stateRef` every frame; this component reads that ref
// inside its own useFrame rather than taking x/tilt as React props, so
// 60fps updates never trigger a re-render.
export type LiquidState = { x: number; tilt: number };

type LiquidSurfaceProps = {
  color: string;
  stateRef: React.MutableRefObject<LiquidState>;
  radius?: number;
  centerY?: number;
  slosh?: number;
  reducedMotion?: boolean;
};

const SEGMENTS_X = 32;
const FILL_DEPTH = 1.5; // how far below the wave line the fill extends, in radius-relative units

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

export function LiquidSurface({
  color,
  stateRef,
  radius = 1.7,
  centerY = 0.6,
  slosh = 1,
  reducedMotion = false,
}: LiquidSurfaceProps) {
  // Mirrors the reference's per-bottle `sim` object (w/v = spring wobble
  // angle/velocity, wp = wave phase, px/pt = previous x/tilt for velocity).
  const sim = useRef({ w: 0, v: 0, wp: 0, px: null as number | null, pt: null as number | null });

  const vertexCount = (SEGMENTS_X + 1) * 2;

  // Two rows of vertices (top = wave line, bottom = far below it) - built
  // once as a triangle strip; only positions are mutated per frame.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(vertexCount * 3);
    const indices: number[] = [];
    for (let i = 0; i < SEGMENTS_X; i++) {
      const a = i * 2; // top[i]
      const b = i * 2 + 1; // bottom[i]
      const c = (i + 1) * 2; // top[i+1]
      const d = (i + 1) * 2 + 1; // bottom[i+1]
      indices.push(a, b, c, b, d, c);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    return geo;
  }, [vertexCount]);

  // Unlit deliberately - MeshPhysicalMaterial/MeshStandardMaterial (lit,
  // PBR) rendered this mesh completely invisible here regardless of
  // opacity/color, seemingly a normals/lighting interaction specific to
  // this flat, live-mutated geometry sitting this close to other
  // transparent surfaces. Unlit avoids that dependency entirely and still
  // reads fine as a tinted liquid fill.
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        depthWrite: false,
        // The bottle's inner tube/straw ("bootle_1") runs right through
        // this mesh's position and is opaque, so normal depth testing
        // occludes the liquid behind it entirely. Disabling depth test
        // here means the liquid always draws on top of it, a minor
        // inaccuracy that reads far better than being invisible.
        depthTest: false,
      }),
    [color],
  );

  useFrame((_, rawDelta) => {
    const dt = clamp(rawDelta, 0.001, 0.05);
    const s = sim.current;
    const { x, tilt } = stateRef.current;

    // Velocity of the bottle's own position/tilt, diffed frame to frame -
    // exactly the reference's `xv`/`tv`.
    const xv = s.px == null ? 0 : (x - s.px) / dt;
    const tv = s.pt == null ? 0 : (tilt - s.pt) / dt;
    s.px = x;
    s.pt = tilt;

    const sloshAmt = reducedMotion ? 0.3 : slosh;
    const wobbleTarget = clamp((-xv * 0.035 + tv * 0.35) * sloshAmt, -30, 30);
    const acc = (wobbleTarget - s.w) * 110 - s.v * 6;
    s.v += acc * dt;
    s.w += s.v * dt;

    const amp = (1.5 + Math.min(9, Math.abs(s.v) * 0.06 + Math.abs(wobbleTarget - s.w) * 0.25)) * (radius / 85);
    s.wp += dt * (2.2 + Math.min(6, Math.abs(s.v) * 0.04));

    // Surface angle *relative to the bottle* - subtracting the bottle's own
    // tilt is what keeps the liquid level in world space while its parent
    // group (which already carries that same tilt) rotates around it.
    const theta = ((s.w - tilt) * Math.PI) / 180;
    const ux = Math.cos(theta);
    const uy = Math.sin(theta);
    const nx = Math.sin(theta);
    const ny = -Math.cos(theta);

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const freqScale = 80 / radius;
    for (let i = 0; i <= SEGMENTS_X; i++) {
      const t = -radius + (2 * radius * i) / SEGMENTS_X;
      const tScaled = t * freqScale;
      const w =
        amp * Math.sin(tScaled * 0.045 + s.wp) + amp * 0.4 * Math.sin(tScaled * 0.11 - s.wp * 1.6);
      const topX = t * ux + w * nx;
      const topY = t * uy + w * ny;
      pos.setXYZ(i * 2, topX, topY, 0);
      // Bottom edge follows the same wave point, pushed further along the
      // *negative* normal so the fill always extends "down" relative to
      // the current tilt, not just straight down in world space.
      pos.setXYZ(i * 2 + 1, topX - nx * FILL_DEPTH * radius, topY - ny * FILL_DEPTH * radius, 0);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, centerY, 0]}
      renderOrder={1}
      // Positions are mutated in place every frame - the geometry's
      // bounding sphere is only ever computed once (at construction, all
      // zero), so frustum culling against that stale/degenerate bound
      // would otherwise clip most of the mesh out unpredictably.
      frustumCulled={false}
    />
  );
}

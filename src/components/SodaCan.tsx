"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { LiquidSurface, LiquidState } from "@/components/LiquidSurface";

useGLTF.preload("/Bottle-baked.glb");

// Serum "flavor" tints - each key stays wired to the Prismic `flavor` Select
// field options, only the displayed color/name changed. Restricted to the
// neutral cream/white/tan family from the reference bottle photos, instead
// of the previous saturated brand-color palette.
export const flavorColors = {
  lemonLime: "#F0EBE2", // Green Tea Glow - pale warm white
  grape: "#DCCFBC", // Niacinamide Balance - soft beige
  blackCherry: "#F5F1E6", // Collagen Boost - the two colors in active use
  strawberryLemonade: "#F5F1E6", // Vitamin C Brighten - site-wide
  watermelon: "#C98F5E", // Hyaluronic Hydrate - warm tan
  // Hero-only tints (not tied to any Prismic flavor option) - matching the
  // reference's two named bottles without touching the shared "watermelon"/
  // "lemonLime" hexes above, which are also used on Carousel/SkyDive.
  ageless: "#FAFAF8", // near-white, brighter than the first pass
  radiance: "#FBDAB9", // light peach, softer/lighter than the first pass
};

// The liquid itself is a distinct, more saturated color from the bottle's
// own pale exterior tint above (oklch(0.80 0.09 225) light blue / oklch
// (0.80 0.10 65) warm amber, per spec) - reusing the same pale flavor hex
// for both would leave it blending invisibly into the label/glass it sits
// behind.
export const liquidColors: Partial<Record<keyof typeof flavorColors, string>> = {
  ageless: "#AECBDA",
  radiance: "#D9B67E",
};

// Model has 5 separate parts (label, glass body, inner tube, cap, rubber
// bulb), each authored Z-up in Blender - this 90deg X rotation + 0.01 scale
// (present on every part except the rubber bulb) converts them to glTF's
// Y-up convention, matching the source file's own per-node transforms.
const PART_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0];
const PART_SCALE = 0.01;

// Corrective scale so this model's on-screen size matches the previous
// single-mesh bottle (whose raw geometry was ~0.979 tall) - keeps every
// scene's camera distance/positioning, tuned for the old model, unchanged.
const MODEL_SCALE = 0.07438;
// The 5 parts' combined bounding box is centered at y=2.616 in the model's
// raw units; this is that offset pre-multiplied by MODEL_SCALE, so the
// assembled bottle's pivot is its visual center, matching how the old
// bottle rotated/floated around its own center.
const CENTER_OFFSET_Y = -0.19459;

export type SodaCanProps = {
  flavor?: keyof typeof flavorColors;
  scale?: number;
  // Opt-in per instance - most SodaCan usages (Carousel, FloatingCan,
  // SkyDive) keep the bottle fully opaque and don't pay for the extra
  // per-frame mesh work. `stateRef` is written every frame by the caller's
  // own animation loop (Hero) with the bottle's live x/tilt; see
  // LiquidSurface for why that's a ref and not a prop.
  liquid?: {
    stateRef: React.MutableRefObject<LiquidState>;
    reducedMotion?: boolean;
  };
};

export function SodaCan({
  flavor = "blackCherry",
  scale = 2.3,
  liquid,
  ...props
}: SodaCanProps) {
  const { nodes, materials } = useGLTF("/Bottle-baked.glb");
  const gl = useThree((state) => state.gl);

  // The label's baked texture reads as blurry/illegible at a distance or on
  // small bottles (the default anisotropy is 1, so mipmapping washes out
  // the printed text at any oblique viewing angle) - raising it to the
  // renderer's max sharpens every bottle's label site-wide, since these
  // materials are shared across every mounted SodaCan instance.
  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    Object.values(materials).forEach((material) => {
      const map = (material as THREE.MeshStandardMaterial).map;
      if (map) {
        map.anisotropy = maxAnisotropy;
        map.needsUpdate = true;
      }
    });

    // The label specifically still reads soft even with anisotropy maxed
    // out - mipmapping (the default minFilter) blends in progressively
    // blurrier downsampled versions of the texture, which smears fine
    // printed text even head-on. The label is always shown close/large
    // enough in this design that the moire/aliasing mipmaps exist to
    // prevent isn't a real tradeoff, so turning mipmaps off entirely for
    // just this one texture trades that (irrelevant here) benefit for
    // consistently sharp text.
    const labelMap = (materials["label ageles "] as THREE.MeshStandardMaterial | undefined)?.map;
    if (labelMap) {
      labelMap.generateMipmaps = false;
      labelMap.minFilter = THREE.LinearFilter;
      labelMap.magFilter = THREE.LinearFilter;
      labelMap.needsUpdate = true;
    }
  }, [materials, gl]);

  const bottleMaterial = materials.bottle as THREE.MeshStandardMaterial;
  const labelMaterial = materials["label ageles "] as THREE.MeshStandardMaterial;

  // Clone so each flavor gets its own tinted instance instead of mutating
  // the shared cached material. When a liquid surface is present, the
  // glass also needs to be translucent - otherwise the liquid mesh sits
  // fully hidden behind an opaque wall - but only for that instance, so
  // every other SodaCan usage (Carousel, FloatingCan, SkyDive) keeps its
  // current solid/opaque look.
  const tintedBottleMaterial = useMemo(() => {
    const mat = bottleMaterial.clone();
    mat.color = new THREE.Color(flavorColors[flavor]);
    if (liquid) {
      mat.transparent = true;
      mat.opacity = 0.4;
      mat.depthWrite = false;
    }
    return mat;
  }, [bottleMaterial, flavor, liquid]);

  // The printed label wraps almost the entire visible bottle - tinting only
  // the glass (above) left two different flavors looking nearly identical,
  // since the label's own material never changed. Its texture map is mostly
  // white/cream, so multiplying it by the flavor color (standard PBR
  // base-color * map shading) washes the whole label toward that tint while
  // the darker printed text stays legible, instead of just tinting a thin
  // sliver of exposed glass.
  const tintedLabelMaterial = useMemo(() => {
    const mat = labelMaterial.clone();
    mat.color = new THREE.Color(flavorColors[flavor]);
    if (liquid) {
      // The label wraps essentially the entire glass circumference, so
      // making only the glass translucent (above) left the liquid mesh
      // fully hidden behind this opaque layer regardless of camera angle.
      // A light translucency here keeps the printed text readable while
      // letting the liquid's color/motion show through.
      mat.transparent = true;
      mat.opacity = 0.35;
      mat.depthWrite = false;
    }
    return mat;
  }, [labelMaterial, flavor, liquid]);

  return (
    <group {...props} dispose={null} scale={scale}>
      <group scale={MODEL_SCALE} position={[0, CENTER_OFFSET_Y, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.lable as THREE.Mesh).geometry}
          material={tintedLabelMaterial}
          rotation={PART_ROTATION}
          scale={PART_SCALE}
          renderOrder={liquid ? 3 : undefined}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.bootle_1 as THREE.Mesh).geometry}
          material={materials.D_OrangePlasticDull}
          rotation={PART_ROTATION}
          scale={PART_SCALE}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.bootle as THREE.Mesh).geometry}
          material={tintedBottleMaterial}
          rotation={PART_ROTATION}
          scale={PART_SCALE}
          renderOrder={liquid ? 2 : undefined}
        />
        {liquid && (
          // Sibling of "bootle" at this same group level, in the same
          // post-rotation/scale coordinate space (see the bounding-box
          // numbers this was measured against) - radius/centerY are tuned
          // to the glass interior, not derived from a formula.
          <LiquidSurface
            color={liquidColors[flavor] ?? flavorColors[flavor]}
            stateRef={liquid.stateRef}
            reducedMotion={liquid.reducedMotion}
            radius={1}
            centerY={0}
          />
        )}
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.bottle_cap_rubber as THREE.Mesh).geometry}
          material={materials["bottle cap rubber"]}
          position={[0, 2.677, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.bottle_cap as THREE.Mesh).geometry}
          material={materials["bottle cap "]}
          position={[0, 4.927, 0]}
          rotation={PART_ROTATION}
          scale={PART_SCALE}
        />
      </group>
    </group>
  );
}

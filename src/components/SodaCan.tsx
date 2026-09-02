"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/Bottle-baked.glb");

// Serum "flavor" tints - each key stays wired to the Prismic `flavor` Select
// field options, only the displayed color/name changed.
export const flavorColors = {
  lemonLime: "#6E8B5A", // Green Tea Glow
  grape: "#7C6A8E", // Niacinamide Balance
  blackCherry: "#A9746E", // Collagen Boost
  strawberryLemonade: "#C4915B", // Vitamin C Brighten
  watermelon: "#7FA8A0", // Hyaluronic Hydrate
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
};

export function SodaCan({
  flavor = "blackCherry",
  scale = 2,
  ...props
}: SodaCanProps) {
  const { nodes, materials } = useGLTF("/Bottle-baked.glb");

  const bottleMaterial = materials.bottle as THREE.MeshStandardMaterial;

  // Clone so each flavor gets its own tinted instance instead of mutating
  // the shared cached material.
  const tintedBottleMaterial = useMemo(() => {
    const mat = bottleMaterial.clone();
    mat.color = new THREE.Color(flavorColors[flavor]);
    return mat;
  }, [bottleMaterial, flavor]);

  return (
    <group {...props} dispose={null} scale={scale}>
      <group scale={MODEL_SCALE} position={[0, CENTER_OFFSET_Y, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.lable as THREE.Mesh).geometry}
          material={materials["label ageles "]}
          rotation={PART_ROTATION}
          scale={PART_SCALE}
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
        />
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

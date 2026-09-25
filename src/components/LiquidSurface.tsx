"use client";

import { RefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  CircleGeometry,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  Vector3,
} from "three";

type LiquidSurfaceProps = {
  color: string;
  /** The bottle group whose rotation/position drives the wobble physics -
   *  not this mesh's own scenegraph `parent` on purpose, since it renders
   *  a couple of levels below that group (inside FloatingCan's <Float>). */
  motionRef: RefObject<Group>;
  radius?: number;
  y?: number;
  opacity?: number;
};

const SEGMENTS = 20;

/**
 * A liquid "surface" inside a bottle: a subdivided disc whose vertices ripple
 * every frame, and which lags/oscillates opposite the bottle's own motion
 * (a damped spring chasing a target driven by the bottle's angular/linear
 * velocity) so it reads as sloshing rather than a static tinted disc.
 *
 * Meant to be rendered as a sibling of <SodaCan> inside <FloatingCan>'s
 * `children` slot, so it inherits the same GSAP-driven group transform
 * (position/rotation/scale) the bottle itself is animated with in
 * Scene.tsx - `motionRef` is only used to read that group's rotation/
 * position each frame for the velocity-driven wobble below.
 */
export default function LiquidSurface({
  color,
  motionRef,
  radius = 0.17,
  y = -0.18,
  opacity = 0.55,
}: LiquidSurfaceProps) {
  const meshRef = useRef<Mesh>(null);

  // Radial subdivisions give enough vertices across the disc for the
  // traveling ripple below to read as a wave instead of a flat tilt.
  const geometry = useMemo(
    () => new CircleGeometry(radius, SEGMENTS, 0, Math.PI * 2),
    [radius],
  );

  const wobble = useRef({ angle: 0, velocity: 0 });
  const lastRotZ = useRef<number | null>(null);
  const lastWorldPos = useRef<Vector3 | null>(null);
  const clock = useRef(0);
  const tmpVec = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const bottle = motionRef.current;
    if (!mesh || !bottle) return;

    const dt = Math.min(0.05, Math.max(0.001, delta));
    clock.current += dt;

    // The bottle's own tilt is can1Ref/can2Ref.rotation.z, tweened
    // directly by Scene.tsx's scrollTl - reading it here each frame gives
    // angular velocity without threading a live prop through every frame.
    const rotZ = bottle.rotation.z;
    const angularVelocity =
      lastRotZ.current === null ? 0 : (rotZ - lastRotZ.current) / dt;
    lastRotZ.current = rotZ;

    const worldPos = bottle.getWorldPosition(tmpVec).clone();
    const linearVelocity = lastWorldPos.current
      ? worldPos.distanceTo(lastWorldPos.current) / dt
      : 0;
    lastWorldPos.current = worldPos;

    // Damped spring: chase a target tilt proportional to how fast the
    // bottle is currently rotating/moving, then let it overshoot and
    // settle - same "target, spring toward it, integrate" shape a real
    // liquid slosh follows, just tuned to this model's small scale.
    const target = MathUtils.clamp(
      -angularVelocity * 0.12 - linearVelocity * 0.4,
      -0.3,
      0.3,
    );
    const w = wobble.current;
    const acc = (target - w.angle) * 90 - w.velocity * 9;
    w.velocity += acc * dt;
    w.angle += w.velocity * dt;
    mesh.rotation.z = w.angle;

    // Traveling ripple across the disc, amplitude rising with how hard
    // it's currently sloshing so calmer moments read as a gentler
    // shimmer. CircleGeometry's vertices are on the local XY plane before
    // this mesh's own -90deg X rotation lays it flat - displacing local Z
    // here becomes the liquid's up/down wave height once rotated.
    const amp = 0.004 + Math.min(0.014, Math.abs(w.velocity) * 0.01);
    const pos = geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const wave =
        amp * Math.sin(x * 16 + clock.current * 2.4) +
        amp * 0.4 * Math.sin(x * 28 - clock.current * 3.6);
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, y, 0]}
      rotation-x={-Math.PI / 2}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.1}
        metalness={0.05}
        side={DoubleSide}
      />
    </mesh>
  );
}

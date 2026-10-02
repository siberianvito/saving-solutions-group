"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/** Shared, mutable state driven by GSAP (boot reveal, scroll exit) + pointer. */
export const shieldState = { reveal: 0, exit: 0, mx: 0, my: 0 };

const VERT = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uExit;
uniform float uPixel;
attribute float aSeed;
attribute float aKind;
varying float vAlpha;
varying float vKind;
void main(){
  vec3 p = position;
  float h = clamp(p.y / 3.0, 0.0, 1.0);            // 0 at base → 1 at crown
  float shown = smoothstep(h - 0.08, h, uReveal * 1.1);
  // motes drift upward forever
  if (aKind > 1.5) {
    p.y = mod(p.y + uTime * (0.12 + aSeed * 0.2), 3.6);
    p.x += sin(uTime * 0.6 + aSeed * 30.0) * 0.05;
    shown = uReveal;
  }
  // energy ripple travels up the shell
  float ripple = (aKind > 1.5) ? 0.0 : smoothstep(0.045, 0.0, abs(fract(uTime * 0.11) * 1.3 - h));
  p *= 1.0 + uExit * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 40.0);
  float size = aKind > 1.5 ? 2.2 : (aKind > 0.5 ? 1.5 : 2.4);
  gl_PointSize = size * uPixel * (0.6 + tw * 0.6) * (7.0 / -mv.z);
  float fade = aKind > 1.5 ? (1.0 - smoothstep(2.6, 3.6, p.y)) : 1.0;
  vAlpha = shown * fade * (0.35 + tw * 0.65) * (1.0 - uExit) + ripple * 0.25 * shown;
  vKind = aKind;
}
`;

const FRAG = /* glsl */ `
varying float vAlpha;
varying float vKind;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.6);
  vec3 gold = mix(vec3(0.79, 0.62, 0.27), vec3(1.0, 0.9, 0.62), a);
  if (vKind > 0.5 && vKind < 1.5) gold = vec3(1.0, 0.93, 0.72);
  gl_FragColor = vec4(gold * 1.25, a * vAlpha);
}
`;

function buildDome(count: number) {
    const R = 3;
    const pos: number[] = [];
    const seed: number[] = [];
    const kind: number[] = [];
    // 0 · shell — fibonacci hemisphere
    const n = count;
    for (let i = 0; i < n * 2; i++) {
      const y = 1 - (i / (n * 2 - 1)) * 2;
      if (y < 0) continue;
      const r = Math.sqrt(1 - y * y);
      const t = i * 2.399963229728653;
      pos.push(Math.cos(t) * r * R, y * R, Math.sin(t) * r * R);
      seed.push(Math.random());
      kind.push(0);
    }
    // 1 · meridians + latitude rings (bright filaments)
    for (let m = 0; m < 12; m++) {
      const a = (m / 12) * Math.PI * 2;
      for (let k = 0; k < 90; k++) {
        const phi = (k / 89) * (Math.PI / 2);
        pos.push(Math.cos(a) * Math.cos(phi) * R, Math.sin(phi) * R, Math.sin(a) * Math.cos(phi) * R);
        seed.push(Math.random());
        kind.push(1);
      }
    }
    for (let l = 1; l < 5; l++) {
      const phi = (l / 5) * (Math.PI / 2);
      for (let k = 0; k < 160; k++) {
        const a = (k / 160) * Math.PI * 2;
        pos.push(Math.cos(a) * Math.cos(phi) * R, Math.sin(phi) * R, Math.sin(a) * Math.cos(phi) * R);
        seed.push(Math.random());
        kind.push(1);
      }
    }
    // base ring
    for (let k = 0; k < 360; k++) {
      const a = (k / 360) * Math.PI * 2;
      pos.push(Math.cos(a) * R, 0.01, Math.sin(a) * R);
      seed.push(Math.random());
      kind.push(1);
    }
    // 2 · rising motes inside
    for (let k = 0; k < Math.floor(count / 6); k++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * R * 0.9;
      pos.push(Math.cos(a) * r, Math.random() * 3.6, Math.sin(a) * r);
      seed.push(Math.random());
      kind.push(2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
    g.setAttribute("aKind", new THREE.Float32BufferAttribute(kind, 1));
    return g;
}

function Dome({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const geo = useMemo(() => buildDome(count), [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 }, uExit: { value: 0 }, uPixel: { value: 1 } }),
    []
  );

  useFrame((state, dt) => {
    const u = mat.current?.uniforms;
    if (!u || !group.current) return;
    u.uTime.value += dt;
    u.uReveal.value = shieldState.reveal;
    u.uExit.value = shieldState.exit;
    u.uPixel.value = state.gl.getPixelRatio();
    group.current.rotation.y += dt * 0.04;
    // pointer parallax on the camera
    const cam = state.camera;
    cam.position.x += (shieldState.mx * 0.9 - cam.position.x) * 0.04;
    cam.position.y += (2.2 - shieldState.my * 0.5 - cam.position.y) * 0.04;
    cam.lookAt(0, 1.2, 0);
  });

  return (
    <group ref={group}>
      <points ref={ref} geometry={geo}>
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroShield({ active }: { active: boolean }) {
  const small = useRef(false);
  useEffect(() => {
    small.current = window.matchMedia("(max-width: 768px)").matches;
    const move = (e: PointerEvent) => {
      shieldState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      shieldState.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.2, 8.2], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Dome count={typeof window !== "undefined" && window.innerWidth < 768 ? 1400 : 2600} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.12} luminanceSmoothing={0.3} />
      </EffectComposer>
    </Canvas>
  );
}

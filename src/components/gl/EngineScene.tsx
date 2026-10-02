"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/** Scroll progress (0..1) written by the pinned section's ScrollTrigger. */
export const engineState = { p: 0, smooth: 0, mx: 0, my: 0 };

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ── City ────────────────────────────────────────────────────── */
const CITY_VERT = /* glsl */ `
uniform float uRise;
attribute float aDist;
attribute float aSeed;
attribute float aTarget;
attribute vec3 aSize;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vSize;
varying float vDist;
varying float vSeed;
varying float vTarget;
varying float vY;
void main(){
  vec3 p = position;
  float grow = smoothstep(aDist * 0.045, aDist * 0.045 + 0.32, uRise);
  p.y *= max(grow, 0.001);
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vUv = uv;
  vN = normal;
  vSize = aSize * vec3(1.0, grow, 1.0);
  vDist = aDist;
  vSeed = aSeed;
  vTarget = aTarget;
  vY = wp.y;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const CITY_FRAG = /* glsl */ `
uniform float uScan;
uniform float uTargetLit;
uniform float uGlow;
uniform float uTime;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vSize;
varying float vDist;
varying float vSeed;
varying float vTarget;
varying float vY;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  bool top = abs(vN.y) > 0.5;
  vec2 dims = top ? vec2(vSize.x, vSize.z) : vec2(abs(vN.x) > 0.5 ? vSize.z : vSize.x, vSize.y);
  vec2 e = min(vUv, 1.0 - vUv) * dims;
  float edge = 1.0 - smoothstep(0.0, 0.028, min(e.x, e.y));

  vec3 navy = vec3(0.028, 0.062, 0.12);
  vec3 hunter = vec3(0.03, 0.11, 0.08);
  vec3 gold = vec3(0.86, 0.68, 0.32);
  vec3 base = mix(navy, hunter, vSeed * 0.35);
  base *= 0.55 + 0.45 * clamp(vY / 3.0, 0.0, 1.0);

  // windows
  float win = 0.0;
  if (!top) {
    vec2 g = vec2(vUv.x * dims.x * 12.0, vUv.y * dims.y * 10.0);
    vec2 id = floor(g);
    vec2 f = fract(g);
    float lit = step(0.78 - uGlow * 0.33, hash(id + vSeed * 13.0));
    win = lit * step(0.3, f.x) * step(f.x, 0.7) * step(0.34, f.y) * step(f.y, 0.66);
  }

  // scanner band
  float band = smoothstep(0.9, 0.0, abs(vDist - uScan));
  float scanned = step(vDist, uScan) * (1.0 - step(13.5, uScan));

  vec3 col = base;
  col += mix(gold, vec3(1.0, 0.86, 0.6), 0.4) * win * (0.32 + uGlow * 0.6);
  col += gold * edge * (0.22 + band * 1.6 + scanned * 0.12 + uGlow * 0.35);
  col += gold * band * 0.12;

  // the client's building
  if (vTarget > 0.5) {
    float pulse = 0.75 + 0.25 * sin(uTime * 2.2);
    col = mix(col, gold * (0.35 + 0.25 * pulse), uTargetLit * 0.55);
    col += gold * edge * uTargetLit * 1.6;
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

function buildCity(size: number) {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    const dist: number[] = [];
    const seed: number[] = [];
    const target: number[] = [];
    const sz: number[] = [];
    const mats: THREE.Matrix4[] = [];
    const half = Math.floor(size / 2);
    let rnd = 7;
    const rand = () => ((rnd = (rnd * 16807) % 2147483647) / 2147483647);
    for (let x = -half; x <= half; x++) {
      for (let z = -half; z <= half; z++) {
        if ((x % 4 === 2 || x % 4 === -2) || (z % 4 === 2 || z % 4 === -2)) continue; // avenues
        const d = Math.hypot(x, z);
        if (d > half + 0.5) continue;
        const isT = x === 0 && z === 0;
        const w = isT ? 0.82 : 0.48 + rand() * 0.34;
        const dd = 0.48 + rand() * 0.34;
        const h = isT ? 2.7 : Math.max(0.15, (0.25 + rand() * 1.6) * (1.25 - d / (half * 1.4)) + (rand() > 0.94 ? 1.4 : 0));
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(x * 0.95 + (rand() - 0.5) * 0.08, 0, z * 0.95 + (rand() - 0.5) * 0.08),
          new THREE.Quaternion(),
          new THREE.Vector3(w, h, isT ? 0.82 : dd)
        );
        mats.push(m);
        dist.push(d);
        seed.push(rand());
        target.push(isT ? 1 : 0);
        sz.push(w, h, isT ? 0.82 : dd);
      }
    }
    const ig = g.clone();
    ig.setAttribute("aDist", new THREE.InstancedBufferAttribute(new Float32Array(dist), 1));
    ig.setAttribute("aSeed", new THREE.InstancedBufferAttribute(new Float32Array(seed), 1));
    ig.setAttribute("aTarget", new THREE.InstancedBufferAttribute(new Float32Array(target), 1));
    ig.setAttribute("aSize", new THREE.InstancedBufferAttribute(new Float32Array(sz), 3));
    return { geo: ig, count: mats.length, matrices: mats };
}

function City({ size }: { size: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { geo, count, matrices } = useMemo(() => buildCity(size), [size]);

  const uniforms = useMemo(
    () => ({ uRise: { value: 0 }, uScan: { value: -2 }, uTargetLit: { value: 0 }, uGlow: { value: 0 }, uTime: { value: 0 } }),
    []
  );

  useFrame((_, dt) => {
    const m = mesh.current;
    const u = mat.current?.uniforms;
    if (!m || !u) return;
    if (m.userData.init !== true) {
      matrices.forEach((mx, i) => m.setMatrixAt(i, mx));
      m.instanceMatrix.needsUpdate = true;
      m.userData.init = true;
    }
    const p = engineState.smooth;
    u.uTime.value += dt;
    u.uRise.value = 0.15 + ss(0.0, 0.14, p) * 0.85;
    u.uScan.value = -2 + ss(0.17, 0.36, p) * 16;
    u.uTargetLit.value = ss(0.2, 0.28, p);
    u.uGlow.value = ss(0.82, 0.98, p);
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={CITY_VERT} fragmentShader={CITY_FRAG} uniforms={uniforms} />
    </instancedMesh>
  );
}

/* ── Ground grid + scan ring ─────────────────────────────────── */
const GROUND_FRAG = /* glsl */ `
uniform float uScan;
uniform float uGlow;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * 40.0;
  vec2 g = abs(fract(p / 0.95 + 0.5) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.03, min(g.x, g.y));
  float d = length(p);
  float fade = 1.0 - smoothstep(4.0, 16.0, d);
  float ring = smoothstep(0.5, 0.0, abs(d - uScan)) * (1.0 - step(13.5, uScan));
  vec3 gold = vec3(0.86, 0.68, 0.32);
  vec3 col = vec3(0.01, 0.025, 0.05) + gold * line * 0.09 * fade + gold * ring * 0.9 + gold * uGlow * 0.06 * (1.0 - smoothstep(0.0, 6.0, d));
  gl_FragColor = vec4(col, fade * 0.95 + ring);
}
`;

function Ground() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uScan: { value: -2 }, uGlow: { value: 0 } }), []);
  useFrame(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const p = engineState.smooth;
    u.uScan.value = -2 + ss(0.17, 0.36, p) * 16;
    u.uGlow.value = ss(0.82, 0.98, p);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={GROUND_FRAG}
      />
    </mesh>
  );
}

/* ── Market-access arcs + carrier nodes ───────────────────────── */
const ARC_VERT = /* glsl */ `
attribute float aT;
varying float vT;
void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const ARC_FRAG = /* glsl */ `
uniform float uDraw;
uniform float uTime;
uniform float uFade;
uniform float uPhase;
varying float vT;
void main(){
  if (vT > uDraw) discard;
  float packet = smoothstep(0.08, 0.0, abs(fract(vT * 1.0 - uTime * 0.45 + uPhase) - 0.5));
  vec3 gold = vec3(0.92, 0.76, 0.42);
  float a = (0.28 + packet * 1.4) * uFade;
  gl_FragColor = vec4(gold * (1.0 + packet), a);
}
`;

const NODES = 8;

function Markets() {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);

  const arcs = useMemo(() => {
    const list: { line: THREE.Line; mat: THREE.ShaderMaterial; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < NODES; i++) {
      const a = (i / NODES) * Math.PI * 2 + 0.3;
      const end = new THREE.Vector3(Math.cos(a) * 8.5, 3.2 + (i % 3) * 0.7, Math.sin(a) * 8.5);
      const start = new THREE.Vector3(0, 2.75, 0);
      const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 4.2, 0));
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(120);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      geo.setAttribute("aT", new THREE.Float32BufferAttribute(pts.map((_, k) => k / 120), 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: ARC_VERT,
        fragmentShader: ARC_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uDraw: { value: 0 }, uTime: { value: 0 }, uFade: { value: 1 }, uPhase: { value: i * 0.37 } },
      });
      list.push({ line: new THREE.Line(geo, mat), mat, end });
    }
    return list;
  }, []);

  useFrame((_, dt) => {
    const p = engineState.smooth;
    const draw = ss(0.48, 0.64, p);
    const fade = 1 - ss(0.86, 0.96, p) * 0.75;
    arcs.forEach(({ mat }, i) => {
      mat.uniforms.uTime.value += dt;
      mat.uniforms.uDraw.value = Math.min(1, draw * 1.25 - i * 0.03);
      mat.uniforms.uFade.value = fade;
    });
    if (nodes.current) {
      const s = ss(0.44, 0.56, p);
      nodes.current.children.forEach((c, i) => {
        c.scale.setScalar(Math.max(0.001, s));
        c.rotation.y += dt * (0.6 + i * 0.05);
        c.rotation.x += dt * 0.3;
      });
    }
  });

  return (
    <group ref={group}>
      {arcs.map(({ line }, i) => (
        <primitive key={i} object={line} />
      ))}
      <group ref={nodes}>
        {arcs.map(({ end }, i) => (
          <mesh key={i} position={end}>
            <octahedronGeometry args={[0.32, 0]} />
            <meshBasicMaterial color="#ecd393" wireframe />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── The bound shield ─────────────────────────────────────────── */
const DOME_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){
  vP = position;
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const DOME_FRAG = /* glsl */ `
uniform float uReveal; uniform float uTime;
varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){
  float h = vP.y / 3.2;
  if (h > uReveal * 1.05) discard;
  float fres = pow(1.0 - abs(dot(vN, vV)), 2.4);
  // hex-ish lattice from spherical coords
  float lon = atan(vP.z, vP.x) * 9.0;
  float lat = asin(clamp(vP.y / 3.2, -1.0, 1.0)) * 18.0;
  vec2 g = abs(fract(vec2(lon + mod(floor(lat), 2.0) * 0.5, lat)) - 0.5);
  float lattice = 1.0 - smoothstep(0.0, 0.06, min(g.x, g.y));
  float front = smoothstep(0.06, 0.0, abs(h - uReveal));
  float sweep = smoothstep(0.04, 0.0, abs(fract(uTime * 0.18) - h));
  vec3 gold = vec3(0.95, 0.78, 0.42);
  float a = fres * 0.55 + lattice * 0.16 + front * 0.9 + sweep * 0.12 * uReveal;
  gl_FragColor = vec4(gold * (0.8 + front), a * smoothstep(0.0, 0.1, uReveal));
}`;

function Shield() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uReveal: { value: 0 }, uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += dt;
    u.uReveal.value = ss(0.8, 0.95, engineState.smooth);
  });
  return (
    <mesh>
      <sphereGeometry args={[3.2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={DOME_VERT}
        fragmentShader={DOME_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ── Cinematic camera rail ────────────────────────────────────── */
const SHOTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [13, 11, 13], look: [0, 0, 0] },
  { pos: [9, 6.5, 10], look: [0, 0.8, 0] },
  { pos: [4.2, 4.0, 5.2], look: [0, 1.9, 0] },
  { pos: [0.5, 15, 12], look: [0, 1.5, 0] },
  { pos: [-8.5, 5, 8.5], look: [0, 1.6, 0] },
  { pos: [7.5, 4.6, 8.5], look: [0, 1.3, 0] },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

function Rig() {
  const look = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    engineState.smooth += (engineState.p - engineState.smooth) * Math.min(1, dt * 3.2);
    const f = engineState.smooth * (SHOTS.length - 1);
    const i = Math.min(SHOTS.length - 2, Math.floor(f));
    let t = f - i;
    t = t * t * (3 - 2 * t);
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    tmpA.set(...a.pos).lerp(tmpB.set(...b.pos), t);
    tmpA.x += engineState.mx * 0.6;
    tmpA.y += -engineState.my * 0.35;
    state.camera.position.lerp(tmpA, 0.08);
    tmpA.set(...a.look).lerp(tmpB.set(...b.look), t);
    look.current.lerp(tmpA, 0.08);
    state.camera.lookAt(look.current);
  });
  return null;
}

export default function EngineScene({ active }: { active: boolean }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? [1, 1.4] : [1, 1.75]}
      camera={{ position: [13, 11, 13], fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#04070c");
        scene.fog = new THREE.Fog("#04070c", 16, 34);
      }}
    >
      <Rig />
      <Ground />
      <City size={mobile ? 17 : 21} />
      <Markets />
      <Shield />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.22} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}

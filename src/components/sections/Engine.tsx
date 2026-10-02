"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ScrollTrigger } from "@/lib/gsap";
import { ENGINE } from "@/lib/data";
import { engineState } from "@/components/gl/EngineScene";

const EngineScene = dynamic(() => import("@/components/gl/EngineScene"), { ssr: false });

const PROPERTY = [
  ["Property type", "Mid-rise condominium"],
  ["Year built", "2004"],
  ["Square footage", "128,400"],
  ["Units", "96"],
  ["Construction", "Masonry · CBS"],
  ["Roof", "Flat · replaced 2019"],
  ["Flood zone", "AE"],
];

const MARKETS = ["Direct carriers", "Market-access platforms", "MGAs", "Wholesale & E&S", "Private-client programs", "Specialty marine"];

/** Chapter-specific HUD cards that float beside the 3D city. */
function ChapterCard({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="space-y-3">
        {[["Coverage", "Commercial property"], ["Business", "Condominium association"], ["Address", "Brickell Ave, Miami FL"]].map(([k, v], n) => (
          <div key={k} className="flex items-center justify-between rounded-xl border border-gold/15 bg-ink/50 px-4 py-3 text-sm" style={{ animation: `fadeUp .6s ${n * 0.12}s both` }}>
            <span className="text-mist">{k}</span>
            <span className="text-ivory">{v}</span>
          </div>
        ))}
        <p className="hud pt-1">Saved · resume link sent by text</p>
      </div>
    );
  if (i === 1)
    return (
      <div>
        <p className="hud mb-3 flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Record found · verify</p>
        <dl className="divide-y divide-gold/10 rounded-xl border border-gold/15 bg-ink/50">
          {PROPERTY.map(([k, v], n) => (
            <div key={k} className="flex justify-between px-4 py-2.5 text-sm" style={{ animation: `fadeUp .5s ${n * 0.08}s both` }}>
              <dt className="text-mist">{k}</dt>
              <dd className="font-medium text-gold-light">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex gap-2">
          <span className="bg-gold rounded-full px-4 py-2 text-xs font-semibold text-ink">Yes, that&apos;s my property</span>
          <span className="rounded-full border border-gold/30 px-4 py-2 text-xs text-ivory/80">Edit</span>
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div className="rounded-xl border border-gold/15 bg-ink/50 p-4">
        <div className="flex items-center gap-3">
          <Icon name="doc" className="h-8 w-8 text-gold" stroke={1} />
          <div>
            <p className="text-sm text-ivory">current-declarations.pdf</p>
            <p className="hud">Extracted · 14 fields</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {[["Building limit", "$38,500,000", false], ["Wind deductible", "5%", false], ["Flood", "Not found", true], ["Ordinance or law", "Not found", true]].map(([k, v, gap]) => (
            <div key={k as string} className={`flex justify-between rounded-lg px-3 py-2 ${gap ? "bg-gold/10 ring-1 ring-gold/40" : ""}`}>
              <span className="text-mist">{k}</span>
              <span className={gap ? "text-gold-light" : "text-ivory"}>{v}</span>
            </div>
          ))}
        </div>
        <p className="hud mt-3">2 gaps flagged for your advisor</p>
      </div>
    );
  if (i === 3)
    return (
      <ul className="grid grid-cols-2 gap-2">
        {MARKETS.map((m, n) => (
          <li key={m} className="flex items-center gap-2 rounded-xl border border-gold/15 bg-ink/50 px-3 py-3 text-[0.8rem]" style={{ animation: `fadeUp .5s ${n * 0.08}s both` }}>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_10px_#c9a24a]" /> {m}
          </li>
        ))}
      </ul>
    );
  if (i === 4)
    return (
      <div className="rounded-xl border border-gold/15 bg-ink/50 p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[["Option A", "$184K", "Broadest"], ["Option B", "$161K", "Recommended"], ["Option C", "$149K", "Higher ded."]].map(([n, p, t], k) => (
            <div key={n} className={`rounded-lg p-3 ${k === 1 ? "bg-gold/15 ring-1 ring-gold/50" : "bg-white/5"}`}>
              <p className="text-mist">{n}</p>
              <p className="mt-1 font-display text-2xl text-ivory">{p}</p>
              <p className={k === 1 ? "mt-1 text-gold-light" : "mt-1 text-mist"}>{t}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm italic text-ivory/80">&ldquo;Option B closes your flood and ordinance gaps for less than you pay today.&rdquo;</p>
        <p className="hud mt-2">Your advisor · illustrative figures</p>
      </div>
    );
  return (
    <div className="rounded-xl border border-gold/30 bg-gold/[0.07] p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink"><Icon name="check" className="h-5 w-5" stroke={2} /></span>
        <div>
          <p className="font-display text-2xl text-ivory">Policy bound</p>
          <p className="hud">Signed electronically · documents delivered</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[0.7rem] text-mist">
        <span className="rounded-lg bg-white/5 py-2">Policy PDF</span>
        <span className="rounded-lg bg-white/5 py-2">COI issued</span>
        <span className="rounded-lg bg-white/5 py-2">Renewal set</span>
      </div>
    </div>
  );
}

export default function Engine() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        engineState.p = s.progress;
        const c = Math.min(ENGINE.length - 1, Math.floor(s.progress * ENGINE.length * 0.999));
        setChapter((prev) => (prev === c ? prev : c));
      },
    });
    const vis = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => setActive(s.isActive),
    });
    const move = (e: PointerEvent) => {
      engineState.mx = (e.clientX / window.innerWidth) * 2 - 1;
      engineState.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      st.kill();
      vis.kill();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const c = ENGINE[chapter];

  return (
    <section ref={root} id="engine" className="relative z-10 bg-ink" style={{ height: `${ENGINE.length * 110}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">{active && <EngineScene active={active} />}</div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,12,0.88)_0%,rgba(4,7,12,0.35)_42%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        <div className="section-pad relative flex h-full flex-col justify-center">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-gold">02</span>
            <span className="h-px w-10 bg-gradient-to-r from-gold/70 to-transparent" />
            <span className="eyebrow">The Protection Engine</span>
          </div>

          <div key={chapter} className="mt-8 max-w-xl" style={{ animation: "fadeUp .7s both" }}>
            <p className="font-mono text-xs tracking-[0.3em] text-gold-light/80">{c.k} / 0{ENGINE.length} · {c.hud}</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,4.4rem)] font-light leading-[1.02]">{c.title}</h2>
            <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ivory/75">{c.text}</p>
          </div>

          <div key={`card-${chapter}`} className="glass-deep mt-8 hidden w-full max-w-md rounded-2xl p-4 md:absolute md:block md:bottom-[12vh] md:right-[5vw] md:mt-0 md:w-[380px]" style={{ animation: "fadeUp .8s .1s both" }}>
            <ChapterCard i={chapter} />
          </div>

          {/* Chapter rail */}
          <ol className="absolute bottom-10 left-[clamp(1.25rem,5vw,6rem)] flex gap-2">
            {ENGINE.map((e, i) => (
              <li key={e.k} className={`h-[2px] rounded-full transition-all duration-500 ${i === chapter ? "w-14 bg-gold" : i < chapter ? "w-6 bg-gold/50" : "w-6 bg-white/15"}`} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

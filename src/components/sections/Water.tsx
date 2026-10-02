"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { Reveal, SectionTag, SplitHeading } from "@/components/ui";
import { gsap, prefersReduced } from "@/lib/gsap";
import { CASE_STUDIES, CERTS, WATER_STATS } from "@/lib/data";

export default function Water() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.count);
        const dec = Number(n.dataset.dec || 0);
        const o = { v: 0 };
        const fmt = () => (n.textContent = dec ? o.v.toFixed(dec) : Math.round(o.v).toLocaleString());
        if (prefersReduced()) { o.v = to; fmt(); return; }
        gsap.to(o, { v: to, duration: 2.2, ease: "power3.out", onUpdate: fmt, scrollTrigger: { trigger: n, start: "top 88%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((b) => {
        gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 92%", once: true } });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="water" className="relative z-10 overflow-hidden panel-hunter py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_80%_20%,rgba(201,162,74,0.18),transparent_45%)]" />
      <div className="section-pad relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionTag index="06">Where we started · Water Solutions</SectionTag>
            <SplitHeading className="mt-6 font-display text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.02]">
              More insurable. More sustainable. <span className="italic text-gilded">Less expensive</span> to operate.
            </SplitHeading>
          </div>
          <Reveal className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-ivory/75">
              Before we placed a single policy, we were cutting water costs for universities, hospitals, and condominiums, with $0 upfront and paid only from verified savings. Less water waste means less water damage, and that makes for a better risk.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-gold/20 bg-gold/20 lg:grid-cols-4">
          {WATER_STATS.map((s) => (
            <div key={s.label} className="bg-hunter/95 p-7 md:p-10">
              <p className="font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-none text-gilded">
                {s.prefix}
                <span data-count={s.value} data-dec={s.decimals ?? 0}>0</span>
                {s.suffix}
              </p>
              <p className="eyebrow mt-4 !text-ivory/70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Verified client results · utility cost reduction</p>
            <ul className="mt-6 space-y-5">
              {CASE_STUDIES.map((c) => (
                <li key={c.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-xl text-ivory">{c.name} <span className="text-sm text-mist">· {c.city}</span></p>
                    <p className="text-sm text-mist">{c.fixtures} fixtures · <span className="text-gold-light">{c.cost}% saved</span></p>
                  </div>
                  <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                    <div data-bar className="h-full origin-left rounded-full bg-gold" style={{ width: `${Math.min(100, c.cost * 1.7)}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-mist/80">{c.detail} · {c.water}% less water</p>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:col-span-5">
            <div className="glass-deep gold-frame rounded-[28px] p-8">
              <p className="eyebrow">The Sustainability Alliance</p>
              <p className="mt-4 font-display text-3xl leading-tight">Vendors who make properties safer, greener, and cheaper to insure.</p>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Roofing, impact glass, leak detection, solar, generators, and energy retrofits. SSG recommends vetted Alliance partners to clients, and better-protected properties earn a stronger case for lower commercial premiums.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ivory/80">
                {["Vetted referrals to our client base", "Co-marketing with SSG", "Underwriting-ready documentation"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-gold" /> {x}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/insurance/water-conservation" className="bg-gold rounded-full px-5 py-3 text-sm font-semibold text-ink">Analyze my property</Link>
                <Link href="/alliance" className="rounded-full border border-gold/40 px-5 py-3 text-sm text-gold-light hover:bg-gold/10">Become a partner</Link>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {CERTS.map((c) => <span key={c} className="hud">{c}</span>)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

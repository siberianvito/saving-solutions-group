"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { Reveal, SectionTag, SplitHeading } from "@/components/ui";
import PropertyLookup from "@/components/PropertyLookup";
import type { PropertyRecord } from "@/lib/property";

/* ── Text-based intake: animated conversation ─────────────────── */
const CHAT: { from: "ssg" | "you"; text: string }[] = [
  { from: "ssg", text: "Hi John, it's Saving Solutions. I'll help you get started. What type of coverage do you need?" },
  { from: "you", text: "Commercial property" },
  { from: "ssg", text: "Great. What's the property address?" },
  { from: "you", text: "1450 Brickell Ave, Miami" },
  { from: "ssg", text: "Found it: 2004 masonry mid-rise, 96 units, flood zone AE. Is that right?" },
  { from: "you", text: "Yes 👍" },
  { from: "ssg", text: "Perfect. Last thing: snap a photo of your current dec page and send it here. Elizabeth will call with options." },
];

function Phone() {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !t) {
        const step = () => {
          setN((v) => {
            const nx = v >= CHAT.length ? 1 : v + 1;
            return nx;
          });
          t = window.setTimeout(step, 1500);
        };
        t = window.setTimeout(step, 400);
      } else if (!e.isIntersecting && t) {
        window.clearTimeout(t);
        t = undefined;
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); if (t) window.clearTimeout(t); };
  }, []);

  const shown = CHAT.slice(0, n);
  const next = CHAT[n];

  return (
    <div ref={ref} className="relative mx-auto w-[300px] animate-float">
      <div className="absolute -inset-10 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative rounded-[46px] border border-gold/30 bg-gradient-to-b from-[#121a26] to-[#06090f] p-3 shadow-[0_40px_120px_-40px_rgba(201,162,74,0.5)]">
        <div className="relative h-[560px] overflow-hidden rounded-[36px] bg-[#05080d]">
          <div className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="border-b border-white/5 px-5 pb-3 pt-11 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ss-monogram.png")} alt="" className="mx-auto h-7" />
            <p className="mt-1 text-[0.7rem] text-ivory">Saving Solutions</p>
            <p className="text-[0.6rem] text-mist">Text message · secure intake</p>
          </div>
          <div className="flex h-[440px] flex-col justify-end gap-2 overflow-hidden p-3">
            {shown.slice(-6).map((m, i) => (
              <div
                key={`${n}-${i}`}
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[0.78rem] leading-snug ${
                  m.from === "ssg" ? "self-start rounded-bl-md bg-white/[0.07] text-ivory/90" : "bg-gold self-end rounded-br-md text-ink"
                }`}
                style={i === Math.min(shown.length, 6) - 1 ? { animation: "fadeUp .4s both" } : undefined}
              >
                {m.text}
              </div>
            ))}
            {next && (
              <div className={`flex gap-1 rounded-2xl px-3.5 py-3 ${next.from === "ssg" ? "self-start bg-white/[0.07]" : "self-end bg-gold/30"}`}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 rounded-full bg-ivory" style={{ animation: `typing 1s ${d * 0.15}s infinite` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Property intelligence demo ──────────────────────────────── */
function PropertyDemo() {
  const [verified, setVerified] = useState<PropertyRecord | null>(null);
  return (
    <div className="glass-deep gold-frame rounded-[28px] p-6 md:p-8">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Try it · Property intelligence</p>
        <span className="hud flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Live · Miami-Dade</span>
      </div>
      <div className="mt-5">
        <PropertyLookup onVerified={setVerified} />
      </div>
      {verified && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gold/10 px-4 py-3 ring-1 ring-gold/30" style={{ animation: "fadeUp .5s both" }}>
          <span className="text-sm text-gold-light">Want a quote on this {verified.type.toLowerCase()}?</span>
          <Link href={`/quote?address=${encodeURIComponent(verified.address)}&folio=${verified.folio}`} className="text-sm font-medium text-ivory underline decoration-gold underline-offset-4">Continue my quote →</Link>
        </div>
      )}
    </div>
  );
}

export default function SmartApp() {
  return (
    <section id="smart-app" className="relative z-10 overflow-hidden bg-ink py-28 md:py-40">
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-hunter-2/40 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-navy-2/50 blur-[140px]" />

      <div className="section-pad relative">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionTag index="04">The smart application</SectionTag>
            <SplitHeading className="mt-6 font-display text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.02]">
              Ask only what&apos;s <span className="italic text-gilded">required.</span> Never ask twice.
            </SplitHeading>
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-ivory/70">
              Conditional questions adapt to each coverage. Addresses become building data. Your old policy becomes a pre-filled application. And everything flows into one record: CRM, carriers, e-signature, COIs, renewal.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7"><PropertyDemo /></Reveal>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <Phone />
            <p className="mt-8 text-center font-display text-2xl italic text-ivory/85">Start on the website. Continue by text.</p>
            <p className="mt-2 text-center text-sm text-mist">Without starting over.</p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: "bell" as const, t: "Smart reminders", d: "1 hour, 24 hours, 3 days. We always know exactly what's missing." },
            { i: "upload" as const, t: "Upload anything", d: "Dec pages, loss runs, schedules, payroll, matched to your file automatically." },
            { i: "pen" as const, t: "E-sign in the flow", d: "Accept, sign, and bind without printing a page." },
            { i: "lock" as const, t: "Save & resume", d: "Pick up on any device with a secure resume link." },
          ].map((f, k) => (
            <Reveal key={f.t} delay={k * 0.08}>
              <div className="glow-card glass h-full rounded-2xl p-6">
                <Icon name={f.i} className="h-6 w-6 text-gold" />
                <p className="mt-5 font-display text-2xl">{f.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-mist">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

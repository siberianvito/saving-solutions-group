"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { Reveal, SectionTag, SplitHeading } from "@/components/ui";
import { mockLookup, type PropertyRecord } from "@/lib/property";

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
  const [addr, setAddr] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "confirmed">("idle");
  const [rec, setRec] = useState<PropertyRecord | null>(null);
  const [step, setStep] = useState(0);
  const STEPS = ["Geocoding address", "Matching parcel record", "Reading building characteristics", "Checking flood zone"];

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.trim()) return;
    setState("loading");
    setStep(0);
    STEPS.forEach((_, i) => window.setTimeout(() => setStep(i + 1), 380 * (i + 1)));
    window.setTimeout(() => {
      setRec(mockLookup(addr));
      setState("found");
    }, 380 * (STEPS.length + 1));
  };

  return (
    <div className="glass-deep gold-frame rounded-[28px] p-6 md:p-8">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Try it · Property intelligence</p>
        <span className="hud">Demo</span>
      </div>
      <form onSubmit={run} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Property address</span>
          <Icon name="pin" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
          <input value={addr} onChange={(e) => { setAddr(e.target.value); setState("idle"); }} placeholder="Type any Florida address" className="field !pl-11" />
        </label>
        <button className="bg-gold rounded-[14px] px-6 py-3.5 text-sm font-semibold text-ink" type="submit">Look it up</button>
      </form>

      <div className="mt-6 min-h-[300px]">
        {state === "idle" && (
          <div className="grid h-[300px] place-items-center rounded-2xl border border-dashed border-gold/15 text-center">
            <div>
              <Icon name="search" className="mx-auto h-10 w-10 text-gold/50" stroke={1} />
              <p className="mt-4 max-w-xs text-sm text-mist">Enter an address and watch how much we can fill in before you type another word.</p>
            </div>
          </div>
        )}
        {state === "loading" && (
          <ul className="space-y-3 pt-4">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 text-sm transition-opacity ${i < step ? "opacity-100" : "opacity-30"}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full border ${i < step ? "border-gold bg-gold text-ink" : "border-gold/30"}`}>
                  {i < step ? <Icon name="check" className="h-3.5 w-3.5" stroke={2.2} /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />}
                </span>
                {s}
              </li>
            ))}
          </ul>
        )}
        {(state === "found" || state === "confirmed") && rec && (
          <div style={{ animation: "fadeUp .6s both" }}>
            <p className="text-sm text-mist">Is this your property?</p>
            <p className="mt-1 font-display text-2xl text-ivory">{rec.address}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2">
              {rec.fields.map(([k, v], i) => (
                <div key={k} className="rounded-xl border border-gold/12 bg-ink/50 px-3.5 py-2.5" style={{ animation: `fadeUp .5s ${i * 0.06}s both` }}>
                  <dt className="hud !text-[0.55rem]">{k}</dt>
                  <dd className="mt-1 text-sm font-medium text-gold-light">{v}</dd>
                </div>
              ))}
            </dl>
            {state === "found" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setState("confirmed")} className="bg-gold rounded-full px-5 py-2.5 text-xs font-semibold text-ink">Yes, that&apos;s it</button>
                <button type="button" onClick={() => setState("idle")} className="rounded-full border border-gold/30 px-5 py-2.5 text-xs text-ivory/80">Not quite</button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gold/10 px-4 py-3 ring-1 ring-gold/30">
                <span className="flex items-center gap-2 text-sm text-gold-light"><Icon name="check" className="h-4 w-4" /> 7 answers you&apos;ll never have to type.</span>
                <Link href={`/quote?address=${encodeURIComponent(rec.address)}`} className="text-sm font-medium text-ivory underline decoration-gold underline-offset-4">Continue my quote →</Link>
              </div>
            )}
            <p className="hud mt-4 !normal-case !tracking-normal">Demo data for illustration. Live quotes use licensed property-data sources.</p>
          </div>
        )}
      </div>
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

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";
import { SITE, type IconName } from "@/lib/data";
import { shieldState } from "@/components/gl/HeroShield";

const HeroShield = dynamic(() => import("@/components/gl/HeroShield"), { ssr: false });

const TABS: { id: string; label: string; icon: IconName; placeholder: string; field: string; type: string; coverage?: string }[] = [
  { id: "business", label: "Business", icon: "building", placeholder: "What does your business do?", field: "industry", type: "commercial" },
  { id: "home", label: "Home", icon: "home", placeholder: "Enter your property address", field: "address", type: "personal", coverage: "Homeowners" },
  { id: "auto", label: "Auto", icon: "car", placeholder: "Enter your ZIP code", field: "zip", type: "personal", coverage: "Auto" },
  { id: "private", label: "Private Client", icon: "gem", placeholder: "Primary residence address", field: "address", type: "personal", coverage: "High-Value Home" },
  { id: "life", label: "Life", icon: "family", placeholder: "Your ZIP code", field: "zip", type: "life" },
  { id: "water", label: "Water", icon: "drop", placeholder: "Property address to analyze", field: "address", type: "water" },
];

const HEADLINE = ["What", "do", "you", "need", "to", "protect?"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const [tab, setTab] = useState(TABS[0]);
  const [value, setValue] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReduced();

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-word]", { yPercent: 120 });
      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-hero-photo]", { scale: 1.18, autoAlpha: 0 });

      const intro = () => {
        const tl = gsap.timeline();
        tl.to("[data-hero-photo]", { scale: 1.04, autoAlpha: 1, duration: 2.4, ease: "power3.out" }, 0)
          .to(shieldState, { reveal: 1, duration: 3.2, ease: "power2.inOut" }, 0.3)
          .to("[data-hero-word]", { yPercent: 0, duration: 1.3, stagger: 0.07, ease: "power4.out" }, 0.35)
          .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.9);
      };
      if (reduced) {
        gsap.set(["[data-hero-word]", "[data-hero-fade]", "[data-hero-photo]"], { clearProps: "all" });
        shieldState.reveal = 1;
      } else if (document.documentElement.dataset.booted) intro();
      else window.addEventListener("ssg:booted", intro, { once: true });

      if (!reduced) {
        gsap.to("[data-hero-photo]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(shieldState, {
          exit: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          autoAlpha: 0.0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "35% top", end: "bottom top", scrub: true },
        });
      }
      ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom top", onToggle: (s) => setActive(s.isActive) });
    }, el);
    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ type: tab.type });
    if (tab.coverage) q.set("coverage", tab.coverage);
    if (value.trim()) q.set(tab.field, value.trim());
    router.push(`/quote?${q.toString()}`);
  };

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[760px] overflow-hidden">
      {/* Photo plate */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-hero-photo src={asset("/media/hero.jpg")} alt="" className="h-full w-full object-cover object-[60%_50%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,12,0.92)_0%,rgba(4,7,12,0.7)_38%,rgba(4,7,12,0.15)_70%,rgba(4,7,12,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,12,0.6)_0%,transparent_25%,transparent_60%,#04070c_100%)]" />
      </div>

      {/* Gold shield dome over the skyline */}
      <div className="pointer-events-none absolute inset-y-0 right-[-12%] w-[85%] md:right-[-6%] md:w-[70%]">
        <HeroShield active={active} />
      </div>

      {/* HUD chrome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden section-pad md:block">
        <div className="flex items-end justify-between">
          <span className="hud">25.7617° N · 80.1918° W · MIAMI</span>
          <span className="hud flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Advisors online</span>
        </div>
      </div>

      <div data-hero-copy className="section-pad relative z-10 flex h-full flex-col justify-center pt-28">
        <div className="max-w-3xl">
          <p data-hero-fade className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-gold" /> Insurance · Risk Management · Property Solutions
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,7.4vw,7.2rem)] font-light leading-[0.95] tracking-[-0.01em]">
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-hero-word className={`inline-block pr-[0.22em] ${i >= 4 ? "italic text-gilded" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ivory/75">
            Business, home, auto, private client, life, and water. Start online in minutes, continue by text, and finish with a real advisor. <span className="text-gold-light">{SITE.promise}</span>
          </p>

          {/* Quote launcher */}
          <div data-hero-fade className="glass-deep gold-frame mt-9 max-w-2xl rounded-[22px] p-2.5">
            <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.id === t.id}
                  onClick={() => { setTab(t); setValue(""); }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-[0.78rem] font-medium transition-all ${
                    tab.id === t.id ? "bg-gold/15 text-gold-light shadow-[inset_0_0_0_1px_rgba(236,211,147,0.35)]" : "text-ivory/60 hover:text-ivory"
                  }`}
                >
                  <Icon name={t.icon} className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">{tab.placeholder}</span>
                <Icon name={tab.field === "industry" ? "search" : "pin"} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/80" />
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={tab.placeholder}
                  inputMode={tab.field === "zip" ? "numeric" : "text"}
                  className="field !rounded-xl !pl-11"
                />
              </label>
              <button type="submit" className="bg-gold flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-ink">
                Start my quote <Icon name="arrow" className="h-4 w-4" />
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-2 pb-1 pt-3 text-[0.72rem] text-mist">
              <span className="flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5 text-gold" /> About 3 minutes</span>
              <span className="flex items-center gap-1.5"><Icon name="chat" className="h-3.5 w-3.5 text-gold" /> Continue by text anytime</span>
              <Link href="/quote?upload=1" className="flex items-center gap-1.5 text-gold-light hover:underline"><Icon name="upload" className="h-3.5 w-3.5" /> Or just upload your policy</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="hud">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-white/10"><span className="block h-1/2 w-px animate-[float_2.2s_ease-in-out_infinite] bg-gold" /></span>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { Reveal, SectionTag } from "@/components/ui";
import { asset } from "@/lib/asset";
import { gsap, prefersReduced } from "@/lib/gsap";
import { SITE } from "@/lib/data";

export default function Founder() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-portrait]", { clipPath: "inset(18% 18% 18% 18% round 400px 400px 28px 28px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 400px 400px 28px 28px)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "center center", scrub: 0.6 },
      });
      gsap.fromTo("[data-portrait] img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-arc]", { strokeDashoffset: 1600 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "center center", scrub: 0.6 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="founder" className="relative z-10 overflow-hidden bg-ink py-28 md:py-40">
      <div className="section-pad grid items-center gap-16 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <svg className="pointer-events-none absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]" viewBox="0 0 500 640" fill="none" aria-hidden="true">
            <path data-arc d="M250 8 C 420 8, 492 120, 492 260 L 492 632 M250 8 C 80 8, 8 120, 8 260 L 8 632" stroke="url(#arc)" strokeWidth="1.2" strokeDasharray="1600" />
            <defs>
              <linearGradient id="arc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3dc9a" />
                <stop offset="1" stopColor="#8f6a28" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
          <div data-portrait className="relative aspect-[4/5] overflow-hidden rounded-t-[400px] rounded-b-[28px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/elizabeth.jpg")} alt="Elizabeth Mesegue, Founder and CEO of Saving Solutions Group" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionTag index="07">Founder & CEO</SectionTag>
          <Reveal>
            <p className="mt-8 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-light italic leading-[1.15]">
              &ldquo;We do more than sell insurance. We help properties become <span className="text-gold">more insurable, sustainable,</span> and less expensive to operate.&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex items-center gap-5">
              <div className="h-px w-14 bg-gold" />
              <div>
                <p className="font-wordmark text-2xl tracking-[0.08em] text-gilded">ELIZABETH MESEGUE</p>
                <p className="hud mt-1">Founder & CEO · Saving Solutions Group</p>
              </div>
            </div>
            <p className="mt-8 max-w-xl leading-relaxed text-ivory/70">
              Elizabeth built Saving Solutions by cutting millions of dollars of water waste for South Florida institutions. Now she&apos;s bringing the same results-first thinking to insurance: understand the property, reduce the risk, then place the coverage.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={SITE.phoneHref} className="bg-gold flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-ink">
                <Icon name="phone" className="h-4 w-4" /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.ceoEmail}`} className="flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3.5 text-sm text-gold-light hover:bg-gold/10">
                <Icon name="doc" className="h-4 w-4" /> Email Elizabeth
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

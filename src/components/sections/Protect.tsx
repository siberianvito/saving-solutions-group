"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { SectionTag, SplitHeading } from "@/components/ui";
import { asset } from "@/lib/asset";
import { gsap, prefersReduced } from "@/lib/gsap";
import { PROTECT } from "@/lib/data";

/** Art plate used when a division has no photograph yet: gold line glyph on brand silk. */
function ArtPlate({ icon, tone }: { icon: (typeof PROTECT)[number]["icon"]; tone: number }) {
  return (
    <div className={`absolute inset-0 ${tone % 2 ? "panel-hunter" : "panel-navy"}`}>
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 400 560" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`g${tone}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3dc9a" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#c9a24a" stopOpacity="0.25" />
            <stop offset="1" stopColor="#f3dc9a" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M-40 420 C 120 330, 260 520, 460 380" stroke={`url(#g${tone})`} strokeWidth="1.4" fill="none" />
        <path d="M-40 470 C 140 380, 250 560, 460 430" stroke={`url(#g${tone})`} strokeWidth="0.8" fill="none" />
        <path d="M-60 120 C 120 40, 300 160, 470 60" stroke={`url(#g${tone})`} strokeWidth="0.6" fill="none" />
      </svg>
      <div className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[80px]" />
      <div className="absolute inset-0 grid place-items-center pb-24">
        <Icon name={icon} className="h-40 w-40 text-gold/70 drop-shadow-[0_0_30px_rgba(201,162,74,0.35)]" stroke={0.5} />
      </div>
    </div>
  );
}

export default function Protect({ media }: { media: string[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      if (prefersReduced()) return;
      const dist = () => tr.scrollWidth - window.innerWidth + 96;
      const tween = gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      // parallax the plates inside each card while the track moves
      gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((p) => {
        gsap.fromTo(p, { xPercent: -8 }, {
          xPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: p.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
    });

    // 3D tilt
    const cards = el.querySelectorAll<HTMLElement>("[data-tilt]");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const handlers: [HTMLElement, (e: MouseEvent) => void, () => void][] = [];
    if (fine && !prefersReduced()) {
      cards.forEach((c) => {
        const rx = gsap.quickTo(c, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(c, "rotationY", { duration: 0.6, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          const r = c.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          c.style.setProperty("--mx", `${e.clientX - r.left}px`);
          c.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        const leave = () => { rx(0); ry(0); };
        c.addEventListener("mousemove", move);
        c.addEventListener("mouseleave", leave);
        handlers.push([c, move, leave]);
      });
    }
    return () => {
      mm.revert();
      handlers.forEach(([c, m, l]) => { c.removeEventListener("mousemove", m); c.removeEventListener("mouseleave", l); });
    };
  }, []);

  return (
    <section ref={root} id="protect" className="relative z-10 overflow-hidden bg-ink py-24 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div ref={track} className="flex flex-col gap-10 section-pad lg:flex-row lg:items-center lg:gap-8 lg:pr-24">
        <div className="shrink-0 lg:w-[34vw]">
          <SectionTag index="01">Six ways we protect you</SectionTag>
          <SplitHeading className="mt-6 font-display text-[clamp(2.6rem,4.6vw,4.6rem)] font-light leading-[1.02]">
            One firm. <span className="italic text-gilded">Every</span> thing you&apos;ve built.
          </SplitHeading>
          <p className="mt-6 max-w-md text-ivory/70">
            Pick a door. Each one leads to a short, smart application that asks only what that coverage needs, and to an advisor who already knows your file.
          </p>
          <p className="hud mt-10 hidden items-center gap-3 lg:flex">
            Scroll <Icon name="arrow" className="h-3.5 w-3.5 text-gold" />
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:flex lg:gap-7 [perspective:1400px]">
          {PROTECT.map((p, i) => {
            const has = media.includes(p.image);
            return (
              <Link
                key={p.title}
                href={p.href}
                data-tilt
                className="glow-card group relative block aspect-[4/5] overflow-hidden rounded-[28px] border border-gold/15 [transform-style:preserve-3d] lg:aspect-auto lg:h-[68vh] lg:w-[26vw] lg:min-w-[320px]"
              >
                <div data-plate className="absolute inset-[-8%]">
                  {has ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(p.image)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
                  ) : (
                    <ArtPlate icon={p.icon} tone={i} />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
                <div className="absolute inset-0 flex flex-col justify-between p-7 [transform:translateZ(40px)]">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-[0.3em] text-gold">{p.index}</span>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ink/40 text-gold backdrop-blur">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-light">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/70">{p.line}</p>
                    <span className="mt-6 inline-flex items-center gap-2 border-b border-gold/50 pb-1 text-[0.8rem] font-medium text-gold-light transition-all group-hover:gap-4">
                      {p.cta} <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

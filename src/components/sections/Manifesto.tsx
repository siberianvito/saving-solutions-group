"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { LINES_MARQUEE } from "@/lib/data";

const LINE =
  "Online insurers made it fast. Traditional agencies made it personal. We refused to choose. Start on your phone at midnight, and finish with an advisor who knows your name, your building, and your renewal date.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.6 },
      });
      tl.to("[data-w]", { opacity: 1, color: "#f4efe4", stagger: 0.1, ease: "none" })
        .to("[data-copy]", { autoAlpha: 0, scale: 0.96, duration: 1.2 }, "+=0.4")
        .fromTo("[data-stamp]", { autoAlpha: 0, scale: 1.25, filter: "blur(16px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power3.out" }, "<0.3")
        .fromTo("[data-stamp-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, "<0.6");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative z-10 overflow-hidden bg-ink">
      <div className="relative flex h-screen items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(19,70,52,0.35),transparent_70%)]" />

        <div data-copy className="section-pad relative max-w-6xl text-center">
          <p className="eyebrow mb-10">03 · Our philosophy</p>
          <p className="font-display text-[clamp(1.9rem,3.9vw,3.9rem)] font-light leading-[1.18]">
            {LINE.split(" ").map((w, i) => (
              <span key={i} data-w className="inline-block pr-[0.26em] text-ivory/15 [opacity:0.9]">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div data-stamp className="section-pad invisible absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-display text-[clamp(2.6rem,7vw,7.5rem)] font-light leading-[0.98]">
            Technology <span className="italic text-gilded">when you want it.</span>
            <br />A human <span className="italic text-gilded">when you need one.</span>
          </p>
          <div data-stamp-rule className="gold-rule mt-10 w-[min(520px,70vw)] origin-center" />
          <p className="hud mt-6">Digital speed · Human advice</p>
        </div>
      </div>

      {/* Lines of coverage — dual marquee */}
      <div className="marquee-mask border-y border-gold/10 py-6">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...LINES_MARQUEE, ...LINES_MARQUEE].map((l, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-3xl font-light italic text-ivory/70">
              {l} <span className="text-base not-italic text-gilded">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

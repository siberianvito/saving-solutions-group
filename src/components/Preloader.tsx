"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { asset } from "@/lib/asset";

/**
 * Opening title: the gold SS monogram is "forged" (masked rise + light sweep),
 * the wordmark letters settle, a counter runs, then navy / hunter-green curtains
 * part to reveal the hero. Click / key / scroll skips. Hard wall-clock failsafe.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    window.__lenis?.stop();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.__lenis?.start();
      document.documentElement.dataset.booted = "1";
      window.dispatchEvent(new Event("ssg:booted"));
      setDone(true);
    };

    // Only the first arrival plays the title; in-app returns go straight in
    if (prefersReduced() || document.documentElement.dataset.booted) {
      finish();
      return;
    }

    const counter = { v: 0 };
    const num = el.querySelector<HTMLElement>("[data-count]");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo("[data-mono]", { clipPath: "inset(100% 0 0 0)", y: 30 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.3, ease: "power4.out" })
      .fromTo("[data-sweep]", { xPercent: -160 }, { xPercent: 160, duration: 1.1, ease: "power2.inOut" }, 0.55)
      .from("[data-letter]", { yPercent: 110, opacity: 0, stagger: 0.045, duration: 0.8 }, 0.45)
      .from("[data-sub]", { opacity: 0, letterSpacing: "0.9em", duration: 1.1 }, 0.8)
      .to(counter, { v: 100, duration: 2.0, ease: "power2.inOut", onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
      .to("[data-bar]", { scaleX: 1, duration: 2.0, ease: "power2.inOut" }, 0)
      .to("[data-stack]", { scale: 0.94, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.25)
      .to("[data-curtain-l]", { xPercent: -101, duration: 1.1, ease: "expo.inOut" }, 2.45)
      .to("[data-curtain-r]", { xPercent: 101, duration: 1.1, ease: "expo.inOut" }, 2.45)
      .add(finish, 2.9);

    const skip = () => tl.progress() < 0.75 && tl.seek(2.2);
    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("click", skip, { once: true });
    const failsafe = window.setTimeout(finish, 6000);

    return () => {
      tl.kill();
      window.clearTimeout(failsafe);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[2147482500] overflow-hidden" aria-hidden="true">
      <div data-curtain-l className="panel-navy absolute inset-y-0 left-0 w-1/2 border-r border-gold/30" />
      <div data-curtain-r className="panel-hunter absolute inset-y-0 right-0 w-1/2 border-l border-gold/30" />

      <div data-stack className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-mono src={asset("/brand/ss-monogram.png")} alt="" className="h-28 w-auto md:h-36" />
          <span
            data-sweep
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent mix-blend-overlay"
          />
        </div>
        <div className="mt-8 flex overflow-hidden font-wordmark text-3xl font-semibold tracking-[0.12em] text-gold md:text-5xl">
          {"SAVINGS".split("").map((c, i) => (
            <span key={i} data-letter className="inline-block">{c}</span>
          ))}
        </div>
        <p data-sub className="mt-3 font-caps text-[0.6rem] font-medium tracking-[0.5em] text-ivory md:text-xs">
          SOLUTIONS GROUP
        </p>

        <div className="absolute bottom-12 left-1/2 w-[min(320px,70vw)] -translate-x-1/2">
          <div className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.3em] text-mist/70">
            <span>INSURANCE · RISK · PROPERTY</span>
            <span data-count className="text-gold-light">000</span>
          </div>
          <div className="mt-2 h-px w-full bg-white/10">
            <div data-bar className="h-px origin-left scale-x-0 bg-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

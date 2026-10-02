"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReduced } from "@/lib/gsap";

/* ── Section eyebrow tag ─────────────────────────────────────── */
export function SectionTag({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-mono text-[10px] tracking-[0.3em] text-gold">{index}</span>
      <span className="h-px w-10 bg-gradient-to-r from-gold/70 to-transparent" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/* ── Split-text heading: words rise out of masked lines ─────── */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className = "",
  start = "top 82%",
}: {
  as?: "h1" | "h2" | "h3" | "p";
  children: React.ReactNode;
  className?: string;
  start?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          return gsap.from(self.words, {
            yPercent: 118,
            duration: 1.15,
            stagger: 0.04,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [start]);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {children}
    </Tag>
  );
}

/* ── Generic reveal wrapper (fade + rise) ─────────────────────── */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 38,
  start = "top 86%",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ── Magnetic hover element ──────────────────────────────────── */
export function Magnetic({
  children,
  className = "",
  strength = 0.32,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || prefersReduced()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

/* ── Spotlight tracking for .glow-card elements ───────────────── */
export function useGlowCards() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const move = (e: MouseEvent) => {
      root.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    root.addEventListener("mousemove", move, { passive: true });
    return () => root.removeEventListener("mousemove", move);
  }, []);
  return ref;
}

/* ── Scroll-velocity skew (fake motion blur) ─────────────────── */
export function useVelocitySkew(selector: string) {
  useEffect(() => {
    if (prefersReduced()) return;
    const proxy = { skew: 0 };
    const setter = gsap.quickSetter(selector, "skewY", "deg");
    const clamp = gsap.utils.clamp(-1.4, 1.4);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -420);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.7,
            ease: "power3",
            overwrite: true,
            onUpdate: () => setter(proxy.skew),
          });
        }
      },
    });
    return () => st.kill();
  }, [selector]);
}

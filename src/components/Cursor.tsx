"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Custom cursor: gold dot + trailing ring. Fine pointers only. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine || !dot || !ring) {
      document.body.dataset.customCursor = "off";
      return;
    }

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
    };

    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, [data-cursor]";

    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) {
        gsap.to(ring, {
          scale: 1.75,
          borderColor: "rgba(236,211,147,0.85)",
          duration: 0.3,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 0.45, duration: 0.3, overwrite: "auto" });
      }
    };
    const out = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(201,162,74,0.45)",
          duration: 0.3,
          overwrite: "auto",
        });
        gsap.to(dot, { scale: 1, duration: 0.3, overwrite: "auto" });
      }
    };
    const down = () => gsap.to(ring, { scale: 0.85, duration: 0.18, overwrite: "auto" });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.25, overwrite: "auto" });
    const leave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2147482000] hidden [@media(pointer:fine)]:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="invisible absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gold-light opacity-0 shadow-[0_0_12px_rgba(236,211,147,0.85)]"
      />
      <div
        ref={ringRef}
        className="invisible absolute -left-4 -top-4 h-8 w-8 rounded-full border border-gold/45 opacity-0"
      />
    </div>
  );
}

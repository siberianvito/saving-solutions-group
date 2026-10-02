"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { Reveal, SectionTag, SplitHeading, useGlowCards } from "@/components/ui";
import type { IconName } from "@/lib/data";

const BRANDS: { name: string; sub: string; text: string; items: string[]; icon: IconName; href: string; status?: string; panel: string }[] = [
  {
    name: "Saving Solutions",
    sub: "Insurance",
    text: "Property & casualty for businesses, families, and private clients.",
    items: ["Personal", "Commercial", "High-net-worth", "Marine", "Flood", "Specialty"],
    icon: "shield",
    href: "/insurance/business",
    panel: "panel-navy",
  },
  {
    name: "Saving Solutions",
    sub: "Financial Planning",
    text: "Life, retirement, and wealth-protection strategies.",
    items: ["Life", "Retirement", "Disability", "Long-term care", "Wealth protection", "Estate strategies"],
    icon: "chart",
    href: "/insurance/life-financial",
    status: "Launching",
    panel: "panel-hunter",
  },
  {
    name: "Saving Solutions",
    sub: "Water",
    text: "Performance-based water conservation. Our founding division.",
    items: ["Flush valve retrofits", "Free portfolio audit", "$0 upfront", "Paid from savings", "Insurability", "ESG reporting"],
    icon: "drop",
    href: "/insurance/water-conservation",
    panel: "panel-hunter",
  },
  {
    name: "Saving Solutions",
    sub: "Agent",
    text: "The producer platform: leads, quoting, carriers, CRM, and commissions in one login.",
    items: ["Lead distribution", "Quote activity", "Carrier access", "Training", "Production", "Commissions"],
    icon: "key",
    href: "/agents",
    status: "Coming soon",
    panel: "panel-navy",
  },
];

export default function Platform() {
  const glow = useGlowCards();
  return (
    <section id="platform" className="relative z-10 bg-ink py-28 md:py-40">
      <div className="section-pad">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionTag index="05">One group · four houses</SectionTag>
            <SplitHeading className="mt-6 font-display text-[clamp(2.6rem,5vw,5rem)] font-light leading-[1.02]">
              A risk-management <span className="italic text-gilded">group</span>, not just an agency.
            </SplitHeading>
          </div>
          <Reveal className="self-end lg:col-span-5 lg:col-start-8">
            <p className="text-ivory/70">
              Insurance, financial planning, water conservation, and an agent platform, all built API-first on one shared client record. One conversation can lower your water bill, close a coverage gap, and protect your family&apos;s future.
            </p>
          </Reveal>
        </div>

        <div ref={glow} className="mt-16 grid gap-5 md:grid-cols-2">
          {BRANDS.map((b, i) => (
            <Reveal key={b.sub} delay={(i % 2) * 0.1}>
              <Link href={b.href} className={`glow-card group relative block overflow-hidden rounded-[28px] border border-gold/15 p-8 md:p-10 ${b.panel}`}>
                <Icon name={b.icon} className="absolute -right-8 -top-8 h-56 w-56 text-gold/[0.07]" stroke={0.6} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="font-wordmark text-sm tracking-[0.2em] text-ivory/60">{b.name.toUpperCase()}</p>
                    <p className="mt-1 font-display text-5xl font-light text-gilded">{b.sub}</p>
                  </div>
                  {b.status && <span className="rounded-full border border-gold/40 px-3 py-1 text-[0.65rem] tracking-wider text-gold-light">{b.status}</span>}
                </div>
                <p className="relative mt-5 max-w-md text-ivory/75">{b.text}</p>
                <ul className="relative mt-8 flex flex-wrap gap-2">
                  {b.items.map((it) => (
                    <li key={it} className="rounded-full border border-white/10 bg-ink/30 px-3 py-1.5 text-xs text-ivory/70">{it}</li>
                  ))}
                </ul>
                <span className="relative mt-8 inline-flex items-center gap-2 text-sm text-gold-light transition-all group-hover:gap-4">
                  Explore <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

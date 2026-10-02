import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Founder from "@/components/sections/Founder";
import Platform from "@/components/sections/Platform";
import Icon from "@/components/Icon";
import { Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Saving Solutions Group",
  description: "A Miami risk-management group: insurance, financial planning, and water conservation under one roof, led by founder & CEO Elizabeth Mesegue.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { i: "spark" as const, t: "Digital speed", d: "Start online or by text in minutes. Save, resume, upload, and sign without paper." },
  { i: "users" as const, t: "Human advice", d: "An advisor who knows your file, your property, and your renewal date. Every time." },
  { i: "shield" as const, t: "Risk first", d: "We reduce the risk, then place the coverage, so properties become more insurable over time." },
  { i: "leaf" as const, t: "Sustainable by design", d: "Water conservation and Alliance partners lower operating costs and losses together." },
];

export default function About() {
  return (
    <main>
      <PageHero
        eyebrow="About the group"
        icon="gem"
        image="/media/hero.jpg"
        title={<>We do more than <span className="italic text-gilded">sell insurance.</span></>}
        sub="Saving Solutions Group began by cutting water waste for South Florida's universities, hospitals, and condominiums. Today we are building a full risk-management group: insurance, financial planning, and property solutions, connected by one client record and one standard of service."
      >
        <Link href="/quote" className="bg-gold inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-ink">Start a quote <Icon name="arrow" className="h-4 w-4" /></Link>
      </PageHero>

      <section className="section-pad py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, k) => (
            <Reveal key={v.t} delay={k * 0.06}>
              <div className="glass h-full rounded-2xl p-7">
                <Icon name={v.i} className="h-6 w-6 text-gold" />
                <p className="mt-8 font-display text-3xl">{v.t}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Founder />
      <Platform />
    </main>
  );
}

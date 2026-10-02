import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleForm from "@/components/SimpleForm";
import Icon from "@/components/Icon";
import { Reveal } from "@/components/ui";
import type { IconName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sustainability Alliance: Partner with SSG",
  description: "Join the Saving Solutions Sustainability Alliance. Help our clients' properties become safer, greener, and less expensive to insure.",
  alternates: { canonical: "/alliance" },
};

const CATS: { i: IconName; t: string; d: string }[] = [
  { i: "home", t: "Roofing", d: "Newer, code-plus roofs are among the biggest drivers of property insurability in Florida." },
  { i: "shield", t: "Impact glass & shutters", d: "Opening protection that earns wind-mitigation credits." },
  { i: "drop", t: "Leak detection & shut-off", d: "Stop water losses before they become claims." },
  { i: "spark", t: "Generators & solar", d: "Resilience through outages and storms." },
  { i: "leaf", t: "Energy retrofits", d: "LED, HVAC, and controls that cut operating costs." },
  { i: "hardhat", t: "Restoration & mitigation", d: "Fast response that limits damage when losses do happen." },
];

export default function Alliance() {
  return (
    <main>
      <PageHero
        eyebrow="The Sustainability Alliance"
        icon="leaf"
        title={<>Make properties <span className="italic text-gilded">safer, greener,</span> and cheaper to insure.</>}
        sub="SSG recommends vetted Alliance partners whose work makes our clients' properties more sustainable and more insurable. Better-protected buildings earn a stronger case for lower commercial premiums. Partners gain qualified introductions through a monthly membership and referral program."
      />

      <section className="section-pad py-24">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c, i) => (
            <Reveal key={c.t} delay={(i % 3) * 0.06} className="bg-ink">
              <div className="h-full p-8">
                <Icon name={c.i} className="h-7 w-7 text-gold" />
                <p className="mt-8 font-display text-3xl">{c.t}</p>
                <p className="mt-2 text-sm text-mist">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="panel-hunter py-24">
        <div className="section-pad grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1.05]">One advisor. <span className="italic text-gilded">Three wins.</span></h2>
            <ol className="mt-10 space-y-6">
              {[
                ["The client", "lowers operating costs and strengthens their property's risk profile."],
                ["The partner", "receives qualified, pre-vetted introductions from SSG."],
                ["The underwriter", "sees documented improvements on a better risk."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <p className="text-ivory/80"><span className="text-ivory">{t}</span> {d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-xs text-mist/70">Premium outcomes depend on carrier underwriting. Membership and referral terms provided upon approval.</p>
          </div>
          <div className="glass-deep gold-frame rounded-[28px] p-7 md:p-9 lg:col-span-7">
            <p className="font-display text-3xl">Apply to join the Alliance</p>
            <div className="mt-8">
              <SimpleForm
                kind="alliance"
                cta="Apply"
                success="Our partnerships team will review your application and reach out within two business days."
                fields={[
                  { id: "company", label: "Company", required: true },
                  { id: "name", label: "Your name", required: true },
                  { id: "email", label: "Email", type: "email", required: true },
                  { id: "phone", label: "Phone", type: "tel" },
                  { id: "category", label: "Category", type: "select", options: CATS.map((c) => c.t).concat("Other"), full: true },
                  { id: "notes", label: "Service area, licenses, certifications", type: "textarea" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

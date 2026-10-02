import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleForm from "@/components/SimpleForm";
import Icon from "@/components/Icon";
import type { IconName } from "@/lib/data";

export const metadata: Metadata = {
  title: "SSG Agent: Producer Platform",
  description: "Saving Solutions Agent: leads, quoting, carrier access, CRM, training, and commissions in one producer platform.",
  alternates: { canonical: "/agents" },
};

const FEATURES: { i: IconName; t: string }[] = [
  { i: "bell", t: "Lead distribution" },
  { i: "chart", t: "Quote activity" },
  { i: "globe", t: "Carrier & market access" },
  { i: "users", t: "CRM & client management" },
  { i: "doc", t: "Training library" },
  { i: "card", t: "Production & commissions" },
  { i: "check", t: "Tasks & renewals" },
  { i: "chat", t: "Unified calls, texts & email" },
];

export default function Agents() {
  return (
    <main>
      <PageHero compact eyebrow="Saving Solutions Agent" icon="key" title={<>The producer platform, <span className="italic text-gilded">in development.</span></>} sub="One login for leads, quoting, carrier access, CRM, training, production, and commissions, built on the same client record as our website and service desk." />
      <section className="section-pad grid gap-10 pb-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="glass-deep gold-frame rounded-[28px] p-8">
            <p className="flex items-center gap-2 font-display text-3xl"><Icon name="lock" className="h-6 w-6 text-gold" /> Agent login</p>
            <div className="mt-8 space-y-4 opacity-50">
              <input disabled className="field" placeholder="Producer ID or email" />
              <input disabled className="field" placeholder="Password" type="password" />
              <button disabled className="bg-gold w-full rounded-full py-3.5 text-sm font-semibold text-ink">Sign in</button>
            </div>
            <p className="hud mt-6 !normal-case !tracking-normal">Portal access opens with the platform launch.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {FEATURES.map((f) => (
              <div key={f.t} className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm"><Icon name={f.i} className="h-4 w-4 shrink-0 text-gold" /> {f.t}</div>
            ))}
          </div>
        </div>
        <div className="glass-deep rounded-[28px] p-7 md:p-9 lg:col-span-7">
          <p className="font-display text-3xl">Interested in producing with SSG?</p>
          <p className="mt-2 text-sm text-mist">Licensed agents and agencies: tell us about your book.</p>
          <div className="mt-8">
            <SimpleForm
              kind="agent-interest"
              cta="Submit"
              success="Thanks. Our team will be in touch about the producer program."
              fields={[
                { id: "name", label: "Name", required: true },
                { id: "email", label: "Email", type: "email", required: true },
                { id: "phone", label: "Phone", type: "tel" },
                { id: "license", label: "License type(s)", type: "select", options: ["2-20 P&C", "2-15 Life & Health", "Both", "In progress"] },
                { id: "book", label: "Lines of business & book size", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

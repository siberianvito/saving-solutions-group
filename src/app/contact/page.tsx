import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SimpleForm from "@/components/SimpleForm";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact an Advisor",
  description: `Call ${SITE.phone}, text us, or send a message. Saving Solutions Group, Miami, Florida.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const ways = [
    { i: "phone" as const, t: "Call", v: SITE.phone, href: SITE.phoneHref },
    { i: "chat" as const, t: "Text", v: "Start a conversation", href: SITE.sms },
    { i: "building" as const, t: "Office", v: SITE.office, href: SITE.officeHref },
    { i: "doc" as const, t: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
  ];
  return (
    <main>
      <PageHero compact eyebrow="Contact" icon="phone" title={<>Talk to a <span className="italic text-gilded">real advisor.</span></>} sub="Call, text, or write. Same team, same file, whichever way you choose." />
      <section className="section-pad grid gap-10 pb-28 lg:grid-cols-12">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {ways.map((w) => (
            <a key={w.t} href={w.href} className="glow-card glass flex items-center gap-5 rounded-2xl p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-gold"><Icon name={w.i} className="h-5 w-5" /></span>
              <span>
                <span className="eyebrow block">{w.t}</span>
                <span className="mt-1 block break-all font-display text-2xl">{w.v}</span>
              </span>
            </a>
          ))}
          <p className="flex items-center gap-2 px-2 text-sm text-mist"><Icon name="pin" className="h-4 w-4 text-gold" /> {SITE.city}</p>
        </div>
        <div className="glass-deep gold-frame rounded-[28px] p-7 md:p-9 lg:col-span-7">
          <p className="font-display text-3xl">Send a message</p>
          <div className="mt-8">
            <SimpleForm
              kind="contact"
              cta="Send"
              success="An advisor will reach out shortly."
              fields={[
                { id: "name", label: "Name", required: true },
                { id: "phone", label: "Phone", type: "tel", required: true },
                { id: "email", label: "Email", type: "email" },
                { id: "topic", label: "Topic", type: "select", options: ["Business insurance", "Home & auto", "Private client", "Life & financial", "Water conservation", "Existing policy", "Other"] },
                { id: "message", label: "How can we help?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

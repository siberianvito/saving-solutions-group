import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceDesk from "@/components/ServiceDesk";
import Icon from "@/components/Icon";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Client Center: COIs, ID Cards, Claims & Policy Changes",
  description: "Request a certificate of insurance, ID card, policy copy, or policy change, by web or text. No phone tree.",
  alternates: { canonical: "/client-center" },
};

export default function ClientCenter() {
  return (
    <main>
      <PageHero
        compact
        eyebrow="Client Center"
        icon="key"
        title={<>Everything you need, <span className="italic text-gilded">without the phone tree.</span></>}
        sub="Certificates, ID cards, policy changes, and claims. Tap a request, or text it from the number on your file. We'll know who you are."
      >
        <div className="flex flex-wrap gap-3">
          <a href={SITE.sms} className="bg-gold flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-ink"><Icon name="chat" className="h-4 w-4" /> Text a request</a>
          <a href={SITE.phoneHref} className="flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3.5 text-sm text-gold-light"><Icon name="phone" className="h-4 w-4" /> {SITE.phone}</a>
          <span className="flex items-center gap-2 rounded-full px-4 py-3.5 text-sm text-mist"><Icon name="lock" className="h-4 w-4 text-gold" /> Secure client portal: coming soon</span>
        </div>
      </PageHero>
      <section className="section-pad pb-28">
        <ServiceDesk />
      </section>
    </main>
  );
}

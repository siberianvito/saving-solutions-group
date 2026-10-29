import type { Metadata } from "next";
import GHLForm from "@/components/GHLForm";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: `Tell us how to reach you and a Saving Solutions advisor will build your quote. Business, home, auto, private client, life, and water. Or call ${SITE.phone}.`,
  alternates: { canonical: "/quote" },
};

/*
 * v1: lead capture via the GoHighLevel form.
 * The full digital quoting app (conditional questions, property lookup,
 * save & resume, uploads) is preserved in src/components/quote/QuoteApp.tsx
 * for the next version. See assets/FUTURE-DIGITAL-QUOTING.md.
 */
const NEXT = [
  { t: "We call you", d: "An advisor reaches out, usually the same business day." },
  { t: "We review what you have", d: "Your current policy, property, and exposures, line by line." },
  { t: "We shop the markets", d: "Direct carriers, MGAs, and specialty markets for your risk." },
  { t: "You choose, we bind", d: "Clear options, a straight recommendation, and fast documents." },
];

export default function QuotePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-28 pt-36">
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-hunter-2/40 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[600px] w-[600px] rounded-full bg-navy-2/60 blur-[160px]" />

      <div className="section-pad relative grid gap-14 lg:grid-cols-12">
        {/* Copy column */}
        <div className="lg:col-span-5">
          <p className="eyebrow" style={{ animation: "fadeUp .8s both" }}>Request a quote · Digital speed, human advice</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-light leading-[0.98]" style={{ animation: "fadeUp 1s .1s both" }}>
            Let&apos;s get you <span className="italic text-gilded">protected.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ivory/70" style={{ animation: "fadeUp 1s .2s both" }}>
            Business, home, auto, private client, life, or water. Leave your details and an advisor will build your quote with you, no forms to wrestle.
          </p>

          <ol className="mt-12 space-y-6" style={{ animation: "fadeUp 1s .3s both" }}>
            {NEXT.map((n, i) => (
              <li key={n.t} className="flex gap-5">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <div>
                  <p className="font-display text-2xl text-ivory">{n.t}</p>
                  <p className="mt-1 text-sm text-mist">{n.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="glass mt-12 flex items-center gap-4 rounded-2xl p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/elizabeth.jpg")} alt="" className="h-14 w-14 rounded-full object-cover object-top ring-1 ring-gold/50" />
            <div className="flex-1">
              <p className="text-sm text-ivory">Prefer to talk now?</p>
              <p className="hud mt-1 flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Advisors available</p>
            </div>
            <a href={SITE.phoneHref} className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold/10" aria-label={`Call ${SITE.phone}`}><Icon name="phone" className="h-4 w-4" /></a>
            <a href={SITE.sms} className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold hover:bg-gold/10" aria-label="Text us"><Icon name="chat" className="h-4 w-4" /></a>
          </div>
        </div>

        {/* Form column */}
        <div className="lg:col-span-6 lg:col-start-7" style={{ animation: "fadeUp 1s .25s both" }}>
          <div className="glass-deep gold-frame relative rounded-[28px] p-6 md:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-3xl">Your details</p>
                <p className="mt-1 text-sm text-mist">Takes under a minute.</p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold"><Icon name="shield" className="h-5 w-5" /></span>
            </div>
            <div className="gold-rule mb-6" />
            <GHLForm idSuffix="quote" />
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-mist/70">
            <Icon name="lock" className="h-3.5 w-3.5 text-gold" /> Your information is private and never sold.
          </p>
        </div>
      </div>
    </main>
  );
}

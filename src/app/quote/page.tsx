import type { Metadata } from "next";
import QuoteApp from "@/components/quote/QuoteApp";

export const metadata: Metadata = {
  title: "Start a Quote",
  description: "Start your insurance quote in about three minutes. Save and resume anytime, continue by text, and finish with a real advisor.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-28 pt-36">
      <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-hunter-2/40 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[600px] w-[600px] rounded-full bg-navy-2/60 blur-[160px]" />
      <div className="section-pad relative">
        <p className="eyebrow">Smart application · Digital speed, human advice</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] font-light leading-none">
          Let&apos;s get you <span className="italic text-gilded">protected.</span>
        </h1>
        <div className="mt-12">
          <QuoteApp />
        </div>
      </div>
    </main>
  );
}

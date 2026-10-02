"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { Magnetic, Reveal, SectionTag, SplitHeading, useGlowCards } from "@/components/ui";
import { asset } from "@/lib/asset";
import { SERVICE, SITE } from "@/lib/data";

export function ServiceTeaser() {
  const glow = useGlowCards();
  return (
    <section id="clients" className="relative z-10 panel-navy py-28 md:py-36">
      <div className="section-pad">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag index="08">Already a client</SectionTag>
            <SplitHeading className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,4.4vw,4.4rem)] font-light leading-[1.04]">
              Skip the phone tree. <span className="italic text-gilded">We already know you.</span>
            </SplitHeading>
          </div>
          <Reveal>
            <p className="max-w-sm text-sm leading-relaxed text-mist">
              Text from the number on your file and we know who you are, what you own, and who your advisor is. Or just tap what you need.
            </p>
          </Reveal>
        </div>
        <div ref={glow} className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {SERVICE.slice(0, 10).map((s, i) => (
            <Reveal key={s.id} delay={(i % 5) * 0.05}>
              <Link href={`/client-center#${s.id}`} className="glow-card glass group flex h-full flex-col justify-between rounded-2xl p-5">
                <Icon name={s.icon} className="h-6 w-6 text-gold" />
                <div className="mt-8">
                  <p className="text-[0.95rem] font-medium">{s.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{s.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <a href={SITE.sms} className="bg-gold flex h-full flex-col justify-between rounded-2xl p-5 text-ink">
              <Icon name="chat" className="h-6 w-6" />
              <div className="mt-8">
                <p className="text-[0.95rem] font-semibold">Text your request</p>
                <p className="mt-1 text-xs">&ldquo;I need a COI for ABC Construction.&rdquo;</p>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="start" className="relative z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/media/home.jpg")} alt="" loading="lazy" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(4,7,12,0.55),#04070c_85%)]" />
      </div>
      <div className="section-pad relative flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/ss-monogram.png")} alt="" className="mx-auto h-20 animate-float drop-shadow-[0_0_40px_rgba(201,162,74,0.45)]" />
        </Reveal>
        <SplitHeading className="mt-10 max-w-5xl font-display text-[clamp(2.8rem,6.6vw,6.8rem)] font-light leading-[0.98]">
          Let&apos;s protect what <span className="italic text-gilded">you&apos;ve built.</span>
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-xl text-ivory/70">Pick the way you like to work. Every path reaches the same advisor and the same file.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-5">
            <Magnetic className="col-span-2 md:col-span-1">
              <Link href="/quote" className="bg-gold flex h-full flex-col items-center gap-2 rounded-2xl px-5 py-6 text-ink">
                <Icon name="spark" className="h-5 w-5" /><span className="text-sm font-semibold">Start a Quote</span>
              </Link>
            </Magnetic>
            {[
              { href: SITE.phoneHref, icon: "phone" as const, label: "Call" },
              { href: SITE.sms, icon: "chat" as const, label: "Text" },
              { href: "/quote?upload=1", icon: "upload" as const, label: "Upload My Policy" },
              { href: "/client-center", icon: "key" as const, label: "Existing Customer" },
            ].map((b) => {
              const cls = "glass flex h-full flex-col items-center gap-2 rounded-2xl px-5 py-6 text-ivory/90 transition-colors hover:border-gold/50 hover:text-gold-light";
              const inner = (<><Icon name={b.icon} className="h-5 w-5 text-gold" /><span className="text-sm">{b.label}</span></>);
              return b.href.startsWith("/") ? (
                <Link key={b.label} href={b.href} className={cls}>{inner}</Link>
              ) : (
                <a key={b.label} href={b.href} className={cls}>{inner}</a>
              );
            })}
          </div>
        </Reveal>
        <p className="hud mt-12">{SITE.phone} · {SITE.email}</p>
      </div>
    </section>
  );
}

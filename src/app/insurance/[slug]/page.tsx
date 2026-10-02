import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/ui";
import { availableMedia } from "@/lib/media";
import { DIVISIONS, PRODUCTS, SITE, productBySlug } from "@/lib/data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} in Miami & Florida`,
    description: `${p.sub} Start a quote online in minutes or call ${SITE.phone}.`,
    alternates: { canonical: `/insurance/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();

  const [image] = availableMedia([p.image]);
  const quoteHref = `/quote?type=${p.quoteType}${p.quoteCoverage ? `&coverage=${encodeURIComponent(p.quoteCoverage)}` : ""}`;
  const related = PRODUCTS.filter((x) => x.division === p.division && x.slug !== p.slug).slice(0, 4);
  const div = DIVISIONS[p.division];

  return (
    <main>
      <PageHero
        eyebrow={p.eyebrow}
        icon={p.icon}
        image={image}
        title={p.headline}
        sub={p.sub}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={quoteHref} className="bg-gold flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-ink">
            {p.quoteType === "water" ? "Analyze my property" : p.quoteType === "life" ? "Start my plan" : "Start my quote"} <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <a href={SITE.phoneHref} className="flex items-center gap-2 rounded-full border border-gold/40 px-6 py-4 text-sm text-gold-light hover:bg-gold/10">
            <Icon name="phone" className="h-4 w-4" /> {SITE.phone}
          </a>
          <Link href="/quote?upload=1" className="flex items-center gap-2 rounded-full px-4 py-4 text-sm text-ivory/75 hover:text-gold-light">
            <Icon name="upload" className="h-4 w-4 text-gold" /> Upload my policy
          </Link>
        </div>
      </PageHero>

      {/* Coverage grid */}
      <section className="section-pad relative py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">What&apos;s covered</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1.05]">Built for how <span className="italic text-gilded">you</span> actually operate.</h2>
            <p className="mt-5 text-ivory/65">Every program is placed across the right markets for your risk, and explained by an advisor in plain English.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[28px] border border-gold/15 bg-gold/15 sm:grid-cols-2 lg:col-span-8">
            {p.coverages.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 0.06} className="bg-ink">
                <div className="h-full p-7">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <p className="mt-4 font-display text-2xl">{c.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fast application */}
      <section className="panel-hunter relative py-24">
        <div className="section-pad grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">The short application</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1.05]">About three minutes. <span className="italic text-gilded">Then a human.</span></h2>
            <ul className="mt-8 space-y-3">
              {p.asks.map((a) => (
                <li key={a} className="flex items-center gap-3 text-ivory/85"><Icon name="check" className="h-4 w-4 text-gold" /> {a}</li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={quoteHref} className="bg-gold rounded-full px-7 py-4 text-sm font-semibold text-ink">Start now</Link>
              <a href={SITE.sms} className="flex items-center gap-2 rounded-full border border-gold/40 px-6 py-4 text-sm text-gold-light"><Icon name="chat" className="h-4 w-4" /> Start by text</a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Who we protect</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {p.whoFor.map((w) => (
                <div key={w} className="glass rounded-2xl px-5 py-5 text-sm text-ivory/85">{w}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-5 font-display text-5xl font-light">Straight answers.</h2>
          </div>
          <div className="space-y-3 lg:col-span-8">
            {p.faq.map((f) => (
              <details key={f.q} className="group glass rounded-2xl px-6 py-5 open:border-gold/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-relaxed text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-pad border-t border-gold/10 py-20">
          <p className="eyebrow">More from {div.label}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/insurance/${r.slug}`} className="glow-card glass group rounded-2xl p-6">
                <Icon name={r.icon} className="h-6 w-6 text-gold" />
                <p className="mt-8 font-display text-2xl">{r.name}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-xs text-gold-light transition-all group-hover:gap-3">Explore <Icon name="arrow" className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

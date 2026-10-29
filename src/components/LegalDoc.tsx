import Link from "next/link";
import PageHero from "./PageHero";
import { SITE } from "@/lib/data";

export type LegalSection = { id: string; h: string; p?: string[]; list?: string[]; after?: string[] };

/** Shared layout for the Privacy Policy and Terms of Service: sticky contents + readable column. */
export default function LegalDoc({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  other,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  updated: string;
  sections: LegalSection[];
  other: { href: string; label: string };
}) {
  return (
    <main>
      <PageHero compact eyebrow={eyebrow} icon="lock" title={title} sub={intro} />

      <section className="section-pad grid gap-12 pb-28 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="hud">Last updated · {updated}</p>
            <nav aria-label="Contents" className="mt-6 hidden lg:block">
              <p className="eyebrow mb-4">Contents</p>
              <ol className="space-y-2 border-l border-gold/15 pl-4 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-mist transition-colors hover:text-gold-light">
                      <span className="mr-2 font-mono text-[0.65rem] text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                      {s.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <Link href={other.href} className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-xs text-gold-light hover:bg-gold/10">
              {other.label} →
            </Link>
          </div>
        </aside>

        <article className="max-w-3xl lg:col-span-8 lg:col-start-5">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32 border-b border-gold/10 py-10 first:pt-0">
              <p className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-3xl text-ivory md:text-4xl">{s.h}</h2>
              <div className="mt-5 space-y-4 text-[0.97rem] leading-relaxed text-ivory/75">
                {s.p?.map((t, k) => <p key={k}>{t}</p>)}
                {s.list && (
                  <ul className="space-y-2 pl-1">
                    {s.list.map((t, k) => (
                      <li key={k} className="flex gap-3">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.after?.map((t, k) => <p key={`a${k}`}>{t}</p>)}
              </div>
            </section>
          ))}

          <div className="glass mt-12 rounded-2xl p-6 text-sm text-mist">
            <p className="text-ivory">Questions about this document?</p>
            <p className="mt-2">
              Email <a href={`mailto:${SITE.email}`} className="text-gold-light underline underline-offset-4">{SITE.email}</a> or call{" "}
              <a href={SITE.phoneHref} className="text-gold-light underline underline-offset-4">{SITE.phone}</a>.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

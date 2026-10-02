import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import { NAV, SITE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-gold/15 bg-ink">
      <div className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-wordmark text-[18vw] font-semibold leading-none text-outline-gold opacity-40">
        SAVINGS
      </div>

      <div className="section-pad relative pb-40 pt-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="md" tagline />
            <p className="mt-8 max-w-sm font-display text-2xl italic leading-snug text-ivory/85">
              &ldquo;We do more than sell insurance. We help properties become more insurable, sustainable, and less expensive to operate.&rdquo;
            </p>
            <p className="mt-3 eyebrow">Elizabeth Mesegue, Founder & CEO</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {NAV.slice(0, 3).map((n) => (
              <div key={n.key}>
                <p className="eyebrow mb-4">{n.label}</p>
                <ul className="space-y-2.5">
                  {n.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-mist hover:text-gold-light">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow mb-4">Company</p>
              <ul className="space-y-2.5 text-sm text-mist">
                <li><Link href="/about" className="hover:text-gold-light">About SSG</Link></li>
                <li><Link href="/insurance/life-financial" className="hover:text-gold-light">Life & Financial</Link></li>
                <li><Link href="/insurance/water-conservation" className="hover:text-gold-light">Water Solutions</Link></li>
                <li><Link href="/alliance" className="hover:text-gold-light">Sustainability Alliance</Link></li>
                <li><Link href="/agents" className="hover:text-gold-light">SSG Agent Portal</Link></li>
                <li><Link href="/contact" className="hover:text-gold-light">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Clients</p>
              <ul className="space-y-2.5 text-sm text-mist">
                <li><Link href="/quote" className="hover:text-gold-light">Start a Quote</Link></li>
                <li><Link href="/client-center" className="hover:text-gold-light">Client Center</Link></li>
                <li><Link href="/client-center#coi" className="hover:text-gold-light">Request a COI</Link></li>
                <li><Link href="/quote?upload=1" className="hover:text-gold-light">Upload My Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow mb-4">Reach us</p>
            <ul className="space-y-3 text-sm">
              <li><a href={SITE.phoneHref} className="flex items-center gap-2 text-ivory hover:text-gold-light"><Icon name="phone" className="h-4 w-4 text-gold" />{SITE.phone}</a></li>
              <li><a href={SITE.officeHref} className="flex items-center gap-2 text-mist hover:text-gold-light"><Icon name="building" className="h-4 w-4 text-gold" />Office {SITE.office}</a></li>
              <li><a href={SITE.sms} className="flex items-center gap-2 text-mist hover:text-gold-light"><Icon name="chat" className="h-4 w-4 text-gold" />Text us</a></li>
              <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-2 break-all text-mist hover:text-gold-light"><Icon name="doc" className="h-4 w-4 shrink-0 text-gold" />{SITE.email}</a></li>
              <li className="flex items-center gap-2 text-mist"><Icon name="pin" className="h-4 w-4 text-gold" />{SITE.city}</li>
            </ul>
          </div>
        </div>

        <div className="gold-rule mt-16" />
        <div className="mt-6 flex flex-col justify-between gap-4 text-[0.7rem] leading-relaxed text-mist/60 md:flex-row">
          <p>© {new Date().getFullYear()} Saving Solutions Group. All rights reserved. {SITE.license}</p>
          <p className="max-w-2xl md:text-right">
            Coverage is subject to underwriting, policy terms, conditions and exclusions, and carrier availability. Property data shown during quoting is for verification and may be incomplete. Water savings figures reflect past client results and are not a guarantee of future savings.
          </p>
        </div>
      </div>
    </footer>
  );
}

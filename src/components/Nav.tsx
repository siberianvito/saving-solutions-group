"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import { NAV, SITE, DIVISIONS } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close menus on navigation (render-phase reset instead of an effect)
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setOpen(false);
    setMenu(null);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={() => setMenu(null)}>
      {/* Utility bar — existing customers never hunt for service */}
      <div
        className={`hidden overflow-hidden border-b border-gold/10 bg-ink/80 backdrop-blur-md transition-all duration-500 lg:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="section-pad flex h-9 items-center justify-between text-[0.68rem] tracking-wide text-mist">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-gold-light/90">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Existing client?
            </span>
            <Link href="/client-center#coi" className="hover:text-gold-light">Request a COI</Link>
            <Link href="/client-center#id" className="hover:text-gold-light">ID Card</Link>
            <Link href="/quote?upload=1" className="hover:text-gold-light">Upload My Policy</Link>
            <Link href="/client-center#claim" className="hover:text-gold-light">Claims</Link>
          </div>
          <div className="flex items-center gap-5">
            <a href={SITE.sms} className="flex items-center gap-1.5 hover:text-gold-light">
              <Icon name="chat" className="h-3.5 w-3.5" /> Text us
            </a>
            <Link href="/agents" className="flex items-center gap-1.5 hover:text-gold-light">
              <Icon name="lock" className="h-3.5 w-3.5" /> Agent Login
            </Link>
          </div>
        </div>
      </div>

      <nav
        className={`section-pad transition-all duration-500 ${
          scrolled || menu ? "border-b border-gold/15 bg-ink/80 py-3 backdrop-blur-xl" : "py-5"
        }`}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between gap-6">
          <Logo size="sm" />

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV.map((n) => (
              <li key={n.key} onMouseEnter={() => setMenu(n.key)}>
                <button
                  type="button"
                  onClick={() => setMenu(menu === n.key ? null : n.key)}
                  aria-expanded={menu === n.key}
                  className={`relative rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-wide transition-colors ${
                    menu === n.key ? "text-gold-light" : "text-ivory/80 hover:text-ivory"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ${
                      menu === n.key ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              </li>
            ))}
            <li onMouseEnter={() => setMenu(null)}>
              <Link href="/client-center" className="rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-wide text-ivory/80 hover:text-ivory">
                Client Center
              </Link>
            </li>
            <li onMouseEnter={() => setMenu(null)}>
              <Link href="/about" className="rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-wide text-ivory/80 hover:text-ivory">
                About
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <a href={SITE.phoneHref} className="hidden items-center gap-2 text-[0.82rem] font-medium text-ivory/90 hover:text-gold-light md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-gold">
                <Icon name="phone" className="h-3.5 w-3.5" />
              </span>
              {SITE.phone}
            </a>
            <Link
              href="/quote"
              className="bg-gold whitespace-nowrap rounded-full px-4 py-2.5 text-[0.72rem] font-semibold tracking-wide text-ink sm:px-5 sm:text-[0.78rem] shadow-[0_10px_30px_-12px_rgba(201,162,74,0.8)]"
            >
              Start a Quote
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-gold-light transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-px w-4 bg-gold-light transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-px w-4 bg-gold-light transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {NAV.map((n) => (
          <div
            key={n.key}
            className={`absolute inset-x-0 top-full hidden border-b border-gold/15 bg-ink/92 backdrop-blur-2xl transition-all duration-500 xl:block ${
              menu === n.key ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="section-pad grid grid-cols-12 gap-10 py-10">
              <div className="col-span-4">
                <div className="flex items-center gap-3 text-gold">
                  <Icon name={DIVISIONS[n.key].icon} className="h-7 w-7" stroke={1.1} />
                  <span className="eyebrow">{n.label}</span>
                </div>
                <p className="mt-5 font-display text-3xl leading-tight text-ivory">{n.feature}</p>
                <Link href={n.links[0].href} className="mt-6 inline-flex items-center gap-2 text-sm text-gold-light hover:gap-3 transition-all">
                  {DIVISIONS[n.key].cta} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <ul className="col-span-5 grid grid-cols-2 content-start gap-x-8 gap-y-1">
                {n.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group flex items-center justify-between border-b border-white/5 py-3.5 text-[0.92rem] text-ivory/80 hover:text-gold-light">
                      {l.label}
                      <Icon name="arrow" className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="col-span-3">
                <div className="glass-deep gold-frame rounded-2xl p-6">
                  <p className="eyebrow">Fastest path</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist">Upload your current declarations page. We read it, and an advisor calls with options.</p>
                  <Link href="/quote?upload=1" className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-medium text-gold-light hover:bg-gold/10">
                    <Icon name="upload" className="h-3.5 w-3.5" /> Upload my policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 top-0 -z-10 overflow-y-auto bg-ink/97 backdrop-blur-2xl transition-all duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="section-pad pb-16 pt-28">
          {NAV.map((n) => (
            <div key={n.key} className="border-b border-gold/10 py-5">
              <p className="eyebrow mb-3">{n.label}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {n.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-[0.95rem] text-ivory/85">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-6">
            <Link href="/client-center" className="glass rounded-xl px-4 py-3 text-sm">Client Center</Link>
            <Link href="/about" className="glass rounded-xl px-4 py-3 text-sm">About</Link>
            <Link href="/alliance" className="glass rounded-xl px-4 py-3 text-sm">Alliance Partners</Link>
            <Link href="/agents" className="glass rounded-xl px-4 py-3 text-sm">Agent Login</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 rounded-full border border-gold/40 py-3.5 text-sm text-gold-light">
              <Icon name="phone" className="h-4 w-4" /> Call
            </a>
            <a href={SITE.sms} className="flex items-center justify-center gap-2 rounded-full border border-gold/40 py-3.5 text-sm text-gold-light">
              <Icon name="chat" className="h-4 w-4" /> Text
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

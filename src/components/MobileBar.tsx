"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { SITE } from "@/lib/data";

/** Mobile-only sticky action bar: CALL · TEXT · START A QUOTE. */
export default function MobileBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 420);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 grid grid-cols-[1fr_1fr_1.6fr] gap-2 rounded-2xl border border-gold/25 bg-ink/85 p-2 backdrop-blur-xl transition-all duration-500 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a href={SITE.phoneHref} className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[0.65rem] text-ivory/85">
        <Icon name="phone" className="h-4 w-4 text-gold" /> Call
      </a>
      <a href={SITE.sms} className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[0.65rem] text-ivory/85">
        <Icon name="chat" className="h-4 w-4 text-gold" /> Text
      </a>
      <Link href="/quote" className="bg-gold flex items-center justify-center rounded-xl text-[0.8rem] font-semibold text-ink">
        Start a Quote
      </Link>
    </div>
  );
}

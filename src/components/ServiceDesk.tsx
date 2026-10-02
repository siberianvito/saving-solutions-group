"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { SERVICE, SITE } from "@/lib/data";
import { newRef } from "@/lib/intake";

type Field = { id: string; label: string; type?: "text" | "textarea" | "date" | "select"; options?: string[]; full?: boolean; placeholder?: string };

const EXTRA: Record<string, Field[]> = {
  coi: [
    { id: "holder", label: "Certificate holder name" },
    { id: "holderAddr", label: "Holder address" },
    { id: "ai", label: "Additional insured required?", type: "select", options: ["No", "Yes, blanket", "Yes, scheduled", "Not sure"] },
    { id: "pnc", label: "Primary & non-contributory / waiver of subrogation?", type: "select", options: ["No", "Yes", "Not sure"] },
    { id: "project", label: "Project / job name & location", full: true },
    { id: "wording", label: "Special wording (paste from contract)", type: "textarea", full: true },
  ],
  id: [{ id: "vehicle", label: "Which vehicle(s)?", full: true }],
  policy: [{ id: "which", label: "Which policy?", full: true }],
  claim: [
    { id: "date", label: "Date of loss", type: "date" },
    { id: "kind", label: "Type of loss", type: "select", options: ["Water", "Wind / storm", "Fire", "Theft", "Auto accident", "Liability", "Other"] },
    { id: "what", label: "What happened?", type: "textarea", full: true },
  ],
  change: [{ id: "what", label: "What would you like to change?", type: "textarea", full: true }],
  vehicle: [
    { id: "action", label: "Add or remove?", type: "select", options: ["Add", "Remove", "Replace"] },
    { id: "vin", label: "VIN" },
    { id: "eff", label: "Effective date", type: "date" },
  ],
  driver: [
    { id: "action", label: "Add or remove?", type: "select", options: ["Add", "Remove"] },
    { id: "name", label: "Driver name" },
    { id: "eff", label: "Effective date", type: "date" },
  ],
  billing: [{ id: "q", label: "How can we help?", type: "textarea", full: true }],
  agent: [{ id: "topic", label: "What would you like to discuss?", type: "textarea", full: true }],
};

export default function ServiceDesk() {
  const [sel, setSel] = useState("coi");
  const [done, setDone] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});

  useEffect(() => {
    const pick = () => {
      const h = window.location.hash.slice(1);
      if (h && EXTRA[h]) setSel(h);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);

  const svc = SERVICE.find((s) => s.id === sel)!;
  const v = (k: string) => vals[k] ?? "";
  const on = (k: string, x: string) => setVals((p) => ({ ...p, [k]: x }));

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="grid grid-cols-2 content-start gap-2 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-2">
        {SERVICE.map((s) => (
          <button
            key={s.id}
            id={s.id}
            type="button"
            onClick={() => { setSel(s.id); setDone(null); history.replaceState(null, "", `#${s.id}`); }}
            className={`flex scroll-mt-40 flex-col items-start gap-6 rounded-2xl border p-4 text-left transition-all ${
              sel === s.id ? "border-gold bg-gold/10" : "border-white/10 bg-white/[0.02] hover:border-gold/40"
            }`}
          >
            <Icon name={s.icon} className="h-5 w-5 text-gold" />
            <span className="text-sm font-medium">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7">
        <div key={sel + String(done)} className="glass-deep gold-frame rounded-[28px] p-6 md:p-9" style={{ animation: "fadeUp .5s both" }}>
          {done ? (
            <div className="py-10 text-center">
              <span className="bg-gold mx-auto grid h-14 w-14 place-items-center rounded-full text-ink"><Icon name="check" className="h-7 w-7" stroke={2} /></span>
              <p className="mt-6 font-display text-4xl">Request received.</p>
              <p className="mt-3 text-mist">Ticket <span className="font-mono text-gold-light">{done}</span> is routed to your service team. You&apos;ll get a confirmation by text and email.</p>
              <button type="button" onClick={() => { setDone(null); setVals({}); }} className="mt-8 rounded-full border border-gold/40 px-5 py-2.5 text-sm text-gold-light">New request</button>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setDone(newRef().replace("SSG", "SVC")); }}
            >
              <div className="flex items-center gap-3">
                <Icon name={svc.icon} className="h-6 w-6 text-gold" />
                <p className="font-display text-3xl">{svc.label}</p>
              </div>
              <p className="mt-2 text-sm text-mist">{svc.text}</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-[0.82rem] text-ivory/80">Name or business on the policy</span><input required className="field" value={v("insured")} onChange={(e) => on("insured", e.target.value)} /></label>
                <label className="block"><span className="mb-2 block text-[0.82rem] text-ivory/80">Phone or email on file</span><input required className="field" value={v("contact")} onChange={(e) => on("contact", e.target.value)} /></label>
                {(EXTRA[sel] ?? []).map((f) => (
                  <label key={f.id} className={`block ${f.full ? "sm:col-span-2" : ""}`}>
                    <span className="mb-2 block text-[0.82rem] text-ivory/80">{f.label}</span>
                    {f.type === "textarea" ? (
                      <textarea rows={3} className="field resize-none" value={v(f.id)} onChange={(e) => on(f.id, e.target.value)} />
                    ) : f.type === "select" ? (
                      <select className="field" value={v(f.id)} onChange={(e) => on(f.id, e.target.value)}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type === "date" ? "date" : "text"} className="field" value={v(f.id)} onChange={(e) => on(f.id, e.target.value)} />
                    )}
                  </label>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
                <a href={`${SITE.sms}?&body=${encodeURIComponent(sel === "coi" ? "I need a COI for " : `${svc.label}: `)}`} className="flex items-center gap-2 text-sm text-gold-light"><Icon name="chat" className="h-4 w-4" /> Rather text it?</a>
                <button type="submit" className="bg-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink">Send request <Icon name="arrow" className="h-4 w-4" /></button>
              </div>
            </form>
          )}
        </div>
        {sel === "coi" && !done && (
          <ol className="mt-6 grid grid-cols-4 gap-2 text-center">
            {["Request", "Process", "Issue", "Deliver"].map((x, i) => (
              <li key={x} className="rounded-xl border border-gold/15 py-3">
                <p className="font-mono text-[0.6rem] text-gold">0{i + 1}</p>
                <p className="mt-1 text-xs text-ivory/80">{x}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

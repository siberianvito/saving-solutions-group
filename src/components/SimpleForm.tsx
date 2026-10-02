"use client";

import { useState } from "react";
import Icon from "./Icon";

type F = { id: string; label: string; type?: "text" | "email" | "tel" | "textarea" | "select"; options?: string[]; full?: boolean; required?: boolean };

/** Generic lead form (front-end; POSTs to NEXT_PUBLIC_INTAKE_WEBHOOK when configured). */
export default function SimpleForm({ fields, cta, kind, success }: { fields: F[]; cta: string; kind: string; success: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const hook = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK;
    try {
      if (hook) await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, ...data, createdAt: new Date().toISOString() }) });
      else await new Promise((r) => setTimeout(r, 800));
    } catch {}
    setBusy(false);
    setSent(true);
  };

  if (sent)
    return (
      <div className="py-12 text-center" style={{ animation: "fadeUp .6s both" }}>
        <span className="bg-gold mx-auto grid h-14 w-14 place-items-center rounded-full text-ink"><Icon name="check" className="h-7 w-7" stroke={2} /></span>
        <p className="mt-6 font-display text-4xl">Thank you.</p>
        <p className="mt-3 text-mist">{success}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <label key={f.id} className={`block ${f.full || f.type === "textarea" ? "sm:col-span-2" : ""}`}>
          <span className="mb-2 block text-[0.82rem] text-ivory/80">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea name={f.id} rows={4} required={f.required} className="field resize-none" />
          ) : f.type === "select" ? (
            <select name={f.id} required={f.required} className="field" defaultValue="">
              <option value="" disabled>Select…</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input name={f.id} type={f.type ?? "text"} required={f.required} className="field" />
          )}
        </label>
      ))}
      <div className="flex justify-end sm:col-span-2">
        <button disabled={busy} className="bg-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink disabled:opacity-50">
          {busy ? "Sending…" : cta} <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

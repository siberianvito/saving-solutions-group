"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { lookupFolio, suggestAddresses, type AddressSuggestion, type PropertyRecord } from "@/lib/property";

type Status = "idle" | "loading" | "found" | "verified" | "none" | "error";

/**
 * Live property lookup (Miami-Dade public records + FEMA flood zone).
 * Type an address → pick the match → see the real record → confirm.
 */
export default function PropertyLookup({
  initial = "",
  onVerified,
  onManual,
  onAddressChange,
  compact = false,
}: {
  initial?: string;
  onVerified?: (rec: PropertyRecord) => void;
  onManual?: () => void;
  onAddressChange?: (address: string) => void;
  compact?: boolean;
}) {
  const [q, setQ] = useState(initial);
  const [sugs, setSugs] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [rec, setRec] = useState<PropertyRecord | null>(null);
  const [step, setStep] = useState(0);
  const seq = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  // Debounced live suggestions
  useEffect(() => {
    const term = q.trim();
    if (term.length < 5 || !/^\d/.test(term) || status === "found" || status === "verified") return;
    const id = ++seq.current;
    const t = window.setTimeout(async () => {
      setSearching(true);
      try {
        const list = await suggestAddresses(term);
        if (id !== seq.current) return;
        setSugs(list);
        setActive(0);
        setOpen(true);
      } catch {
        if (id === seq.current) setSugs([]);
      } finally {
        if (id === seq.current) setSearching(false);
      }
    }, 280);
    return () => window.clearTimeout(t);
  }, [q, status]);

  // Close the dropdown on outside click
  useEffect(() => {
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, []);

  const STEPS = ["Matching parcel record", "Reading building characteristics", "Checking FEMA flood zone"];

  const pick = async (s: AddressSuggestion) => {
    setOpen(false);
    const label = `${s.address}, ${s.city}, FL ${s.zip}`;
    setQ(label);
    onAddressChange?.(label);
    setStatus("loading");
    setStep(0);
    const ticks = [window.setTimeout(() => setStep(1), 350), window.setTimeout(() => setStep(2), 800)];
    try {
      const r = await lookupFolio(s.folio);
      ticks.forEach(clearTimeout);
      setStep(3);
      if (!r) { setStatus("none"); return; }
      setRec(r);
      setStatus("found");
    } catch {
      ticks.forEach(clearTimeout);
      setStatus("error");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (open && sugs[active]) pick(sugs[active]);
    else if (q.trim().length >= 5) {
      // No dropdown yet: search, then take the best match
      setSearching(true);
      suggestAddresses(q.trim())
        .then((l) => (l[0] ? pick(l[0]) : setStatus("none")))
        .catch(() => setStatus("error"))
        .finally(() => setSearching(false));
    }
  };

  const reset = () => { setStatus("idle"); setRec(null); setSugs([]); };

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <div ref={box} className="relative flex-1">
          <label className="sr-only" htmlFor="ssg-addr">Property address</label>
          <Icon name="pin" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
          <input
            id="ssg-addr"
            value={q}
            autoComplete="off"
            onChange={(e) => { setQ(e.target.value); onAddressChange?.(e.target.value); if (status !== "idle") reset(); }}
            onFocus={() => sugs.length && setOpen(true)}
            onKeyDown={(e) => {
              if (!open || !sugs.length) return;
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(sugs.length - 1, a + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder="Start typing a Miami-Dade address"
            className="field !pl-11 !pr-10"
            role="combobox"
            aria-expanded={open}
            aria-controls="ssg-addr-list"
            aria-autocomplete="list"
          />
          {searching && <span className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 animate-pulse-dot rounded-full bg-gold" />}
          {open && (
            <ul id="ssg-addr-list" role="listbox" className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-gold/25 bg-[#07101e]/97 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl" data-lenis-prevent>
              {sugs.length === 0 ? (
                <li className="px-4 py-3 text-sm text-mist">No Miami-Dade match yet. Keep typing, or check the street name.</li>
              ) : (
                sugs.map((s, i) => (
                  <li key={s.folio} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(s)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left ${i === active ? "bg-gold/12" : ""}`}
                    >
                      <span>
                        <span className="block text-sm text-ivory">{s.address}</span>
                        <span className="block text-xs text-mist">{s.city === "Unincorporated County" ? "Miami-Dade" : s.city}, FL {s.zip}</span>
                      </span>
                      <span className="shrink-0 rounded-full border border-gold/25 px-2.5 py-1 text-[0.65rem] text-gold-light">{s.type}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <button className="bg-gold rounded-[14px] px-6 py-3.5 text-sm font-semibold text-ink" type="submit">Look it up</button>
      </form>

      <div className={compact ? "mt-5" : "mt-6 min-h-[300px]"}>
        {status === "idle" && !compact && (
          <div className="grid h-[300px] place-items-center rounded-2xl border border-dashed border-gold/15 text-center">
            <div>
              <Icon name="search" className="mx-auto h-10 w-10 text-gold/50" stroke={1} />
              <p className="mt-4 max-w-xs text-sm text-mist">Type a Miami-Dade address and pick it from the list. We&apos;ll pull the real public record in seconds.</p>
            </div>
          </div>
        )}

        {status === "loading" && (
          <ul className="space-y-3 pt-2">
            {STEPS.map((st, i) => (
              <li key={st} className={`flex items-center gap-3 text-sm transition-opacity ${i < step ? "opacity-100" : "opacity-35"}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full border ${i < step ? "border-gold bg-gold text-ink" : "border-gold/30"}`}>
                  {i < step ? <Icon name="check" className="h-3.5 w-3.5" stroke={2.2} /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />}
                </span>
                {st}
              </li>
            ))}
          </ul>
        )}

        {(status === "found" || status === "verified") && rec && (
          <div style={{ animation: "fadeUp .6s both" }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-mist">{status === "found" ? "Is this your property?" : "Verified"}</p>
              <p className="hud !normal-case !tracking-normal">Folio {rec.folio.replace(/^(\d{2})(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1-$2$3-$4-$5")}</p>
            </div>
            <p className="mt-1 font-display text-2xl text-ivory">{rec.address}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              {rec.fields.map(([k, v], i) => (
                <div key={k} className="rounded-xl border border-gold/12 bg-ink/50 px-3.5 py-2.5" style={{ animation: `fadeUp .5s ${i * 0.05}s both` }}>
                  <dt className="hud !text-[0.55rem]">{k}</dt>
                  <dd className="mt-1 text-sm font-medium text-gold-light">{v}</dd>
                </div>
              ))}
            </dl>
            {status === "found" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => { setStatus("verified"); onVerified?.(rec); }} className="bg-gold rounded-full px-5 py-2.5 text-xs font-semibold text-ink">Yes, that&apos;s my property</button>
                <button type="button" onClick={() => { reset(); onManual?.(); }} className="rounded-full border border-gold/30 px-5 py-2.5 text-xs text-ivory/80">Not quite</button>
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-sm text-gold-light"><Icon name="check" className="h-4 w-4" /> Verified. {rec.fields.length} answers you won&apos;t have to type.</p>
            )}
            <p className="hud mt-4 !normal-case !tracking-normal">Source: Miami-Dade Property Appraiser public records &amp; FEMA flood maps. Your advisor confirms everything before quoting.</p>
          </div>
        )}

        {(status === "none" || status === "error") && (
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-5" style={{ animation: "fadeUp .5s both" }}>
            <p className="text-sm text-ivory">
              {status === "none"
                ? "We couldn't find that address in Miami-Dade records. Outside Miami-Dade? No problem. Your advisor will confirm the details with you."
                : "The county records service didn't respond just now. Try again in a moment, or continue and your advisor will confirm the details."}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={reset} className="rounded-full border border-gold/30 px-4 py-2 text-xs text-ivory/80">Try again</button>
              {onManual && <button type="button" onClick={onManual} className="rounded-full border border-gold/30 px-4 py-2 text-xs text-gold-light">Continue without it</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

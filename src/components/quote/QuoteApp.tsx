"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { SITE } from "@/lib/data";
import { mockLookup } from "@/lib/property";
import { COVERAGES, INDUSTRIES, LIFE_BASICS, PATHS, QUESTIONS, WATER_QS, type Path, type Q } from "@/lib/questions";
import { newRef, submitIntake, type IntakeRecord } from "@/lib/intake";

type StepId = "path" | "coverage" | "contact" | "property" | "details" | "current" | "review";
const STEP_LABEL: Record<StepId, string> = {
  path: "Start", coverage: "Coverage", contact: "About you", property: "Property", details: "Details", current: "Current policy", review: "Review",
};
const stepsFor = (p: Path | null): StepId[] =>
  p === "life" ? ["path", "coverage", "contact", "details", "review"]
  : p === "water" ? ["path", "contact", "property", "details", "review"]
  : ["path", "coverage", "contact", "property", "details", "current", "review"];

type State = {
  step: number;
  path: Path | null;
  coverages: string[];
  contact: { name: string; phone: string; email: string; preferred: "call" | "text" | "email" };
  business: { name: string; industry: string; years: string };
  address: string;
  property: { status: "none" | "found" | "verified" | "manual"; data?: Record<string, string> };
  answers: Record<string, Record<string, string>>;
  current: { carrier: string; premium: string; effectiveDate: string };
  docs: { name: string; size: number; type: string }[];
  consent: boolean;
  ref: string;
  submitted: boolean;
};

const blank = (): State => ({
  step: 0,
  path: null,
  coverages: [],
  contact: { name: "", phone: "", email: "", preferred: "text" },
  business: { name: "", industry: "", years: "" },
  address: "",
  property: { status: "none" },
  answers: {},
  current: { carrier: "", premium: "", effectiveDate: "" },
  docs: [],
  consent: false,
  ref: "",
  submitted: false,
});

const KEY = "ssg-quote-v1";

/* ── Small field primitives ───────────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.82rem] text-ivory/80">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-mist/70">{hint}</span>}
    </label>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-2 text-sm transition-all ${
            value === o ? "border-gold bg-gold/15 text-gold-light" : "border-white/12 text-ivory/70 hover:border-gold/40"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Question({ q, value, onChange }: { q: Q; value: string; onChange: (v: string) => void }) {
  if (q.type === "yesno" || (q.type === "select" && (q.options?.length ?? 0) <= 4))
    return <Field label={q.label} hint={q.help}><Chips options={q.options ?? []} value={value} onChange={onChange} /></Field>;
  if (q.type === "select")
    return (
      <Field label={q.label} hint={q.help}>
        <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {q.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
    );
  return (
    <Field label={q.label} hint={q.help}>
      <div className="relative">
        {q.type === "currency" && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold">$</span>}
        <input
          className={`field ${q.type === "currency" ? "!pl-8" : ""}`}
          type={q.type === "date" ? "date" : "text"}
          inputMode={q.type === "number" || q.type === "currency" ? "numeric" : undefined}
          placeholder={q.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </Field>
  );
}

/* ── The application ──────────────────────────────────────────── */
export default function QuoteApp() {
  const [s, setS] = useState<State>(blank);
  const [resume, setResume] = useState<State | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lookup, setLookup] = useState(false);
  const [result, setResult] = useState<{ simulated: boolean } | null>(null);
  const hydrated = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [uploadMode, setUploadMode] = useState(false);

  // Hydrate: query-string entry wins; otherwise offer to resume a saved draft
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let stored: State | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) stored = JSON.parse(raw) as State;
    } catch {}
    const type = params.get("type") as Path | null;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL + localStorage (client-only APIs) */
    setUploadMode(params.get("upload") === "1");
    if (type && PATHS.some((p) => p.id === type)) {
      const next = blank();
      next.path = type;
      const cov = params.get("coverage");
      if (cov) next.coverages = [cov];
      next.address = params.get("address") ?? "";
      next.business.industry = params.get("industry") ?? "";
      next.step = cov || type === "water" ? (type === "water" ? 1 : 2) : 1;
      setS(next);
    } else if (params.get("address")) {
      setS({ ...blank(), address: params.get("address") ?? "" });
    } else if (stored && !stored.submitted && (stored.step > 0 || stored.path)) {
      setResume(stored);
    }
    setS((p) => (p.ref ? p : { ...p, ref: newRef() }));
    /* eslint-enable react-hooks/set-state-in-effect */
    hydrated.current = true;
  }, []);

  // Autosave every change (save & resume)
  useEffect(() => {
    if (!hydrated.current || s.submitted || (!s.path && s.step === 0 && !s.docs.length)) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- flash the "Saved" badge after persisting
      setSaved(true);
      const t = window.setTimeout(() => setSaved(false), 1400);
      return () => window.clearTimeout(t);
    } catch {}
  }, [s]);

  const steps = stepsFor(s.path);
  const id = steps[Math.min(s.step, steps.length - 1)];
  const pct = Math.round((s.step / (steps.length - 1)) * 100);

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const ans = (group: string, qid: string, v: string) =>
    setS((p) => ({ ...p, answers: { ...p.answers, [group]: { ...(p.answers[group] ?? {}), [qid]: v } } }));

  const go = (d: number) => {
    setS((p) => ({ ...p, step: Math.max(0, Math.min(stepsFor(p.path).length - 1, p.step + d)) }));
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const canNext = (() => {
    if (id === "path") return !!s.path;
    if (id === "coverage") return s.coverages.length > 0;
    if (id === "contact") return s.contact.name.trim().length > 1 && (s.contact.phone.trim().length >= 7 || s.contact.email.includes("@"));
    if (id === "property") return s.property.status === "verified" || s.property.status === "manual";
    if (id === "review") return s.consent;
    return true;
  })();

  const runLookup = () => {
    if (!s.address.trim()) return;
    setLookup(true);
    window.setTimeout(() => {
      const rec = mockLookup(s.address);
      setS((p) => ({ ...p, address: rec.address, property: { status: "found", data: Object.fromEntries(rec.fields) } }));
      setLookup(false);
    }, 1500);
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).map((f) => ({ name: f.name, size: f.size, type: f.type }));
    setS((p) => ({ ...p, docs: [...p.docs, ...list] }));
  };

  const submit = async () => {
    setBusy(true);
    const utm: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((v, k) => { if (k.startsWith("utm_")) utm[k] = v; });
    const rec: IntakeRecord = {
      ref: s.ref,
      channel: "website",
      path: s.path ?? "personal",
      coverages: s.coverages,
      contact: s.contact,
      business: s.path === "commercial" ? s.business : undefined,
      property: s.address ? { address: s.address, verified: s.property.status === "verified", data: s.property.data } : undefined,
      answers: s.answers,
      current: s.current,
      documents: s.docs,
      consent: { sms: s.consent, at: new Date().toISOString() },
      source: { landing: typeof document !== "undefined" ? document.referrer : "", utm },
      createdAt: new Date().toISOString(),
    };
    const r = await submitIntake(rec);
    setBusy(false);
    setResult({ simulated: r.simulated });
    setS((p) => ({ ...p, submitted: true }));
    try { localStorage.removeItem(KEY); } catch {}
  };

  const smsResume = `${SITE.sms}?&body=${encodeURIComponent(`Hi! Continuing my Saving Solutions quote, ref ${s.ref}.`)}`;

  /* ── Success ── */
  if (s.submitted && result) {
    return (
      <div ref={topRef} className="glass-deep gold-frame mx-auto max-w-2xl rounded-[28px] p-8 text-center md:p-12" style={{ animation: "fadeUp .7s both" }}>
        <span className="bg-gold mx-auto grid h-16 w-16 place-items-center rounded-full text-ink"><Icon name="check" className="h-8 w-8" stroke={2} /></span>
        <h2 className="mt-8 font-display text-5xl font-light">You&apos;re in good hands.</h2>
        <p className="mt-4 text-ivory/70">Reference <span className="font-mono text-gold-light">{s.ref}</span>. An advisor is reviewing your file and will reach you by {s.contact.preferred}.</p>
        <ol className="mx-auto mt-10 max-w-md space-y-4 text-left">
          {["We verify your property and read any documents you uploaded", "We take one clean submission to the right markets", "Your advisor presents side-by-side options", "You sign electronically, and we bind and deliver documents"].map((t, i) => (
            <li key={t} className="flex gap-4"><span className="font-mono text-sm text-gold">0{i + 1}</span><span className="text-sm text-ivory/80">{t}</span></li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={smsResume} className="bg-gold flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-ink"><Icon name="chat" className="h-4 w-4" /> Text us now</a>
          <Link href="/" className="rounded-full border border-gold/40 px-6 py-3 text-sm text-gold-light">Back home</Link>
        </div>
        {result.simulated && <p className="hud mt-8 !normal-case !tracking-normal">Preview mode: connect NEXT_PUBLIC_INTAKE_WEBHOOK to deliver submissions to the CRM.</p>}
      </div>
    );
  }

  const groups = s.path === "life" ? ["Life basics", ...s.coverages] : s.path === "water" ? ["Water analysis"] : s.coverages;

  return (
    <div ref={topRef} className="grid scroll-mt-28 gap-8 lg:grid-cols-12">
      {/* ── Main column ── */}
      <div className="lg:col-span-8">
        {resume && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4" style={{ animation: "fadeUp .5s both" }}>
            <p className="text-sm"><span className="text-gold-light">Welcome back.</span> Your application ({resume.ref}) is saved.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setS(resume); setResume(null); }} className="bg-gold rounded-full px-4 py-2 text-xs font-semibold text-ink">Resume</button>
              <button type="button" onClick={() => setResume(null)} className="rounded-full border border-gold/30 px-4 py-2 text-xs text-ivory/80">Start over</button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="hud">Step {s.step + 1} of {steps.length} · {STEP_LABEL[id]}</p>
            <p className={`hud flex items-center gap-1.5 transition-opacity ${saved ? "opacity-100" : "opacity-40"}`}><Icon name="check" className="h-3 w-3 text-gold" /> Saved</p>
          </div>
          <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${Math.max(4, pct)}%` }} />
          </div>
          <ol className="mt-3 hidden gap-1 md:flex">
            {steps.map((st, i) => (
              <li key={st} className={`flex-1 text-[0.65rem] tracking-wide ${i <= s.step ? "text-gold-light" : "text-mist/50"}`}>{STEP_LABEL[st]}</li>
            ))}
          </ol>
        </div>

        <div key={id} className="glass-deep rounded-[28px] p-6 md:p-10" style={{ animation: "fadeUp .55s both" }}>
          {id === "path" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">What are we protecting?</h2>
              <p className="mt-3 text-ivory/65">Choose one to start. You can add more later with your advisor.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {PATHS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setS((st) => ({ ...st, path: p.id, coverages: st.path === p.id ? st.coverages : [] }))}
                    className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                      s.path === p.id ? "border-gold bg-gold/10" : "border-white/10 hover:border-gold/40"
                    }`}
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${s.path === p.id ? "border-gold bg-gold text-ink" : "border-gold/30 text-gold"}`}>
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-2xl">{p.label}</span>
                      <span className="mt-1 block text-xs text-mist">{p.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className={`mt-6 rounded-2xl border border-dashed p-5 ${uploadMode ? "border-gold/60 bg-gold/[0.06]" : "border-gold/20"}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Icon name="upload" className="h-7 w-7 text-gold" />
                    <div>
                      <p className="font-medium">Fastest path: upload your current policy</p>
                      <p className="text-xs text-mist">Dec page, policy, or renewal notice. We read it so you don&apos;t have to retype it.</p>
                    </div>
                  </div>
                  <label className="cursor-pointer rounded-full border border-gold/40 px-4 py-2 text-xs text-gold-light hover:bg-gold/10">
                    Choose files
                    <input type="file" multiple accept=".pdf,image/*" className="sr-only" onChange={(e) => onFiles(e.target.files)} />
                  </label>
                </div>
                {s.docs.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.docs.map((d, i) => <li key={i} className="flex items-center gap-2 text-xs text-ivory/80"><Icon name="doc" className="h-3.5 w-3.5 text-gold" /> {d.name}</li>)}
                  </ul>
                )}
              </div>
            </>
          )}

          {id === "coverage" && s.path && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">What coverage do you need?</h2>
              <p className="mt-3 text-ivory/65">Select all that apply. We&apos;ll only ask the questions each one requires.</p>
              <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {COVERAGES[s.path].map((c) => {
                  const on = s.coverages.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("coverages", on ? s.coverages.filter((x) => x !== c) : [...s.coverages, c])}
                      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left text-sm transition-all ${on ? "border-gold bg-gold/10 text-gold-light" : "border-white/10 text-ivory/80 hover:border-gold/40"}`}
                    >
                      {c}
                      <span className={`grid h-5 w-5 place-items-center rounded-full border ${on ? "border-gold bg-gold text-ink" : "border-white/25"}`}>
                        {on && <Icon name="check" className="h-3 w-3" stroke={2.4} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {s.path === "personal" && s.coverages.includes("Homeowners") && (
                <p className="mt-5 rounded-xl bg-white/[0.04] px-4 py-3 text-xs text-mist">Home worth more than ~$1.5M to rebuild? Add <button type="button" className="text-gold-light underline" onClick={() => set("coverages", Array.from(new Set([...s.coverages, "High-Value Home"])))}>High-Value Home</button> for Private Client programs.</p>
              )}
            </>
          )}

          {id === "contact" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">{s.path === "commercial" ? "Tell us about the business." : "Nice to meet you."}</h2>
              <p className="mt-3 text-ivory/65">So your advisor knows who to call, and so you can finish by text.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {s.path === "commercial" && (
                  <>
                    <Field label="Business name"><input className="field" value={s.business.name} onChange={(e) => set("business", { ...s.business, name: e.target.value })} /></Field>
                    <Field label="What does the business do?">
                      <input className="field" list="industries" value={s.business.industry} onChange={(e) => set("business", { ...s.business, industry: e.target.value })} placeholder="Start typing…" />
                      <datalist id="industries">{INDUSTRIES.map((i) => <option key={i} value={i} />)}</datalist>
                    </Field>
                    <Field label="Years in business"><input className="field" inputMode="numeric" value={s.business.years} onChange={(e) => set("business", { ...s.business, years: e.target.value })} /></Field>
                  </>
                )}
                <Field label={s.path === "commercial" ? "Contact name" : "Full name"}><input className="field" autoComplete="name" value={s.contact.name} onChange={(e) => set("contact", { ...s.contact, name: e.target.value })} /></Field>
                <Field label="Mobile phone"><input className="field" type="tel" autoComplete="tel" value={s.contact.phone} onChange={(e) => set("contact", { ...s.contact, phone: e.target.value })} /></Field>
                <Field label="Email"><input className="field" type="email" autoComplete="email" value={s.contact.email} onChange={(e) => set("contact", { ...s.contact, email: e.target.value })} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Best way to reach you"><Chips options={["text", "call", "email"]} value={s.contact.preferred} onChange={(v) => set("contact", { ...s.contact, preferred: v as State["contact"]["preferred"] })} /></Field>
                </div>
              </div>
            </>
          )}

          {id === "property" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">Where is the property?</h2>
              <p className="mt-3 text-ivory/65">We&apos;ll look up the building so you only confirm, not retype.</p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <input className="field flex-1" autoComplete="street-address" placeholder="Street, city, ZIP" value={s.address} onChange={(e) => setS((p) => ({ ...p, address: e.target.value, property: { status: "none" } }))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runLookup())} />
                <button type="button" onClick={runLookup} className="bg-gold rounded-[14px] px-6 py-3.5 text-sm font-semibold text-ink">{lookup ? "Looking up…" : "Find my property"}</button>
              </div>
              {lookup && <p className="mt-6 flex items-center gap-3 text-sm text-mist"><span className="h-2 w-2 animate-pulse-dot rounded-full bg-gold" /> Matching parcel and building records…</p>}
              {(s.property.status === "found" || s.property.status === "verified") && s.property.data && (
                <div className="mt-6" style={{ animation: "fadeUp .5s both" }}>
                  <p className="text-sm text-mist">Is this your property?</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                    {Object.entries(s.property.data).map(([k, v]) => (
                      <div key={k} className="rounded-xl border border-gold/12 bg-ink/50 px-3.5 py-2.5"><dt className="hud !text-[0.55rem]">{k}</dt><dd className="mt-1 text-sm text-gold-light">{v}</dd></div>
                    ))}
                  </dl>
                  {s.property.status === "found" ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => set("property", { ...s.property, status: "verified" })} className="bg-gold rounded-full px-5 py-2.5 text-xs font-semibold text-ink">Yes, that&apos;s correct</button>
                      <button type="button" onClick={() => set("property", { status: "manual" })} className="rounded-full border border-gold/30 px-5 py-2.5 text-xs">Something&apos;s off, my advisor will fix it</button>
                    </div>
                  ) : (
                    <p className="mt-4 flex items-center gap-2 text-sm text-gold-light"><Icon name="check" className="h-4 w-4" /> Verified. That&apos;s {Object.keys(s.property.data).length} answers you won&apos;t have to type.</p>
                  )}
                </div>
              )}
              {s.property.status === "none" && !lookup && (
                <button type="button" onClick={() => set("property", { status: "manual" })} className="mt-5 text-xs text-mist underline underline-offset-4">Skip, I&apos;ll confirm details with my advisor</button>
              )}
              {s.property.status === "manual" && <p className="mt-5 text-sm text-mist">No problem. Your advisor will confirm the building details with you.</p>}
              <p className="hud mt-6 !normal-case !tracking-normal">Preview uses demo property data. Production connects to a licensed property-data provider.</p>
            </>
          )}

          {id === "details" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">Just a few specifics.</h2>
              <p className="mt-3 text-ivory/65">Only what underwriters need for the coverage you chose. Not sure? Skip it.</p>
              <div className="mt-8 space-y-10">
                {groups.map((g) => {
                  const qs = g === "Life basics" ? LIFE_BASICS : g === "Water analysis" ? WATER_QS : QUESTIONS[g] ?? [];
                  if (!qs.length) return null;
                  return (
                    <fieldset key={g}>
                      <legend className="eyebrow mb-5 flex items-center gap-3"><span className="h-px w-6 bg-gold" /> {g}</legend>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {qs.map((q) => (
                          <div key={q.id} className={q.type === "text" || q.type === "yesno" || (q.options?.length ?? 0) > 3 ? "sm:col-span-2" : ""}>
                            <Question q={q} value={s.answers[g]?.[q.id] ?? ""} onChange={(v) => ans(g, q.id, v)} />
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </>
          )}

          {id === "current" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">Your current coverage.</h2>
              <p className="mt-3 text-ivory/65">Optional, but it helps us beat it.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <Field label="Current carrier"><input className="field" value={s.current.carrier} onChange={(e) => set("current", { ...s.current, carrier: e.target.value })} placeholder="If any" /></Field>
                <Field label="Current annual premium"><input className="field" inputMode="numeric" value={s.current.premium} onChange={(e) => set("current", { ...s.current, premium: e.target.value })} placeholder="$" /></Field>
                <Field label="Desired effective date"><input className="field" type="date" value={s.current.effectiveDate} onChange={(e) => set("current", { ...s.current, effectiveDate: e.target.value })} /></Field>
              </div>
              <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gold/30 px-6 py-10 text-center transition-colors hover:border-gold/60 hover:bg-gold/[0.04]">
                <Icon name="upload" className="h-9 w-9 text-gold" stroke={1} />
                <span className="mt-4 font-display text-2xl">Upload your dec page, loss runs, or schedules</span>
                <span className="mt-1 text-xs text-mist">PDF or photo · attached to your file automatically</span>
                <input type="file" multiple accept=".pdf,image/*,.xlsx,.csv" className="sr-only" onChange={(e) => onFiles(e.target.files)} />
              </label>
              {s.docs.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {s.docs.map((d, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm">
                      <span className="flex items-center gap-2"><Icon name="doc" className="h-4 w-4 text-gold" /> {d.name}</span>
                      <button type="button" onClick={() => set("docs", s.docs.filter((_, k) => k !== i))} className="text-xs text-mist hover:text-gold-light">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {id === "review" && (
            <>
              <h2 className="font-display text-4xl font-light md:text-5xl">Look right?</h2>
              <p className="mt-3 text-ivory/65">Your advisor sees exactly this, so you never repeat yourself.</p>
              <dl className="mt-8 divide-y divide-white/5 rounded-2xl border border-gold/15">
                {[
                  ["Protecting", PATHS.find((p) => p.id === s.path)?.label ?? "-"],
                  ["Coverage", s.coverages.join(", ") || (s.path === "water" ? "Water savings analysis" : "-")],
                  ...(s.path === "commercial" ? [["Business", [s.business.name, s.business.industry].filter(Boolean).join(" · ") || "-"]] : []),
                  ["Contact", [s.contact.name, s.contact.phone, s.contact.email].filter(Boolean).join(" · ")],
                  ...(s.address ? [["Property", `${s.address}${s.property.status === "verified" ? " ✓ verified" : ""}`]] : []),
                  ["Answers", `${Object.values(s.answers).reduce((n, g) => n + Object.values(g).filter(Boolean).length, 0)} provided`],
                  ["Documents", s.docs.length ? s.docs.map((d) => d.name).join(", ") : "None yet"],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[160px_1fr]">
                    <dt className="text-sm text-mist">{k}</dt>
                    <dd className="text-sm text-ivory">{v}</dd>
                  </div>
                ))}
              </dl>
              <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-mist">
                <input type="checkbox" checked={s.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#c9a24a]" />
                <span>I agree that Saving Solutions Group may contact me by phone, text message, and email about my request, including reminders about incomplete applications. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of purchase.</span>
              </label>
            </>
          )}

          {/* Nav buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6">
            <button type="button" onClick={() => go(-1)} className={`text-sm text-mist hover:text-ivory ${s.step === 0 ? "invisible" : ""}`}>← Back</button>
            {id === "review" ? (
              <button type="button" disabled={!canNext || busy} onClick={submit} className="bg-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink disabled:opacity-40">
                {busy ? "Sending to your advisor…" : "Submit my request"} <Icon name="arrow" className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" disabled={!canNext} onClick={() => go(1)} className="bg-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink disabled:opacity-40">
                Continue <Icon name="arrow" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Advisor rail ── */}
      <aside className="space-y-4 lg:col-span-4">
        <div className="glass-deep gold-frame sticky top-28 rounded-[28px] p-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/media/elizabeth.jpg")} alt="" className="h-14 w-14 rounded-full object-cover object-top ring-1 ring-gold/50" />
            <div>
              <p className="font-display text-xl">A human, when you need one</p>
              <p className="hud flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" /> Advisors available</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-mist">Prefer to talk it through? Call or text. Mention reference <span className="font-mono text-gold-light">{s.ref}</span> and we&apos;ll pick up exactly where you are.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 rounded-full border border-gold/40 py-2.5 text-xs text-gold-light hover:bg-gold/10"><Icon name="phone" className="h-3.5 w-3.5" /> Call</a>
            <a href={smsResume} className="flex items-center justify-center gap-2 rounded-full border border-gold/40 py-2.5 text-xs text-gold-light hover:bg-gold/10"><Icon name="chat" className="h-3.5 w-3.5" /> Continue by text</a>
          </div>
          <div className="gold-rule my-6" />
          <p className="eyebrow">What we have so far</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Path", PATHS.find((p) => p.id === s.path)?.label],
              ["Coverage", s.coverages.length ? `${s.coverages.length} selected` : undefined],
              ["Contact", s.contact.name || undefined],
              ["Property", s.property.status === "verified" ? "Verified" : s.address ? "Pending" : undefined],
              ["Documents", s.docs.length ? `${s.docs.length} uploaded` : undefined],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center justify-between">
                <span className="text-mist">{k}</span>
                <span className={v ? "text-gold-light" : "text-mist/40"}>{v ?? "-"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-mist/70">Step away anytime. Your progress saves automatically on this device, and we&apos;ll text a reminder if anything is missing.</p>
        </div>
      </aside>
    </div>
  );
}

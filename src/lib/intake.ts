/**
 * API-first intake. Every channel (website, text, phone, portal) produces the
 * same normalized record, so it can be sent once to the CRM / AMS / rater /
 * e-signature stack without re-asking the client.
 *
 * Delivery: GoHighLevel "Inbound Webhook" workflow trigger
 * (NEXT_PUBLIC_INTAKE_WEBHOOK, set in .github/workflows/deploy.yml).
 * The payload is FLAT with GHL-style keys (first_name, phone, address1, …) so
 * each one maps 1:1 to a contact field in the workflow's Create/Update Contact action.
 */
import type { Path } from "./questions";

export type IntakeRecord = {
  ref: string;
  channel: "website" | "text" | "phone";
  path: Path;
  coverages: string[];
  contact: { name: string; phone: string; email: string; preferred: "call" | "text" | "email" };
  business?: { name: string; industry: string; years: string };
  property?: { address: string; verified: boolean; data?: Record<string, string>; parcel?: string };
  answers: Record<string, Record<string, string>>;
  current: { carrier: string; premium: string; effectiveDate: string };
  documents: { name: string; size: number; type: string }[];
  consent: { sms: boolean; at: string };
  source: { landing: string; utm: Record<string, string> };
  createdAt: string;
};

export const newRef = () =>
  "SSG-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();

const PATH_LABEL: Record<Path, string> = {
  commercial: "Business insurance",
  personal: "Home, auto & assets",
  life: "Life & financial",
  water: "Water savings analysis",
};

export function splitName(full: string) {
  const parts = full.trim().replace(/\s+/g, " ").split(" ");
  return { first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") };
}

/** "11826 SW 97 ST, Miami-Dade, FL 33186" → street / city / state / zip */
export function splitAddress(addr: string) {
  const parts = addr.split(",").map((p) => p.trim()).filter(Boolean);
  const out = { address1: parts[0] ?? "", city: "", state: "", postal_code: "" };
  for (const p of parts.slice(1)) {
    const m = p.match(/^(FL|Florida)\b\s*(\d{5})?/i);
    if (m) {
      out.state = "FL";
      if (m[2]) out.postal_code = m[2];
    } else if (/^\d{5}$/.test(p)) out.postal_code = p;
    else if (!out.city) out.city = p;
  }
  if (out.city === "Miami-Dade" || out.city === "Broward") out.city = ""; // county, not a city
  return out;
}

/** Flat, GHL-friendly lead payload. */
export function toLeadPayload(rec: IntakeRecord): Record<string, string> {
  const d = rec.property?.data ?? {};
  const answers = Object.entries(rec.answers)
    .flatMap(([group, qs]) => Object.entries(qs).filter(([, v]) => v).map(([k, v]) => `${group} · ${k}: ${v}`))
    .join("\n");
  const flat: Record<string, string> = {
    ...splitName(rec.contact.name),
    full_name: rec.contact.name.trim(),
    phone: rec.contact.phone.trim(),
    email: rec.contact.email.trim(),
    ...(rec.property?.address ? splitAddress(rec.property.address) : { address1: "", city: "", state: "", postal_code: "" }),
    country: "US",
    company_name: rec.business?.name ?? "",
    source: "Website quote · savingsolutionsinsurance.com",
    quote_ref: rec.ref,
    insurance_type: PATH_LABEL[rec.path],
    coverages: rec.coverages.join(", "),
    preferred_contact: rec.contact.preferred,
    industry: rec.business?.industry ?? "",
    years_in_business: rec.business?.years ?? "",
    property_address: rec.property?.address ?? "",
    property_verified: rec.property?.verified ? "yes" : "no",
    property_type: d["Property type"] ?? "",
    year_built: d["Year built"] ?? "",
    living_area: d["Living area"] ?? "",
    bed_bath: d["Bed / bath"] ?? "",
    property_value: d["Market value"] ?? d["Assessed value"] ?? "",
    flood_zone: d["Flood zone"] ?? "",
    parcel_id: rec.property?.parcel ?? "",
    current_carrier: rec.current.carrier,
    current_premium: rec.current.premium,
    effective_date: rec.current.effectiveDate,
    documents: rec.documents.map((x) => x.name).join(", "),
    answers,
    sms_consent: rec.consent.sms ? "yes" : "no",
    consent_at: rec.consent.at,
    submitted_at: rec.createdAt,
    ...Object.fromEntries(Object.entries(rec.source.utm).map(([k, v]) => [k, v])),
  };
  flat.lead_summary = leadSummary(rec, flat);
  return flat;
}

/** Human-readable note for the advisor (map to a GHL "Add Note" action). */
function leadSummary(rec: IntakeRecord, f: Record<string, string>): string {
  const line = (label: string, v?: string) => (v && v.trim() ? `${label}: ${v.trim()}` : null);
  const block = (title: string, rows: (string | null)[]) => {
    const r = rows.filter(Boolean);
    return r.length ? [`— ${title} —`, ...r].join("\n") : null;
  };
  const answers = Object.entries(rec.answers).flatMap(([group, qs]) =>
    Object.entries(qs).filter(([, v]) => v).map(([k, v]) => `${group} · ${k.replace(/([A-Z])/g, " $1").toLowerCase()}: ${v}`)
  );
  return [
    `🛡️ NEW WEBSITE QUOTE REQUEST · ${rec.ref}`,
    block("Request", [
      line("Insurance", f.insurance_type),
      line("Coverage", f.coverages),
      line("Best contact", f.preferred_contact),
      line("Desired effective date", f.effective_date),
    ]),
    block("Contact", [line("Name", f.full_name), line("Phone", f.phone), line("Email", f.email)]),
    rec.business ? block("Business", [line("Name", f.company_name), line("Industry", f.industry), line("Years in business", f.years_in_business)]) : null,
    rec.property
      ? block(`Property${rec.property.verified ? " (verified · public records)" : " (not verified)"}`, [
          line("Address", f.property_address),
          ...Object.entries(rec.property.data ?? {}).map(([k, v]) => line(k, v)),
          line("Parcel", f.parcel_id),
        ])
      : null,
    block("Current coverage", [line("Carrier", f.current_carrier), line("Annual premium", f.current_premium ? `$${f.current_premium.replace(/^\$/, "")}` : "")]),
    answers.length ? block("Underwriting answers", answers) : null,
    f.documents ? block("Documents mentioned", [f.documents]) : null,
    block("Consent & source", [line("SMS consent", f.sms_consent), line("Source", f.source), line("Submitted", new Date(rec.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET")]),
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** POST any flat lead to the GHL webhook. */
export async function postLead(payload: Record<string, string>): Promise<{ ok: boolean; simulated: boolean }> {
  const hook = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK;
  if (!hook) {
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, simulated: true };
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) return { ok: true, simulated: false };
    } catch {
      /* retry once */
    }
  }
  return { ok: false, simulated: false };
}

export function submitIntake(rec: IntakeRecord) {
  return postLead(toLeadPayload(rec));
}

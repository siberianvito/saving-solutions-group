/**
 * API-first intake. Every channel (website, text, phone, portal) produces the
 * same normalized record, so it can be sent once to the CRM / AMS / rater /
 * e-signature stack without re-asking the client.
 *
 * Wire-up: set NEXT_PUBLIC_INTAKE_WEBHOOK (e.g. a GoHighLevel inbound webhook,
 * Zapier/Make hook, or the agency's API gateway) at build time.
 */
import type { Path } from "./questions";

export type IntakeRecord = {
  ref: string;
  channel: "website" | "text" | "phone";
  path: Path;
  coverages: string[];
  contact: { name: string; phone: string; email: string; preferred: "call" | "text" | "email" };
  business?: { name: string; industry: string; years: string };
  property?: { address: string; verified: boolean; data?: Record<string, string> };
  answers: Record<string, Record<string, string>>;
  current: { carrier: string; premium: string; effectiveDate: string };
  documents: { name: string; size: number; type: string }[];
  consent: { sms: boolean; at: string };
  source: { landing: string; utm: Record<string, string> };
  createdAt: string;
};

export const newRef = () =>
  "SSG-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();

export async function submitIntake(rec: IntakeRecord): Promise<{ ok: boolean; simulated: boolean }> {
  const hook = process.env.NEXT_PUBLIC_INTAKE_WEBHOOK;
  if (!hook) {
    await new Promise((r) => setTimeout(r, 1100));
    return { ok: true, simulated: true };
  }
  try {
    const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rec) });
    return { ok: res.ok, simulated: false };
  } catch {
    return { ok: false, simulated: false };
  }
}

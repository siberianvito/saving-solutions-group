# Digital Quoting: status

**2026-10-29 (update):** /quote runs QuoteApp again, and the property lookup is LIVE with real
Miami-Dade Property Appraiser records + FEMA flood zones (`src/lib/property.ts`,
`src/components/PropertyLookup.tsx`). No server or API key: both services allow browser calls.
The GHL form lives only on /contact.

⚠️ Quote submissions need `NEXT_PUBLIC_INTAKE_WEBHOOK` (a GHL inbound-webhook URL) set in the
deploy workflow, or they show the preview message and go nowhere.

---

# (Earlier) Future version: Digital Quoting (parked 2026-10-29)

VITO's call: v1 captures leads with the GoHighLevel form (`src/components/GHLForm.tsx`,
skinned by `assets/ghl-form-custom.css`). The full digital-quoting app is kept, working and
un-routed, for v2.

## What's preserved
- `src/components/quote/QuoteApp.tsx`: the smart application
  - path picker (business / personal / life / water) → coverage multi-select
  - conditional questions per coverage (`src/lib/questions.ts`)
  - property intelligence lookup + "Is this your property?" verify (`src/lib/property.ts`, demo data)
  - policy / dec-page upload, current carrier & premium
  - save & resume (localStorage), "continue by text" with reference ID, advisor rail
  - review + SMS consent → normalized `IntakeRecord` POST (`src/lib/intake.ts`, `NEXT_PUBLIC_INTAKE_WEBHOOK`)
- Hero launcher tabs already pass `?type=&coverage=&address=` to /quote. QuoteApp reads them.

## To switch it back on
In `src/app/quote/page.tsx`, render `<QuoteApp />` (client component, no Suspense needed) in place of
the GHL form column. Wire `NEXT_PUBLIC_INTAKE_WEBHOOK` to a GHL inbound webhook so records still land in the CRM.

## Needed before launch
- ~~Licensed property-data provider~~: done for Miami-Dade (public PA records). Broward / Palm Beach still to add
- Server-side file storage for uploads (currently metadata only)
- Real SMS continuation (GHL conversations) + reminder workflows (1h / 24h / 3d)
- Carrier / market-access integration (First Connect, direct carriers), e-signature, COI automation

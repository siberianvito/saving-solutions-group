/**
 * Property intelligence: live public records, called straight from the browser
 * (both services allow cross-origin requests, so no server or API key is needed).
 *
 *  • Miami-Dade Property Appraiser — "Property Point View" (ArcGIS Online, MDPublisher)
 *    address search + building characteristics by folio.
 *  • FEMA National Flood Hazard Layer — flood zone at the parcel's coordinates.
 *
 * Coverage today: Miami-Dade County. Other counties return no match and the
 * advisor confirms details by hand. Add Broward / Palm Beach sources here later.
 */

const PA = "https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/PaGISView_gdb/FeatureServer/0/query";
const FEMA = "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query";

export type AddressSuggestion = { folio: string; address: string; unit: string | null; city: string; zip: string; type: string };

export type PropertyRecord = {
  folio: string;
  address: string;
  type: string;
  fields: [string, string][];
  floodZone: string | null;
  yearBuilt: number | null;
  source: "miami-dade";
};

/* ── Address normalisation → Property Appraiser format ("11826 SW 97 ST") ── */
const DIRS: Record<string, string> = {
  NORTHWEST: "NW", NORTHEAST: "NE", SOUTHWEST: "SW", SOUTHEAST: "SE",
  NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W",
};
const SUFFIX: Record<string, string> = {
  STREET: "ST", AVENUE: "AVE", AV: "AVE", ROAD: "RD", DRIVE: "DR", COURT: "CT", PLACE: "PL", TERRACE: "TER", TERR: "TER",
  LANE: "LN", BOULEVARD: "BLVD", CIRCLE: "CIR", HIGHWAY: "HWY", PARKWAY: "PKWY", TRAIL: "TRL", CAUSEWAY: "CSWY",
};
const UNIT_WORDS = new Set(["APT", "APARTMENT", "UNIT", "STE", "SUITE", "#", "PH"]);

export function normalizeAddress(input: string): string[] {
  let s = input.toUpperCase().split(",")[0].replace(/\./g, "").replace(/#\s*/g, "# ").replace(/\s+/g, " ").trim();
  // drop trailing state / zip if typed without commas
  s = s.replace(/\b(FL|FLORIDA)\b.*$/, "").replace(/\b\d{5}(-\d{4})?\s*$/, "").trim();
  const out: string[] = [];
  const toks = s.split(" ");
  for (let i = 0; i < toks.length; i++) {
    let t = toks[i];
    if (UNIT_WORDS.has(t)) continue; // unit marker: keep the unit number itself
    t = t.replace(/^(\d+)(ST|ND|RD|TH)$/, "$1");
    if (i > 0 && DIRS[t] && toks.length > 2) t = DIRS[t];
    if (SUFFIX[t]) t = SUFFIX[t];
    out.push(t);
  }
  return out;
}

const esc = (s: string) => s.replace(/'/g, "''");

async function query(url: string, params: Record<string, string>, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(`${url}?${new URLSearchParams({ f: "json", ...params })}`, { signal: ctrl.signal });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message ?? "query failed");
    return json as { features?: { attributes: Record<string, unknown>; geometry?: { x: number; y: number } }[] };
  } finally {
    clearTimeout(t);
  }
}

/** Live address suggestions. Progressively loosens the match until something hits. */
export async function suggestAddresses(input: string): Promise<AddressSuggestion[]> {
  const toks = normalizeAddress(input);
  if (toks.length < 2 || !/^\d/.test(toks[0])) return [];
  for (let n = toks.length; n >= 2; n--) {
    const prefix = esc(toks.slice(0, n).join(" "));
    const json = await query(PA, {
      where: `TRUE_SITE_ADDR LIKE '${prefix}%'`,
      outFields: "FOLIO,TRUE_SITE_ADDR,TRUE_SITE_UNIT,TRUE_SITE_CITY,TRUE_SITE_ZIP_CODE,DOR_DESC",
      returnGeometry: "false",
      orderByFields: "TRUE_SITE_ADDR",
      resultRecordCount: "8",
    });
    const rows = (json.features ?? [])
      .map((f) => f.attributes)
      .filter((a) => !String(a.DOR_DESC ?? "").includes("REFERENCE FOLIO"));
    if (rows.length) {
      return rows.map((a) => ({
        folio: String(a.FOLIO),
        address: String(a.TRUE_SITE_ADDR),
        unit: (a.TRUE_SITE_UNIT as string) ?? null,
        city: titleCase(String(a.TRUE_SITE_CITY ?? "")),
        zip: String(a.TRUE_SITE_ZIP_CODE ?? "").slice(0, 5),
        type: friendlyType(String(a.DOR_DESC ?? "")),
      }));
    }
  }
  return [];
}

/** Full record for one folio, plus FEMA flood zone. */
export async function lookupFolio(folio: string): Promise<PropertyRecord | null> {
  const json = await query(PA, {
    where: `FOLIO='${esc(folio)}'`,
    outFields: "*",
    returnGeometry: "true",
    outSR: "4326",
  });
  const f = json.features?.[0];
  if (!f) return null;
  const a = f.attributes;
  const num = (k: string) => (typeof a[k] === "number" && (a[k] as number) > 0 ? (a[k] as number) : null);

  let flood: string | null = null;
  if (f.geometry) {
    try {
      const fz = await query(FEMA, {
        geometry: JSON.stringify({ x: f.geometry.x, y: f.geometry.y, spatialReference: { wkid: 4326 } }),
        geometryType: "esriGeometryPoint",
        spatialRel: "esriSpatialRelIntersects",
        outFields: "FLD_ZONE,ZONE_SUBTY",
        returnGeometry: "false",
      }, 8000);
      const z = fz.features?.[0]?.attributes;
      if (z?.FLD_ZONE) flood = z.ZONE_SUBTY && String(z.ZONE_SUBTY).includes("0.2 PCT") ? `${z.FLD_ZONE} (shaded)` : String(z.FLD_ZONE);
    } catch {
      flood = null; // FEMA is occasionally slow — the advisor confirms
    }
  }

  const type = friendlyType(String(a.DOR_DESC ?? ""));
  const beds = num("BEDROOM_COUNT");
  const baths = (num("BATHROOM_COUNT") ?? 0) + (num("HALF_BATHROOM_COUNT") ?? 0) * 0.5;
  const units = num("UNIT_COUNT");
  const sale = typeof a.DOS_1 === "string" && /^\d{8}$/.test(a.DOS_1) ? `${a.DOS_1.slice(4, 6)}/${a.DOS_1.slice(0, 4)}` : null;

  const fields: [string, string][] = [
    ["Property type", type],
    ["Year built", num("YEAR_BUILT") ? String(num("YEAR_BUILT")) : "Not on record"],
    ["Living area", num("BUILDING_HEATED_AREA") ? `${num("BUILDING_HEATED_AREA")!.toLocaleString()} sq ft` : "Not on record"],
    ["Total building", num("BUILDING_ACTUAL_AREA") ? `${num("BUILDING_ACTUAL_AREA")!.toLocaleString()} sq ft` : "Not on record"],
  ];
  if (beds || baths) fields.push(["Bed / bath", `${beds ?? "–"} / ${baths || "–"}`]);
  if (num("FLOOR_COUNT")) fields.push(["Stories", String(num("FLOOR_COUNT"))]);
  if (units && units > 1) fields.push(["Units", units.toLocaleString()]);
  if (num("LOT_SIZE")) fields.push(["Lot size", `${num("LOT_SIZE")!.toLocaleString()} sq ft`]);
  if (num("ASSESSED_VAL_CUR")) fields.push(["Assessed value", `$${num("ASSESSED_VAL_CUR")!.toLocaleString()}`]);
  fields.push(["Flood zone", flood ?? "Advisor to confirm"]);
  if (sale) fields.push(["Last sale", sale]);

  const city = titleCase(String(a.TRUE_SITE_CITY ?? ""));
  return {
    folio,
    address: `${a.TRUE_SITE_ADDR}, ${city === "Unincorporated County" ? "Miami-Dade" : city}, FL ${String(a.TRUE_SITE_ZIP_CODE ?? "").slice(0, 5)}`,
    type,
    fields,
    floodZone: flood,
    yearBuilt: num("YEAR_BUILT"),
    source: "miami-dade",
  };
}

/* Property Appraiser land-use code ("USE : SUB-TYPE") → plain English.
   The sub-type after the colon is the most specific, so it is checked first. */
export function friendlyType(dor: string): string {
  const d = dor.toUpperCase();
  const [use = "", sub = ""] = d.split(":").map((x) => x.trim());
  const any = (...k: string[]) => k.some((x) => d.includes(x));
  if (use.startsWith("VACANT") || sub === "VACANT LAND") return "Vacant land";
  if (sub.includes("TOWNHOUSE")) return "Townhome";
  if (sub.includes("CLUSTER HOME")) return "Cluster home";
  if (sub.includes("CONDOMINIUM - COMMERCIAL")) return "Commercial condo";
  if (use.includes("HOTEL") && sub.includes("CONDOMINIUM")) return "Condo-hotel unit";
  if (any("CONDOMINIUM")) return "Condominium";
  if (any("COOPERATIVE")) return "Co-op";
  if (any("2 LIVING UNITS", "DUPLEX")) return "Duplex";
  if (any("MULTIFAMILY")) return "Multifamily";
  if (any("SINGLE FAMILY")) return "Single-family home";
  if (any("MOBILE HOME")) return "Mobile home";
  if (any("COMMON AREA")) return "Common area";
  if (any("HOTEL", "MOTEL")) return "Hotel / motel";
  if (any("OFFICE")) return "Office building";
  if (any("STORE", "RETAIL", "SHOPPING")) return "Retail";
  if (any("WAREHOUSE", "MANUFACTURING", "INDUSTRIAL")) return "Industrial / warehouse";
  if (any("REFERENCE FOLIO")) return "Master parcel";
  const tail = (sub || use).split(" - ").pop() ?? dor;
  return titleCase(tail.trim()) || "Property";
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

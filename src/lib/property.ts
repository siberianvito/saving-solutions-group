/**
 * Property intelligence: live public records, called straight from the browser.
 * Every source below allows cross-origin requests — no server, no API key.
 *
 *  • Miami-Dade — Property Appraiser "Property Point View" (ArcGIS Online · MDPublisher)
 *  • Broward    — "Parcel Tax Roll Data with Property Attributes" (Broward County GIS · BCGIS)
 *  • Palm Beach — "Parcels and Property Details" (Palm Beach County GIS · PBCGOV_GIS)
 *  • FEMA       — National Flood Hazard Layer, flood zone at the parcel's coordinates
 *
 * Addresses are searched in all three counties at once; the user picks the match.
 */

export type County = "miami-dade" | "broward" | "palm-beach";

export const COUNTY_LABEL: Record<County, string> = {
  "miami-dade": "Miami-Dade",
  broward: "Broward",
  "palm-beach": "Palm Beach",
};

const SRC = {
  "miami-dade": "https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/PaGISView_gdb/FeatureServer/0/query",
  broward: "https://services.arcgis.com/JMAJrTsHNLrSsWf5/arcgis/rest/services/PARCEL_POLY_BCPA_TAXROLL/FeatureServer/0/query",
  "palm-beach": "https://services1.arcgis.com/ZWOoUZbtaYePLlPw/arcgis/rest/services/Parcels_and_Property_Details_WebMercator/FeatureServer/0/query",
} as const;
const FEMA = "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query";

export type AddressSuggestion = {
  county: County;
  id: string; // folio / parcel number
  address: string;
  place: string; // city or county + ZIP for display
  type: string;
  score?: number; // how many typed tokens matched (ranking)
};

export type PropertyRecord = {
  county: County;
  id: string;
  address: string;
  type: string;
  fields: [string, string][];
  floodZone: string | null;
  yearBuilt: number | null;
};

/* ── Address normalisation → appraiser format ("11826 SW 97 ST") ─────── */
const DIRS: Record<string, string> = {
  NORTHWEST: "NW", NORTHEAST: "NE", SOUTHWEST: "SW", SOUTHEAST: "SE",
  NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W",
};
const DIR_ABBR = new Set(["N", "S", "E", "W", "NE", "NW", "SE", "SW"]);
const SUFFIX: Record<string, string> = {
  STREET: "ST", AVENUE: "AVE", AV: "AVE", ROAD: "RD", DRIVE: "DR", COURT: "CT", PLACE: "PL", TERRACE: "TER", TERR: "TER",
  LANE: "LN", BOULEVARD: "BLVD", CIRCLE: "CIR", HIGHWAY: "HWY", PARKWAY: "PKWY", TRAIL: "TRL", CAUSEWAY: "CSWY",
};
const SUFFIX_ABBR = new Set([...Object.values(SUFFIX), "WAY", "PATH", "LOOP", "ROW", "SQ", "PT", "XING", "ISLE", "RUN", "WALK"]);
const UNIT_WORDS = new Set(["APT", "APARTMENT", "UNIT", "STE", "SUITE", "#", "PH"]);

export function normalizeAddress(input: string): string[] {
  let s = input.toUpperCase().split(",")[0].replace(/\./g, "").replace(/#\s*/g, "# ").replace(/\s+/g, " ").trim();
  s = s.replace(/\b(FL|FLORIDA)\b.*$/, "").replace(/\b\d{5}(-\d{4})?\s*$/, "").trim();
  const out: string[] = [];
  const toks = s.split(" ");
  for (let i = 0; i < toks.length; i++) {
    let t = toks[i];
    if (UNIT_WORDS.has(t)) continue;
    t = t.replace(/^(\d+)(ST|ND|RD|TH)$/, "$1");
    if (i > 0 && DIRS[t] && toks.length > 2) t = DIRS[t];
    if (SUFFIX[t]) t = SUFFIX[t];
    out.push(t);
  }
  return out;
}

const esc = (s: string) => s.replace(/'/g, "''");
const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const zip5 = (z: unknown) => String(z ?? "").replace(/\D/g, "").slice(0, 5);
const posNum = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && isFinite(n) && n > 0 ? n : null;
};
const fmtDate = (v: unknown) => {
  if (typeof v === "number" && v > 0) { const d = new Date(v); return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`; }
  if (typeof v === "string" && /^\d{8}$/.test(v)) return `${v.slice(4, 6)}/${v.slice(0, 4)}`;
  return null;
};

type Feature = { attributes: Record<string, unknown>; geometry?: { x: number; y: number }; centroid?: { x: number; y: number } };

async function query(url: string, params: Record<string, string>, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(`${url}?${new URLSearchParams({ f: "json", ...params })}`, { signal: ctrl.signal });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message ?? "query failed");
    return json as { features?: Feature[] };
  } finally {
    clearTimeout(t);
  }
}

/* ── Address suggestions, per county ──────────────────────────────────── */

/** Counties that store one full site-address string: loosen the prefix until something hits. */
async function suggestByPrefix(
  county: "miami-dade" | "palm-beach",
  toks: string[],
  field: string,
  outFields: string,
  extraWhere: string,
  map: (a: Record<string, unknown>) => AddressSuggestion | null
) {
  for (let n = toks.length; n >= Math.min(3, toks.length); n--) {
    const json = await query(SRC[county], {
      where: `${field} LIKE '${esc(toks.slice(0, n).join(" "))}%'${extraWhere}`,
      outFields,
      returnGeometry: "false",
      orderByFields: field,
      resultRecordCount: "6",
    });
    const rows = (json.features ?? []).map((f) => map(f.attributes)).filter(Boolean) as AddressSuggestion[];
    if (rows.length) return rows.map((r) => ({ ...r, score: n }));
  }
  return [];
}

function suggestMiamiDade(toks: string[]) {
  return suggestByPrefix(
    "miami-dade", toks, "TRUE_SITE_ADDR",
    "FOLIO,TRUE_SITE_ADDR,TRUE_SITE_CITY,TRUE_SITE_ZIP_CODE,DOR_DESC",
    " AND DOR_DESC NOT LIKE 'REFERENCE FOLIO%'",
    (a) => {
      const city = titleCase(String(a.TRUE_SITE_CITY ?? ""));
      return {
        county: "miami-dade",
        id: String(a.FOLIO),
        address: String(a.TRUE_SITE_ADDR),
        place: `${city === "Unincorporated County" ? "Miami-Dade" : city}, FL ${zip5(a.TRUE_SITE_ZIP_CODE)}`,
        type: friendlyType(String(a.DOR_DESC ?? "")),
      };
    }
  );
}

function suggestPalmBeach(toks: string[]) {
  return suggestByPrefix(
    "palm-beach", toks, "SITE_ADDR_STR",
    "PARCEL_NUMBER,SITE_ADDR_STR,MUNICIPALITY,PROPERTY_USE",
    "",
    (a) => ({
      county: "palm-beach",
      id: String(a.PARCEL_NUMBER),
      address: String(a.SITE_ADDR_STR),
      place: `${titleCase(String(a.MUNICIPALITY ?? "Palm Beach County"))}, FL`,
      type: friendlyType(String(a.PROPERTY_USE ?? "")),
    })
  );
}

const BW_FIELDS = "FOLIO_NUMBER,SITUS_STREET_NUMBER,SITUS_STREET_DIRECTION,SITUS_STREET_NAME,SITUS_STREET_TYPE,SITUS_STREET_POST_DIR,SITUS_UNIT_NUMBER,SITUS_ZIP_CODE,USE_CODE,GIS_SQUARE_FOOT,LEGAL_LINE_1";
const bwAddress = (a: Record<string, unknown>) =>
  [a.SITUS_STREET_NUMBER, a.SITUS_STREET_DIRECTION, a.SITUS_STREET_NAME, a.SITUS_STREET_TYPE, a.SITUS_STREET_POST_DIR, a.SITUS_UNIT_NUMBER]
    .filter((x) => x !== null && x !== undefined && String(x).trim() !== "")
    .join(" ");

/** Broward stores the address in parts: number · direction · name · type · unit. */
async function suggestBroward(toks: string[]): Promise<AddressSuggestion[]> {
  const [num, ...rest] = toks;
  let dir: string | null = null;
  if (rest.length > 1 && DIR_ABBR.has(rest[0])) dir = rest.shift()!;
  const cut = rest.findIndex((t, i) => i > 0 && SUFFIX_ABBR.has(t));
  const name = cut > 0 ? rest.slice(0, cut) : rest.filter((t, i) => !(i > 0 && /^\d+[A-Z]?$/.test(t) && i === rest.length - 1));
  if (!name.length) return [];
  const tries: { where: string; score: number }[] = [];
  for (let n = name.length; n >= 1; n--) {
    const base = `SITUS_STREET_NUMBER='${esc(num)}' AND SITUS_STREET_NAME LIKE '${esc(name.slice(0, n).join(" "))}%'`;
    if (dir) tries.push({ where: `${base} AND SITUS_STREET_DIRECTION='${dir}'`, score: 2 + n });
    tries.push({ where: base, score: 1 + n });
  }
  for (const { where, score } of tries) {
    const json = await query(SRC.broward, { where, outFields: BW_FIELDS, returnGeometry: "false", resultRecordCount: "6" });
    const rows = (json.features ?? []).map((f) => f.attributes);
    if (rows.length) {
      return rows.map((a) => ({
        county: "broward" as const,
        id: String(a.FOLIO_NUMBER),
        address: bwAddress(a),
        place: `Broward, FL ${zip5(a.SITUS_ZIP_CODE)}`,
        type: browardType(a),
        score,
      }));
    }
  }
  return [];
}

/** Search all three counties in parallel. Miami-Dade first, then Broward, then Palm Beach. */
export async function suggestAddresses(input: string): Promise<AddressSuggestion[]> {
  const toks = normalizeAddress(input);
  if (toks.length < 2 || !/^\d/.test(toks[0])) return [];
  const settled = await Promise.allSettled([suggestMiamiDade(toks), suggestBroward(toks), suggestPalmBeach(toks)]);
  const all = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  if (!all.length && settled.every((r) => r.status === "rejected")) throw new Error("records unavailable");
  // Rank by whole words matched in order ("SW 15 ST" beats "SW 154 PL"), then drop duplicates
  // (one estate can span several parcels at the same address).
  const exact = (addr: string) => {
    const words = addr.split(" ");
    let i = 0;
    while (i < toks.length && i < words.length && words[i] === toks[i]) i++;
    return i;
  };
  const seen = new Set<string>();
  return all
    .map((x) => ({ ...x, score: exact(x.address) * 10 + (x.score ?? 0) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => {
      const k = `${x.county}|${x.address}|${x.type}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 8);
}

/* ── Full record, per county ──────────────────────────────────────────── */

async function floodZone(pt?: { x: number; y: number }): Promise<string | null> {
  if (!pt) return null;
  try {
    const fz = await query(FEMA, {
      geometry: JSON.stringify({ x: pt.x, y: pt.y, spatialReference: { wkid: 4326 } }),
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "FLD_ZONE,ZONE_SUBTY",
      returnGeometry: "false",
    }, 8000);
    const z = fz.features?.[0]?.attributes;
    if (!z?.FLD_ZONE) return null;
    return z.ZONE_SUBTY && String(z.ZONE_SUBTY).includes("0.2 PCT") ? `${z.FLD_ZONE} (shaded)` : String(z.FLD_ZONE);
  } catch {
    return null; // FEMA is occasionally slow — the advisor confirms
  }
}

const sqft = (n: number | null) => (n ? `${Math.round(n).toLocaleString()} sq ft` : "Not on record");
const money = (n: number | null) => (n ? `$${Math.round(n).toLocaleString()}` : null);

async function recordMiamiDade(id: string): Promise<PropertyRecord | null> {
  const json = await query(SRC["miami-dade"], { where: `FOLIO='${esc(id)}'`, outFields: "*", returnGeometry: "true", outSR: "4326" });
  const f = json.features?.[0];
  if (!f) return null;
  const a = f.attributes;
  const flood = await floodZone(f.geometry);
  const type = friendlyType(String(a.DOR_DESC ?? ""));
  const beds = posNum(a.BEDROOM_COUNT);
  const baths = (posNum(a.BATHROOM_COUNT) ?? 0) + (posNum(a.HALF_BATHROOM_COUNT) ?? 0) * 0.5;
  const units = posNum(a.UNIT_COUNT);
  const fields: [string, string][] = [
    ["Property type", type],
    ["Year built", posNum(a.YEAR_BUILT) ? String(a.YEAR_BUILT) : "Not on record"],
    ["Living area", sqft(posNum(a.BUILDING_HEATED_AREA))],
    ["Total building", sqft(posNum(a.BUILDING_ACTUAL_AREA))],
  ];
  if (beds || baths) fields.push(["Bed / bath", `${beds ?? "–"} / ${baths || "–"}`]);
  if (posNum(a.FLOOR_COUNT)) fields.push(["Stories", String(a.FLOOR_COUNT)]);
  if (units && units > 1) fields.push(["Units", units.toLocaleString()]);
  if (posNum(a.LOT_SIZE)) fields.push(["Lot size", sqft(posNum(a.LOT_SIZE))]);
  if (money(posNum(a.ASSESSED_VAL_CUR))) fields.push(["Assessed value", money(posNum(a.ASSESSED_VAL_CUR))!]);
  fields.push(["Flood zone", flood ?? "Advisor to confirm"]);
  if (fmtDate(a.DOS_1)) fields.push(["Last sale", fmtDate(a.DOS_1)!]);
  const city = titleCase(String(a.TRUE_SITE_CITY ?? ""));
  return {
    county: "miami-dade",
    id,
    address: `${a.TRUE_SITE_ADDR}, ${city === "Unincorporated County" ? "Miami-Dade" : city}, FL ${zip5(a.TRUE_SITE_ZIP_CODE)}`,
    type,
    fields,
    floodZone: flood,
    yearBuilt: posNum(a.YEAR_BUILT),
  };
}

async function recordBroward(id: string): Promise<PropertyRecord | null> {
  const json = await query(SRC.broward, {
    where: `FOLIO_NUMBER='${esc(id)}'`,
    outFields: `${BW_FIELDS},BEDS,BATHS,BLDG_TOT_SQ_FOOTAGE,BLDG_ADJ_SQ_FOOTAGE,BLDG_YEAR_BUILT,ACTUAL_YEAR_BUILT,BLDG_UNITS,LAST_YRS_ASSESSED,JUST_LAND_VALUE,JUST_BUILDING_VALUE,SALE_DATE_1`,
    returnGeometry: "false",
    returnCentroid: "true",
    outSR: "4326",
  });
  const f = json.features?.[0];
  if (!f) return null;
  const a = f.attributes;
  const flood = await floodZone(f.centroid);
  const type = browardType(a);
  const year = posNum(a.ACTUAL_YEAR_BUILT) ?? posNum(a.BLDG_YEAR_BUILT);
  const beds = posNum(a.BEDS);
  const baths = posNum(a.BATHS);
  const units = posNum(a.BLDG_UNITS);
  const just = (posNum(a.JUST_LAND_VALUE) ?? 0) + (posNum(a.JUST_BUILDING_VALUE) ?? 0);
  const fields: [string, string][] = [
    ["Property type", type],
    ["Year built", year ? String(year) : "Not on record"],
    ["Living area", sqft(posNum(a.BLDG_ADJ_SQ_FOOTAGE))],
    ["Total building", sqft(posNum(a.BLDG_TOT_SQ_FOOTAGE))],
  ];
  if (beds || baths) fields.push(["Bed / bath", `${beds ?? "–"} / ${baths ?? "–"}`]);
  if (units && units > 1) fields.push(["Units", units.toLocaleString()]);
  if (posNum(a.GIS_SQUARE_FOOT)) fields.push(["Lot size", sqft(posNum(a.GIS_SQUARE_FOOT))]);
  if (just) fields.push(["Market value", money(just)!]);
  fields.push(["Flood zone", flood ?? "Advisor to confirm"]);
  if (fmtDate(a.SALE_DATE_1)) fields.push(["Last sale", fmtDate(a.SALE_DATE_1)!]);
  return {
    county: "broward",
    id,
    address: `${bwAddress(a)}, Broward, FL ${zip5(a.SITUS_ZIP_CODE)}`,
    type,
    fields,
    floodZone: flood,
    yearBuilt: year,
  };
}

async function recordPalmBeach(id: string): Promise<PropertyRecord | null> {
  const json = await query(SRC["palm-beach"], {
    where: `PARCEL_NUMBER='${esc(id)}'`,
    outFields: "PARCEL_NUMBER,SITE_ADDR_STR,MUNICIPALITY,PROPERTY_USE,YRBLT,ASSESSED_VAL,TOTAL_MARKET,SALE_DATE,PRICE,CONDO,SUBDIV_NAME",
    returnGeometry: "false",
    returnCentroid: "true",
    outSR: "4326",
  });
  const f = json.features?.[0];
  if (!f) return null;
  const a = f.attributes;
  const flood = await floodZone(f.centroid);
  const type = friendlyType(String(a.PROPERTY_USE ?? ""));
  const year = posNum(a.YRBLT);
  const fields: [string, string][] = [
    ["Property type", type],
    ["Year built", year ? String(year) : "Not on record"],
  ];
  const community = String(a.SUBDIV_NAME ?? "").replace(/\s+(COND(O|OMINIUM)?\s+DECL|DECL|PL\s*B|PB|ORB|FILED)\b.*$/i, "").trim();
  if (community) fields.push(["Community", titleCase(community)]);
  if (money(posNum(a.TOTAL_MARKET))) fields.push(["Market value", money(posNum(a.TOTAL_MARKET))!]);
  if (money(posNum(a.ASSESSED_VAL))) fields.push(["Assessed value", money(posNum(a.ASSESSED_VAL))!]);
  fields.push(["Flood zone", flood ?? "Advisor to confirm"]);
  if (fmtDate(a.SALE_DATE)) fields.push(["Last sale", fmtDate(a.SALE_DATE)!]);
  return {
    county: "palm-beach",
    id,
    address: `${a.SITE_ADDR_STR}, ${titleCase(String(a.MUNICIPALITY ?? "Palm Beach County"))}, FL`,
    type,
    fields,
    floodZone: flood,
    yearBuilt: year,
  };
}

export function lookupProperty(county: County, id: string): Promise<PropertyRecord | null> {
  if (county === "broward") return recordBroward(id);
  if (county === "palm-beach") return recordPalmBeach(id);
  return recordMiamiDade(id);
}

/* ── Property-type labels ─────────────────────────────────────────────── */

/* Florida DOR land-use codes (Broward publishes the code, not a description) */
const DOR: Record<string, string> = {
  "00": "Vacant land", "01": "Single-family home", "02": "Mobile home", "03": "Multifamily", "04": "Condominium",
  "05": "Co-op", "06": "Retirement home", "07": "Residential", "08": "Multifamily", "09": "Common area",
  "10": "Vacant land", "11": "Retail", "12": "Mixed use", "13": "Retail", "14": "Retail", "15": "Shopping center",
  "16": "Shopping center", "17": "Office building", "18": "Office building", "19": "Professional office",
  "20": "Airport / marina", "21": "Restaurant", "22": "Restaurant", "23": "Bank", "25": "Service shop",
  "26": "Service station", "27": "Auto sales / repair", "28": "Parking / mobile home park", "29": "Wholesale",
  "32": "Theater", "33": "Bar / nightclub", "34": "Recreation", "38": "Golf course", "39": "Hotel / motel",
  "40": "Vacant land", "41": "Industrial / warehouse", "42": "Industrial / warehouse", "48": "Industrial / warehouse",
  "49": "Open storage", "70": "Vacant land", "71": "Church", "72": "Private school", "73": "Hospital",
  "74": "Senior living", "76": "Cemetery", "77": "Club / lodge", "80": "Vacant land", "82": "Park / recreation",
  "83": "Public school", "84": "College", "85": "Hospital", "86": "Government", "87": "Government",
  "88": "Government", "89": "Government", "91": "Utility", "94": "Right-of-way", "95": "Waterway", "99": "Acreage",
};

/**
 * Broward uses the state code, where "01" covers detached homes AND townhomes.
 * Conservative rule: call it a townhome only when the legal description says so
 * or the lot is too small for a detached house (< 3,000 sq ft).
 */
function browardType(a: Record<string, unknown>): string {
  const code = String(a.USE_CODE ?? "").padStart(2, "0");
  if (code === "01") {
    const legal = String(a.LEGAL_LINE_1 ?? "").toUpperCase();
    const lot = posNum(a.GIS_SQUARE_FOOT);
    if (/TOWNH|TOWN HOME|TOWN HOUSE/.test(legal) || (lot !== null && lot < 3000)) return "Townhome";
    return "Single-family home";
  }
  return DOR[code] ?? (/^\d{2}$/.test(code) && Number(code) >= 50 && Number(code) <= 69 ? "Agricultural" : "Property");
}

/* Text land-use descriptions (Miami-Dade "USE : SUB-TYPE", Palm Beach plain) → plain English. */
export function friendlyType(dor: string): string {
  const d = dor.toUpperCase();
  const [use = "", sub = ""] = d.split(":").map((x) => x.trim());
  const any = (...k: string[]) => k.some((x) => d.includes(x));
  if (use.startsWith("VACANT") || sub === "VACANT LAND") return "Vacant land";
  if (any("TOWNHOUSE", "TOWNHOME")) return "Townhome";
  if (any("CLUSTER HOME")) return "Cluster home";
  if (any("ZERO LOT")) return "Zero-lot-line home";
  if (any("HOTEL") && any("CONDO")) return "Condo-hotel unit";
  if (any("CONDO") && any("OFF", "STORE", "RESTAURANT", "MEDIC", "WAREH", "SH CTR", "AIRPORT", "COMMERCIAL", "INDUS")) return "Commercial condo";
  if (any("CONDO")) return "Condominium";
  if (any("COOPERATIVE", "COOP")) return "Co-op";
  if (any("2 LIVING UNITS", "DUPLEX")) return "Duplex";
  if (any("MULTIFAMILY")) return "Multifamily";
  if (any("SINGLE FAMILY", "SFR")) return "Single-family home";
  if (any("MOBILE HOME", "MANUFACTURED", "MHT")) return "Mobile home";
  if (any("COMMON AREA")) return "Common area";
  if (any("HOTEL", "MOTEL")) return "Hotel / motel";
  if (any("OFFICE", "OFF BLDG")) return "Office building";
  if (any("STORE", "RETAIL", "SHOPPING", "SH CTR")) return "Retail";
  if (any("WAREHOUSE", "WAREH", "MANUFACTURING", "INDUSTRIAL")) return "Industrial / warehouse";
  if (any("REFERENCE FOLIO")) return "Master parcel";
  const tail = (sub || use).split(" - ").pop() ?? dor;
  return titleCase(tail.trim()) || "Property";
}

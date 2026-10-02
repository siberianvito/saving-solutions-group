/**
 * Property-intelligence stand-in. Deterministic, plausible records so the UX
 * can be demoed end-to-end. Swap `mockLookup` for a call to the licensed
 * property-data provider (via a server/API route) when it's selected.
 */
export type PropertyRecord = { address: string; fields: [string, string][]; floodZone: string; yearBuilt: number };

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296);
};

const title = (s: string) => s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function mockLookup(input: string): PropertyRecord {
  const r = hash(input.toLowerCase());
  const commercial = /ave|blvd|plaza|center|tower|suite|ste|unit|#/i.test(input) && r() > 0.3;
  const year = 1958 + Math.floor(r() * 64);
  const sq = commercial ? 18000 + Math.floor(r() * 140000) : 1600 + Math.floor(r() * 4200);
  const zones = ["X", "X", "AE", "AH", "X (shaded)", "VE"];
  const zone = zones[Math.floor(r() * zones.length)];
  const roofYear = Math.min(2025, year + 10 + Math.floor(r() * 40));
  const construction = r() > 0.35 ? "Masonry · CBS" : "Wood frame";
  return {
    address: title(input) + (/fl|florida/i.test(input) ? "" : ", FL"),
    yearBuilt: year,
    floodZone: zone,
    fields: [
      ["Property type", commercial ? (r() > 0.5 ? "Multifamily / condo" : "Office / retail") : r() > 0.4 ? "Single-family" : "Townhome"],
      ["Year built", String(year)],
      ["Square feet", sq.toLocaleString()],
      [commercial ? "Units" : "Stories", commercial ? String(8 + Math.floor(r() * 140)) : String(1 + Math.floor(r() * 2))],
      ["Construction", construction],
      ["Roof", `${r() > 0.5 ? "Hip · tile" : "Flat · membrane"} (${roofYear})`],
      ["Flood zone", zone],
      ["Distance to coast", `${(0.2 + r() * 9).toFixed(1)} mi`],
    ],
  };
}

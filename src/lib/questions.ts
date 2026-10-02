/* Conditional application logic: ask only what each coverage requires. */

export type Path = "commercial" | "personal" | "life" | "water";

export type Q = {
  id: string;
  label: string;
  type: "text" | "number" | "currency" | "select" | "yesno" | "date";
  options?: string[];
  placeholder?: string;
  help?: string;
};

export const PATHS: { id: Path; label: string; sub: string; icon: "building" | "home" | "family" | "drop" }[] = [
  { id: "commercial", label: "My business", sub: "Property, liability, comp, auto, specialty", icon: "building" },
  { id: "personal", label: "My home, auto & assets", sub: "Home, flood, auto, umbrella, private client", icon: "home" },
  { id: "life", label: "My family & future", sub: "Life, retirement, disability, LTC", icon: "family" },
  { id: "water", label: "My property's water costs", sub: "Free water-savings analysis", icon: "drop" },
];

export const COVERAGES: Record<Path, string[]> = {
  commercial: ["Commercial Property", "General Liability", "Workers' Compensation", "Commercial Auto", "Umbrella & Excess", "Builders' Risk", "Cyber & Management", "Commercial Flood"],
  personal: ["Homeowners", "Condo", "Flood", "Auto", "Umbrella", "High-Value Home", "Yacht & Marine", "Fine Art & Jewelry"],
  life: ["Term Life", "Permanent Life", "Retirement Planning", "Disability Income", "Long-Term Care", "Key Person / Buy-Sell"],
  water: [],
};

export const INDUSTRIES = [
  "Condominium association", "Apartment / multifamily", "Office building", "Retail store", "Restaurant / bar", "Hotel / hospitality",
  "General contractor", "Roofing contractor", "Electrical contractor", "Plumbing contractor", "HVAC contractor", "Landscaping",
  "Cleaning / janitorial", "Medical / dental office", "Senior living / healthcare", "Professional services", "Real estate",
  "Manufacturing", "Wholesale / distribution", "Trucking / logistics", "Auto repair / dealer", "Fitness / gym", "Salon / spa",
  "Technology / software", "School / university", "Nonprofit", "Event / entertainment", "Marina / marine", "Other",
];

const YN = ["Yes", "No", "Not sure"];

export const QUESTIONS: Record<string, Q[]> = {
  /* Commercial */
  "Commercial Property": [
    { id: "own", label: "Do you own or lease the building?", type: "select", options: ["Own", "Lease", "Own & lease to others"] },
    { id: "bldgValue", label: "Building value (replacement cost)", type: "currency", placeholder: "e.g. 4,500,000" },
    { id: "contents", label: "Contents / business personal property", type: "currency" },
    { id: "roofAge", label: "Roof age (years)", type: "number" },
    { id: "sprinklers", label: "Sprinklered?", type: "yesno", options: YN },
    { id: "windMit", label: "Do you have a wind mitigation report?", type: "yesno", options: YN },
  ],
  "General Liability": [
    { id: "ops", label: "Describe your operations in a sentence", type: "text", placeholder: "What you do, where, and for whom" },
    { id: "revenue", label: "Annual revenue", type: "currency" },
    { id: "subs", label: "Do you use subcontractors?", type: "yesno", options: YN },
    { id: "claims", label: "Claims in the last 5 years?", type: "yesno", options: YN },
    { id: "coiNeeds", label: "Do clients require certificates or additional insureds?", type: "yesno", options: YN },
  ],
  "Workers' Compensation": [
    { id: "payroll", label: "Annual payroll (total)", type: "currency" },
    { id: "ftpt", label: "Employees (full-time / part-time)", type: "text", placeholder: "e.g. 12 FT / 4 PT" },
    { id: "jobTypes", label: "Main job types", type: "text", placeholder: "e.g. clerical, roofers, drivers" },
    { id: "subs1099", label: "Use 1099 subcontractors?", type: "yesno", options: YN },
    { id: "officers", label: "Include or exclude officers?", type: "select", options: ["Include", "Exclude", "Not sure"] },
  ],
  "Commercial Auto": [
    { id: "vehicles", label: "Number of vehicles", type: "number" },
    { id: "vehTypes", label: "Vehicle types", type: "select", options: ["Cars / SUVs", "Pickups / vans", "Box trucks", "Tractor-trailers", "Mixed fleet"] },
    { id: "drivers", label: "Number of drivers", type: "number" },
    { id: "radius", label: "Radius of operation", type: "select", options: ["Under 50 miles", "50–200 miles", "Over 200 miles"] },
    { id: "hno", label: "Employees drive personal or rented cars for work?", type: "yesno", options: YN },
  ],
  "Umbrella & Excess": [
    { id: "limit", label: "Limit you're considering", type: "select", options: ["$1M", "$2M", "$5M", "$10M", "$10M+", "Not sure"] },
    { id: "contractReq", label: "Is it a contract requirement?", type: "yesno", options: YN },
  ],
  "Builders' Risk": [
    { id: "projectValue", label: "Completed project value", type: "currency" },
    { id: "projectType", label: "Project type", type: "select", options: ["New construction", "Renovation", "Addition"] },
    { id: "start", label: "Construction start date", type: "date" },
  ],
  "Cyber & Management": [
    { id: "mgmtLines", label: "Coverages of interest", type: "select", options: ["Cyber", "D&O", "E&O / professional", "EPLI", "Fiduciary", "Several of these"] },
    { id: "records", label: "Approx. customer records stored", type: "select", options: ["Under 10K", "10K–100K", "100K+"] },
  ],
  "Commercial Flood": [
    { id: "elevCert", label: "Elevation certificate available?", type: "yesno", options: YN },
    { id: "priorFlood", label: "Prior flood losses?", type: "yesno", options: YN },
  ],

  /* Personal */
  Homeowners: [
    { id: "occupancy", label: "How is the home used?", type: "select", options: ["Primary residence", "Secondary / seasonal", "Rental"] },
    { id: "roofYear", label: "Roof year", type: "number", placeholder: "e.g. 2018" },
    { id: "roofType", label: "Roof material", type: "select", options: ["Tile", "Shingle", "Metal", "Flat / membrane", "Not sure"] },
    { id: "openings", label: "Impact windows or shutters?", type: "select", options: ["Impact windows & doors", "Hurricane shutters", "Partial", "None"] },
    { id: "pool", label: "Pool?", type: "yesno", options: ["Yes", "No"] },
    { id: "inspections", label: "Do you have a 4-point or wind mitigation report?", type: "yesno", options: YN },
  ],
  Condo: [
    { id: "unitFloor", label: "Unit floor", type: "number" },
    { id: "hoaWalls", label: "Association covers walls-in?", type: "yesno", options: YN },
    { id: "contents", label: "Estimated contents value", type: "currency" },
  ],
  Flood: [
    { id: "elevCert", label: "Elevation certificate available?", type: "yesno", options: YN },
    { id: "elevated", label: "Is the lowest floor elevated?", type: "yesno", options: YN },
    { id: "priorFlood", label: "Any prior flood claims?", type: "yesno", options: YN },
    { id: "lender", label: "Required by your mortgage lender?", type: "yesno", options: YN },
  ],
  Auto: [
    { id: "vehicles", label: "Vehicles (year / make / model)", type: "text", placeholder: "e.g. 2024 Range Rover, 2022 Tesla Model Y" },
    { id: "drivers", label: "Drivers in the household", type: "number" },
    { id: "incidents", label: "Accidents or violations in 3 years?", type: "yesno", options: YN },
    { id: "limits", label: "Current liability limits", type: "select", options: ["State minimum", "100/300", "250/500", "500 CSL+", "Not sure"] },
  ],
  Umbrella: [
    { id: "limit", label: "Limit you're considering", type: "select", options: ["$1M", "$2M", "$5M", "$10M", "$25M+", "Not sure"] },
    { id: "teen", label: "Teen drivers in the household?", type: "yesno", options: ["Yes", "No"] },
    { id: "rentals", label: "Own rental properties?", type: "yesno", options: ["Yes", "No"] },
  ],
  "High-Value Home": [
    { id: "replacement", label: "Estimated replacement cost", type: "currency", placeholder: "e.g. 3,500,000" },
    { id: "otherHomes", label: "Other residences", type: "number" },
    { id: "protective", label: "Generator, water-leak detection, monitored alarm?", type: "select", options: ["All three", "Some", "None"] },
  ],
  "Yacht & Marine": [
    { id: "vessel", label: "Vessel (length, year, make)", type: "text", placeholder: "e.g. 72' 2021 Sunseeker" },
    { id: "hullValue", label: "Hull value", type: "currency" },
    { id: "navArea", label: "Navigation area", type: "select", options: ["Florida inland & coastal", "Florida + Bahamas", "Caribbean", "Worldwide"] },
    { id: "crew", label: "Captain or crew?", type: "yesno", options: ["Yes", "No"] },
    { id: "hurricane", label: "Named-storm plan", type: "select", options: ["Haul-out", "Move out of zone", "Marina plan", "Not sure"] },
  ],
  "Fine Art & Jewelry": [
    { id: "collectionValue", label: "Approximate collection value", type: "currency" },
    { id: "appraisals", label: "Recent appraisals?", type: "yesno", options: YN },
  ],

  /* Life */
  "Term Life": [
    { id: "amount", label: "Coverage amount", type: "select", options: ["$250K", "$500K", "$1M", "$2M", "$5M+", "Help me decide"] },
    { id: "term", label: "Term length", type: "select", options: ["10 years", "20 years", "30 years", "Not sure"] },
  ],
  "Permanent Life": [{ id: "purpose", label: "Primary purpose", type: "select", options: ["Legacy / estate", "Cash value", "Business planning", "Not sure"] }],
  "Retirement Planning": [{ id: "horizon", label: "Years to retirement", type: "number" }],
  "Disability Income": [{ id: "income", label: "Annual earned income", type: "currency" }],
  "Long-Term Care": [{ id: "forWhom", label: "For whom?", type: "select", options: ["Myself", "Spouse / partner", "Both", "A parent"] }],
  "Key Person / Buy-Sell": [{ id: "partners", label: "Number of owners / partners", type: "number" }],
};

export const LIFE_BASICS: Q[] = [
  { id: "age", label: "Your age", type: "number" },
  { id: "tobacco", label: "Tobacco or nicotine use?", type: "yesno", options: ["Yes", "No"] },
  { id: "health", label: "How would you rate your health?", type: "select", options: ["Excellent", "Good", "Average", "Some conditions"] },
];

export const WATER_QS: Q[] = [
  { id: "propType", label: "Property type", type: "select", options: ["Condominium", "Multifamily", "Hotel", "University / school", "Healthcare / senior living", "Office", "Other"] },
  { id: "units", label: "Units or rooms", type: "number" },
  { id: "fixtures", label: "Approx. number of toilets", type: "number" },
  { id: "bill", label: "Monthly water & sewer bill", type: "currency" },
];

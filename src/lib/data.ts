/* ─────────────────────────────────────────────────────────────
   Saving Solutions Group — single source of truth for content.
   Anything marked [REPLACE] needs a real value from the client.
   ───────────────────────────────────────────────────────────── */

export const SITE = {
  name: "Saving Solutions Group",
  short: "Saving Solutions",
  url: "https://savingsolutionsinsurance.com",
  tagline: "Technology when you want it. A human when you need one.",
  promise: "Digital speed. Human advice.",
  phone: "(786) 510-5572",
  phoneHref: "tel:+17865105572",
  sms: "sms:+17865105572",
  office: "(786) 863-2411",
  officeHref: "tel:+17868632411",
  email: "info@savingsolutionsgroup.com",
  ceoEmail: "elizabeth@savingsolutionsgroup.com",
  city: "Miami, Florida",
  address: "[REPLACE — office address]",
  license: "[REPLACE — FL agency license # once the 2-20 P&C license is issued]",
  linkedin: "https://www.linkedin.com/",
};

export type IconName =
  | "building" | "home" | "car" | "yacht" | "family" | "drop" | "shield" | "hardhat"
  | "briefcase" | "umbrella" | "wave" | "users" | "doc" | "phone" | "chat" | "upload"
  | "check" | "arrow" | "spark" | "key" | "chart" | "pen" | "bell" | "globe" | "leaf"
  | "gem" | "plane" | "id" | "card" | "search" | "pin" | "clock" | "lock";

export type DivisionKey = "business" | "personal" | "private" | "life" | "water";

export const DIVISIONS: Record<DivisionKey, { label: string; cta: string; icon: IconName }> = {
  business: { label: "Business", cta: "Get Business Insurance", icon: "building" },
  personal: { label: "Home & Auto", cta: "Protect My Property", icon: "home" },
  private: { label: "Private Client", cta: "Private Client Insurance", icon: "gem" },
  life: { label: "Life & Financial", cta: "Protect My Family & Future", icon: "family" },
  water: { label: "Water Solutions", cta: "Analyze My Property", icon: "drop" },
};

/* ── The six doors on the homepage ("What do you need to protect?") ── */
export const PROTECT = [
  {
    key: "business" as DivisionKey,
    title: "Business",
    cta: "Get Business Insurance",
    line: "Property, liability, workers' comp, fleets, and specialty risk, placed across direct carriers, MGAs and E&S markets.",
    href: "/insurance/business",
    image: "/media/business.jpg",
    icon: "building" as IconName,
    index: "01",
  },
  {
    key: "personal" as DivisionKey,
    title: "Home",
    cta: "Protect My Property",
    line: "Homeowners, condo, and flood coverage built for South Florida's wind, water, and replacement-cost reality.",
    href: "/insurance/home",
    image: "/media/home.jpg",
    icon: "home" as IconName,
    index: "02",
  },
  {
    key: "personal" as DivisionKey,
    title: "Auto",
    cta: "Insure My Vehicles",
    line: "Daily drivers, family fleets, and exotic collections, with the right limits under the right umbrella.",
    href: "/insurance/auto",
    image: "/media/auto.jpg",
    icon: "car" as IconName,
    index: "03",
  },
  {
    key: "private" as DivisionKey,
    title: "High-Net-Worth",
    cta: "Private Client Insurance",
    line: "Estates, yachts, fine art, aviation, and personal excess limits to $25M+. Quiet, complete, and placed with care.",
    href: "/insurance/private-client",
    image: "/media/hero.jpg",
    icon: "gem" as IconName,
    index: "04",
  },
  {
    key: "life" as DivisionKey,
    title: "Life & Financial",
    cta: "Protect My Family & Future",
    line: "Life, retirement, disability, long-term care, and estate strategies. Protect the people who matter, and their future.",
    href: "/insurance/life-financial",
    image: "/media/family.jpg",
    icon: "family" as IconName,
    index: "05",
  },
  {
    key: "water" as DivisionKey,
    title: "Water Conservation",
    cta: "Analyze My Property",
    line: "Our original division. Patented retrofits cut water costs with $0 upfront, and make your property easier to insure.",
    href: "/insurance/water-conservation",
    image: "/media/water.jpg",
    icon: "drop" as IconName,
    index: "06",
  },
];

/* ── Product catalogue → /insurance/[slug] landing pages ───────────── */
export type Product = {
  slug: string;
  division: DivisionKey;
  name: string;
  nav: string;
  icon: IconName;
  eyebrow: string;
  headline: string;
  sub: string;
  image?: string;
  coverages: { title: string; text: string }[];
  whoFor: string[];
  asks: string[];
  faq: { q: string; a: string }[];
  quoteType: "commercial" | "personal" | "life" | "water";
  quoteCoverage?: string;
};

export const PRODUCTS: Product[] = [
  /* BUSINESS ─────────────────────────────── */
  {
    slug: "business",
    division: "business",
    name: "Business Insurance",
    nav: "All Business Coverage",
    icon: "building",
    eyebrow: "Commercial · Florida & beyond",
    headline: "Insurance that moves at the speed of your business.",
    sub: "Tell us what you do once. We pull your property and business data, shop direct carriers, MGAs and E&S markets, and an advisor walks you through the best options.",
    image: "/media/business.jpg",
    coverages: [
      { title: "Commercial Property", text: "Buildings, contents, business income, and wind, priced on verified building data." },
      { title: "General Liability", text: "Premises, products, and completed operations, with COIs on demand." },
      { title: "Workers' Compensation", text: "Payroll-accurate, class-correct, audited without surprises." },
      { title: "Commercial Auto", text: "Owned, hired, and non-owned vehicles, from one van to a full fleet." },
      { title: "Umbrella & Excess", text: "Liability towers up to $10M+ when contracts and exposure demand it." },
      { title: "Management & Cyber", text: "D&O, E&O, EPLI, fiduciary, and cyber for the risks you can't see." },
    ],
    whoFor: ["Property owners & associations", "Contractors & trades", "Hospitality & restaurants", "Professional services", "Retail & wholesale", "Manufacturing & trucking"],
    asks: ["Business name & industry", "Business address (we fill in the building)", "Coverage needed & effective date", "Current carrier & premium (if known)", "Your current dec page (optional upload)"],
    faq: [
      { q: "How fast can I get a quote?", a: "Most commercial requests take about three minutes to start. Because we pre-fill building data from your address, you only answer what underwriters actually need." },
      { q: "Do you only work with one carrier?", a: "No. We place business through direct carrier appointments, market-access platforms, MGAs, and wholesale/E&S markets, so hard-to-place risks still have options." },
      { q: "Can I get certificates of insurance quickly?", a: "Yes. Request a COI by web, text, or email. The request goes straight to your service team with the holder, wording, and project details attached." },
    ],
    quoteType: "commercial",
  },
  {
    slug: "commercial-property",
    division: "business",
    name: "Commercial Property",
    nav: "Commercial Property",
    icon: "building",
    eyebrow: "Commercial Property Insurance",
    headline: "Your building, verified before you finish typing.",
    sub: "Enter an address and we retrieve year built, square footage, construction, and roof data. You confirm it, and we take it to market.",
    image: "/media/business.jpg",
    coverages: [
      { title: "Building & Contents", text: "Replacement-cost valuation grounded in real building characteristics." },
      { title: "Windstorm & Named Storm", text: "Florida wind placed in admitted and E&S markets, with mitigation credits applied." },
      { title: "Business Income", text: "Keep revenue flowing while the doors are closed after a covered loss." },
      { title: "Equipment Breakdown", text: "HVAC, electrical, elevators, and the systems that keep you open." },
      { title: "Water Damage Mitigation", text: "Pair coverage with our water retrofits to lower risk and operating costs." },
      { title: "Flood", text: "NFIP and private flood options matched to your zone and elevation." },
    ],
    whoFor: ["Condominium associations", "Multifamily owners", "Office & retail landlords", "Hospitality properties", "Healthcare & senior living", "Universities & campuses"],
    asks: ["Property address", "Number of buildings / units", "Building & contents values", "Roof age & wind mitigation", "Current carrier & renewal date"],
    faq: [
      { q: "Where does the property data come from?", a: "Licensed property-data providers and public appraiser records. We never ask you to type what we can verify, and you always confirm before anything goes to an underwriter." },
      { q: "Can water conservation lower my property premium?", a: "Water damage is one of the most frequent commercial losses. Our retrofit program reduces water risk, and that becomes part of the story we tell underwriters." },
    ],
    quoteType: "commercial",
    quoteCoverage: "Commercial Property",
  },
  {
    slug: "general-liability",
    division: "business",
    name: "General Liability",
    nav: "General Liability",
    icon: "shield",
    eyebrow: "General Liability Insurance",
    headline: "Win the contract. Keep the business.",
    sub: "The coverage every client, landlord, and GC asks for, with certificates you can request by text.",
    image: "/media/business.jpg",
    coverages: [
      { title: "Premises Liability", text: "Injuries and damage that happen on your property." },
      { title: "Products & Completed Ops", text: "Protection that follows your work after the job is done." },
      { title: "Personal & Advertising Injury", text: "Libel, slander, and advertising-related claims." },
      { title: "Additional Insureds", text: "Blanket AI, primary & non-contributory, and waiver wording on request." },
    ],
    whoFor: ["Contractors & subcontractors", "Restaurants & venues", "Retail stores", "Property managers", "Event companies", "Consultants"],
    asks: ["What your business does", "Annual revenue & payroll", "Subcontractor use", "Claims in the last 5 years", "Contract certificate requirements"],
    faq: [{ q: "How do I get a COI?", a: "Text us \"I need a COI for ABC Construction\", or use the Client Center. We collect the holder, address, additional-insured requirements, and special wording, and route it to your service team immediately." }],
    quoteType: "commercial",
    quoteCoverage: "General Liability",
  },
  {
    slug: "workers-compensation",
    division: "business",
    name: "Workers' Compensation",
    nav: "Workers' Comp",
    icon: "users",
    eyebrow: "Workers' Compensation",
    headline: "Protect your people. Pass your audit.",
    sub: "Class codes, payroll, and officer elections set up correctly from day one, so the premium you're quoted is the premium you pay.",
    coverages: [
      { title: "Statutory Benefits", text: "Medical care and wage replacement required by Florida law." },
      { title: "Employer's Liability", text: "Protection when an injury claim becomes a lawsuit." },
      { title: "Pay-As-You-Go Options", text: "Premium tied to real payroll to protect cash flow." },
      { title: "Audit Support", text: "We prepare you before the auditor calls." },
    ],
    whoFor: ["Construction trades", "Restaurants", "Healthcare offices", "Cleaning & janitorial", "Landscaping", "Professional firms"],
    asks: ["Payroll by job type", "Full-time / part-time headcount", "1099 subcontractors", "Experience mod (if any)", "Officer inclusion / exclusion"],
    faq: [{ q: "Do 1099 subs need their own coverage?", a: "Usually yes. If they can't show a certificate, their payroll may be added to yours at audit. We'll help you collect and track sub certificates." }],
    quoteType: "commercial",
    quoteCoverage: "Workers' Compensation",
  },
  {
    slug: "commercial-auto",
    division: "business",
    name: "Commercial Auto",
    nav: "Commercial Auto",
    icon: "car",
    eyebrow: "Commercial Auto & Fleet",
    headline: "Every vehicle. Every driver. One clean schedule.",
    sub: "Add a vehicle or driver by text, get ID cards in seconds, and keep your fleet schedule current without the paperwork.",
    image: "/media/auto.jpg",
    coverages: [
      { title: "Liability & Physical Damage", text: "Owned vehicles from sedans to heavy trucks." },
      { title: "Hired & Non-Owned", text: "Coverage when employees drive rentals or their own cars for work." },
      { title: "Cargo & Motor Truck", text: "Protect what you haul." },
      { title: "Fleet Services", text: "ID cards, adds, and deletes by text, handled the same day." },
    ],
    whoFor: ["Contractors with work trucks", "Delivery & logistics", "Trucking", "Sales fleets", "Limo & transport", "Service companies"],
    asks: ["Number & type of vehicles", "Drivers", "Radius of operation", "Garaging address", "Current carrier"],
    faq: [{ q: "Can I add a vehicle by text?", a: "Yes. Text the VIN and effective date. We confirm, endorse, and send the new ID card back to you." }],
    quoteType: "commercial",
    quoteCoverage: "Commercial Auto",
  },
  {
    slug: "contractors",
    division: "business",
    name: "Contractors Insurance",
    nav: "Construction & Specialty",
    icon: "hardhat",
    eyebrow: "Construction & Specialty",
    headline: "Built for the job site, and for the GC's contract.",
    sub: "GL, workers' comp, builders' risk, pollution, wrap-ups and surety, placed together so your coverage has no gaps.",
    image: "/media/construction.jpg",
    coverages: [
      { title: "Builders' Risk", text: "Structures under construction, materials, and soft costs." },
      { title: "Contractor's Pollution", text: "Mold, silica, and environmental exposures on the job." },
      { title: "OCIP / CCIP Wrap-Ups", text: "Project-wide programs for owners and GCs." },
      { title: "Surety Bonds", text: "Bid, performance, and payment bonds." },
      { title: "Inland Marine", text: "Tools, equipment, and materials in transit." },
      { title: "Fast COIs", text: "Certificates with exact contract wording, requested by text." },
    ],
    whoFor: ["General contractors", "Roofing", "Electrical & plumbing", "HVAC", "Developers", "Specialty trades"],
    asks: ["Trade / class of work", "Revenue & payroll", "Subcontracted costs", "Project types & locations", "Contract insurance requirements"],
    faq: [{ q: "Can you match my GC's contract language?", a: "Send the insurance section of the contract. We'll confirm the endorsements needed before you sign." }],
    quoteType: "commercial",
    quoteCoverage: "General Liability",
  },

  /* PERSONAL ─────────────────────────────── */
  {
    slug: "home",
    division: "personal",
    name: "Home Insurance",
    nav: "Homeowners",
    icon: "home",
    eyebrow: "Homeowners · Condo · Landlord",
    headline: "Your home, verified in seconds. Protected for years.",
    sub: "Enter your address and we fill in the details we already know: year built, square feet, construction, and roof. You just confirm.",
    image: "/media/home.jpg",
    coverages: [
      { title: "Dwelling & Wind", text: "Replacement cost that reflects South Florida construction costs." },
      { title: "Personal Property", text: "Everything inside, with scheduled items for valuables." },
      { title: "Liability", text: "Protection when someone is hurt on your property." },
      { title: "Loss of Use", text: "Living expenses while your home is repaired." },
      { title: "Flood", text: "A separate policy, and one we strongly recommend in Florida." },
      { title: "Wind Mitigation Credits", text: "We apply every discount your home has earned." },
    ],
    whoFor: ["Single-family homes", "Condos & townhomes", "Landlords & rentals", "New purchases", "Non-renewed homeowners", "Seasonal residents"],
    asks: ["Property address", "Roof year & material", "Wind mitigation / 4-point", "Current carrier & renewal date", "Your current dec page (optional upload)"],
    faq: [
      { q: "My carrier non-renewed me. Can you help?", a: "Yes. Upload your current declarations page and we'll shop admitted and surplus markets for a replacement before your policy lapses." },
      { q: "When should I look at Private Client instead?", a: "Generally when your home's replacement cost passes about $1.5M, or when you own fine art, jewelry, or multiple properties. Private Client programs offer broader coverage and higher limits." },
    ],
    quoteType: "personal",
    quoteCoverage: "Homeowners",
  },
  {
    slug: "flood",
    division: "personal",
    name: "Flood Insurance",
    nav: "Flood",
    icon: "wave",
    eyebrow: "Flood Insurance · NFIP & Private",
    headline: "Homeowners insurance doesn't cover flood. We do.",
    sub: "We look up your flood zone from your address, compare NFIP with private flood markets, and show you the difference in plain English.",
    image: "/media/storm.jpg",
    coverages: [
      { title: "Building Coverage", text: "Structure, systems, and permanently installed items." },
      { title: "Contents Coverage", text: "Furniture, electronics, and belongings." },
      { title: "Private Flood Options", text: "Higher limits and broader terms than NFIP where available." },
      { title: "Commercial Flood", text: "Excess flood for buildings over NFIP limits." },
    ],
    whoFor: ["Homeowners in any zone", "Condo associations", "Commercial buildings", "Lender-required policies", "Waterfront estates", "Landlords"],
    asks: ["Property address (we look up the zone)", "Elevation certificate (if you have one)", "Prior flood claims", "Mortgage requirements"],
    faq: [{ q: "Do I need flood if I'm not in a high-risk zone?", a: "A large share of flood claims come from outside high-risk zones. Preferred-risk policies can be very affordable, and there's usually a 30-day waiting period, so don't wait for a storm." }],
    quoteType: "personal",
    quoteCoverage: "Flood",
  },
  {
    slug: "auto",
    division: "personal",
    name: "Auto Insurance",
    nav: "Auto",
    icon: "car",
    eyebrow: "Personal Auto",
    headline: "From daily drivers to the collection in the garage.",
    sub: "Bundle home and auto, set your liability limits correctly, and put an umbrella over everything.",
    image: "/media/auto.jpg",
    coverages: [
      { title: "Liability & PIP", text: "Florida-required coverage, set at limits that actually protect you." },
      { title: "Collision & Comprehensive", text: "Repairs, theft, glass, and storm damage." },
      { title: "Uninsured Motorist", text: "Essential in Florida, where many drivers carry minimum limits." },
      { title: "Exotic & Collector", text: "Agreed-value coverage for special vehicles." },
    ],
    whoFor: ["Families", "New drivers", "Exotic & collector owners", "Multi-car households", "Rideshare drivers", "Seasonal residents"],
    asks: ["Vehicles (year / make / model)", "Drivers in the household", "Garaging address", "Current carrier & limits"],
    faq: [{ q: "Can I get my ID card by text?", a: "Yes. Existing clients can text \"ID card\" and receive it right away." }],
    quoteType: "personal",
    quoteCoverage: "Auto",
  },
  {
    slug: "umbrella",
    division: "personal",
    name: "Umbrella Insurance",
    nav: "Umbrella",
    icon: "umbrella",
    eyebrow: "Personal Umbrella & Excess",
    headline: "One lawsuit shouldn't cost you everything you built.",
    sub: "Umbrella limits from $1M to $25M+ that sit above your home, auto, and watercraft policies.",
    coverages: [
      { title: "Excess Liability", text: "Extra limits above your home, auto, and boat policies." },
      { title: "Broader Protection", text: "Some claims your underlying policies exclude." },
      { title: "Defense Costs", text: "Legal defense, often outside your limit." },
      { title: "High Limits", text: "$1M to $25M+ through Private Client programs." },
    ],
    whoFor: ["Homeowners", "Families with teen drivers", "Landlords", "Boat owners", "Business owners", "High-net-worth households"],
    asks: ["Limit desired", "Underlying policies", "Drivers & household staff", "Rental properties"],
    faq: [{ q: "How much umbrella do I need?", a: "A good starting point is your net worth plus future earnings exposure. We'll model it with you. It's one of the most affordable coverages per dollar of protection." }],
    quoteType: "personal",
    quoteCoverage: "Umbrella",
  },

  /* PRIVATE CLIENT ───────────────────────── */
  {
    slug: "private-client",
    division: "private",
    name: "Private Client",
    nav: "Private Client Overview",
    icon: "gem",
    eyebrow: "Private Client · High-Net-Worth",
    headline: "Complete protection, for a more complex life.",
    sub: "A $3M home on a standard policy may never be made whole. Our Private Client desk places estates, collections, yachts, and excess limits with carriers built for them.",
    image: "/media/hero.jpg",
    coverages: [
      { title: "Luxury Home Programs", text: "Guaranteed rebuild, cash-out options, and white-glove claims, through premier private-client carriers." },
      { title: "Personal Excess to $25M+", text: "Liability built for public profiles and significant assets." },
      { title: "Yacht & Marine", text: "Agreed value, crew, charter, and named-storm haul-out planning." },
      { title: "Exotic Auto & Aviation", text: "Collector cars and private aircraft." },
      { title: "Fine Art, Jewelry & Collections", text: "Blanket and scheduled coverage, worldwide." },
      { title: "Forensic Risk Analysis", text: "A complimentary, line-by-line review of your current program for qualified clients." },
    ],
    whoFor: ["Estate owners", "Multi-home families", "Collectors", "Yacht owners", "Executives & public figures", "Family offices"],
    asks: ["Primary residence & other properties", "Collections & valuables", "Vehicles, watercraft, aircraft", "Current program & renewal dates"],
    faq: [
      { q: "What is a Forensic Risk Analysis?", a: "A complimentary, confidential review of every policy you own: gaps, overlaps, valuation, and liability limits, delivered as a clear written report." },
      { q: "Which carriers do you work with?", a: "We access premier private-client programs and specialty markets. [REPLACE — confirm the appointed carrier list before naming carriers publicly.]" },
    ],
    quoteType: "personal",
    quoteCoverage: "High-Value Home",
  },
  {
    slug: "yacht-marine",
    division: "private",
    name: "Yacht & Marine",
    nav: "Yacht & Marine",
    icon: "yacht",
    eyebrow: "Yacht & Marine",
    headline: "From Biscayne Bay to the Bahamas, covered.",
    sub: "Agreed-value hull, protection & indemnity, crew, and hurricane plans for yachts and high-performance boats.",
    image: "/media/yacht.jpg",
    coverages: [
      { title: "Agreed-Value Hull", text: "No depreciation surprises after a total loss." },
      { title: "Protection & Indemnity", text: "Liability on the water, including wreck removal." },
      { title: "Crew Coverage", text: "Jones Act and crew medical." },
      { title: "Named-Storm Planning", text: "Haul-out and hurricane plans that keep coverage in force." },
    ],
    whoFor: ["Yacht owners", "Sport fishing", "Charter operators", "Center consoles", "Captained vessels", "Marinas"],
    asks: ["Vessel length, year, hull, value", "Navigation area", "Captain / crew", "Hurricane plan", "Boating experience"],
    faq: [{ q: "Do you cover charter use?", a: "Yes, through specialty marine markets. Tell us the charter frequency and area." }],
    quoteType: "personal",
    quoteCoverage: "Yacht & Marine",
  },
  {
    slug: "high-value-home",
    division: "private",
    name: "High-Value Home",
    nav: "Luxury Home",
    icon: "key",
    eyebrow: "High-Value Home",
    headline: "Rebuilt exactly as it was. Not approximately.",
    sub: "Guaranteed replacement, cash-settlement options, and artisan-level restoration for exceptional homes.",
    image: "/media/home.jpg",
    coverages: [
      { title: "Guaranteed Rebuild", text: "Rebuild cost, even above your dwelling limit (program-dependent)." },
      { title: "Cash-Out Option", text: "Choose to settle instead of rebuilding." },
      { title: "Risk Consulting", text: "Water sensors, generator, and hurricane readiness." },
      { title: "Worldwide Contents", text: "Coverage that travels with you." },
    ],
    whoFor: ["$1.5M+ homes", "Waterfront estates", "Second homes", "Historic properties"],
    asks: ["Address", "Replacement cost estimate", "Protective devices", "Other properties"],
    faq: [{ q: "Does a water retrofit help?", a: "Leak detection and water-efficiency upgrades reduce one of the most common high-value home losses, and many carriers notice." }],
    quoteType: "personal",
    quoteCoverage: "High-Value Home",
  },

  /* LIFE & FINANCIAL ─────────────────────── */
  {
    slug: "life-financial",
    division: "life",
    name: "Life & Financial",
    nav: "Life & Financial Planning",
    icon: "family",
    eyebrow: "Saving Solutions Financial Planning",
    headline: "Protect the people. Plan the future.",
    sub: "Life insurance, retirement, disability, long-term care, and estate-related strategies, designed with an advisor, not an algorithm.",
    image: "/media/family.jpg",
    coverages: [
      { title: "Term & Permanent Life", text: "Income replacement, mortgage protection, and legacy." },
      { title: "Retirement Planning", text: "Income strategies and annuity solutions." },
      { title: "Disability Income", text: "Protect your ability to earn." },
      { title: "Long-Term Care", text: "Plan for care without draining your estate." },
      { title: "Key Person & Buy-Sell", text: "Keep the business whole when a partner is lost." },
      { title: "Estate Strategies", text: "Liquidity for taxes and smooth transfer of wealth." },
    ],
    whoFor: ["Young families", "Business owners", "Pre-retirees", "High-net-worth families", "Partners & co-founders", "Professionals"],
    asks: ["What you want to protect", "Coverage amount (estimate)", "Age & tobacco use", "Best time to talk"],
    faq: [{ q: "Can I buy life insurance online here?", a: "You can start online in two minutes. Life planning is personal, so an advisor reviews your goals and presents options before anything is final." }],
    quoteType: "life",
  },

  /* WATER ────────────────────────────────── */
  {
    slug: "water-conservation",
    division: "water",
    name: "Water Conservation",
    nav: "Water Conservation",
    icon: "drop",
    eyebrow: "Saving Solutions · Water",
    headline: "Lower bills. Protected property. Paid only from your savings.",
    sub: "Our patented retrofit technology cuts water and sewer costs with $0 upfront. You pay only from verified savings, and a lower-risk property is easier to insure.",
    image: "/media/water.jpg",
    coverages: [
      { title: "Flush Valve", text: "Automatic shut-off technology that stops waste at the source." },
      { title: "Flapper Flush System", text: "Adjustable gallons-per-flush, calibrated to each fixture." },
      { title: "Enhancer", text: "Recaptures drain water to keep lines clear with less volume." },
      { title: "Free Portfolio Audit", text: "We model your savings before anything is installed." },
      { title: "Performance-Based", text: "No savings, no fee. We only get paid when you save." },
      { title: "Insurability", text: "Less water damage risk, a stronger story for underwriters." },
    ],
    whoFor: ["Condominium associations", "Universities", "Healthcare & senior living", "Multifamily", "Hospitality", "Commercial portfolios"],
    asks: ["Property address", "Number of units / fixtures", "Monthly water & sewer bill", "Best contact"],
    faq: [{ q: "What does it cost?", a: "Nothing upfront. We share in your verified savings, so if you don't save, you don't pay." }],
    quoteType: "water",
  },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/* Nav mega-menu built from the catalogue */
export const NAV: { key: DivisionKey; label: string; links: { label: string; href: string }[]; feature: string }[] = [
  {
    key: "business",
    label: "Business",
    feature: "Commercial insurance, quoted in minutes and placed across direct carriers, MGAs and E&S markets.",
    links: PRODUCTS.filter((p) => p.division === "business").map((p) => ({ label: p.nav, href: `/insurance/${p.slug}` })),
  },
  {
    key: "personal",
    label: "Home & Auto",
    feature: "Homeowners, flood, auto, and umbrella, built for Florida.",
    links: PRODUCTS.filter((p) => p.division === "personal").map((p) => ({ label: p.nav, href: `/insurance/${p.slug}` })),
  },
  {
    key: "private",
    label: "Private Client",
    feature: "Estates, yachts, collections, and personal excess to $25M+.",
    links: PRODUCTS.filter((p) => p.division === "private").map((p) => ({ label: p.nav, href: `/insurance/${p.slug}` })),
  },
  {
    key: "life",
    label: "Life & Financial",
    feature: "Life, retirement, disability, long-term care, and estate strategies.",
    links: [
      { label: "Life & Financial Planning", href: "/insurance/life-financial" },
      { label: "Talk to an Advisor", href: "/contact" },
    ],
  },
  {
    key: "water",
    label: "Water Solutions",
    feature: "Performance-based water conservation with $0 upfront.",
    links: [
      { label: "Water Conservation", href: "/insurance/water-conservation" },
      { label: "Sustainability Alliance", href: "/alliance" },
    ],
  },
];

/* ── The Protection Engine (pinned 3D scroll story) ─────────────────── */
export const ENGINE = [
  { k: "01", title: "Start anywhere", text: "Website, text, or phone. Answer a handful of questions. Save and resume any time, on any device.", hud: "INTAKE · 3 MIN" },
  { k: "02", title: "We already know your building", text: "Your address returns year built, square footage, construction, roof, and flood zone. You just confirm.", hud: "PROPERTY INTELLIGENCE" },
  { k: "03", title: "Your policy, read for you", text: "Upload your current dec page. We extract limits and deductibles and highlight the gaps for an advisor to review.", hud: "DOCUMENT EXTRACTION" },
  { k: "04", title: "Many markets. One request.", text: "One clean submission reaches direct carriers, market-access platforms, MGAs, and E&S markets.", hud: "MARKET ACCESS" },
  { k: "05", title: "An advisor makes it make sense", text: "Side-by-side options, a clear recommendation, and a real person who knows your file.", hud: "HUMAN ADVICE" },
  { k: "06", title: "Sign, bind, done", text: "Accept electronically, sign in one flow, and get policy documents and COIs delivered instantly.", hud: "BOUND · PROTECTED" },
];

/* ── Client Center service requests ─────────────────────────────────── */
export const SERVICE = [
  { id: "coi", label: "Certificate of Insurance", icon: "doc" as IconName, text: "Holder, AI wording, project details. Routed instantly." },
  { id: "id", label: "ID Card", icon: "id" as IconName, text: "Auto ID cards delivered by text or email." },
  { id: "policy", label: "Policy Copy", icon: "doc" as IconName, text: "Your full policy or dec page, on demand." },
  { id: "claim", label: "Claim Help", icon: "shield" as IconName, text: "Report a loss or check on an open claim." },
  { id: "change", label: "Policy Change", icon: "pen" as IconName, text: "Limits, locations, mortgagee, named insureds." },
  { id: "vehicle", label: "Add / Remove Vehicle", icon: "car" as IconName, text: "Send the VIN and effective date." },
  { id: "driver", label: "Add / Remove Driver", icon: "users" as IconName, text: "Household or employee drivers." },
  { id: "billing", label: "Billing Help", icon: "card" as IconName, text: "Payments, plans, and premium questions." },
  { id: "agent", label: "Speak to an Agent", icon: "phone" as IconName, text: "Your assigned advisor, no phone tree." },
];

/* ── Water division proof (from the current savingsolutionsgroup.com) ── */
export const WATER_STATS = [
  { value: 190, suffix: "M+", label: "Gallons saved" },
  { value: 2.03, prefix: "$", suffix: "M+", label: "Client savings", decimals: 2 },
  { value: 3224, label: "Fixtures retrofitted" },
  { value: 59, suffix: "%", label: "Average savings" },
];

export const CASE_STUDIES = [
  { name: "St. Thomas University", city: "Miami Gardens", fixtures: 289, water: 45, cost: 49, detail: "$354,768 → $180,516 per year" },
  { name: "Village at Dadeland Condominium", city: "Miami", fixtures: 516, water: 41, cost: 44, detail: "$548,352 → $306,420 per year" },
  { name: "Miami Jewish Health", city: "Miami", fixtures: 117, water: 51, cost: 53, detail: "Healthcare campus" },
  { name: "Douglas Gardens North", city: "Pembroke Pines", fixtures: 147, water: 60, cost: 27, detail: "Senior living" },
  { name: "East Ridge at Cutler Bay", city: "Cutler Bay", fixtures: 469, water: 21, cost: 28, detail: "Retirement community" },
  { name: "Nova Southeastern University", city: "Cutler Bay", fixtures: 360, water: 18, cost: 17, detail: "University campus" },
];

export const CERTS = ["GreenCircle Certified", "UL", "ISO", "ICC Evaluation Service", "Bolder Energy Engineers"];

export const LINES_MARQUEE = [
  "Commercial Property", "General Liability", "Workers' Compensation", "Commercial Auto", "Builders' Risk",
  "Flood", "Homeowners", "Yacht & Marine", "Personal Excess to $25M+", "Cyber", "D&O · E&O · EPLI",
  "Fine Art & Jewelry", "Life & Retirement", "Water Conservation",
];

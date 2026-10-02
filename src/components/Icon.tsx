import type { IconName } from "@/lib/data";

/** Thin-stroke line icons, drawn for the gold-on-dark system (24px grid). */
const PATHS: Record<IconName, React.ReactNode> = {
  building: (<><path d="M4 21V5.5L12 3l8 2.5V21" /><path d="M2.5 21h19M8 8h1M8 11.5h1M8 15h1M15 8h1M15 11.5h1M15 15h1M11 21v-3.5h2V21" /></>),
  home: (<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9v12h14V9M10 21v-6h4v6" /></>),
  car: (<><path d="M3 16.5V12l2-5h14l2 5v4.5" /><path d="M2.5 12h19M3 16.5h18v2H3zM6.5 19.5v1.5M17.5 19.5v1.5" /><circle cx="7" cy="14.3" r=".6" /><circle cx="17" cy="14.3" r=".6" /></>),
  yacht: (<><path d="M3 16h18l-2.5 4h-13z" /><path d="M6 16l2-5h7l3 5M10 11V6l4 5M2 21.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /></>),
  family: (<><circle cx="8" cy="6" r="2.5" /><circle cx="16.5" cy="7.5" r="2" /><path d="M3.5 20v-4.5A4.5 4.5 0 0 1 8 11a4.5 4.5 0 0 1 4.5 4.5V20M13 20v-3.5a3.5 3.5 0 0 1 7 0V20" /></>),
  drop: (<><path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z" /><path d="M9 15a3 3 0 0 0 3 3" /></>),
  shield: (<><path d="M12 2.8 4.5 5.8v5.7c0 4.6 3.2 8.4 7.5 9.7 4.3-1.3 7.5-5.1 7.5-9.7V5.8z" /><path d="m8.8 12 2.2 2.2 4.4-4.4" /></>),
  hardhat: (<><path d="M3 17h18M4.5 17a7.5 7.5 0 0 1 15 0" /><path d="M10 9.7V6.5h4v3.2M3 17v2h18v-2" /></>),
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="1.5" /><path d="M8.5 7V4.5h7V7M3 12.5h18" /></>),
  umbrella: (<><path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z" /><path d="M12 12v7a2 2 0 0 1-4 0" /></>),
  wave: (<><path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /></>),
  users: (<><circle cx="9" cy="7.5" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 4.8a3 3 0 0 1 0 5.4M18 14.4A6 6 0 0 1 21 20" /></>),
  doc: (<><path d="M6 2.5h8.5L19 7v14.5H6z" /><path d="M14 2.5V7h5M9 12h7M9 15.5h7M9 8.5h3" /></>),
  phone: (<path d="M5 3.5h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.6 6.6l1.4-2.3 4.5 1.8V19a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />),
  chat: (<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>),
  upload: (<><path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 15v5h16v-5" /></>),
  check: (<path d="m4.5 12.5 4.5 4.5 10.5-10.5" />),
  arrow: (<path d="M4 12h15M13.5 6l6 6-6 6" />),
  spark: (<path d="M12 2.5 13.8 10l7.7 2-7.7 2L12 21.5 10.2 14l-7.7-2 7.7-2z" />),
  key: (<><circle cx="8" cy="15" r="4.5" /><path d="m11.2 11.8 8.8-8.8M16.5 6.5l2.5 2.5M14 9l2 2" /></>),
  chart: (<><path d="M3 20.5h18M6 16.5v-4M10.5 16.5v-7.5M15 16.5v-5.5M19.5 16.5V5.5" /></>),
  pen: (<><path d="m15 4.5 4.5 4.5L8.5 20H4v-4.5z" /><path d="m12.5 7 4.5 4.5" /></>),
  bell: (<><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>),
  leaf: (<><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19 14 10" /></>),
  gem: (<><path d="M6.5 3.5h11l4 5.5L12 21 2.5 9z" /><path d="M2.5 9h19M9 3.5 7.5 9 12 21M15 3.5 16.5 9 12 21" /></>),
  plane: (<path d="m3 13.5 7-1.5 5-8.5h2l-2.5 8 5.5-1 1.5-2H23l-1.5 4.5L23 17h-1.5l-1.5-2-5.5-1 2.5 8h-2l-5-8.5-7-1.5z" />),
  id: (<><rect x="2.5" y="5" width="19" height="14" rx="1.5" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16a3 3 0 0 1 6 0M14 10h4.5M14 13.5h3" /></>),
  card: (<><rect x="2.5" y="5" width="19" height="14" rx="1.5" /><path d="M2.5 9.5h19M6 15h4" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>),
  pin: (<><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  lock: (<><rect x="4.5" y="10.5" width="15" height="10.5" rx="1.5" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>),
};

export default function Icon({
  name,
  className = "h-5 w-5",
  stroke = 1.3,
}: {
  name: IconName;
  className?: string;
  stroke?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

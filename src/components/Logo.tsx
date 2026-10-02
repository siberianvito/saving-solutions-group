import Link from "next/link";
import { asset } from "@/lib/asset";

/**
 * The SSG lockup: the real gold monogram (extracted from the brand card)
 * + a typeset wordmark matching the card (Cinzel caps / spaced geometric caps).
 */
export default function Logo({
  size = "md",
  tagline = false,
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  href?: string | null;
}) {
  const s = {
    sm: { mono: "h-8", word: "text-[1.05rem]", sub: "text-[0.42rem]", gap: "gap-2.5", rule: "h-7" },
    md: { mono: "h-11", word: "text-[1.45rem]", sub: "text-[0.54rem]", gap: "gap-3.5", rule: "h-10" },
    lg: { mono: "h-24 md:h-32", word: "text-[2.6rem] md:text-[3.8rem]", sub: "text-[0.8rem] md:text-[1.1rem]", gap: "gap-5 md:gap-7", rule: "h-20 md:h-28" },
  }[size];

  const body = (
    <span className={`flex items-center ${s.gap}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/brand/ss-monogram.png")} alt="" className={`${s.mono} w-auto drop-shadow-[0_2px_10px_rgba(201,162,74,0.25)]`} />
      <span className={`${s.rule} w-px bg-gradient-to-b from-transparent via-gold/80 to-transparent`} />
      <span className="flex flex-col leading-none">
        <span className={`font-wordmark ${s.word} font-semibold tracking-[0.08em] text-gilded`}>SAVINGS</span>
        <span className={`mt-[0.35em] font-caps ${s.sub} font-medium tracking-[0.42em] text-ivory`}>SOLUTIONS GROUP</span>
        {tagline && (
          <span className="mt-3 font-caps text-[0.5rem] font-medium tracking-[0.2em] text-ivory/75 md:text-[0.62rem]">
            INSURANCE <span className="text-gold">|</span> RISK MANAGEMENT <span className="text-gold">|</span> PROPERTY SOLUTIONS
          </span>
        )}
      </span>
    </span>
  );

  if (href === null) return body;
  return (
    <Link href={href} aria-label="Saving Solutions Group, home" className="inline-flex">
      {body}
    </Link>
  );
}

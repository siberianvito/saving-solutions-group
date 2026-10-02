import Icon from "./Icon";
import { asset } from "@/lib/asset";
import type { IconName } from "@/lib/data";

/** Interior page header: photo (or brand silk) plate, gold eyebrow, serif headline. */
export default function PageHero({
  eyebrow,
  title,
  sub,
  image,
  icon,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  image?: string;
  icon?: IconName;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden ${compact ? "pb-14 pt-40" : "min-h-[88svh] pb-20 pt-44"} flex items-end`}>
      <div className="absolute inset-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(image)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="panel-navy h-full w-full" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,12,0.94)_0%,rgba(4,7,12,0.7)_45%,rgba(4,7,12,0.25)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        {!image && icon && (
          <Icon name={icon} className="absolute -right-10 top-1/2 h-[70vh] w-[70vh] -translate-y-1/2 text-gold/[0.06]" stroke={0.4} />
        )}
      </div>
      <div className="section-pad relative w-full">
        <p className="eyebrow flex items-center gap-3" style={{ animation: "fadeUp .8s both" }}>
          {icon && <Icon name={icon} className="h-4 w-4 text-gold" />}
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.98]" style={{ animation: "fadeUp 1s .1s both" }}>
          {title}
        </h1>
        {sub && <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-ivory/75" style={{ animation: "fadeUp 1s .2s both" }}>{sub}</p>}
        {children && <div className="mt-9" style={{ animation: "fadeUp 1s .3s both" }}>{children}</div>}
      </div>
    </section>
  );
}

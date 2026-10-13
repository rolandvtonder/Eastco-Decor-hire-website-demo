import type {ReactNode} from 'react';
import {useReveals} from '../hooks/useReveals';
import {Sprig} from './Logo';

/** A page section that reveals its `[data-reveal]` children as they arrive. */
export function Section({
  id,
  labelledBy,
  className = '',
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={`relative px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

/** Eyebrow + heading + optional lede, the opening of every content section. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  id,
  dark = false,
  className = '',
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  id?: string;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:items-end ${className}`} data-reveal>
      <div className="md:col-span-7">
        <p className={`flex items-center gap-2 text-micro font-semibold uppercase ${dark ? 'text-gold' : 'text-gold-deep'}`}>
          <Sprig className="size-4" />
          {eyebrow}
        </p>
        <h2 id={id} className="mt-4 font-display text-title font-medium text-balance">
          {title}
        </h2>
      </div>
      {(lede || children) && (
        <div className="md:col-span-4 md:col-start-9">
          {lede && <p className={`max-w-[28rem] text-body ${dark ? 'text-ivory/70' : 'text-ink/70'}`}>{lede}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = 'gold',
  className = '',
  external = false,
  download = false,
  label,
}: {
  href: string;
  children: ReactNode;
  variant?: 'gold' | 'teal' | 'ghost' | 'ghost-light';
  className?: string;
  external?: boolean;
  download?: boolean;
  label?: string;
}) {
  const styles = {
    gold: 'bg-gold text-teal-ink hover:-translate-y-0.5',
    teal: 'bg-teal-deep text-ivory hover:-translate-y-0.5 hover:bg-teal-ink',
    ghost: 'ring-1 ring-teal-ink/25 text-teal-ink hover:bg-teal-ink/5',
    'ghost-light': 'ring-1 ring-white/30 text-ivory hover:bg-white/10',
  }[variant];
  return (
    <a
      href={href}
      aria-label={label}
      {...(external && {target: '_blank', rel: 'noopener'})}
      {...(download && {download: ''})}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-nav font-semibold transition-[transform,background-color] active:translate-y-0 ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

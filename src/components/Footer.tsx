import {brand, branches, collections, footer, nav, socials} from '../content';
import {IconArrowUp, IconMail, IconPhone, IconPin, socialIcon} from './Icons';
import {LogoBadge} from './Logo';
import {url} from '../lib/url';

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-teal-ink px-4 pt-16 pb-8 text-ivory sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <LogoBadge className="size-16" />
            <p className="font-script text-[2.75rem] leading-none text-gold-soft">{brand.short}</p>
          </div>
          <p className="mt-5 max-w-[22rem] text-body text-ivory/70">{footer.note}</p>
          <ul className="mt-6 flex gap-2" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${brand.name} on ${s.label}`}
                  className="grid size-11 place-items-center rounded-full bg-white/8 ring-1 ring-white/12 transition-colors hover:bg-gold hover:text-teal-ink"
                >
                  {socialIcon(s.label)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-3">
          <div>
            <p className="text-micro font-semibold text-gold uppercase">Explore</p>
            <ul className="mt-4 space-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-10 items-center text-nav text-ivory/75 hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-micro font-semibold text-gold uppercase">Catalogues</p>
            <ul className="mt-4 space-y-1">
              {collections.map((c) => (
                <li key={c.id}>
                  <a href={url(`/catalogue/#${c.id}`)} className="inline-flex min-h-10 items-center text-nav text-ivory/75 hover:text-ivory">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5">
          {branches.map((b) => (
            <address key={b.id} className="not-italic">
              <p className="text-micro font-semibold text-gold uppercase">{b.name}</p>
              <ul className="mt-4 space-y-2.5 text-nav leading-snug text-ivory/80">
                <li>
                  <a href={b.maps} target="_blank" rel="noopener" className="flex gap-2.5 hover:text-ivory">
                    <IconPin className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>{b.address.join(', ')}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${b.tel}`} className="flex min-h-8 items-center gap-2.5 hover:text-ivory">
                    <IconPhone className="size-4 shrink-0 text-gold" />
                    {b.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${b.email}`} className="flex min-h-8 items-center gap-2.5 break-all hover:text-ivory">
                    <IconMail className="size-4 shrink-0 text-gold" />
                    {b.email}
                  </a>
                </li>
              </ul>
            </address>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.8125rem] text-ivory/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Eastco CC trading as {brand.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={url('/terms/')} className="hover:text-ivory">
            Hire terms
          </a>
          <a href={url('/privacy/')} className="hover:text-ivory">
            Privacy
          </a>
          <a href="#top" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/8 px-4 font-medium text-ivory hover:bg-white/15">
            Back to top <IconArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}

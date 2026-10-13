import {useEffect, useRef, useState} from 'react';
import {brand, branches, nav, quoteHref, type PageKey} from '../content';
import {lockScroll, onFrame} from '../lib/scroll';
import {IconPhone, IconWhatsApp} from './Icons';
import {LogoBadge} from './Logo';
import {url} from '../lib/url';

/**
 * Fixed header. Over a page's dark photo hero it is just ivory type on the
 * picture; once you scroll past the first screen it settles into an ivory
 * pill so it stays legible over light sections. The swap is a data attribute
 * written from the scroll loop — no React re-render while scrolling.
 */
export function Header({page, solid = false}: {page: PageKey; solid?: boolean}) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current!;
    if (solid) {
      el.dataset.solid = 'true';
      return;
    }
    let last = '';
    return onFrame(() => {
      const next = window.scrollY > window.innerHeight * 0.6 ? 'true' : 'false';
      if (next !== last) el.dataset.solid = last = next;
    });
  }, [solid]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <header ref={headerRef} data-solid="false" className="group/h fixed inset-x-0 top-0 z-50">
      <div className="px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <div
          className={`flex items-center justify-between gap-4 rounded-full py-1.5 pr-1.5 pl-1.5 transition-[background-color,box-shadow,color] duration-500 sm:pr-2 ${
            open
              ? 'text-ivory'
              : 'text-ivory group-data-[solid=true]/h:bg-ivory/92 group-data-[solid=true]/h:text-teal-ink group-data-[solid=true]/h:shadow-[0_10px_30px_-18px_rgb(8_48_47/0.55)] group-data-[solid=true]/h:ring-1 group-data-[solid=true]/h:ring-teal-ink/8 group-data-[solid=true]/h:backdrop-blur-md'
          }`}
        >
          <a href={url('/')} className="group flex min-h-11 items-center gap-3 rounded-full pr-2" aria-label={`${brand.name} — home`}>
            <LogoBadge className="size-11 transition-transform duration-700 group-hover:rotate-[20deg]" />
            <span className="leading-none">
              <span className="block font-display text-[1.375rem] font-medium tracking-[-0.01em]">{brand.name}</span>
              <span className="mt-1 hidden text-[0.6875rem] font-medium tracking-[0.12em] uppercase opacity-80 sm:block">
                {brand.tagline[0]}
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => {
              const current = item.key === page;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`relative rounded-full px-3.5 py-3 text-nav font-medium transition-colors hover:bg-current/10 ${
                    current ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {item.label}
                  {current && <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1.5 h-px bg-gold" />}
                </a>
              );
            })}
            <a
              href={quoteHref}
              className="ml-2 rounded-full bg-gold px-5 py-3 text-nav font-semibold text-teal-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get a quote
            </a>
          </nav>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-current/12 backdrop-blur-md lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-300 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-300 ${open ? 'top-[5px] -rotate-45' : 'top-2.5'}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 flex flex-col justify-end overflow-y-auto bg-teal-ink/96 px-5 pt-24 pb-8 text-ivory backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.key === page ? 'page' : undefined}
                  className="flex items-baseline gap-4 py-2 font-display text-[2.75rem] leading-none font-medium tracking-[-0.01em] aria-[current=page]:text-gold"
                >
                  <span className="font-sans text-micro text-gold">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={quoteHref}
          onClick={() => setOpen(false)}
          className="mt-8 rounded-full bg-gold py-4 text-center text-nav font-semibold text-teal-ink"
        >
          Get a quote
        </a>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
              <p className="text-micro font-semibold text-gold uppercase">{b.name}</p>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${b.tel}`} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white/10 text-nav font-medium">
                  <IconPhone /> {b.phone}
                </a>
                <a href={b.whatsapp} target="_blank" rel="noopener" className="grid size-11 place-items-center rounded-full bg-white/10" aria-label={`WhatsApp ${b.name}`}>
                  <IconWhatsApp />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

import {useEffect, type ReactNode} from 'react';
import type {PageKey} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {startScroll} from '../lib/scroll';
import {Footer} from './Footer';
import {Header} from './Header';
import {WhatsAppButton} from './WhatsAppButton';

/** The frame every page shares: skip link, header, footer, WhatsApp. */
export function Layout({page, solidHeader = false, children}: {page: PageKey; solidHeader?: boolean; children: ReactNode}) {
  const reduced = useReducedMotion();

  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-gold px-5 py-3 text-nav font-semibold text-teal-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header page={page} solid={solidHeader} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

/**
 * A light sheet that slides up over the still-pinned hero above it: it pulls
 * itself up by exactly one viewport, which is the hero's last screen of pin.
 */
export function Sheet({children, dark = false, id}: {children: ReactNode; dark?: boolean; id?: string}) {
  return (
    <div
      id={id}
      className={`relative z-10 -mt-[100svh] rounded-t-[28px] shadow-[0_-30px_60px_-24px_rgb(8_48_47/0.55)] ${dark ? 'bg-teal-ink' : 'bg-ivory'}`}
    >
      <div aria-hidden="true" className={`absolute top-3 left-1/2 z-20 h-1 w-12 -translate-x-1/2 rounded-full ${dark ? 'bg-white/40' : 'bg-teal-ink/25'}`} />
      {children}
    </div>
  );
}

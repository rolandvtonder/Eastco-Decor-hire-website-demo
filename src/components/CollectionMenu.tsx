import {useEffect, useRef, useState} from 'react';
import {collectionMenu, collections} from '../content';
import {useReveals} from '../hooks/useReveals';
import {clamp} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {IconArrow} from './Icons';
import {PhotoStack} from './PhotoStack';
import {url} from '../lib/url';

/**
 * The menu of collections. As the list scrolls, whichever row crosses the
 * middle of the screen lights up gold (keyboard focus can also pick one), and
 * the rest curve away from that line — sliding right and dimming the further
 * they are from it. On wide screens a sticky frame beside the list shows the
 * lit collection's catalogue cover.
 *
 * The Décor row gets a dwell: its list item is DWELL_VH tall and the row pins
 * inside it, lit, while a table is dressed layer by layer with the scroll —
 * then it lets go and the menu carries on.
 */

const DWELL_VH = 220;

export function CollectionMenu() {
  const [active, setActive] = useState(0);
  const sectionRef = useReveals<HTMLElement>();
  // The visible body of each row (the pinned part, for a dwell row).
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const rowInnerRefs = useRef<HTMLAnchorElement[]>([]);
  const dwellRef = useRef<HTMLLIElement>(null);
  const stackProgress = useRef(0);
  const plateRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let current = 0;
    let lastTop = Infinity;
    return onFrame(() => {
      const section = sectionRef.current;
      if (!section) return;
      const sr = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (sr.bottom < 0 || sr.top > vh) return;
      if (Math.abs(sr.top - lastTop) < 0.5) return;
      lastTop = sr.top;

      const mid = vh * 0.5;
      let best = current;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = r.top + r.height / 2 - mid;
        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d);
          best = i;
        }
        // Rows curve away from the reading line: a gentle arc, not a tilt.
        const n = clamp(Math.abs(d) / vh, 0, 1);
        const inner = rowInnerRefs.current[i];
        inner.style.transform = `translate3d(${n * n * 120}px, 0, 0)`;
        inner.style.opacity = String(1 - n * 0.5);
      });
      if (best !== current) {
        current = best;
        setActive(best);
      }

      // Dwell: how far the pinned row is through its stay.
      const dwell = dwellRef.current;
      const pinned = dwell?.firstElementChild as HTMLElement | null;
      if (dwell && pinned) {
        const lr = dwell.getBoundingClientRect();
        const stickyTop = parseFloat(getComputedStyle(pinned).top) || 0;
        stackProgress.current = clamp((stickyTop - lr.top) / Math.max(1, lr.height - pinned.offsetHeight));
      }

      // Section progress, -1 entering → 1 leaving, drives the frame's layers.
      const k = clamp((mid - (sr.top + sr.height / 2)) / (sr.height / 2 + mid), -1, 1);
      if (plateRef.current) plateRef.current.style.transform = `translate3d(0, ${k * -36}px, 0)`;
      if (ghostRef.current) ghostRef.current.style.transform = `translate3d(0, ${k * 80}px, 0)`;
    });
  }, [sectionRef]);

  const item = collections[active];

  return (
    <section
      ref={sectionRef}
      id="collection"
      aria-labelledby="collection-title"
      className="grain relative overflow-x-clip bg-teal-ink px-4 pt-28 pb-24 text-ivory sm:px-6 md:pt-40 md:pb-36 lg:px-8"
    >
      <div className="grid gap-8 md:grid-cols-12 md:items-end" data-reveal>
        <div className="md:col-span-7">
          <p className="text-micro font-semibold text-gold uppercase">{collectionMenu.eyebrow}</p>
          <h2 id="collection-title" className="mt-4 max-w-[14ch] font-display text-display font-medium">
            {collectionMenu.heading}
          </h2>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="max-w-[26rem] text-body text-ivory/70">{collectionMenu.lede}</p>
          <a href={url('/catalogue/')} className="mt-5 inline-flex min-h-11 items-center gap-2 text-nav font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
            See all catalogues <IconArrow />
          </a>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
        <ol className="space-y-2 md:col-span-7">
          {collections.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.id} ref={c.stack ? dwellRef : undefined} data-reveal style={c.stack ? {height: `${DWELL_VH}vh`} : undefined}>
                <div
                  ref={(el) => {
                    if (el) rowRefs.current[i] = el;
                  }}
                  className={c.stack ? 'sticky top-[10svh] md:top-[26vh]' : undefined}
                >
                  <a
                    ref={(el) => {
                      if (el) rowInnerRefs.current[i] = el;
                    }}
                    href={url(`/catalogue/#${c.id}`)}
                    onFocus={() => setActive(i)}
                    aria-current={on ? 'true' : undefined}
                    className={`relative block overflow-hidden rounded-[22px] px-4 py-6 transition-colors duration-500 md:px-6 md:py-8 ${
                      on ? 'text-teal-ink' : 'text-ivory hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Gold fill wipes in from the left on the lit row. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 origin-left bg-gold transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)] ${on ? 'scale-x-100' : 'scale-x-0'}`}
                    />
                    {/* Hairline between unlit rows. */}
                    <span aria-hidden="true" className={`absolute inset-x-4 top-0 h-px bg-white/12 transition-opacity md:inset-x-6 ${on ? 'opacity-0' : ''}`} />

                    <span className="relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 md:grid-cols-[3.5rem_1fr_auto]">
                      <span className={`font-mark text-[1.125rem] font-medium transition-colors duration-500 ${on ? 'text-teal-ink' : 'text-ivory/45'}`}>0{i + 1}</span>
                      <span className={`font-display text-row font-medium transition-[color,transform] duration-500 ${on ? 'translate-x-1.5 text-teal-ink' : 'text-ivory/60'}`}>
                        {c.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid size-11 place-items-center rounded-full border transition-all duration-500 ${
                          on ? 'rotate-[-45deg] border-teal-ink bg-teal-ink text-gold' : 'border-white/15 text-ivory/50'
                        }`}
                      >
                        <IconArrow />
                      </span>
                    </span>

                    <span className="relative mt-4 grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-[3.5rem_1fr]">
                      <span />
                      <span>
                        <span className={`block max-w-[34rem] text-body transition-colors duration-500 ${on ? 'text-teal-ink/80' : 'text-ivory/65'}`}>{c.body}</span>
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold transition-colors duration-500 ${on ? 'bg-teal-ink text-gold-soft' : 'bg-white/8 text-ivory/80'}`}
                          >
                            {c.pages} pages
                          </span>
                          {c.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full border px-2.5 py-1 text-[0.75rem] font-medium transition-colors duration-500 ${
                                on ? 'border-teal-ink/30 text-teal-ink' : 'border-white/15 text-ivory/70'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                        {/* Phones: the picture lives in the row. */}
                        {c.stack ? (
                          <PhotoStack photos={c.stack} progress={stackProgress} label={c.caption} className="relative mt-5 aspect-[4/3] rounded-[16px] md:hidden" />
                        ) : (
                          <span className="relative mt-5 block aspect-[4/3] overflow-hidden rounded-[16px] md:hidden">
                            <img src={c.cover.src} alt="" width={c.cover.w} height={c.cover.h} loading="lazy" decoding="async" className="size-full object-cover object-top" />
                          </span>
                        )}
                      </span>
                    </span>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Wide screens: one sticky frame, crossfading between collections. */}
        <div className="hidden md:col-span-5 md:block">
          {/* Width is capped from the height budget (74vh at 4:5) so the frame
              and the ticks under it always share one width. */}
          <figure className="sticky top-[14vh] ml-auto w-full max-w-[calc(74vh*0.8)]" data-reveal="clip">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[28px] bg-teal-deep ring-2 ring-gold/70">
              {/* Plate bleeds past the frame so its drift never shows an edge. */}
              <div ref={plateRef} className="absolute inset-x-0 -inset-y-[7%]">
                {collections.map((c, i) => {
                  const cls = `absolute inset-0 size-full object-cover transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)] ${
                    i === active ? 'scale-100 opacity-100 blur-none' : 'scale-[1.08] opacity-0 blur-sm'
                  }`;
                  // The dwell row plays its table being dressed; the rest show their cover.
                  return c.stack ? (
                    <PhotoStack key={c.id} photos={c.stack} progress={stackProgress} label={i === active ? c.caption : undefined} className={cls} />
                  ) : (
                    <img
                      key={c.id}
                      src={c.cover.src}
                      alt={i === active ? `${c.title} catalogue cover` : ''}
                      aria-hidden={i !== active}
                      width={c.cover.w}
                      height={c.cover.h}
                      loading="eager"
                      decoding="async"
                      className={`${cls} object-top`}
                    />
                  );
                })}
              </div>
              {/* Big ghost numeral, drifting faster than the picture. */}
              <span
                ref={ghostRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-[18%] right-5 font-mark text-[7rem] leading-none font-light text-transparent will-change-transform"
                style={{WebkitTextStroke: '1.5px var(--color-gold)'}}
              >
                0{active + 1}
              </span>
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-teal-ink/60 px-4 py-3 backdrop-blur-md">
                <span className="text-[0.875rem] font-medium">{item.caption}</span>
                <span className="shrink-0 text-micro font-semibold text-gold uppercase">{item.title}</span>
              </figcaption>
            </div>
            {/* Progress ticks — how far down the menu you are. */}
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {collections.map((c, i) => (
                <span key={c.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-gold' : 'bg-white/15'}`} />
              ))}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

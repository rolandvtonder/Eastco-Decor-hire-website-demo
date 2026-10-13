import {useEffect, useRef} from 'react';
import {collections} from '../content';
import {clamp} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {ButtonLink} from './Bits';
import {IconDownload, IconOpen} from './Icons';

/**
 * The five catalogues as a stack of cards. From tablet width up, each card
 * pins a little lower than the one before, so the next one slides up over it
 * like a page turning onto a pile; the cards underneath ease back and dim as
 * they are covered. On phones a card is taller than the screen, so pinning
 * would bury its buttons — there they simply scroll.
 */
export function CatalogueStack() {
  const cardRefs = useRef<HTMLElement[]>([]);
  const innerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const last: number[] = [];
    return onFrame(() => {
      const cards = cardRefs.current;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        let k = 0;
        if (next) {
          const r = card.getBoundingClientRect();
          const n = next.getBoundingClientRect();
          // 0 while the next card is a screen away, 1 once it lies on top.
          k = clamp((r.bottom - n.top) / Math.max(1, r.height));
        }
        if (Math.abs(k - (last[i] ?? -1)) < 0.002) return;
        last[i] = k;
        const inner = innerRefs.current[i];
        inner.style.transform = k > 0 ? `scale(${1 - k * 0.06}) translate3d(0, ${-k * 14}px, 0)` : '';
        inner.style.setProperty('--cover', String(k * 0.35));
      });
    });
  }, []);

  return (
    <ol className="relative mt-14 space-y-6 md:mt-20 md:space-y-[12vh]" aria-label="Catalogues">
      {collections.map((c, i) => (
        <li
          key={c.id}
          id={c.id}
          ref={(el) => {
            if (el) cardRefs.current[i] = el;
          }}
          className="md:sticky"
          style={{top: `calc(5.5rem + ${i * 1.1}rem)`}}
        >
          <div
            ref={(el) => {
              if (el) innerRefs.current[i] = el;
            }}
            className="origin-top"
          >
            <article
              aria-labelledby={`${c.id}-title`}
              className="relative grid overflow-hidden rounded-[28px] bg-ivory shadow-[0_30px_70px_-40px_rgb(8_48_47/0.55)] ring-1 ring-teal-ink/10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              <div className="relative flex items-center justify-center overflow-hidden bg-linear-to-br from-mist to-aqua/70 p-6 md:p-10">
                <span aria-hidden="true" className="absolute -top-6 -left-2 font-mark text-[9rem] leading-none font-light text-teal-deep/10 md:text-[12rem]">
                  0{i + 1}
                </span>
                <img
                  src={c.cover.src}
                  alt={`Cover of the ${c.title} catalogue, September 2026`}
                  width={c.cover.w}
                  height={c.cover.h}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`relative h-[clamp(11rem,28vh,24rem)] w-auto rounded-lg object-cover shadow-[0_24px_40px_-18px_rgb(8_48_47/0.7)] ring-1 ring-white/60 ${i % 2 ? 'rotate-2' : '-rotate-2'}`}
                />
              </div>

              <div className="flex flex-col p-6 md:p-10 lg:p-12">
                <p className="text-micro font-semibold text-gold-deep uppercase">
                  September 2026 · {String(i + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
                </p>
                <h3 id={`${c.id}-title`} className="mt-3 font-display text-title font-medium text-teal-ink">
                  {c.title}
                </h3>
                <p className="mt-4 max-w-[36rem] text-body text-ink/75">{c.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${c.title} includes`}>
                  {c.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-teal-ink/15 px-3 py-1 text-[0.8125rem] font-medium text-teal-ink/80">
                      {tag}
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 flex gap-8 border-t border-teal-ink/10 pt-5 text-[0.8125rem]">
                  <div>
                    <dt className="text-ink/55">Pages</dt>
                    <dd className="mt-1 font-display text-[1.75rem] leading-none font-medium text-teal-ink">{c.pages}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/55">Format</dt>
                    <dd className="mt-1 font-display text-[1.75rem] leading-none font-medium text-teal-ink">PDF</dd>
                  </div>
                  <div>
                    <dt className="text-ink/55">Size</dt>
                    <dd className="mt-1 font-display text-[1.75rem] leading-none font-medium text-teal-ink">{c.size}</dd>
                  </div>
                </dl>
                <div className="mt-7 flex flex-wrap gap-3 md:mt-auto md:pt-8">
                  <ButtonLink href={c.pdf} variant="teal" external label={`View the ${c.title} catalogue (opens PDF in a new tab)`}>
                    <IconOpen /> View catalogue
                  </ButtonLink>
                  <ButtonLink href={c.pdf} variant="ghost" download label={`Download the ${c.title} catalogue PDF, ${c.size}`}>
                    <IconDownload /> Download PDF
                  </ButtonLink>
                </div>
              </div>

              {/* Shade that deepens as the next card covers this one. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-teal-ink" style={{opacity: 'var(--cover, 0)'}} />
            </article>
          </div>
        </li>
      ))}
    </ol>
  );
}

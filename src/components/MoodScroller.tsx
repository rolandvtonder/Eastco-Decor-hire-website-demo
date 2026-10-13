import {useEffect, useRef} from 'react';
import {moods} from '../content';
import {clamp, pinProgress, range, smoothstep} from '../lib/math';
import {onFrame, scrollToPosition} from '../lib/scroll';
import {ButtonLink} from './Bits';
import {IconArrow} from './Icons';
import {Sprig} from './Logo';
import {url} from '../lib/url';

/**
 * Three styling moods on one long horizontal track. The section pins and
 * vertical scrolling slides the track sideways, one mood per screen; inside
 * each panel the three photographs drift at different speeds, so the collage
 * has depth as it passes.
 */

/** Viewport heights of scroll per mood. */
const PER_PANEL_VH = 110;

export function MoodScroller() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);
  const photoRefs = useRef<HTMLElement[][]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const n = moods.items.length;

  useEffect(() => {
    let lastP = -1;
    let lastW = 0;
    let lastIdx = -1;
    return onFrame(() => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      const vw = window.innerWidth;
      if (vw === lastW && Math.abs(p - lastP) < 0.00005) return;
      lastP = p;
      lastW = vw;

      // Each mood holds square in frame for the middle of its share of the
      // scroll; the ramps between are the slides.
      const u = range(p, 0.04, 0.96);
      const seg = u * (n - 1);
      const i0 = Math.min(n - 2, Math.floor(seg));
      const f = i0 + smoothstep(range(seg - i0, 0.3, 0.7));
      const panelW = track.scrollWidth / n;
      track.style.transform = `translate3d(${-f * panelW}px, 0, 0)`;
      barRef.current!.style.transform = `scaleX(${u})`;

      const idx = Math.round(f);
      if (idx !== lastIdx) {
        lastIdx = idx;
        counterRef.current!.textContent = `0${idx + 1}`;
      }

      panelRefs.current.forEach((panel, i) => {
        // -1 → 1 as the panel crosses the screen from right to left.
        const r = panel.getBoundingClientRect();
        const d = clamp((r.left + r.width / 2 - vw / 2) / vw, -1, 1);
        photoRefs.current[i]?.forEach((ph, j) => {
          ph.style.transform = `translate3d(${d * (40 + j * 50)}px, 0, 0)`;
        });
      });
    });
  }, [n]);

  // Keyboard users tabbing into an off-screen panel get it scrolled into view.
  const focusPanel = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const span = root.offsetHeight - window.innerHeight;
    scrollToPosition(top + span * (0.04 + (i / Math.max(1, n - 1)) * 0.92));
  };

  return (
    <section
      ref={rootRef}
      id="moods"
      aria-labelledby="moods-title"
      className="relative rounded-t-[28px] text-ivory"
      style={{height: `${n * PER_PANEL_VH + 60}svh`}}
    >
      <div className="grain sticky top-0 h-screen-s overflow-hidden">
        <div className="absolute inset-x-4 top-24 z-10 flex items-end justify-between gap-6 sm:inset-x-6 md:top-28 lg:inset-x-8">
          <div>
            <p className="flex items-center gap-2 text-micro font-semibold text-gold uppercase">
              <Sprig className="size-4" />
              {moods.eyebrow}
            </p>
            <h2 id="moods-title" className="mt-3 max-w-[22ch] font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-medium">
              {moods.heading}
            </h2>
          </div>
        </div>

        <div ref={trackRef} className="absolute inset-y-0 left-0 flex w-max">
          {moods.items.map((m, i) => (
            <article
              key={m.name}
              ref={(el) => {
                if (el) panelRefs.current[i] = el;
              }}
              aria-labelledby={`mood-${i}`}
              onFocusCapture={() => focusPanel(i)}
              className="relative grid h-full w-screen grid-rows-[auto_1fr] gap-6 px-4 pt-[38svh] pb-20 sm:px-6 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-8 md:pt-24 md:pb-16 lg:px-8"
            >
              <div className="md:col-span-5 md:pt-24">
                <p className="font-script text-[2.25rem] leading-none text-gold-soft">{m.name}</p>
                <h3 id={`mood-${i}`} className="mt-2 font-display text-[clamp(2.25rem,4.4vw,4.5rem)] leading-[0.95] font-medium">
                  <span className="sr-only">{m.n} · {m.name}: </span>
                  {m.title.map((line, j) => (
                    <span key={line} className={`block ${j === 1 ? 'italic' : ''}`}>
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-4 max-w-[30rem] text-body text-ivory/75 max-md:hidden">{m.body}</p>
                <p className="mt-6 text-micro font-semibold text-gold uppercase max-md:hidden">Pieces to look for</p>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.9375rem] text-ivory/85 max-md:hidden">
                  {m.lookFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Sprig className="mt-0.5 size-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-4">
                  <span className="flex -space-x-1.5" aria-hidden="true">
                    {m.swatches.map((c) => (
                      <span key={c} className="size-7 rounded-full ring-2 ring-teal-ink" style={{background: c}} />
                    ))}
                  </span>
                  <ButtonLink href={url('/catalogue/')} variant="ghost-light" className="min-h-11 px-5">
                    Find the pieces <IconArrow />
                  </ButtonLink>
                </div>
              </div>

              {/* Collage: one tall arch and two smaller frames, each drifting at its own pace. */}
              <div className="relative h-full min-h-0 md:col-span-6 md:col-start-7 md:h-[68svh]" aria-hidden="true">
                {m.photos.map((ph, j) => (
                  <div
                    key={ph.src}
                    ref={(el) => {
                      if (!el) return;
                      (photoRefs.current[i] ??= [])[j] = el;
                    }}
                    className={`absolute overflow-hidden shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] ${
                      j === 0
                        ? 'top-0 left-[8%] h-[92%] w-[50%] rounded-t-full rounded-b-[20px] ring-1 ring-gold/60'
                        : j === 1
                          ? 'top-[8%] right-0 h-[44%] w-[40%] rounded-[20px]'
                          : 'right-[6%] bottom-0 h-[40%] w-[36%] rounded-[20px]'
                    }`}
                  >
                    <img src={ph.src} alt="" width={ph.w} height={ph.h} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" className="size-full object-cover" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="absolute right-4 bottom-6 left-4 z-10 flex items-center gap-4 sm:right-6 sm:left-6 lg:right-8 lg:left-8" aria-hidden="true">
          <span className="font-mark text-[1.125rem] font-medium tabular-nums">
            <span ref={counterRef}>01</span>
            <span className="text-ivory/45"> / 0{n}</span>
          </span>
          <span className="relative h-px flex-1 bg-white/15">
            <span ref={barRef} className="absolute inset-0 origin-left bg-gold" style={{transform: 'scaleX(0)'}} />
          </span>
        </div>
      </div>
    </section>
  );
}

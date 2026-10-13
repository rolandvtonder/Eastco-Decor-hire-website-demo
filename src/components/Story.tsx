import {useEffect, useMemo, useRef} from 'react';
import {manifesto, marquee, photos} from '../content';
import {clamp, easeOutCubic, lerp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {Sprig} from './Logo';

/**
 * The ivory sheet. It pulls itself up by one viewport so it slides over the
 * still-pinned photo stage — rounded top edge and grab handle leading — then
 * pins itself while the manifesto tips up into place word by word. Beside it
 * an arched photograph drifts slowly closer as you read.
 */

const SECTION_VH = 300;

type Word = {text: string; em: boolean};

export function Story() {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const lastPos = useRef(-1);

  const words = useMemo<Word[]>(
    () => manifesto.flatMap((run) => run.text.split(' ').map((text) => ({text, em: !!run.em}))),
    [],
  );

  useEffect(
    () =>
      onFrame(() => {
        const root = rootRef.current;
        if (!root) return;
        const {p, rect, vh} = pinProgress(root);
        if (rect.top > vh || rect.bottom < 0) return;

        // The photo pushes in across the whole stay, sheet arrival included.
        const arrive = clamp(1 - rect.top / vh);
        photoRef.current!.style.transform = `scale(${lerp(1.18, 1.02, clamp(arrive * 0.35 + p * 0.65))})`;

        // The first line is already legible as the sheet arrives; the rest
        // resolves over the pinned scroll.
        const n = words.length;
        const pos = lerp(6, n + 2, range(p, 0.02, 0.8));
        if (Math.abs(pos - lastPos.current) < 0.01) return;
        lastPos.current = pos;

        // Each word tips up out of the baseline — rising, un-blurring and
        // rotating flat over a window about a word and a half wide. The
        // emphasised words then draw a gold rule underneath themselves.
        wordRefs.current.forEach((el, i) => {
          const a = clamp((pos - i) / 1.5, 0, 1);
          const e = easeOutCubic(a);
          const rest = words[i].em ? 1 : 0.5;
          el.style.opacity = String(lerp(0.12, rest, e));
          el.style.transform = e < 0.999 ? `translate3d(0, ${(1 - e) * 0.55}em, 0) rotateX(${(1 - e) * -75}deg)` : '';
          el.style.filter = e < 0.99 ? `blur(${(1 - e) * 6}px)` : '';
          if (words[i].em) {
            const u = easeOutCubic(clamp((pos - i - 1) / 1.5, 0, 1));
            el.style.backgroundSize = `${u * 100}% 0.06em`;
          }
        });
      }),
    [words],
  );

  const photo = photos.belleCloche;

  return (
    <section
      id="story"
      ref={rootRef}
      aria-labelledby="story-title"
      className="relative z-10 -mt-[100svh]"
      style={{height: `${SECTION_VH}svh`}}
    >
      <div className="sticky top-0 h-screen-s overflow-hidden rounded-t-[28px] bg-ivory text-teal-ink shadow-[0_-30px_60px_-20px_rgb(8_48_47/0.55)]">
        {/* Grab handle, as on a bottom sheet. */}
        <div aria-hidden="true" className="absolute top-3 left-1/2 z-20 h-1 w-12 -translate-x-1/2 rounded-full bg-teal-ink/25" />

        {/* Photo: an arched window on wide screens, a soft band across the top on phones. */}
        <div className="absolute inset-x-0 top-0 h-[30svh] overflow-hidden md:inset-x-auto md:top-1/2 md:right-[6vw] md:h-[min(72svh,46rem)] md:w-[min(34vw,30rem)] md:-translate-y-[48%] md:rounded-t-full md:rounded-b-[22px] md:shadow-[0_40px_80px_-40px_rgb(8_48_47/0.6)] md:ring-1 md:ring-gold/50">
          <img
            ref={photoRef}
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            loading="lazy"
            decoding="async"
            className="size-full origin-[50%_40%] object-cover object-[50%_35%]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ivory via-ivory/10 to-transparent md:hidden" />
        </div>
        <Sprig className="pointer-events-none absolute top-[14svh] right-[3vw] hidden size-24 -rotate-12 text-gold/50 md:block" />

        <div className="relative z-10 flex h-full flex-col px-4 pt-[29svh] pb-[4.5rem] sm:px-6 md:justify-center md:pt-24 md:pb-28 lg:px-8">
          <div className="md:max-w-[min(48rem,54vw)]">
            <p id="story-title" className="flex items-center gap-2 text-micro font-semibold text-gold-deep uppercase">
              <Sprig className="size-4" />
              Our promise
            </p>
            <p className="mt-5 font-display text-manifesto font-medium [perspective:700px]">
              {words.map((w, i) => (
                <span key={i}>
                  <span
                    ref={(el) => {
                      if (el) wordRefs.current[i] = el;
                    }}
                    className={`inline-block origin-[50%_100%] ${w.em ? 'font-semibold text-teal-deep italic' : ''}`}
                    style={{
                      opacity: 0.12,
                      transform: 'translate3d(0,0.55em,0) rotateX(-75deg)',
                      ...(w.em && {
                        backgroundImage: 'linear-gradient(var(--color-gold), var(--color-gold))',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '0 94%',
                        backgroundSize: '0% 0.06em',
                      }),
                    }}
                  >
                    {w.text}
                  </span>{' '}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* The occasions Eastco dresses, on a loop. */}
        <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-teal-ink/10 bg-ivory py-4 md:py-5" aria-label="Occasions we dress">
          <ul className="marquee-track flex w-max gap-10 pr-10 font-display text-[1.125rem] font-medium tracking-[0.04em] text-teal-ink/70 uppercase md:text-[1.375rem]">
            {[...marquee, ...marquee].map((item, i) => (
              <li key={i} className="flex items-center gap-10 whitespace-nowrap" aria-hidden={i >= marquee.length}>
                {item}
                <Sprig className="size-4 text-gold" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

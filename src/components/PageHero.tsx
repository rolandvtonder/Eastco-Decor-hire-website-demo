import {useEffect, useRef} from 'react';
import type {Photo} from '../content';
import {useFitText} from '../hooks/useFitText';
import {archClip, type Arch} from '../lib/arch';
import {clamp, easeInQuad, easeOutCubic, lerp, pinProgress, range, smoothstep} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * Pinned hero for the inner pages — the home stage's language, shorter.
 * The title is readable the moment the page loads; scrolling then plays:
 *
 *   0.00 – 0.20  the page's wordmark drops out of frame, letter by letter
 *   0.02 – 0.42  the arched photo opens to full bleed behind the title
 *   last 100vh   the next section rises over it as a sheet (see Sheet)
 *
 * HERO_VH is the timeline: two screens of play, one of sheet.
 */

const HERO_VH = 300;
const TUMBLE = [-12, 8, -6, 11, -9, 7, -10, 6, 12, -7, 9];

type Props = {
  word: string;
  eyebrow: string;
  title: string[];
  lede: string;
  /** Portrait photo for phones, landscape for wide screens. */
  image: Photo;
  wide: Photo;
};

function restingArch(vw: number, vh: number): Arch {
  if (vw >= 768) {
    const width = Math.min(vw * 0.26, vh * 0.42, 420);
    const height = width * 1.3;
    return {left: vw * 0.7 - width / 2, top: vh * 0.44 - height / 2, width, height};
  }
  const width = Math.min(vw * 0.5, vh * 0.23);
  const height = width * 1.3;
  // Centred on phones: the window then frames the middle of the photo, where its subject is.
  return {left: (vw - width) / 2, top: vh * 0.66 - height / 2, width, height};
}

export function PageHero({word, eyebrow, title, lede, image, wide}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const markRef = useFitText<HTMLSpanElement>();

  useEffect(() => {
    let lastP = -1;
    let lastW = 0;
    let lastH = 0;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0) return;
      const vw = window.innerWidth;
      if (vw === lastW && vh === lastH && Math.abs(p - lastP) < 0.00005) return;
      lastP = p;
      lastW = vw;
      lastH = vh;

      const sheetStart = 1 - vh / Math.max(1, rect.height - vh);
      const x = range(p, sheetStart, 1);

      const arch = restingArch(vw, vh);
      const open = smoothstep(range(p, 0.02, 0.42));
      frameRef.current!.style.clipPath = archClip(vw, vh, arch, open);
      imgRef.current!.style.transform = `scale(${lerp(1.2, 1.04, open) + x * 0.04})`;
      const ring = ringRef.current!;
      ring.style.opacity = String(1 - range(open, 0, 0.35));
      ring.style.transform = `translate3d(${arch.left - 8}px, ${arch.top - 8}px, 0)`;
      ring.style.width = `${arch.width + 16}px`;
      ring.style.height = `${arch.height + 16}px`;
      ring.style.borderRadius = `${arch.width / 2 + 8}px ${arch.width / 2 + 8}px 24px 24px`;

      const n = letterRefs.current.length;
      letterRefs.current.forEach((el, i) => {
        const start = 0.005 + (i / n) * 0.11;
        const k = range(p, start, start + 0.09);
        const e = easeInQuad(k);
        el.style.transform = k > 0 ? `translate3d(0, ${e * 140}%, 0) rotate(${TUMBLE[i % TUMBLE.length] * e}deg)` : '';
        el.style.opacity = String(1 - k);
      });

      const c = copyRef.current!;
      c.style.transform = `translate3d(0, ${-x * 60 - easeOutCubic(range(p, 0, 0.4)) * 20}px, 0)`;
      c.style.opacity = String(1 - x * 0.9);
      dimRef.current!.style.opacity = String(clamp(x * 0.6));
      sceneRef.current!.style.transform = x > 0.001 ? `scale(${1 - x * 0.05})` : '';
    });
  }, []);

  return (
    <section id="top" ref={rootRef} aria-labelledby="page-title" className="relative" style={{height: `${HERO_VH}svh`}}>
      <div className="grain sticky top-0 h-screen-s overflow-hidden bg-teal-deep text-ivory">
        <div ref={sceneRef} className="absolute inset-0 origin-[50%_70%]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{background: 'radial-gradient(90% 70% at 70% 100%, rgb(140 199 192 / 0.32), transparent 70%)'}}
          />

          <div ref={frameRef} className="absolute inset-0 overflow-hidden" style={{clipPath: 'inset(30% 15% 30% 60% round 999px 999px 18px 18px)'}}>
            <picture>
              <source media="(max-width: 767px)" srcSet={image.src} width={image.w} height={image.h} />
              <img
                ref={imgRef}
                src={wide.src}
                alt={wide.alt}
                width={wide.w}
                height={wide.h}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
            {/* Shade under the copy so it stays readable once the photo fills the screen. */}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-teal-ink/80 via-teal-ink/45 to-teal-ink/60 md:bg-linear-to-r md:from-teal-ink/85 md:via-teal-ink/45 md:to-teal-ink/10" />
          </div>
          <div ref={ringRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 border border-gold/70" />

          <div ref={copyRef} className="absolute inset-x-4 top-[14svh] sm:inset-x-6 md:top-1/2 md:right-auto md:left-[5vw] md:w-[min(42rem,52vw)] md:-translate-y-[60%] lg:left-8">
            <p className="text-micro font-semibold text-gold-soft uppercase">{eyebrow}</p>
            <h1 id="page-title" className="mt-4 font-display text-display font-medium">
              {title.map((line, i) => (
                <span key={line} className={`block ${i === title.length - 1 ? 'italic' : ''}`}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-[30rem] text-lede text-ivory/85">{lede}</p>
          </div>

          <p className="pointer-events-none absolute inset-x-0 bottom-0 px-3 leading-none sm:px-5 lg:px-6" aria-hidden="true">
            <span ref={markRef} className="inline-block pb-[0.02em] font-mark leading-[0.78] font-light tracking-[0.02em] whitespace-nowrap text-ivory">
              {[...word].map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) letterRefs.current[i] = el;
                  }}
                  className="inline-block whitespace-pre will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </span>
          </p>

          <div ref={dimRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-teal-ink opacity-0" />
        </div>
      </div>
    </section>
  );
}

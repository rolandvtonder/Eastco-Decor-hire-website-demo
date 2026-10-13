import {useEffect, useRef, type PointerEvent} from 'react';
import {brand, hero, perks, type Photo} from '../content';
import {useFitText} from '../hooks/useFitText';
import {archClip, type Arch} from '../lib/arch';
import {clamp, easeInQuad, easeOutCubic, lerp, pinProgress, range, smoothstep} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * Pinned home hero. One scroll range drives the whole beat:
 *
 *   0.00 – 0.12  the EASTCO wordmark drops out of frame, letter by letter
 *   0.03 – 0.28  the arched window opens until the photo fills the screen
 *   0.30 – 0.56  the photo story plays: each table crossfades into the next
 *                with a slow push-in, like walking the room
 *   0.48 – 0.70  "Beautiful events start here." rises, then three invitation
 *                cards swing in, unwrap from tissue, catch a gold glint and
 *                drift apart as you keep going
 *   last 100vh   the ivory story sheet rises over the stage while the stage
 *                dims and sinks back
 *
 * The story sheet pulls itself up by 100svh (see Story.tsx), so it starts
 * overlapping exactly when this stage has one viewport of pin left.
 */

const STAGE_VH = 520;

const T = {
  letters: [0.008, 0.12] as const,
  open: [0.03, 0.28] as const,
  story: [0.3, 0.56] as const,
  scrim: [0.46, 0.6] as const,
  eyebrow: [0.47, 0.51] as const,
  heading: 0.48,
  headingStep: 0.022,
  headingLen: 0.05,
  cards: 0.52,
  cardStep: 0.04,
  cardLen: 0.1,
};

/** Per-letter tumble as it falls — fixed so the drop looks the same every visit. */
const TUMBLE = [-12, 8, -6, 11, -9, 7];

/** Where the arch sits at rest: above the wordmark, centred. */
function restingArch(vw: number, vh: number): Arch {
  const width = vw >= 768 ? Math.min(vw * 0.3, vh * 0.42, 460) : Math.min(vw * 0.62, vh * 0.32);
  const height = width * 1.3;
  const cy = vh * (vw >= 768 ? 0.42 : 0.43);
  return {left: (vw - width) / 2, top: cy - height / 2, width, height};
}

/** Pointer tilt for the cards — fine pointers only, eased by CSS. */
function tilt(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateX(${ny * -10}deg) rotateY(${nx * 14}deg) translate3d(0,-4px,0) scale(1.035)`;
}
function untilt(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = '';
}

function StoryLayer({wide, tall, i}: {wide: Photo; tall: Photo; i: number}) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={tall.src} width={tall.w} height={tall.h} />
      <img
        src={wide.src}
        width={wide.w}
        height={wide.h}
        alt={i === 0 ? wide.alt : ''}
        // All three load up front so a fast scroll never fades into an empty
        // frame; only the first jumps the queue.
        loading="eager"
        fetchPriority={i === 0 ? 'high' : 'low'}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  );
}

export function PhotoStage() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const scrimRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLParagraphElement>(null);
  const chipTextRef = useRef<HTMLSpanElement>(null);
  const fadeRefs = useRef<HTMLElement[]>([]);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const perksRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const tissueRefs = useRef<HTMLSpanElement[]>([]);
  const shineRefs = useRef<HTMLSpanElement[]>([]);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const markRef = useFitText<HTMLSpanElement>();

  useEffect(() => {
    let lastP = -1;
    let lastW = 0;
    let lastH = 0;
    let lastChip = -1;

    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0) return;
      const vw = window.innerWidth;
      const resized = vw !== lastW || vh !== lastH;
      if (!resized && Math.abs(p - lastP) < 0.00005) return;
      lastP = p;
      lastW = vw;
      lastH = vh;

      const sheetStart = 1 - vh / Math.max(1, rect.height - vh);
      const x = range(p, sheetStart, 1);

      // --- The arch opens. ---
      const arch = restingArch(vw, vh);
      const open = smoothstep(range(p, ...T.open));
      frameRef.current!.style.clipPath = archClip(vw, vh, arch, open);
      const ring = ringRef.current!;
      ring.style.opacity = String(1 - range(open, 0, 0.35));
      ring.style.transform = `translate3d(${arch.left - 8}px, ${arch.top - 8}px, 0)`;
      ring.style.width = `${arch.width + 16}px`;
      ring.style.height = `${arch.height + 16}px`;
      ring.style.borderRadius = `${arch.width / 2 + 8}px ${arch.width / 2 + 8}px 24px 24px`;

      // --- Photo story: each layer fades in over the last with a push-in. ---
      const n = layerRefs.current.length;
      const s = range(p, ...T.story) * (n - 1);
      layerRefs.current.forEach((el, i) => {
        const shown = i === 0 ? 1 : smoothstep(range(s, i - 0.75, i - 0.15));
        const k = range(s, i - 1, i + 1);
        // Before the arch opens the photo sits pushed in; it settles as the
        // window widens, then each layer drifts slowly while it is on top.
        const zoom = lerp(1.22, 1.06, open) + (1 - k) * 0.08;
        el.style.opacity = String(shown);
        el.style.transform = `translate3d(${(k - 0.5) * -1.5}%, 0, 0) scale(${zoom})`;
      });
      const chip = Math.round(s);
      if (chip !== lastChip) {
        lastChip = chip;
        chipTextRef.current!.textContent = hero.story.captions[chip];
      }
      chipRef.current!.style.opacity = String(range(open, 0.8, 1) * (1 - range(p, T.scrim[0], T.scrim[0] + 0.04)));

      // Legibility for the copy that lands over the photos.
      scrimRef.current!.style.opacity = String(easeOutCubic(range(p, ...T.scrim)));

      // Caption + scroll hint leave with the first flick of the wheel.
      const intro = 1 - range(p, 0, 0.035);
      fadeRefs.current.forEach((el) => (el.style.opacity = String(intro)));

      // Wordmark letters fall, each a beat after the one before.
      const letters = letterRefs.current.length;
      letterRefs.current.forEach((el, i) => {
        const span = T.letters[1] - T.letters[0];
        const start = T.letters[0] + (i / letters) * span * 0.55;
        const k = range(p, start, start + span * 0.45);
        const e = easeInQuad(k);
        el.style.transform = k > 0 ? `translate3d(0, ${e * 140}%, 0) rotate(${TUMBLE[i % TUMBLE.length] * e}deg)` : '';
        el.style.opacity = String(1 - k);
        el.style.filter = k > 0.01 ? `blur(${k * 6}px)` : '';
      });

      // Eyebrow fades up; each heading line rises out of its own mask.
      const eb = easeOutCubic(range(p, ...T.eyebrow));
      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(eb);
        eyebrowRef.current.style.transform = `translate3d(0, ${(1 - eb) * 12}px, 0)`;
      }
      lineRefs.current.forEach((el, i) => {
        const start = T.heading + i * T.headingStep;
        const e = easeOutCubic(range(p, start, start + T.headingLen));
        el.style.transform = `translate3d(0, ${(1 - e) * 110}%, 0) rotate(${(1 - e) * 4}deg)`;
      });

      // Invitation cards: swing in from the left in 3D, unwrap, catch a
      // glint as they land, then drift apart until the sheet arrives.
      const settled = T.cards + (cardRefs.current.length - 1) * T.cardStep + T.cardLen;
      cardRefs.current.forEach((el, i) => {
        const start = T.cards + i * T.cardStep;
        const a = range(p, start, start + T.cardLen);
        const e = easeOutCubic(a);
        const drift = range(p, settled, sheetStart) * (14 + i * 18);
        el.style.opacity = String(clamp(a * 2.4));
        el.style.transform =
          a >= 1
            ? `translate3d(0, ${-drift}px, 0)`
            : `perspective(1100px) translate3d(${(1 - e) * -140}px, ${(1 - e) * 36 - drift}px, 0) rotateY(${(1 - e) * -38}deg) rotateX(${(1 - e) * 14}deg) scale(${0.84 + e * 0.16})`;
        el.style.pointerEvents = a > 0.95 ? 'auto' : 'none';

        const unwrap = range(a, 0.3, 0.95);
        tissueRefs.current[i].style.opacity = String(1 - unwrap);
        textRefs.current[i].style.filter = unwrap < 0.99 ? `blur(${(1 - unwrap) * 8}px)` : '';
        const g = range(a, 0.5, 1);
        shineRefs.current[i].style.transform = `translate3d(${-140 + g * 340}%, 0, 0) skewX(-18deg)`;
      });

      // As the sheet rises the copy lifts away and the stage sinks back.
      if (perksRef.current) {
        perksRef.current.style.opacity = String(1 - x * 0.9);
        perksRef.current.style.transform = x > 0 ? `translate3d(0, ${-x * 60}px, 0)` : '';
      }
      dimRef.current!.style.opacity = String(x * 0.6);
      sceneRef.current!.style.transform = x > 0.001 ? `scale(${1 - x * 0.06})` : '';
    });
  }, []);

  const letters = [...brand.wordmark];
  const {wide, tall} = hero.story;

  return (
    <section id="top" ref={rootRef} aria-label="Introduction" className="relative" style={{height: `${STAGE_VH}svh`}}>
      <div className="grain sticky top-0 h-screen-s overflow-hidden bg-teal-deep">
        <div ref={sceneRef} className="absolute inset-0 origin-[50%_70%]">
          {/* Ground: the aqua wash from the bottom of the logo badge. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{background: 'radial-gradient(90% 70% at 50% 100%, rgb(140 199 192 / 0.35), transparent 70%)'}}
          />

          {/* The photo story, clipped by the arch window. */}
          <div ref={frameRef} className="absolute inset-0 overflow-hidden" style={{clipPath: 'inset(30% 35% 35% 35% round 999px 999px 18px 18px)'}}>
            {wide.map((w, i) => (
              <div
                key={w.src}
                ref={(el) => {
                  if (el) layerRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{opacity: i === 0 ? 1 : 0}}
              >
                <StoryLayer wide={w} tall={tall[i]} i={i} />
              </div>
            ))}
            {/* Always-on shade at the foot so the wordmark and captions read. */}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-teal-ink/70 via-teal-ink/10 to-teal-ink/30" />
            <div
              ref={scrimRef}
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-teal-ink/85 via-teal-ink/55 to-teal-ink/20 opacity-0 md:bg-linear-to-r md:from-teal-ink/90 md:via-teal-ink/50 md:to-transparent"
            />
          </div>

          {/* Gold hairline around the resting arch, like the badge's ring. */}
          <div ref={ringRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 border border-gold/70" />

          {/* Which event you're looking at. */}
          <p
            ref={chipRef}
            className="absolute right-4 bottom-[calc(19vw+3.5rem)] flex items-center gap-2 rounded-full bg-teal-ink/55 px-4 py-2 text-[0.8125rem] font-medium text-ivory opacity-0 backdrop-blur-md sm:right-6 lg:right-8"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
            <span ref={chipTextRef}>{hero.story.captions[0]}</span>
          </p>

          {/* Perks — top on phones, left column on wider screens. */}
          <div
            ref={perksRef}
            className="absolute inset-x-4 top-[12svh] text-ivory sm:inset-x-6 md:top-1/2 md:right-auto md:left-[5vw] md:w-[min(40rem,48vw)] md:-translate-y-[52%]"
          >
            <p ref={eyebrowRef} className="text-micro font-semibold text-gold-soft uppercase opacity-0">
              {perks.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-display font-medium">
              {perks.heading.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.1em]">
                  <span
                    ref={(el) => {
                      if (el) lineRefs.current[i] = el;
                    }}
                    className={`block origin-[0_100%] ${i === 1 ? 'italic' : ''}`}
                    style={{transform: 'translate3d(0,110%,0)'}}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <ul className="mt-5 space-y-2.5 md:mt-9 md:space-y-4">
              {perks.items.map((item, i) => (
                <li
                  key={item.title}
                  ref={(el) => {
                    if (el) cardRefs.current[i] = el;
                  }}
                  className="origin-[0_50%] opacity-0"
                  style={{marginLeft: `calc(${i} * clamp(0.75rem, 2.8vw, 3rem))`, pointerEvents: 'none'}}
                >
                  <div onPointerMove={tilt} onPointerLeave={untilt} className="w-full max-w-[32rem] transition-transform duration-500 ease-out will-change-transform">
                    <div className="card-stock relative flex items-center gap-4 overflow-hidden rounded-[20px] p-3.5 text-teal-ink md:gap-5 md:p-5">
                      {/* Numeral set in its own little medallion. */}
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-mist to-aqua font-mark text-[1.375rem] font-medium text-teal-deep shadow-[inset_0_1px_0_#fff,inset_0_-6px_10px_-6px_rgb(43_122_120/0.5)] ring-1 ring-gold/60 md:size-16 md:text-[1.75rem]">
                        0{i + 1}
                      </span>
                      <span
                        ref={(el) => {
                          if (el) textRefs.current[i] = el;
                        }}
                        className="min-w-0"
                        style={{filter: 'blur(8px)'}}
                      >
                        <span className="block font-display text-[clamp(1.25rem,1.8vw,1.75rem)] leading-tight font-semibold">{item.title}</span>
                        <span className="mt-1 block text-[clamp(0.875rem,0.95vw,1rem)] leading-snug text-ink/65">{item.note}</span>
                      </span>

                      {/* Tissue that lifts off as the card lands. */}
                      <span
                        ref={(el) => {
                          if (el) tissueRefs.current[i] = el;
                        }}
                        aria-hidden="true"
                        className="tissue pointer-events-none absolute inset-0 rounded-[inherit]"
                      />
                      {/* Gold glint that crosses the card once, on landing. */}
                      <span
                        ref={(el) => {
                          if (el) shineRefs.current[i] = el;
                        }}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-gold-soft/90 to-transparent mix-blend-soft-light"
                        style={{transform: 'translate3d(-140%,0,0) skewX(-18deg)'}}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 text-ivory">
            {/* Caption row sits on the wordmark's cap line. */}
            <div
              ref={(el) => {
                if (el) fadeRefs.current[0] = el;
              }}
              className="flex items-end justify-between gap-4 px-4 pb-3 text-micro font-semibold text-ivory/90 uppercase sm:px-6 lg:px-8"
            >
              <span className="hidden sm:inline">{hero.caption}</span>
              <span className="flex shrink-0 items-center gap-2 max-sm:ml-auto">
                {hero.scrollHint}
                <span aria-hidden="true" className="inline-block animate-bounce motion-reduce:animate-none">
                  ↓
                </span>
              </span>
            </div>

            <h1 className="px-3 leading-none sm:px-5 lg:px-6" aria-label={`${brand.name} — event furniture, linen and décor hire in Centurion, Pretoria and Krugersdorp`}>
              <span
                ref={markRef}
                aria-hidden="true"
                className="inline-block pb-[0.02em] font-mark leading-[0.78] font-light tracking-[0.02em] whitespace-nowrap"
              >
                {letters.map((ch, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) letterRefs.current[i] = el;
                    }}
                    className="inline-block will-change-transform"
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <div ref={dimRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-teal-ink opacity-0" />
        </div>
      </div>
    </section>
  );
}

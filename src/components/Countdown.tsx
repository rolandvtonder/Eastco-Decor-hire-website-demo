import {useEffect, useRef} from 'react';
import {process} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {clamp, lerp, pinProgress, range, smoothstep} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * "How it works", told as a countdown to the event. The section pins while a
 * giant readout counts the days down from 90 to event day and a candle burns
 * down beside it. The room changes with it: a cool teal dusk warms to
 * candlelight, the motes drifting up off the floor slow, turn gold and start
 * falling as confetti. Meanwhile the four steps slide through on a 3D
 * carousel, the one in front ringed in the current light.
 */

const SECTION_VH = 560;
const START_DAYS = 90;

/** Scroll → countdown and carousel windows, as shares of the pin. */
const W = {
  days: [0.04, 0.9] as const,
  cards: [0.06, 0.92] as const,
};

/**
 * Carousel position (0 → n-1) across the cards window. Each card holds in
 * front for the middle of its share; the ramps between are the slides.
 */
function carousel(u: number, n: number) {
  const seg = u * (n - 1);
  const i = Math.min(n - 2, Math.floor(seg));
  return i + smoothstep(range(seg - i, 0.3, 0.7));
}

type RGB = [number, number, number];
const DUSK: RGB = [140, 199, 192];
const IVORY: RGB = [250, 247, 241];
const GOLD: RGB = [230, 190, 120];
const BG_DUSK: RGB = [8, 48, 47];
const BG_MID: RGB = [10, 30, 32];
const BG_LIT: RGB = [40, 26, 12];

const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
/** Three-stop ramp: a at 0, b at 0.5, c at 1. */
const ramp = (a: RGB, b: RGB, c: RGB, t: number) => (t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2));
const rgb = ([r, g, b]: RGB, alpha = 1) => `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;

function statusFor(days: number) {
  if (days > 60) return 'Dreaming it up';
  if (days > 30) return 'Shortlisting';
  if (days > 0) return 'Booked & counting';
  return 'Event day';
}

type Particle = {x: number; y: number; speed: number; size: number; phase: number};

function makeParticles(count: number): Particle[] {
  // Deterministic scatter so the field is the same on every visit.
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({length: count}, () => ({
    x: rand(),
    y: rand(),
    speed: 0.5 + rand() * 0.8,
    size: 0.7 + rand() * 1.3,
    phase: rand() * Math.PI * 2,
  }));
}

export function Countdown() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const daysRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const waxRef = useRef<HTMLSpanElement>(null);
  const flameRef = useRef<HTMLSpanElement>(null);
  const candleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const imgRefs = useRef<HTMLElement[]>([]);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  // Canvas backing store follows its CSS size.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const particles = makeParticles(window.matchMedia('(max-width: 767px)').matches ? 50 : 110);
    let lastTime = 0;
    let lastP = -1;
    let lastDays = NaN;
    let lastStep = -1;

    return onFrame((time) => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) {
        lastTime = 0;
        return;
      }
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
      lastTime = time;

      const t = smoothstep(range(p, ...W.days));
      const light = ramp(DUSK, IVORY, GOLD, t);

      // --- Motes → confetti. Runs every frame while on screen. ---
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const dpr = canvas.width / Math.max(1, cw);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';
      const vy = lerp(-0.05, 0.06, t); // share of the height per second
      ctx.fillStyle = rgb(ramp(DUSK, [255, 236, 200], [240, 200, 130], t), 1);
      const moving = !reducedRef.current;
      for (const pt of particles) {
        if (moving) {
          pt.y += vy * pt.speed * dt;
          pt.x += Math.sin(time * 0.0006 + pt.phase) * 0.012 * dt;
          if (pt.y < -0.02) pt.y += 1.04;
          if (pt.y > 1.02) pt.y -= 1.04;
          if (pt.x < 0) pt.x += 1;
          if (pt.x > 1) pt.x -= 1;
        }
        // Motes twinkle small; confetti is larger and turns as it falls.
        const twinkle = t < 0.5 ? 0.55 + 0.45 * Math.sin(time * 0.004 + pt.phase * 3) : 0.8;
        ctx.globalAlpha = lerp(0.6, 0.7, t) * twinkle;
        const r = pt.size * lerp(1.1, 2.4, t);
        ctx.beginPath();
        if (t > 0.6) {
          const a = time * 0.002 * pt.speed + pt.phase;
          ctx.ellipse(pt.x * cw, pt.y * ch, r * 1.4, r * Math.abs(Math.cos(a)) * 0.8 + 0.4, a, 0, Math.PI * 2);
        } else {
          ctx.arc(pt.x * cw, pt.y * ch, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      // --- Room light. ---
      stage.style.setProperty('--glow', rgb(light));
      stage.style.setProperty('--glow-soft', rgb(light, 0.28));
      stage.style.backgroundColor = rgb(ramp(BG_DUSK, BG_MID, BG_LIT, t));

      // --- Readout + candle. ---
      const days = Math.round(lerp(START_DAYS, 0, t));
      if (days !== lastDays) {
        lastDays = days;
        daysRef.current!.textContent = String(days);
        unitRef.current!.textContent = days === 1 ? 'day to go' : days === 0 ? "it's today" : 'days to go';
        statusRef.current!.textContent = statusFor(days);
      }
      const k = lerp(1, 0.12, t);
      waxRef.current!.style.transform = `scaleY(${k})`;
      const h = candleRef.current!.clientHeight;
      flameRef.current!.style.transform = `translate3d(-50%, ${(1 - k) * h}px, 0)`;

      // --- Carousel. ---
      const n = cardRefs.current.length;
      const u = range(p, ...W.cards);
      const f = carousel(u, n);
      const step = Math.round(f);
      if (step !== lastStep) {
        lastStep = step;
        counterRef.current!.textContent = `0${step + 1}`;
      }
      barRef.current!.style.transform = `scaleX(${u})`;

      const vw = window.innerWidth;
      const gap = vw < 768 ? vw * 0.05 : vw * 0.03;
      cardRefs.current.forEach((card, i) => {
        const d = i - f; // <0 already passed, 0 in front, >0 still coming
        const w = card.offsetWidth;
        const x = d * (w + gap) + (d < 0 ? d * w * 0.35 : 0);
        const a = Math.abs(d);
        const scale = 1 - Math.min(a, 1.5) * 0.1;
        const rot = clamp(d, -1.5, 1.5) * -16;
        const lift = d < 0 ? d * -40 : 0;
        card.style.transform = `translate3d(${x}px, calc(-50% - ${lift}px), 0) perspective(1200px) rotateY(${rot}deg) scale(${scale})`;
        card.style.opacity = String(clamp(d < 0 ? 1 + d * 1.6 : 1 - d * 0.38));
        card.style.zIndex = String(10 - Math.round(a * 2));
        // Only the card in front wears the ring.
        card.style.setProperty('--ring', String(clamp(1 - a * 2)));
        // Scaled from the top edge so heads never crop; drift is sideways only.
        imgRefs.current[i].style.transform = `translate3d(${d * -24}px, 0, 0) scale(1.1)`;
      });
    });
  }, []);

  return (
    <section ref={rootRef} id="how-it-works" aria-labelledby="process-title" className="relative" style={{height: `${SECTION_VH}svh`}}>
      <div ref={stageRef} className="sticky top-0 h-screen-s overflow-hidden text-ivory" style={{backgroundColor: rgb(BG_DUSK)}}>
        {/* Glow off the floor, in the current light. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{background: 'radial-gradient(70% 60% at 22% 100%, var(--glow-soft, rgba(140,199,192,0.28)), transparent 70%)'}}
        />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />

        {/* Heading. */}
        <div className="absolute inset-x-4 top-24 sm:inset-x-6 md:top-28 lg:inset-x-8">
          <p className="text-micro font-semibold uppercase" style={{color: 'var(--glow, #8cc7c0)'}}>
            {process.eyebrow}
          </p>
          <h2 id="process-title" className="mt-3 max-w-[13ch] font-display text-[clamp(2.25rem,4.2vw,4.25rem)] leading-[0.95] font-medium">
            {process.heading}
          </h2>
        </div>

        {/* Readout + candle. */}
        <div className="absolute inset-x-4 top-[30svh] flex items-end gap-6 sm:inset-x-6 md:top-auto md:right-auto md:bottom-[12svh] md:left-8">
          <div ref={candleRef} aria-hidden="true" className="relative hidden h-[30svh] w-5 shrink-0 md:block">
            {/* Wax burns down from the top. */}
            <span
              ref={waxRef}
              className="absolute inset-0 origin-bottom rounded-t-[6px] rounded-b-[3px] bg-linear-to-r from-[#efe6d4] via-ivory to-[#e3d6bd] shadow-[inset_0_-8px_14px_-8px_rgb(0_0_0/0.25)]"
            />
            {/* Flame rides the top of the wax. */}
            <span ref={flameRef} className="absolute -top-7 left-1/2 block h-7 w-3.5" style={{transform: 'translate3d(-50%,0,0)'}}>
              <span className="absolute inset-0 origin-bottom animate-[flicker_1.6s_ease-in-out_infinite] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-linear-to-t from-[#ff9a3c] via-[#ffd27a] to-[#fff6dc] shadow-[0_0_24px_8px_rgb(255_190_100/0.45)] motion-reduce:animate-none" />
            </span>
            <span className="absolute -bottom-2 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-gold/70" />
            <span className="absolute -top-14 left-1/2 -translate-x-1/2 text-[0.6875rem] font-medium whitespace-nowrap text-ivory/55">90 days</span>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[0.6875rem] font-medium whitespace-nowrap text-ivory/55">Event day</span>
          </div>
          <div aria-live="off">
            <span className="flex items-baseline gap-3">
              <span
                ref={daysRef}
                className="block font-mark text-[clamp(4.25rem,11vw,11rem)] leading-[0.8] font-light tabular-nums"
                style={{color: 'var(--glow, #8cc7c0)'}}
              >
                {START_DAYS}
              </span>
              <span ref={unitRef} className="font-display text-[clamp(1.125rem,1.6vw,1.5rem)] italic text-ivory/80">
                days to go
              </span>
            </span>
            <span className="mt-3 flex items-center gap-2 text-micro font-semibold text-ivory/85 uppercase">
              <span className="size-2 rounded-full" style={{background: 'var(--glow, #8cc7c0)'}} />
              <span ref={statusRef}>Dreaming it up</span>
            </span>
          </div>
        </div>

        {/* Carousel. Cards are anchored at one spot and moved by transform. */}
        <ol className="absolute inset-0" aria-label="Steps">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="absolute top-[70svh] left-[5vw] w-[78vw] origin-[50%_50%] md:top-1/2 md:left-[44vw] md:w-[min(25rem,28vw)]"
              style={{transform: 'translate3d(0,-50%,0)'}}
            >
              <article
                className="rounded-[26px] bg-white/[0.06] p-2.5 ring-1 ring-white/12 backdrop-blur-sm"
                style={{
                  boxShadow:
                    '0 0 0 calc(var(--ring, 0) * 1.5px) var(--glow, #8cc7c0), 0 40px 90px -40px color-mix(in srgb, var(--glow, #8cc7c0) calc(var(--ring, 0) * 80%), transparent)',
                }}
              >
                <div className="relative overflow-hidden rounded-t-[120px] rounded-b-[18px] bg-teal-deep max-md:aspect-[16/10] md:aspect-[4/4.2]">
                  <div
                    ref={(el) => {
                      if (el) imgRefs.current[i] = el;
                    }}
                    className="absolute inset-0 origin-top"
                    style={{transform: 'scale(1.1)'}}
                  >
                    <img
                      src={step.image.src}
                      alt={step.image.alt}
                      width={step.image.w}
                      height={step.image.h}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute top-1/4 left-3 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold backdrop-blur-md ${
                      i === process.steps.length - 1 ? 'bg-gold text-teal-ink' : 'bg-ivory/90 text-teal-ink'
                    }`}
                  >
                    {step.days}
                  </span>
                  <span className="absolute inset-x-3 bottom-3 font-display text-[1.375rem] leading-tight font-semibold italic [text-shadow:0_2px_16px_rgb(0_0_0/0.7)]">
                    {step.caption}
                  </span>
                </div>
                <div className="flex gap-4 px-2.5 pt-4 pb-3">
                  <span aria-hidden="true" className="font-mark text-[2.75rem] leading-[0.85] font-light text-transparent" style={{WebkitTextStroke: '1px rgb(250 247 241 / 0.55)'}}>
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.625rem] leading-tight font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ivory/70">{step.body}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        {/* Step counter. */}
        <div className="absolute right-4 bottom-6 left-4 flex items-center gap-4 sm:right-6 sm:left-6 md:left-[44vw] lg:right-8" aria-hidden="true">
          <span className="font-mark text-[1.125rem] font-medium tabular-nums">
            <span ref={counterRef}>01</span>
            <span className="text-ivory/45"> / 0{process.steps.length}</span>
          </span>
          <span className="relative h-px flex-1 bg-white/15">
            <span ref={barRef} className="absolute inset-0 origin-left" style={{background: 'var(--glow, #8cc7c0)', transform: 'scaleX(0)'}} />
          </span>
        </div>
      </div>
    </section>
  );
}

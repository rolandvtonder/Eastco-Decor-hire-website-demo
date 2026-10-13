import {useEffect, useRef} from 'react';
import {about} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {easeOutCubic} from '../lib/math';

/** The four numbers, counting up once the first time they are seen. */
export function Stats() {
  const listRef = useRef<HTMLUListElement>(null);
  const numRefs = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const list = listRef.current!;
    const fmt = (v: number, i: number) => {
      const s = about.stats[i];
      if (s.display) return s.display;
      return s.pad ? String(v).padStart(2, '0') : String(v);
    };
    if (reduced) {
      numRefs.current.forEach((el, i) => (el.textContent = fmt(about.stats[i].value, i)));
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = easeOutCubic(Math.min(1, (now - start) / 1600));
          numRefs.current.forEach((el, i) => {
            const s = about.stats[i];
            el.textContent = s.display && k < 1 ? `${Math.round(k)}:${Math.round(k)}` : fmt(Math.round(s.value * k), i);
          });
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      {threshold: 0.4},
    );
    io.observe(list);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <ul ref={listRef} className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/12 ring-1 ring-white/12 lg:grid-cols-4">
      {about.stats.map((s, i) => (
        <li key={s.label} className="bg-teal-deep p-6 md:p-8">
          {/* The final value is in the accessible text from the start. */}
          <span className="sr-only">
            {s.display ?? s.value} {s.label}.
          </span>
          <span
            aria-hidden="true"
            ref={(el) => {
              if (el) numRefs.current[i] = el;
            }}
            className="block font-mark text-[clamp(3.5rem,6vw,5.5rem)] leading-none font-light text-gold tabular-nums"
          >
            {s.display ?? (s.pad ? '00' : '0')}
          </span>
          <span aria-hidden="true" className="mt-3 block font-display text-[1.5rem] leading-tight font-semibold">
            {s.label}
          </span>
          <span className="mt-1 block text-[0.875rem] leading-snug text-ivory/65">{s.note}</span>
        </li>
      ))}
    </ul>
  );
}

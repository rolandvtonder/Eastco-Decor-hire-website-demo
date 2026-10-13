import {useEffect, useRef, type RefObject} from 'react';
import type {Photo} from '../content';
import {range, smoothstep} from '../lib/math';
import {onFrame} from '../lib/scroll';

type Props = {
  photos: Photo[];
  /** 0–1, written by the parent each frame from its own scroll maths. */
  progress: RefObject<number>;
  className?: string;
  label?: string;
};

/**
 * A sequence played by scrolling rather than by time: photographs stacked in
 * one frame, each fading in over the last with a slow push-in as the parent's
 * progress advances — the table being dressed, layer by layer.
 */
export function PhotoStack({photos, progress, className = '', label}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let last = -1;
    return onFrame(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) return;
      const t = Math.min(1, Math.max(0, progress.current ?? 0));
      if (Math.abs(t - last) < 0.0005) return;
      last = t;
      const s = t * (photos.length - 1);
      layerRefs.current.forEach((el, i) => {
        const shown = i === 0 ? 1 : smoothstep(range(s, i - 0.7, i - 0.2));
        const k = range(s, i - 1, i + 1);
        el.style.opacity = String(shown);
        el.style.transform = `scale(${1.12 - k * 0.1})`;
      });
    });
  }, [photos.length, progress]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      {photos.map((ph, i) => (
        <img
          key={ph.src}
          ref={(el) => {
            if (el) layerRefs.current[i] = el;
          }}
          src={ph.src}
          alt=""
          aria-hidden="true"
          width={ph.w}
          height={ph.h}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          style={{opacity: i === 0 ? 1 : 0, transform: 'scale(1.12)'}}
        />
      ))}
    </div>
  );
}

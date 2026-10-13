import {useEffect, useRef} from 'react';
import type {Photo} from '../content';
import {clamp} from '../lib/math';
import {onFrame} from '../lib/scroll';

type Props = {
  photo: Photo;
  className?: string;
  imgClassName?: string;
  /** Pixels of travel either side of centre as the frame crosses the viewport. */
  strength?: number;
  /** Override the photo's own alt text ('' marks it decorative). */
  alt?: string;
  eager?: boolean;
};

/**
 * A photograph that drifts against its frame as the frame crosses the
 * viewport. The image is scaled up just enough that the drift never shows an
 * edge.
 */
export function ParallaxImage({photo, className = '', imgClassName = '', strength = 32, alt, eager = false}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let last = 2;
    return onFrame(() => {
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -80 || r.top > vh + 80 || r.height === 0) return;
      // -1 as the frame enters from below, 0 centred, 1 as it leaves the top.
      const k = clamp((vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2), -1, 1);
      if (Math.abs(k - last) < 0.001) return;
      last = k;
      const scale = 1 + (strength * 2.2) / Math.max(1, r.height);
      img.style.transform = `translate3d(0, ${k * strength}px, 0) scale(${scale})`;
    });
  }, [strength]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={photo.src}
        alt={alt ?? photo.alt}
        width={photo.w}
        height={photo.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`size-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

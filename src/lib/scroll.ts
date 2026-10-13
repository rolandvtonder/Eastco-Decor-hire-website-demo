import Lenis from 'lenis';

/**
 * One rAF loop per page. Lenis advances first, then every scroll-driven
 * component reads its own rect and writes styles directly — nothing here goes
 * through React state, so scrolling never re-renders.
 */

type Tick = (time: number) => void;

const subscribers = new Set<Tick>();
let lenis: Lenis | null = null;

/** Clearance for the fixed header when landing on an in-page anchor. */
const HEADER_OFFSET = -88;

function target(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null;
  try {
    return document.querySelector<HTMLElement>(decodeURIComponent(hash));
  } catch {
    return null;
  }
}

/** Smooth-scrolls to an in-page hash like `#linen`, or to the top for `#top`. */
export function scrollToHash(hash: string, immediate = false) {
  const el = hash === '#top' ? 0 : target(hash);
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, {duration: 1.6, offset: el === 0 ? 0 : HEADER_OFFSET, immediate});
  } else if (typeof el === 'number') {
    window.scrollTo({top: 0});
  } else {
    el.scrollIntoView();
  }
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
}

/**
 * Same-page anchors (including `/catalogue/#linen` while already on the
 * catalogue) glide instead of jumping; links to other pages navigate normally.
 */
function onClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  e.preventDefault();
  scrollToHash(url.hash);
}

export function startScroll(reducedMotion: boolean): () => void {
  if (!reducedMotion) {
    lenis = new Lenis({lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95});
  }

  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    subscribers.forEach((fn) => fn(time));
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  document.addEventListener('click', onClick);

  // Arriving from another page with a hash: land on it once fonts have set
  // the layout (scroll restoration is manual, so the browser won't).
  // The jump is repeated once everything has loaded, unless the visitor has
  // started scrolling themselves, in case late content moved the target.
  let userMoved = false;
  const onUser = () => (userMoved = true);
  if (location.hash) {
    const hash = location.hash;
    const jump = () => !userMoved && requestAnimationFrame(() => scrollToHash(hash, true));
    // Every pinned section's height is fixed in viewport units and every
    // image declares its size, so the first jump is already close.
    jump();
    void document.fonts?.ready.then(jump);
    if (document.readyState === 'complete') jump();
    else window.addEventListener('load', jump, {once: true});
    window.addEventListener('wheel', onUser, {once: true, passive: true});
    window.addEventListener('touchstart', onUser, {once: true, passive: true});
    window.addEventListener('keydown', onUser, {once: true});
  }

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('click', onClick);
    window.removeEventListener('wheel', onUser);
    window.removeEventListener('touchstart', onUser);
    window.removeEventListener('keydown', onUser);
    lenis?.destroy();
    lenis = null;
  };
}

export function onFrame(fn: Tick): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

/** Glides to an absolute scroll position (used to bring focused content into a pinned stage). */
export function scrollToPosition(y: number) {
  if (lenis) lenis.scrollTo(y, {duration: 0.8});
  else window.scrollTo({top: y});
}

/** Freezes page scrolling under a modal (lightbox, mobile menu). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

import {useCallback, useEffect, useRef, useState} from 'react';
import {galleryArchive} from '../content';
import {lockScroll} from '../lib/scroll';
import {Section, SectionHead} from './Bits';
import {IconChevron, IconClose, IconExpand} from './Icons';

/**
 * The archive as a masonry wall. Every picture opens a lightbox — a native
 * <dialog>, so focus is trapped, Escape closes it and the page behind is
 * inert for free. Arrow keys and buttons step through; nothing depends on a
 * swipe.
 */
export function GalleryGrid() {
  const list = galleryArchive.photos;
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    const dlg = dialogRef.current!;
    if (index !== null && !dlg.open) {
      dlg.showModal();
      lockScroll(true);
    } else if (index === null && dlg.open) {
      dlg.close();
    }
  }, [index]);

  useEffect(() => {
    const dlg = dialogRef.current!;
    const onClose = () => {
      setIndex(null);
      lockScroll(false);
      openerRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    dlg.addEventListener('close', onClose);
    dlg.addEventListener('keydown', onKey);
    return () => {
      dlg.removeEventListener('close', onClose);
      dlg.removeEventListener('keydown', onKey);
    };
  }, [step]);

  const current = index === null ? null : list[index];

  return (
    <Section id="archive" labelledBy="archive-title" className="bg-linen py-24 md:py-36">
      <SectionHead id="archive-title" eyebrow={galleryArchive.eyebrow} title={galleryArchive.heading} lede="Tap any photograph to see it larger." />

      <ul className="mt-12 columns-2 gap-3 md:mt-16 md:columns-3 md:gap-5 xl:columns-4">
        {list.map((ph, i) => (
          <li key={ph.src} className="mb-3 break-inside-avoid md:mb-5" data-reveal style={{['--reveal-delay' as string]: `${(i % 4) * 0.06}s`}}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block w-full overflow-hidden rounded-[18px] bg-teal-ink/5"
              aria-label={`View larger: ${ph.alt}`}
            >
              <img
                src={ph.src}
                alt=""
                width={ph.w}
                height={ph.h}
                loading="lazy"
                decoding="async"
                className="w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-ivory/90 text-teal-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <IconExpand />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ivory backdrop:bg-teal-ink/94 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 px-4 py-16 md:px-24">
            <figure className="pointer-events-auto flex max-h-full min-h-0 flex-col items-center">
              <img src={current.src} alt={current.alt} width={current.w} height={current.h} className="max-h-[calc(100dvh-11rem)] w-auto min-w-0 rounded-[14px] object-contain" />
              <figcaption className="mt-4 max-w-[46rem] text-center text-[0.9375rem] text-ivory/85">
                {current.alt}
                {current.credit && <span className="mt-1 block text-[0.8125rem] text-ivory/55">Photo: {current.credit}</span>}
              </figcaption>
            </figure>
            <p className="pointer-events-auto text-micro font-semibold text-gold uppercase" aria-live="polite">
              {index! + 1} of {list.length}
            </p>
          </div>
        )}
        <button type="button" onClick={close} aria-label="Close photo viewer" className="fixed top-4 right-4 grid size-12 place-items-center rounded-full bg-white/12 hover:bg-white/20">
          <IconClose />
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="fixed top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 hover:bg-white/20 md:left-6">
          <IconChevron dir="left" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className="fixed top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 hover:bg-white/20 md:right-6">
          <IconChevron dir="right" />
        </button>
      </dialog>
    </Section>
  );
}

import {useEffect, useId, useRef, useState} from 'react';
import {branches} from '../content';
import {onFrame} from '../lib/scroll';
import {IconClose, IconWhatsApp} from './Icons';

/**
 * Floating WhatsApp button. Eastco has two branches with two numbers, so it
 * opens a small chooser instead of guessing which branch you meant.
 */
export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tucked away over the opening hero (where it would sit on the wordmark),
  // it rises in once you start reading.
  useEffect(() => {
    const el = wrapRef.current!;
    let last = '';
    return onFrame(() => {
      const next = window.scrollY > window.innerHeight * 0.5 ? 'true' : 'false';
      if (next === last) return;
      el.dataset.shown = last = next;
      // While hidden it is out of the tab order too, not just invisible.
      el.inert = next === 'false';
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      data-shown="false"
      className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 transition-[opacity,transform] duration-500 data-[shown=false]:pointer-events-none data-[shown=false]:translate-y-6 data-[shown=false]:opacity-0 sm:right-6 sm:bottom-6"
    >
      <div
        id={id}
        role="group"
        aria-label="WhatsApp a branch"
        inert={!open}
        className={`w-64 origin-bottom-right rounded-3xl bg-ivory p-2 text-teal-ink shadow-[0_24px_60px_-20px_rgb(8_48_47/0.6)] ring-1 ring-teal-ink/10 transition-[opacity,transform] duration-300 ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
        }`}
      >
        <p className="px-3 pt-2 pb-1 text-micro font-semibold text-gold-deep uppercase">WhatsApp a branch</p>
        {branches.map((b) => (
          <a
            key={b.id}
            href={b.whatsapp}
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3 hover:bg-mist"
          >
            <span>
              <span className="block text-nav font-semibold">{b.name}</span>
              <span className="mt-1 block text-[0.8125rem] text-ink/65">{b.phone}</span>
            </span>
            <IconWhatsApp className="size-5 text-[#128c4a]" />
          </a>
        ))}
      </div>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? 'Close WhatsApp options' : 'Chat on WhatsApp'}
        onClick={() => setOpen((v) => !v)}
        className="grid size-14 place-items-center rounded-full bg-[#128c4a] text-white shadow-[0_14px_30px_-10px_rgb(8_48_47/0.7)] ring-2 ring-white/70 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <IconClose className="size-6" /> : <IconWhatsApp className="size-7" />}
      </button>
    </div>
  );
}

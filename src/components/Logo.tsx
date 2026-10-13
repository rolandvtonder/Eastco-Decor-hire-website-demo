import {brand} from '../content';

/**
 * A single sprig from the logo's wreath — stem, five leaves and a bud.
 * Drawn, not an icon font, so it inherits currentColor. Used wherever the
 * reference design used its snowflake: list bullets, marquee separators,
 * eyebrows.
 */
export function Sprig({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 27C11 21 15 14 25 5" />
        <path d="M11.5 20.5c-3.4.2-5.6-1.1-6.5-3.6 3-.6 5.3.4 6.5 3.6Z" fill="currentColor" fillOpacity=".25" />
        <path d="M11.5 20.5c.5-3.3 2.4-5 5.2-5.4-.2 3-2 4.9-5.2 5.4Z" fill="currentColor" fillOpacity=".25" />
        <path d="M16.6 14.4c-3.2-.4-4.9-2.2-5.2-4.9 2.9.1 4.7 1.8 5.2 4.9Z" fill="currentColor" fillOpacity=".25" />
        <path d="M16.6 14.4c1-3.1 3.1-4.4 5.9-4.4-.6 2.9-2.7 4.5-5.9 4.4Z" fill="currentColor" fillOpacity=".25" />
        <path d="M21.4 9.2c-2.3-1.6-2.9-3.7-2.2-6 2.4 1 3.1 3.2 2.2 6Z" fill="currentColor" fillOpacity=".25" />
      </g>
      <circle cx="25.6" cy="4.6" r="1.8" fill="currentColor" />
    </svg>
  );
}

/** The real logo badge. */
export function LogoBadge({className = 'size-11', alt = ''}: {className?: string; alt?: string}) {
  return (
    <img
      src={brand.logo}
      alt={alt}
      width={512}
      height={512}
      decoding="async"
      className={`shrink-0 rounded-full bg-white object-contain shadow-[0_6px_18px_-8px_rgb(8_48_47/0.6)] ${className}`}
    />
  );
}

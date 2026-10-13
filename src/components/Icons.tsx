/**
 * One small, consistent line-icon set (1.6 stroke, round caps) drawn inline
 * so every glyph inherits currentColor. All are decorative: whatever they sit
 * beside carries the accessible name.
 */
type P = {className?: string};

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const IconArrow = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowUp = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconPhone = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </svg>
);

export const IconMail = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconPin = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const IconDownload = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </svg>
);

export const IconOpen = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </svg>
);

export const IconClose = ({className = 'size-5'}: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconChevron = ({className = 'size-5', dir = 'right'}: P & {dir?: 'left' | 'right' | 'down'}) => (
  <svg {...base} className={className}>
    {dir === 'left' && <path d="m15 5-7 7 7 7" />}
    {dir === 'right' && <path d="m9 5 7 7-7 7" />}
    {dir === 'down' && <path d="m5 9 7 7 7-7" />}
  </svg>
);

export const IconExpand = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);

export const IconCalendar = ({className = 'size-5'}: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const IconList = ({className = 'size-5'}: P) => (
  <svg {...base} className={className}>
    <path d="M9 7h11M9 12h11M9 17h11" />
    <circle cx="4.5" cy="7" r=".9" fill="currentColor" />
    <circle cx="4.5" cy="12" r=".9" fill="currentColor" />
    <circle cx="4.5" cy="17" r=".9" fill="currentColor" />
  </svg>
);

/** WhatsApp's own mark (filled), so it is instantly recognisable. */
export const IconWhatsApp = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.08.8.82-3-.2-.31a8.2 8.2 0 1 1 6.94 3.84Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.7c1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const IconInstagram = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M14.5 8H17V4.5h-2.5A3.5 3.5 0 0 0 11 8v2.5H8.5V14H11v6.5h3.5V14H17l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5Z" />
  </svg>
);

export const IconTikTok = ({className = 'size-4'}: P) => (
  <svg {...base} className={className}>
    <path d="M14 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M14 3.5c.4 2.6 2.2 4.3 5 4.5" />
  </svg>
);

export const socialIcon = (label: string, className?: string) =>
  label === 'Instagram' ? (
    <IconInstagram className={className} />
  ) : label === 'Facebook' ? (
    <IconFacebook className={className} />
  ) : (
    <IconTikTok className={className} />
  );

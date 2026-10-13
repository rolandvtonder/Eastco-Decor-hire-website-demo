import {branches} from '../content';
import {IconMail, IconPhone, IconPin, IconWhatsApp} from './Icons';

/** Both branches, every way to reach them. `map` adds an embedded map to each. */
export function BranchCards({map = false, headingLevel = 3}: {map?: boolean; headingLevel?: 2 | 3}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {branches.map((b, i) => (
        <article
          key={b.id}
          id={b.id}
          data-reveal
          style={{['--reveal-delay' as string]: `${i * 0.12}s`}}
          className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-40px_rgb(8_48_47/0.5)] ring-1 ring-teal-ink/10"
        >
          <div className="p-6 md:p-8">
            <p className="text-micro font-semibold text-gold-deep uppercase">{b.region}</p>
            <H className="mt-2 font-display text-[2.25rem] leading-none font-medium text-teal-ink">{b.name}</H>
            <address className="mt-5 not-italic">
              <ul className="space-y-3 text-body text-ink/80">
                <li className="flex gap-3">
                  <IconPin className="mt-1 size-5 shrink-0 text-teal" />
                  <span>
                    {b.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </li>
                <li>
                  <a href={`tel:${b.tel}`} className="flex min-h-11 items-center gap-3 font-medium text-teal-ink hover:underline">
                    <IconPhone className="size-5 shrink-0 text-teal" />
                    {b.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${b.email}`} className="flex min-h-11 items-center gap-3 font-medium break-all text-teal-ink hover:underline">
                    <IconMail className="size-5 shrink-0 text-teal" />
                    {b.email}
                  </a>
                </li>
              </ul>
            </address>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={b.whatsapp}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#128c4a] px-5 text-nav font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <IconWhatsApp /> WhatsApp
              </a>
              <a
                href={`tel:${b.tel}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-deep px-5 text-nav font-semibold text-ivory transition-transform hover:-translate-y-0.5"
              >
                <IconPhone /> Call
              </a>
              <a
                href={b.maps}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-nav font-semibold text-teal-ink ring-1 ring-teal-ink/20 hover:bg-teal-ink/5"
              >
                <IconPin /> Directions
              </a>
            </div>
          </div>
          {map && (
            <iframe
              title={`Map showing the ${b.name} branch`}
              src={b.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-auto aspect-[16/10] w-full border-0 grayscale-[35%]"
            />
          )}
        </article>
      ))}
    </div>
  );
}

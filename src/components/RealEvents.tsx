import {realEvents} from '../content';
import {Section, SectionHead} from './Bits';
import {ParallaxImage} from './ParallaxImage';

/**
 * Three real events, each as a spread: a tall arched photograph with two
 * smaller frames drifting against it, the story beside it and the full credit
 * list — suppliers deserve their names on the page.
 */
export function RealEvents() {
  return (
    <Section id="real-events" labelledBy="events-title" className="py-24 md:py-36">
      <SectionHead id="events-title" eyebrow={realEvents.eyebrow} title={realEvents.heading} lede={realEvents.lede} />

      <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
        {realEvents.items.map((ev, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={ev.title} aria-labelledby={`event-${i}`} className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
              <div className={`relative md:col-span-7 ${flip ? 'md:order-2 md:col-start-6' : ''}`}>
                <div className="grid grid-cols-[3fr_2fr] gap-3 md:gap-5">
                  <ParallaxImage
                    photo={ev.photos[0]}
                    strength={28}
                    className="row-span-2 aspect-[3/4] rounded-t-full rounded-b-[22px] ring-1 ring-gold/50"
                  />
                  <div data-reveal="clip" className="overflow-hidden rounded-[22px]">
                    <ParallaxImage photo={ev.photos[1]} strength={18} className="aspect-[4/5] size-full" />
                  </div>
                  <div data-reveal="clip" className="overflow-hidden rounded-[22px]" style={{['--reveal-delay' as string]: '0.15s'}}>
                    <ParallaxImage photo={ev.photos[2]} strength={18} className="aspect-[4/5] size-full" />
                  </div>
                </div>
              </div>

              <div className={`md:col-span-4 ${flip ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`} data-reveal>
                <p className="text-micro font-semibold text-gold-deep uppercase">{ev.kind}</p>
                <h3 id={`event-${i}`} className="mt-3 font-display text-[clamp(2rem,3.2vw,3rem)] leading-[1] font-medium text-teal-ink">
                  {ev.title}
                </h3>
                <p className="mt-4 text-body text-ink/75">{ev.body}</p>
                <dl className="mt-6 divide-y divide-teal-ink/10 border-y border-teal-ink/10 text-[0.875rem]">
                  {ev.credits.map(([role, name]) => (
                    <div key={role} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-ink/60">{role}</dt>
                      <dd className={`text-right font-medium ${name === 'Eastco' ? 'text-teal' : 'text-teal-ink'}`}>{name}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

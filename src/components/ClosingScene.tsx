import {useId} from 'react';
import {brand, branches, cta, quoteHref} from '../content';
import {useFitText} from '../hooks/useFitText';
import {useReveals} from '../hooks/useReveals';
import {IconArrow, IconPhone, IconWhatsApp} from './Icons';
import {ParallaxImage} from './ParallaxImage';

/** Rotating sticker built around the logo badge. */
function Sticker({className = ''}: {className?: string}) {
  const id = useId();
  return (
    <div className={`size-28 md:size-40 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 size-full drop-shadow-[0_10px_24px_rgb(0_0_0/0.35)]">
        <defs>
          <path id={id} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#faf7f1" />
        <circle cx="100" cy="100" r="96" fill="none" stroke="#c49a5b" strokeWidth="1.5" />
        <text fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" letterSpacing="2.4" fill="#08302f">
          <textPath href={`#${id}`}>{cta.sticker}</textPath>
        </text>
      </svg>
      <img
        src={brand.logo}
        alt=""
        width={512}
        height={512}
        loading="lazy"
        className="absolute inset-[19%] size-[62%] rounded-full bg-white object-contain ring-1 ring-gold"
      />
    </div>
  );
}

/**
 * The last beat on every page: the long table under the festoon lights, an
 * invitation to send your date, both branches one tap away and a full-width
 * CELEBRATE line to close.
 */
export function ClosingScene({showQuote = true}: {showQuote?: boolean}) {
  const markRef = useFitText<HTMLSpanElement>();
  const sectionRef = useReveals<HTMLElement>();

  return (
    <section ref={sectionRef} id="enquire" aria-labelledby="cta-title" className="relative overflow-hidden rounded-t-[28px] bg-teal-deep text-ivory">
      {/* Phones: the scene is a band on top. Wide screens: it fills the section. */}
      <div className="relative md:absolute md:inset-0">
        <div className="md:hidden">
          <ParallaxImage photo={cta.image} strength={26} className="aspect-[4/5] max-h-[70svh] w-full" imgClassName="object-[50%_30%]" />
        </div>
        <div className="hidden size-full md:block">
          <ParallaxImage photo={cta.wideImage} strength={34} className="size-full" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-teal-deep via-teal-deep/10 to-transparent md:bg-linear-to-r md:from-teal-deep md:via-teal-deep/60 md:to-teal-deep/5" />
        <Sticker className="absolute top-[8%] right-[5%] rotate-[-8deg] md:top-[14%] md:right-[7%]" />
      </div>

      <div className="relative px-4 pt-2 pb-10 sm:px-6 md:min-h-[100svh] md:pt-32 lg:px-8">
        <div className="max-w-[34rem]" data-reveal>
          <p className="font-script text-[2.25rem] leading-none text-gold-soft">{cta.eyebrow}</p>
          <h2 id="cta-title" className="mt-3 font-display text-title font-medium">
            {cta.heading}
          </h2>
          <p className="mt-4 text-lede text-ivory/85">{cta.lede}</p>

          {showQuote && (
            <a
              href={quoteHref}
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 py-4 text-nav font-semibold text-teal-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Request a quote <IconArrow />
            </a>
          )}

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {branches.map((b) => (
              <li key={b.id} className="rounded-2xl bg-teal-ink/55 p-4 ring-1 ring-white/12 backdrop-blur-md">
                <p className="text-micro font-semibold text-gold uppercase">{b.name}</p>
                <p className="mt-1 text-[0.8125rem] text-ivory/70">{b.region}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`tel:${b.tel}`}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white/12 px-3 text-nav font-medium whitespace-nowrap hover:bg-white/20"
                  >
                    <IconPhone /> {b.phone}
                  </a>
                  <a
                    href={b.whatsapp}
                    target="_blank"
                    rel="noopener"
                    aria-label={`WhatsApp the ${b.name} branch`}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-white/12 hover:bg-white/20"
                  >
                    <IconWhatsApp />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="-mx-1 mt-14 leading-none md:absolute md:inset-x-4 md:bottom-6 md:mx-0 lg:inset-x-6" aria-hidden="true">
          <span ref={markRef} className="inline-block font-mark leading-[0.8] font-light tracking-[0.02em] whitespace-nowrap text-ivory/95">
            {cta.wordmark}
          </span>
        </p>
      </div>
    </section>
  );
}

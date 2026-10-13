import {Section, SectionHead} from '../components/Bits';
import {BranchCards} from '../components/BranchCards';
import {IconCalendar, IconChevron, IconList, IconPin, socialIcon} from '../components/Icons';
import {Layout, Sheet} from '../components/Layout';
import {Sprig} from '../components/Logo';
import {PageHero} from '../components/PageHero';
import {QuoteForm} from '../components/QuoteForm';
import {brand, contactPage, pageHeroes, socials} from '../content';
import {mount} from './mount';
import {url} from '../lib/url';

const beforeIcons = [IconCalendar, IconPin, IconList];

mount(
  <Layout page="contact">
    <PageHero {...pageHeroes.contact} />
    <Sheet>
      {/* Branches first: most visitors just want a number. */}
      <Section labelledBy="branches-title" className="pt-24 pb-20 md:pt-32">
        <SectionHead
          id="branches-title"
          eyebrow="Two Gauteng branches"
          title={
            <>
              Call, WhatsApp <span className="italic">or visit.</span>
            </>
          }
          lede="Speak directly to the branch closest to your venue — they hold the stock and can confirm your date."
        />
        <div className="mt-12">
          <BranchCards map />
        </div>
      </Section>

      {/* Quote form, with what to have ready beside it. */}
      <Section id="quote" labelledBy="quote-title" className="pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4" aria-labelledby="before-title" data-reveal>
            <div className="lg:sticky lg:top-28">
              <p className="flex items-center gap-2 text-micro font-semibold text-gold-deep uppercase">
                <Sprig className="size-4" />
                {contactPage.before.eyebrow}
              </p>
              <h2 id="before-title" className="mt-4 font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.02] font-medium text-teal-ink">
                {contactPage.before.heading}
              </h2>
              <ul className="mt-6 space-y-5">
                {contactPage.before.items.map((item, i) => {
                  const Icon = beforeIcons[i];
                  return (
                    <li key={item.title} className="flex gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-teal-deep ring-1 ring-gold/40">
                        <Icon />
                      </span>
                      <span>
                        <span className="block font-display text-[1.375rem] leading-tight font-semibold text-teal-ink">{item.title}</span>
                        <span className="mt-1 block text-[0.9375rem] text-ink/70">{item.body}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <a href={url('/catalogue/')} className="mt-7 inline-flex min-h-11 items-center gap-2 text-nav font-semibold text-teal underline decoration-teal/30 underline-offset-4 hover:decoration-teal">
                Open the catalogues to build your shortlist
              </a>
            </div>
          </aside>
          <div className="lg:col-span-8" data-reveal>
            <QuoteForm />
          </div>
        </div>
      </Section>

      {/* What happens next. */}
      <Section labelledBy="next-title" className="grain bg-teal-deep py-24 text-ivory md:py-32">
        <SectionHead id="next-title" dark eyebrow={contactPage.next.eyebrow} title="From shortlist to confirmed hire." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-white/12 ring-1 ring-white/12 md:grid-cols-2 lg:grid-cols-4">
          {contactPage.next.items.map((s, i) => (
            <li key={s.title} className="bg-teal-deep p-7" data-reveal style={{['--reveal-delay' as string]: `${i * 0.08}s`}}>
              <span aria-hidden="true" className="font-mark text-[3.5rem] leading-none font-light text-gold">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-[1.625rem] leading-tight font-semibold">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ivory/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Good to know. */}
      <Section labelledBy="faq-title" className="py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4" data-reveal>
            <p className="flex items-center gap-2 text-micro font-semibold text-gold-deep uppercase">
              <Sprig className="size-4" />
              Good to know
            </p>
            <h2 id="faq-title" className="mt-4 font-display text-title font-medium text-teal-ink">
              Before you book.
            </h2>
            <p className="mt-4 text-body text-ink/70">
              The short version of our hire terms. The{' '}
              <a href={url('/terms/')} className="font-semibold text-teal underline underline-offset-4">
                full hire terms
              </a>{' '}
              apply to every booking.
            </p>
          </div>
          <div className="divide-y divide-teal-ink/10 border-y border-teal-ink/10 md:col-span-7 md:col-start-6" data-reveal>
            {contactPage.faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-3 font-display text-[1.5rem] leading-tight font-semibold text-teal-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-teal-ink/15 transition-transform duration-300 group-open:rotate-180">
                    <IconChevron dir="down" className="size-4" />
                  </span>
                </summary>
                <p className="pb-4 text-body text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Social. */}
      <Section labelledBy="social-title" className="bg-linen py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between" data-reveal>
          <div>
            <h2 id="social-title" className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight font-medium text-teal-ink">
              Follow the latest setups.
            </h2>
            <p className="mt-2 text-body text-ink/70">Finished tables, new pieces and styling ideas from real functions.</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${brand.name} on ${s.label}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ivory px-5 text-nav font-semibold text-teal-ink ring-1 ring-teal-ink/15 hover:bg-white"
                >
                  {socialIcon(s.label)} {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </Sheet>
  </Layout>,
);

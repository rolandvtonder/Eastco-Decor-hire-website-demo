import {ButtonLink, Section, SectionHead} from '../components/Bits';
import {BranchCards} from '../components/BranchCards';
import {ClosingScene} from '../components/ClosingScene';
import {IconArrow} from '../components/Icons';
import {Layout, Sheet} from '../components/Layout';
import {Sprig} from '../components/Logo';
import {PageHero} from '../components/PageHero';
import {ParallaxImage} from '../components/ParallaxImage';
import {Stats} from '../components/Stats';
import {about, marquee, pageHeroes, photos} from '../content';
import {mount} from './mount';
import {url} from '../lib/url';

mount(
  <Layout page="about">
    <PageHero {...pageHeroes.about} />
    <Sheet>
      {/* Who we are. */}
      <Section labelledBy="story-title" className="pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-6" data-reveal>
            <p className="flex items-center gap-2 text-micro font-semibold text-gold-deep uppercase">
              <Sprig className="size-4" />
              {about.story.eyebrow}
            </p>
            <h2 id="story-title" className="mt-4 font-display text-title font-medium text-balance text-teal-ink">
              {about.story.heading}
            </h2>
            <div className="mt-6 space-y-4 text-lede text-ink/75">
              {about.story.paragraphs.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={url('/catalogue/')} variant="teal">
                Browse the collection <IconArrow />
              </ButtonLink>
              <ButtonLink href={url('/gallery/')} variant="ghost">
                See real events
              </ButtonLink>
            </div>
          </div>
          <div className="relative md:col-span-5 md:col-start-8">
            <ParallaxImage photo={about.story.image} strength={30} className="aspect-[4/5] rounded-t-full rounded-b-[28px] ring-1 ring-gold/60" />
            <div className="absolute -bottom-6 -left-4 w-[42%] md:-left-12" data-reveal="clip">
              <ParallaxImage photo={photos.terracotta} strength={16} className="aspect-square rounded-[22px] ring-4 ring-ivory" />
            </div>
          </div>
        </div>
      </Section>

      {/* The numbers. */}
      <Section labelledBy="numbers-title" className="grain bg-teal-deep py-24 text-ivory md:py-32">
        <SectionHead id="numbers-title" dark eyebrow="Eastco in numbers" title="Small enough to know you. Big enough to dress the room." />
        <div className="mt-12" data-reveal>
          <Stats />
        </div>
      </Section>

      {/* Occasions. */}
      <Section labelledBy="occasions-title" className="py-24 md:py-32">
        <SectionHead id="occasions-title" eyebrow={about.occasions.eyebrow} title={about.occasions.heading} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.occasions.items.map((o, i) => (
            <li
              key={o.title}
              data-reveal
              style={{['--reveal-delay' as string]: `${(i % 3) * 0.08}s`}}
              className="group rounded-[24px] bg-white p-7 ring-1 ring-teal-ink/8 transition-shadow hover:shadow-[0_24px_50px_-30px_rgb(8_48_47/0.5)]"
            >
              <span className="grid size-12 place-items-center rounded-full bg-mist text-teal-deep ring-1 ring-gold/50 transition-transform duration-500 group-hover:rotate-[20deg]">
                <Sprig className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-[1.75rem] leading-tight font-semibold text-teal-ink">{o.title}</h3>
              <p className="mt-2 text-body text-ink/70">{o.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Values. */}
      <Section labelledBy="values-title" className="bg-linen py-24 md:py-32">
        <h2 id="values-title" className="sr-only">
          {about.values.eyebrow}
        </h2>
        <p className="flex items-center gap-2 text-micro font-semibold text-gold-deep uppercase" data-reveal>
          <Sprig className="size-4" />
          {about.values.eyebrow}
        </p>
        <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
          {about.values.items.map((v, i) => (
            <li key={v.title} data-reveal style={{['--reveal-delay' as string]: `${i * 0.1}s`}} className="border-t border-teal-ink/15 pt-6">
              <span aria-hidden="true" className="font-mark text-[3.5rem] leading-none font-light text-gold">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-[2rem] leading-[1.05] font-medium text-teal-ink">{v.title}</h3>
              <p className="mt-3 text-body text-ink/70">{v.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Marquee of occasions. */}
      <div className="overflow-hidden border-y border-teal-ink/10 py-5" aria-hidden="true">
        <ul className="marquee-track flex w-max gap-10 pr-10 font-display text-[1.375rem] font-medium tracking-[0.04em] text-teal-ink/70 uppercase">
          {[...marquee, ...marquee].map((item, i) => (
            <li key={i} className="flex items-center gap-10 whitespace-nowrap">
              {item}
              <Sprig className="size-4 text-gold" />
            </li>
          ))}
        </ul>
      </div>

      {/* Branches. */}
      <Section labelledBy="find-title" className="py-24 md:py-32">
        <SectionHead id="find-title" eyebrow="Find us" title="Two branches. One standard." lede="Visit, call or WhatsApp the branch closest to your venue." />
        <div className="mt-12">
          <BranchCards />
        </div>
      </Section>
    </Sheet>
    <ClosingScene />
  </Layout>,
);

import {Section, SectionHead} from '../components/Bits';
import {BranchCards} from '../components/BranchCards';
import {CatalogueStack} from '../components/CatalogueStack';
import {ClosingScene} from '../components/ClosingScene';
import {Layout, Sheet} from '../components/Layout';
import {PageHero} from '../components/PageHero';
import {catalogueIntro, collections, pageHeroes} from '../content';
import {mount} from './mount';

mount(
  <Layout page="catalogue">
    <PageHero {...pageHeroes.catalogue} />
    <Sheet>
      <Section labelledBy="catalogues-title" className="pt-24 pb-28 md:pt-32">
        <SectionHead
          id="catalogues-title"
          eyebrow="September 2026 edition"
          title={
            <>
              Five catalogues. <span className="italic">Every detail.</span>
            </>
          }
          lede={catalogueIntro.note}
        >
          <nav aria-label="Jump to a catalogue" className="mt-5 flex flex-wrap gap-2">
            {collections.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex min-h-10 items-center rounded-full bg-teal-ink/6 px-4 text-[0.875rem] font-medium text-teal-ink hover:bg-teal-ink/12"
              >
                {c.title}
              </a>
            ))}
          </nav>
        </SectionHead>
        <CatalogueStack />
      </Section>

      <Section labelledBy="howto-title" className="bg-linen py-24 md:py-32">
        <SectionHead id="howto-title" eyebrow="Ordering from the catalogue" title="Seen something you like?" />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {catalogueIntro.howTo.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{['--reveal-delay' as string]: `${i * 0.1}s`}}
              className="rounded-[24px] bg-ivory p-7 ring-1 ring-teal-ink/8"
            >
              <span aria-hidden="true" className="font-mark text-[3.5rem] leading-none font-light text-gold">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-[1.75rem] leading-tight font-semibold text-teal-ink">{step.title}</h3>
              <p className="mt-2 text-body text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="branches-title" className="py-24 md:py-32">
        <SectionHead
          id="branches-title"
          eyebrow="Send us your shortlist"
          title="Choose the branch nearest your venue."
          lede="Both branches work from the same catalogues. Send your product codes, quantities and date, and they will confirm what is available."
        />
        <div className="mt-12">
          <BranchCards />
        </div>
      </Section>
    </Sheet>
    <ClosingScene />
  </Layout>,
);

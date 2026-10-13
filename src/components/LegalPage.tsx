import {branches} from '../content';
import {Layout} from './Layout';
import {Sprig} from './Logo';

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: {title: string; body: string[]}[];
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Long-form reading page: quiet header band, numbered sections, a sticky contents list on wide screens. */
export function LegalPage({eyebrow, title, intro, updated, sections}: Props) {
  return (
    <Layout page="legal">
      <section id="top" aria-labelledby="page-title" className="grain relative overflow-hidden bg-teal-deep px-4 pt-36 pb-16 text-ivory sm:px-6 md:pt-44 md:pb-24 lg:px-8">
        <p className="flex items-center gap-2 text-micro font-semibold text-gold-soft uppercase">
          <Sprig className="size-4" />
          {eyebrow}
        </p>
        <h1 id="page-title" className="mt-4 max-w-[16ch] font-display text-display font-medium">
          {title}
        </h1>
        <p className="mt-6 max-w-[40rem] text-lede text-ivory/85">{intro}</p>
        <p className="mt-4 text-[0.875rem] text-ivory/60">Last updated {updated}</p>
      </section>

      <div className="relative z-10 -mt-7 rounded-t-[28px] bg-ivory px-4 pt-16 pb-24 sm:px-6 md:pt-20 md:pb-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="text-micro font-semibold text-gold-deep uppercase">On this page</p>
              <ol className="mt-4 space-y-1 border-l border-teal-ink/12">
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a href={`#${slug(s.title)}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[0.9375rem] text-ink/70 hover:border-gold hover:text-teal-ink">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="max-w-[44rem] lg:col-span-8 lg:col-start-5">
            <ol className="space-y-12">
              {sections.map((s, i) => (
                <li key={s.title} id={slug(s.title)}>
                  <h2 className="flex items-baseline gap-4 font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight font-semibold text-teal-ink">
                    <span aria-hidden="true" className="font-mark text-[1.5rem] font-light text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-body text-ink/80">
                    {s.body.map((para) => (
                      <p key={para.slice(0, 32)}>{para}</p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16 rounded-[24px] bg-linen p-6 ring-1 ring-teal-ink/8 md:p-8">
              <h2 className="font-display text-[1.75rem] font-semibold text-teal-ink">Questions?</h2>
              <p className="mt-2 text-body text-ink/75">Contact either branch and we will gladly explain anything on this page.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {branches.map((b) => (
                  <li key={b.id} className="text-[0.9375rem]">
                    <span className="block font-semibold text-teal-ink">{b.name}</span>
                    <a href={`tel:${b.tel}`} className="mt-1 inline-flex min-h-10 items-center text-teal underline underline-offset-4">
                      {b.phone}
                    </a>
                    <span className="text-ink/40"> · </span>
                    <a href={`mailto:${b.email}`} className="inline-flex min-h-10 items-center break-all text-teal underline underline-offset-4">
                      {b.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

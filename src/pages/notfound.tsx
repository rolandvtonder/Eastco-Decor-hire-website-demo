import {ButtonLink} from '../components/Bits';
import {IconArrow} from '../components/Icons';
import {Layout} from '../components/Layout';
import {Sprig} from '../components/Logo';
import {collections} from '../content';
import {mount} from './mount';
import {url} from '../lib/url';

mount(
  <Layout page="none">
    <section id="top" aria-labelledby="page-title" className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-teal-deep px-4 pt-32 pb-20 text-ivory sm:px-6 lg:px-8">
      <span aria-hidden="true" className="pointer-events-none absolute -right-6 bottom-0 font-mark text-[42vw] leading-[0.75] font-light text-white/6">
        404
      </span>
      <p className="flex items-center gap-2 text-micro font-semibold text-gold-soft uppercase">
        <Sprig className="size-4" />
        Page not found
      </p>
      <h1 id="page-title" className="mt-4 max-w-[14ch] font-display text-display font-medium">
        This table <span className="italic">isn&rsquo;t set yet.</span>
      </h1>
      <p className="mt-6 max-w-[34rem] text-lede text-ivory/80">The page you were looking for has moved or no longer exists. These will get you back on track:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={url('/')}>
          Back to home <IconArrow />
        </ButtonLink>
        <ButtonLink href={url('/catalogue/')} variant="ghost-light">
          Hire catalogues
        </ButtonLink>
        <ButtonLink href={url('/contact-us/')} variant="ghost-light">
          Contact us
        </ButtonLink>
      </div>
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ivory/70">
        {collections.map((c) => (
          <li key={c.id}>
            <a href={url(`/catalogue/#${c.id}`)} className="underline decoration-white/30 underline-offset-4 hover:text-ivory">
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  </Layout>,
);

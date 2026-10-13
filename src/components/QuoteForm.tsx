import {useId, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {branches, contactPage, type Branch} from '../content';
import {IconMail, IconWhatsApp} from './Icons';

/**
 * The quote request. There is no backend to lose messages in: on send, the
 * form composes the enquiry and opens WhatsApp (or the visitor's mail app)
 * addressed to the branch they chose, ready to go. Errors are checked on blur
 * and on submit; a failed submit lists them at the top and moves focus there.
 */

type Values = {
  name: string;
  phone: string;
  email: string;
  date: string;
  type: string;
  venue: string;
  guests: string;
  branch: Branch['id'] | '';
  shortlist: string;
};

type Field = keyof Values;

const EMPTY: Values = {name: '', phone: '', email: '', date: '', type: '', venue: '', guests: '', branch: '', shortlist: ''};

const LABELS: Record<Field, string> = {
  name: 'Your name',
  phone: 'Phone number',
  email: 'Email address',
  date: 'Event date',
  type: 'Type of event',
  venue: 'Venue or area',
  guests: 'Number of guests',
  branch: 'Branch',
  shortlist: 'Your shortlist',
};

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) e.name = 'Please tell us your name.';
  const digits = v.phone.replace(/\D/g, '');
  if (!digits) e.phone = 'Add a phone number so the branch can reach you.';
  else if (digits.length < 9 || digits.length > 13) e.phone = 'Check the phone number — for example 082 123 4567.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Check the email address — for example name@example.com.';
  if (!v.date) e.date = 'Choose your event date so we can check availability.';
  else if (v.date < today()) e.date = 'That date has passed — choose an upcoming date.';
  if (!v.branch) e.branch = 'Choose the branch nearest your venue.';
  if (v.guests && !/^\d{1,5}$/.test(v.guests.trim())) e.guests = 'Use numbers only, for example 120.';
  return e;
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function compose(v: Values, branch: Branch) {
  const when = new Date(`${v.date}T12:00:00`).toLocaleDateString('en-ZA', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
  const opt = (label: string, value: string) => (value.trim() ? `${label}: ${value.trim()}` : null);
  const lines = [
    `Hi Eastco Decor Hire (${branch.name}),`,
    '',
    "I'd like a quote for my event.",
    '',
    `Name: ${v.name.trim()}`,
    `Phone: ${v.phone.trim()}`,
    opt('Email', v.email),
    `Date: ${when}`,
    opt('Event', v.type),
    opt('Venue / area', v.venue),
    opt('Guests', v.guests),
    ...(v.shortlist.trim() ? ['', 'Shortlist (codes & quantities):', v.shortlist.trim()] : []),
  ];
  return {
    text: lines.filter((l) => l !== null).join('\n'),
    subject: `Hire quote request — ${when}`,
  };
}

export function QuoteForm() {
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState<null | 'whatsapp' | 'email'>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const errors = validate(values);
  const show = (f: Field) => (submitted || touched[f]) && errors[f];

  const set = (f: Field) => (e: {currentTarget: {value: string}}) => {
    const value = e.currentTarget.value;
    setValues((v) => ({...v, [f]: value}));
    setSent(null);
  };
  const blur = (f: Field) => () => setTouched((t) => ({...t, [f]: true}));

  const send = (via: 'whatsapp' | 'email') => (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const branch = branches.find((b) => b.id === values.branch)!;
    const {text, subject} = compose(values, branch);
    if (via === 'whatsapp') {
      const num = branch.whatsapp.match(/wa\.me\/(\d+)/)![1];
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    } else {
      window.location.href = `mailto:${branch.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    }
    setSent(via);
  };

  const errorList = Object.entries(errors) as [Field, string][];
  const inputCls = (f: Field) =>
    `mt-2 block w-full rounded-2xl bg-white px-4 py-3.5 text-[1rem] text-ink ring-1 outline-none transition-shadow placeholder:text-ink/40 focus:ring-2 focus:ring-teal ${
      show(f) ? 'ring-2 ring-[#b3261e]' : 'ring-teal-ink/15'
    }`;

  const fieldProps = (f: Field) => ({
    id: id(f),
    name: f,
    value: values[f],
    onChange: set(f),
    onBlur: blur(f),
    'aria-invalid': show(f) ? true : undefined,
    'aria-describedby': show(f) ? `${id(f)}-err` : undefined,
    className: inputCls(f),
  });

  const Label = ({f, required, hint}: {f: Field; required?: boolean; hint?: ReactNode}) => (
    <label htmlFor={id(f)} className="block text-[0.9375rem] font-semibold text-teal-ink">
      {LABELS[f]}
      {required ? (
        <span className="text-[#b3261e]" aria-hidden="true">
          {' '}
          *
        </span>
      ) : (
        <span className="font-normal text-ink/55"> (optional)</span>
      )}
      {hint && <span className="mt-0.5 block text-[0.8125rem] font-normal text-ink/60">{hint}</span>}
    </label>
  );

  const Err = ({f}: {f: Field}) =>
    show(f) ? (
      <p id={`${id(f)}-err`} className="mt-1.5 text-[0.875rem] font-medium text-[#b3261e]">
        {errors[f]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={send('whatsapp')} className="rounded-[28px] bg-linen p-5 ring-1 ring-teal-ink/8 sm:p-8 md:p-10" aria-labelledby="quote-title">
      <h2 id="quote-title" className="font-display text-title font-medium text-teal-ink">
        Request a quote
      </h2>
      <p className="mt-3 max-w-[36rem] text-body text-ink/70">
        Fill in what you know and press send — WhatsApp or your email app opens with the message ready for the branch you choose. Fields marked <span className="text-[#b3261e]">*</span> are required.
      </p>

      {submitted && errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-2xl bg-[#fbeceb] p-5 text-[#7a1b15] ring-1 ring-[#b3261e]/30 outline-none focus:ring-2">
          <p className="font-semibold">Please fix {errorList.length === 1 ? 'this' : `these ${errorList.length} things`} before sending:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
            {errorList.map(([f, msg]) => (
              <li key={f}>
                <a href={`#${id(f)}`} onClick={(e) => (e.preventDefault(), document.getElementById(f === 'branch' ? `${id('branch')}-pretoria` : id(f))?.focus())} className="underline">
                  {LABELS[f]}: {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="mt-8">
        <legend className="font-display text-[1.5rem] font-semibold text-teal-ink">About you</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label f="name" required />
            <input {...fieldProps('name')} type="text" autoComplete="name" required />
            <Err f="name" />
          </div>
          <div>
            <Label f="phone" required />
            <input {...fieldProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="082 123 4567" required />
            <Err f="phone" />
          </div>
          <div>
            <Label f="email" />
            <input {...fieldProps('email')} type="email" autoComplete="email" placeholder="name@example.com" />
            <Err f="email" />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="font-display text-[1.5rem] font-semibold text-teal-ink">Your event</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <Label f="date" required />
            <input {...fieldProps('date')} type="date" min={today()} required />
            <Err f="date" />
          </div>
          <div>
            <Label f="type" />
            <select {...fieldProps('type')}>
              <option value="">Choose one…</option>
              {contactPage.eventTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <Label f="venue" />
            <input {...fieldProps('venue')} type="text" autoComplete="off" placeholder="e.g. Irene, Centurion" />
          </div>
          <div>
            <Label f="guests" />
            <input {...fieldProps('guests')} type="text" inputMode="numeric" placeholder="e.g. 120" />
            <Err f="guests" />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8" aria-describedby={show('branch') ? `${id('branch')}-err` : undefined}>
        <legend className="font-display text-[1.5rem] font-semibold text-teal-ink">
          Which branch? <span className="text-[#b3261e]" aria-hidden="true">*</span>
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {branches.map((b) => (
            <label
              key={b.id}
              htmlFor={`${id('branch')}-${b.id}`}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 ring-1 transition-shadow has-[:checked]:ring-2 has-[:checked]:ring-teal has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                show('branch') ? 'ring-[#b3261e]' : 'ring-teal-ink/15'
              }`}
            >
              <input
                id={`${id('branch')}-${b.id}`}
                type="radio"
                name="branch"
                value={b.id}
                checked={values.branch === b.id}
                onChange={set('branch')}
                onBlur={blur('branch')}
                className="mt-1 size-5 accent-teal"
              />
              <span>
                <span className="block font-semibold text-teal-ink">{b.name}</span>
                <span className="mt-0.5 block text-[0.875rem] text-ink/65">{b.region}</span>
              </span>
            </label>
          ))}
        </div>
        <Err f="branch" />
      </fieldset>

      <div className="mt-8">
        <Label f="shortlist" hint="Product codes and quantities from the catalogues — or just describe the look you're after." />
        <textarea {...fieldProps('shortlist')} rows={5} placeholder={'e.g. FUR-012 × 10\nLIN-204 ivory × 12'} className={`${inputCls('shortlist')} resize-y`} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#128c4a] px-7 py-4 text-nav font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <IconWhatsApp /> Send on WhatsApp
        </button>
        <button
          type="button"
          onClick={send('email')}
          className="inline-flex min-h-13 items-center gap-2 rounded-full bg-teal-deep px-7 py-4 text-nav font-semibold text-ivory transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <IconMail /> Send by email
        </button>
      </div>
      <p role="status" className="mt-4 min-h-6 text-[0.9375rem] text-teal-ink">
        {sent === 'whatsapp' && 'WhatsApp should have opened with your message ready — just press send there.'}
        {sent === 'email' && 'Your email app should have opened with your message ready — just press send there.'}
      </p>
    </form>
  );
}

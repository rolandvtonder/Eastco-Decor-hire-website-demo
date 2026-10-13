# Eastco Decor Hire — website demo

A redesign of [eastcodecorhire.co.za](https://eastcodecorhire.co.za/) for Eastco Decor Hire (Centurion & Krugersdorp): a scroll-driven, multi-page site built around Eastco's own event photography, logo colours and September 2026 catalogues.

**Live demo:** https://rolandvtonder.github.io/Eastco-Decor-hire-website-demo/

Pages: Home · Hire Collection · Inspiration & Gallery · About · Contact (with a quote form that opens WhatsApp or email for the chosen branch) · Hire terms · Privacy.

## Run it

```bash
npm install
npm run dev
```

`npm run lint` type-checks; `npm run build` writes the static site to `dist/`, ready for any ordinary web host.

## Editing

Every word, phone number, address and photo choice lives in [`src/content.ts`](src/content.ts). Photos and catalogue PDFs are in `public/`.

## Deploying

- **This demo:** every push to `main` rebuilds and publishes to GitHub Pages ([workflow](.github/workflows/deploy.yml)). The demo is marked `noindex` so it doesn't compete with Eastco's real site in Google.
- **The real domain:** run `npm run build` and upload `dist/` to the host. The defaults in `.env` (`VITE_SITE_URL=https://eastcodecorhire.co.za`, indexing on) are already set for that.

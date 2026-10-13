/**
 * Every internal link and asset path goes through here, so the site works at
 * a domain root (eastcodecorhire.co.za/) and under a sub-folder (a GitHub
 * Pages demo at /Eastco-Decor-hire-website-demo/) without editing content.
 * Vite's BASE_URL always ends in a slash.
 */
export const url = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');

/**
 * Social-metadata QA reporter for every public page + the /play/ shell.
 *
 * Prints one row per page (OG/Twitter completeness, image, og:url==canonical,
 * absolute-HTTPS image, no URL leaks) and exits non-zero if anything is wrong.
 * Reads the committed source HTML and scripts/social/meta.config.json.
 *
 * Run:  node scripts/social/check-social.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CFG = JSON.parse(readFileSync(resolve(ROOT, 'scripts/social/meta.config.json'), 'utf8'));
const SITE = CFG.baseUrl;
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');
const fileOf = (d) => (d === 'play' ? 'play/index.html' : d === '' ? 'index.html' : `${d}/index.html`);
const m = (h, prop, attr) => (h.match(new RegExp(`<meta ${attr}="${prop}" content="([^"]*)"`)) || [])[1] || null;

const OG = ['og:type', 'og:site_name', 'og:locale', 'og:locale:alternate', 'og:title', 'og:description',
  'og:url', 'og:image', 'og:image:secure_url', 'og:image:width', 'og:image:height', 'og:image:alt'];
const TW = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'];

let problems = 0;
const rows = [];
for (const d of Object.keys(CFG.pageCategory)) {
  const h = read(fileOf(d));
  const head = h.split('</head>')[0];
  const errs = [];
  for (const t of OG) if (!new RegExp(`property="${t}"`).test(head)) errs.push(`-${t}`);
  for (const t of TW) if (!new RegExp(`name="${t}"`).test(head)) errs.push(`-${t}`);
  const canon = (h.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const ogurl = m(h, 'og:url', 'property');
  if (canon !== ogurl) errs.push('og:url!=canonical');
  const img = m(h, 'og:image', 'property') || '';
  if (!img.startsWith(SITE + 'assets/social/')) errs.push('img!absHTTPS');
  const file = img.split('/').pop();
  if (file && !existsSync(resolve(ROOT, 'public/assets/social', file))) errs.push('img!exists');
  if (/localhost|127\.0\.0\.1|github\.io|:41\d\d/.test(head)) errs.push('URL-LEAK');
  if (errs.length) problems += errs.length;
  rows.push({ page: '/' + (d === 'play' ? 'play/' : d ? d + '/' : ''), img: file, cat: CFG.pageCategory[d], status: errs.length ? errs.join(' ') : 'OK' });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad('PAGE', 44), pad('CATEGORY', 12), pad('IMAGE', 30), 'STATUS');
console.log('-'.repeat(110));
for (const r of rows) console.log(pad(r.page, 44), pad(r.cat, 12), pad(r.img, 30), r.status);
console.log('-'.repeat(110));
console.log(`${rows.length} pages checked · ${problems} problem(s)`);
process.exit(problems ? 1 : 0);

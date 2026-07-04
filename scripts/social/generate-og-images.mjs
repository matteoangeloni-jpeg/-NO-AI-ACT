/**
 * Generate the branded 1200×630 social-preview PNGs for NO AI ACT.
 *
 * Reproducible authoring tool (not part of the production build — the PNGs it
 * writes are committed under public/assets/social/ and served statically).
 *
 * Usage:
 *   npm i -D playwright && npx playwright install chromium   # once
 *   node scripts/social/generate-og-images.mjs
 * or point at an existing Chromium:
 *   CHROMIUM_PATH=/path/to/chrome node scripts/social/generate-og-images.mjs
 *
 * Design: project brand only (carbon #0a1020, amber #d9a521, slate #5d7fb8,
 * mono/sans system fonts, the magnifying-lens mark from favicon.svg). No EU
 * flag or institutional logo, no third-party or copyrighted imagery.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OUT = process.env.OG_OUT || resolve(dirname(fileURLToPath(import.meta.url)), '../../public/assets/social');
const W = 1200;
const H = 630;

/** One card per share category. Text kept short and high-contrast. */
const CARDS = [
  { file: 'no-ai-act-og.png', badge: 'SERIOUS GAME · AI ACT UE',
    title: "Indaga l'IA.<br>Classifica il rischio.",
    tagline: "Serious game educativo gratuito sull'AI Act europeo.",
    footer: 'Didattico · non è consulenza legale' },
  { file: 'no-ai-act-en-og.png', badge: 'SERIOUS GAME · EU AI ACT',
    title: 'Investigate AI.<br>Classify the risk.',
    tagline: 'Free educational serious game on the EU AI Act.',
    footer: 'Educational · not legal advice' },
  { file: 'no-ai-act-play-og.png', badge: 'PLAY · SERIOUS GAME',
    title: 'Play the investigation',
    tagline: '11 cases · examine the evidence · classify AI risk under the EU AI Act.',
    footer: 'Free · no account · runs in your browser' },
  { file: 'no-ai-act-education-og.png', badge: 'EDUCATION HUB',
    title: 'Teach the EU AI Act',
    tagline: 'Guides, lesson plans, classroom activities, a glossary & a serious game.',
    footer: 'For teachers & students · free and open source' },
  { file: 'no-ai-act-guide-og.png', badge: 'AI ACT GUIDE',
    title: 'The EU AI Act,<br>explained simply',
    tagline: 'Risk categories · prohibited practices · transparency · GPAI · oversight.',
    footer: 'Educational · not legal advice' },
  { file: 'no-ai-act-glossary-og.png', badge: 'AI LITERACY',
    title: 'AI Act glossary',
    tagline: 'The key terms of the EU AI Act, defined in plain language.',
    footer: 'Educational · not legal advice' }
];

const lens = `<svg width="54" height="54" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <circle cx="13" cy="13" r="6.4" fill="none" stroke="#d9a521" stroke-width="2.4"/>
  <line x1="17.7" y1="17.7" x2="24.5" y2="24.5" stroke="#d9a521" stroke-width="2.8" stroke-linecap="round"/>
</svg>`;

function html(c) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body {
    font-family: "Liberation Sans", system-ui, Arial, sans-serif;
    color:#e7ecf5; position:relative; overflow:hidden;
    background:
      radial-gradient(900px 520px at 82% -12%, rgba(217,165,33,0.16), transparent 60%),
      radial-gradient(1100px 640px at 12% 118%, rgba(93,127,184,0.14), transparent 62%),
      #0a1020;
  }
  .grid { position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(74,82,96,0.10) 1px, transparent 1px),
      linear-gradient(90deg, rgba(74,82,96,0.10) 1px, transparent 1px);
    background-size: 48px 48px; }
  .frame { position:absolute; inset:26px; border:1px solid #2a3650; border-radius:16px; }
  .pad { position:absolute; inset:64px 72px; display:flex; flex-direction:column; }
  .top { display:flex; align-items:center; justify-content:space-between; }
  .brand { display:flex; align-items:center; gap:16px;
    font-family:"Liberation Mono", ui-monospace, monospace; font-weight:700;
    font-size:34px; letter-spacing:0.06em; }
  .brand .dot { color:#d9a521; }
  .badge { font-family:"Liberation Mono", ui-monospace, monospace; font-size:19px;
    letter-spacing:0.16em; color:#d9a521; border:1px solid #b4861a;
    border-radius:6px; padding:9px 16px; white-space:nowrap; }
  .mid { flex:1; display:flex; flex-direction:column; justify-content:center; }
  h1 { font-weight:700; font-size:78px; line-height:1.06; letter-spacing:-0.01em; }
  .tag { margin-top:26px; font-size:30px; line-height:1.35; color:#aab6cc; max-width:960px; }
  .bottom { display:flex; align-items:center; justify-content:space-between;
    font-family:"Liberation Mono", ui-monospace, monospace; font-size:22px; }
  .dom { color:#d9a521; letter-spacing:0.04em; }
  .foot { color:#8a97ac; letter-spacing:0.02em; }
  </style></head><body>
    <div class="grid"></div>
    <div class="frame"></div>
    <div class="pad">
      <div class="top">
        <div class="brand">${lens}<span>NO AI ACT<span class="dot">.</span></span></div>
        <div class="badge">${c.badge}</div>
      </div>
      <div class="mid">
        <h1>${c.title}</h1>
        <p class="tag">${c.tagline}</p>
      </div>
      <div class="bottom"><span class="dom">no-ai-act.eu</span><span class="foot">${c.footer}</span></div>
    </div>
  </body></html>`;
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const c of CARDS) {
  await page.setContent(html(c), { waitUntil: 'networkidle' });
  await page.screenshot({ path: resolve(OUT, c.file), type: 'png' });
  console.log('wrote', c.file);
}
await browser.close();

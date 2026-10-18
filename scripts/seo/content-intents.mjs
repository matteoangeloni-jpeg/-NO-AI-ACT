import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';
import { publicRoutes } from '../../src/site/route-inventory.mjs';

const cfg = JSON.parse(readFileSync('scripts/seo/routes.config.json', 'utf8'));
const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const text = node => node.nodeName === '#text' ? node.value : ['script', 'style', 'nav'].includes(node.tagName) ? '' : (node.childNodes ?? []).map(text).join(' ');
const normalize = value => value.replace(/\s+/g, ' ').trim();
const kinds = {
  en: 'game', 'en/how-it-works': 'gameplay', 'en/ai-act-serious-game': 'game-pedagogy',
  'en/education': 'resource-hub', 'en/for-educators': 'classroom-session',
  'en/ai-act-for-teachers': 'school-ai-act', 'en/eu-ai-act-guide': 'regulation-overview',
  'en/research-and-methodology': 'research-methodology', 'en/how-to-cite': 'citation',
  'en/press-kit': 'press', 'en/matteo-angeloni': 'author', 'en/faq': 'faq',
  'en/ai-act-classroom-lab': 'classroom-lab',
  'en/ai-in-recruitment-and-employment': 'employment-case-analysis'
};
export const rows = publicRoutes(cfg).map(route => {
  const html = readFileSync(route.dir ? `${route.dir}/index.html` : 'index.html', 'utf8');
  const all = nodes(parse(html));
  const main = all.find(n => n.tagName === 'main');
  const content = normalize(text(main));
  const title = normalize(text(all.find(n => n.tagName === 'title')));
  const h1 = normalize(text(all.find(n => n.tagName === 'h1')));
  const description = attr(all.find(n => n.tagName === 'meta' && attr(n, 'name') === 'description'), 'content');
  const editorialLinks = nodes(main).filter(n => n.tagName === 'a' && attr(n, 'href')?.startsWith('/') && !attr(n, 'href').startsWith('/play/')).length;
  return { route: cfg.site + (route.dir ? `${route.dir}/` : ''), lang: route.lang,
    topic: route.en.slice(3) || 'home', intent: kinds[route.en] ?? 'topic-explainer',
    title, h1, description, mainWords: content.split(/\s+/).length, editorialLinks,
    keywordEvidence: ['de', 'es', 'pt'].includes(route.lang) ? 'editorial candidate; no historical GSC validation' : 'editorial focus; compare with GSC query/page data' };
});
const columns = Object.keys(rows[0]);
const csv = value => `"${String(value).replaceAll('"', '""')}"`;
if (process.argv.includes('--write')) {
  writeFileSync('docs/SEO_CONTENT_INTENTS.csv', [columns.join(','), ...rows.map(row => columns.map(c => csv(row[c])).join(','))].join('\n') + '\n');
}
console.log(`Reviewed ${rows.length} pages across ${new Set(rows.map(r => r.lang)).size} languages. Focus labels are not search-volume estimates.`);
console.log(JSON.stringify(Object.fromEntries([...new Set(rows.map(r => r.lang))].map(lang => {
  const local = rows.filter(r => r.lang === lang);
  return [lang, { pages: local.length, mainWordMedian: [...local].sort((a,b)=>a.mainWords-b.mainWords)[Math.floor(local.length/2)].mainWords, below250MainWords: local.filter(r=>r.mainWords<250).length }];
})), null, 2));

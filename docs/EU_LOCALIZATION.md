# European website localization candidate

## Scope

This branch adds 13 introductory pages each in German, Spanish and European
Portuguese (`pt-PT`): home, how it works, education, teachers, guide, glossary,
privacy, risk categories, prohibited practices, high-risk systems, transparency,
general-purpose models and AI literacy. These are localized introductions to the
equivalent project topics, not full translations of the 37-page English hub.

Inventory: 146 indexable URLs (33 IT, 37 EN, 37 FR, 13 DE, 13 ES, 13 PT).
The playable game remains Italian, English and French. Every new page names those
three available game languages and links only to supported game queries.
No gameplay, telemetry configuration, Access policy or DNS change is included.

## Editorial boundaries

Terminology checked against official language versions of Regulation 2024/1689:

- German: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32024R1689
- Spanish: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689
- Portuguese: https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32024R1689

The texts do not invent application dates, certifications, partnerships or study
results. They disclose AI assistance, legal simplification and the absence of a
controlled efficacy study. Native-speaker and specialist legal review have not
been obtained. Detailed methodology and the full statistics notice remain linked
in English with an explicit language label. The privacy introductions distinguish
local saves/answers from automatic aggregate usage counters; obsolete blanket
French claims about zero data/network traffic are corrected at their source.

## Technical contract

- `src/site/route-inventory.mjs` is shared by build, audit and inventory tests.
- Only real equivalent pages receive reciprocal hreflang links; `pt-PT` is the
  document and alternate code, `/pt/` the URL prefix. Each page is self-canonical.
- Language selectors are ordinary links, work without JavaScript and do not
  redirect visitors based on language detection.
- All six language sitemaps exclude `/play/`; that shell retains noindex.
- Existing social images and press assets are reused; no new external scripts.
- New editorial sources live in `src/site/{de,es,pt}-content.mjs`.
- `npm run site:eu` regenerates the new pages and shared language links.
  `npm run site:fr` also reapplies those links after French regeneration.
- `node scripts/seo/update-sitemap-lastmod.mjs` synchronizes all six children
  and their index using source change dates.
- `npm run smoke:european-site` checks all 39 pages at 1440, 390 and 320 pixels,
  including dropdowns, press carousel, images and no-JavaScript navigation.

SEO approach follows Google's localized-version guidance:
https://developers.google.com/search/docs/specialty/international/localized-versions

This is a review candidate. Passing source/build checks does not demonstrate
publication, Google indexing, rankings or native-language validation.

## Local verification (18 October 2026)

- TypeScript check and 1,431 automated tests passed (four workers locally).
- SEO audit: 146 routes, no critical defects and no short-content warnings.
- Production build and distribution verification: all 146 routes present.
- European browser smoke: 117 route/viewport combinations passed, plus
  no-JavaScript navigation, open menus, carousel movement and image decoding.
- Existing Italian/English press smoke passed at 320, 390, 768 and 1440px,
  including rapid repeated navigation.
- German mobile and Spanish desktop screenshots were visually inspected.
- Repeated generation was checked for stable output.
- The built game remains `play-CP_-nEVD.js`; gameplay and collection source
  files are unchanged. The full historical gameplay browser suite has not
  been rerun locally for this website-only change; CI remains a separate gate.

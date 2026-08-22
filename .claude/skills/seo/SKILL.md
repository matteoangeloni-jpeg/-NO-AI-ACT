---
name: seo
description: SEO analysis and improvement for the NO AI ACT site (56 bilingual pages, IT+EN). Use this whenever the work touches search visibility, keyword positioning, titles or meta descriptions, structured data, sitemaps, hreflang, internal linking, Search Console, thin content, or "why isn't this page ranking" — and whenever someone pastes an SEO audit from another tool asking you to act on it. Also use before publishing new pages or renaming URLs, because the URL inventory is test-pinned and changing it breaks the build. Carries the site's real constraints (privacy posture, verification gates) and the traps that have already produced false findings here.
---

# SEO for NO AI ACT

This site is 56 public pages — 26 Italian, 30 English — teaching the EU AI Act
around a browser serious game. Its SEO is already in good shape and heavily
test-enforced. That changes the job: you are rarely fixing something broken,
usually you are either **verifying a claim** or **finding the one real gap**.

## Verify before you act. Always.

The most valuable thing you can do here is refuse to act on an unverified
finding. This is not caution for its own sake — external SEO tools have
already produced a majority of false findings on this exact site:

| Reported | Reality |
|---|---|
| "Meta descriptions of 1–32 characters" | They were 148–158. The tool truncated each attribute at the first apostrophe. |
| "Incomplete hreflang on 4 EN pages" | Those pages have no Italian counterpart. `en` + self-referencing `x-default` is correct; adding `hreflang="it"` toward a non-equivalent page would be the actual error. |
| "robots.txt blocks GPTBot/ClaudeBot/CCBot" | `robots.txt` is `User-agent: * / Allow: /`. Nothing is blocked. |

**The apostrophe trap deserves its own warning.** Italian copy is full of
`l'AI Act`, `dell'IA`, `sull'AI Act`. Any tool parsing `content="..."` with a
naive regex that also treats `'` as a delimiter will report those descriptions
as 1–32 characters long. If you see suspiciously short descriptions on Italian
pages, measure them yourself before believing it:

```bash
d=$(grep -o '<meta name="description" content="[^"]*"' PAGE/index.html | sed 's/.*content="//;s/"$//')
echo "${#d} caratteri: $d"
```

When a finding survives verification, act on it. When it doesn't, say so
plainly and explain the mechanism — that is more useful to the owner than a
silent fix, because it tells them which tools to distrust.

## The tooling that already exists

Use these before writing anything new; between them they answer most questions.

```bash
npm run audit:seo   # gate: fails the build on real indexability defects
npm run insight     # report: structure, linking, content depth (no tracking)
node scripts/seo/update-sitemap-lastmod.mjs   # after any content change
```

**`audit:seo`** is a pass/fail gate that runs in CI on every PR. It already
fails on: missing or wrong canonical, broken hreflang, title over 65 chars,
description outside 50–165, duplicate titles/descriptions, H1 count ≠ 1,
orphan pages, broken internal links, sitemap membership errors, missing
`lastmod`, and forbidden schema types. **If it passes, those defects do not
exist** — that is why an external tool reporting one should be treated as a
parser bug until proven otherwise.

**`insight`** surfaces what the audit computes and then discards: which pages
the editorial links actually support, which are fragile (≤1 editorial inbound
link), which are thin, dead ends, single-language pages. It counts links
inside `<main>` only, because nav and footer links appear on all 56 pages and
would drown the signal. `--json` for further processing.

## Constraints that are not negotiable without the owner

**No third-party analytics SDK.** The site publishes "non invia nulla a
fornitori terzi" and uses cookieless Cloudflare Web Analytics deliberately.
`release.config.json` pins `runtimeHostAllowlist`, and `privacyGuards` tests
fail the build on any new host. Installing PostHog/GA/etc. is a change to the
site's public privacy posture and its EU consent exposure — it needs the
owner's explicit decision, plus rewriting both privacy pages, the allowlist
and the guard tests in the same PR. Never slip it in as a technical addition.

**The URL inventory is pinned.** 56 URLs (26 IT + 30 EN) appear in
`release.config.json`, both sitemaps, and several test files. Adding or
renaming a page means updating all of them together. Prefer strengthening an
existing indexed page over creating a new one — especially under time
pressure, since a new URL needs weeks to rank while an indexed page responds
to a retitle almost immediately.

**Educational framing.** Every legal statement is a simplified educational
reading, never legal advice. Pages carry that disclaimer and new content must
stay inside it: describe what the regulation's structure supports, and say
explicitly when formal compliance needs a professional.

## Titles and descriptions

Target ≤65 characters for titles (Google truncates around 60) and 120–158 for
descriptions (snippets cut near 155). The audit enforces the outer bounds; aim
for the inner ones so small edits don't trip the gate.

Lead with the keyword, not the brand. `Glossario AI Act: definizioni semplici
dei termini chiave` outranks `NO AI ACT — glossario` for the query people
actually type. Keep IT and EN in parity: both languages get the same treatment
in the same PR, or the pair drifts.

One page, one intent — with a caveat. When two intents genuinely share a
keyword and the site can serve both credibly, say so in the title and cover
both in the body rather than splitting into a second page that will cannibalise
the first. That is what `/ai-act-per-docenti/` does: it teaches *how to teach*
the AI Act **and** answers *what applies to a school*, because the Italian SERP
demands the second and the page had the substance for it.

## Reading Search Console

There is no Search Console connector in this environment. The owner exports
*Prestazioni → Query → CSV* and pastes it. When you have that data, the single
most useful distinction:

- **high impressions, low CTR** → the page ranks but the SERP snippet doesn't
  convince. Fix the title and description. The content is fine.
- **low impressions** → the page isn't ranking at all. The title is not the
  problem; content depth, internal links or intent match are. Rewriting the
  title here wastes effort.

Cross this with `npm run insight`: a high-impression page that shows up under
"Fragile" needs links, not words; one under "Thinnest" needs words.

`docs/SITE_INSIGHT.md` documents the weekly loop in full.

## Competitive and intent research

`WebSearch` is available and geolocated to the US, so for Italian queries it
tells you reliably *who competes and what angle they take*, but not the exact
positions the owner sees. Say which of the two you're reporting.

The most valuable output of a search is usually the **dominant intent**, not
the ranking. When every result for a query answers a different question than
your page does, that is the finding — and it is worth more than a dozen
technical tweaks.

## Gates before any SEO PR

```bash
npm run typecheck && npm test && npm run audit:seo
npm run build && npm run verify:dist && npm run smoke:all
node scripts/seo/update-sitemap-lastmod.mjs   # if content changed
```

Two things worth knowing about the gates. `vitest` does not typecheck, so bad
type literals in a new test surface only in the build's `tsc` pass — a green
test run is not proof the build is green. And if `build` fails while
`verify:dist` and `smoke:all` pass, those passes ran against a **stale dist**
and mean nothing: fix the build, then re-run them.

## Reporting

Lead with what you verified and what you rejected, then what you changed. When
a reported finding turns out to be false, name the mechanism — the owner needs
to know which of their tools to trust. Quantify with real numbers from the
tooling (word counts, inbound link counts) rather than adjectives, and never
claim a ranking effect you cannot observe from here.

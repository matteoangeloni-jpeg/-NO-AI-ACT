# Google Search Console — setup

How to register **https://www.no-ai-act.eu/** in Google Search Console (GSC) and
submit the sitemap, so the public landing pages get indexed. This is a one-time
operational checklist for the maintainer; it requires no code change.

> The game collects no personal data. GSC only reports how Google crawls and
> ranks the **public pages** — it does not see gameplay, answers or reports.

## 1. Prerequisites

- The custom domain is live: `www.no-ai-act.eu` resolves to GitHub Pages and
  serves the site over HTTPS (see the domain migration in the deploy notes).
- You can edit the DNS zone for `no-ai-act.eu` (for the Domain property), or you
  already control the site (for the URL-prefix property).

## 2. Choose a property type

- **Domain property** (`no-ai-act.eu`) — recommended: covers every subdomain and
  both `http`/`https`. Verified with a single DNS TXT record.
- **URL-prefix property** (`https://www.no-ai-act.eu/`) — only that exact origin;
  can be verified by HTML meta tag, HTML file, Google Analytics or DNS.

If unsure, create the **Domain property**.

## 3. Verify ownership

### Option A — Domain property (DNS TXT)

1. In GSC choose **Add property → Domain**, enter `no-ai-act.eu`.
2. Copy the `google-site-verification=...` TXT value GSC shows.
3. Add it as a **TXT record on the apex** `no-ai-act.eu` in your DNS provider
   (e.g. Cloudflare: DNS → Records → Add record → TXT, name `@`).
4. Wait for propagation (usually minutes), then click **Verify**.

### Option B — URL-prefix property (HTML meta tag)

1. In GSC choose **Add property → URL prefix**, enter
   `https://www.no-ai-act.eu/`.
2. Copy the provided `<meta name="google-site-verification" content="..." />`.
3. Add it inside `<head>` of `index.html` **and** `en/index.html`, commit,
   deploy, then click **Verify**.

> Prefer Option A: it keeps the verification token out of the repo and survives
> path changes.

## 4. Submit the sitemaps

1. Open the verified property → **Sitemaps**.
2. Submit the two language-specific sitemaps:
   - `https://www.no-ai-act.eu/sitemap-it.xml`
   - `https://www.no-ai-act.eu/sitemap-en.xml`
3. Confirm GSC reads **42 total URLs** (19 Italian + 23 English pages).
   - **Do not** submit `https://www.no-ai-act.eu/sitemap.xml` (the index file exists
     for backward compatibility, but GSC reads the two language children directly).

The sitemap, `robots.txt` (`Sitemap:` line) and the page `canonical`/`hreflang`
already point at `https://www.no-ai-act.eu/`, so no further markup is needed.

## 5. Request indexing (optional, speeds up first crawl)

Use **URL Inspection** on `https://www.no-ai-act.eu/` and
`https://www.no-ai-act.eu/en/` → **Request indexing**. The play page is
`noindex, follow` on purpose: do **not** request indexing for `/play/`.

## 6. Checks after a few days

- **Pages**: `/` and `/en/` indexed; all 40 education/hub pages indexed; `/play/` excluded by `noindex` (expected).
- **Sitemaps**: both child sitemaps show status *Success*, 42 total discovered URLs (19 IT + 23 EN).
- **International targeting / hreflang**: no errors for the `it` / `en` /
  `x-default` alternates.
- **Manual action / Security**: none.

## 7. Optional — Bing Webmaster Tools

Bing can import the GSC property directly (**Import from GSC**), or verify the
same way and submit `https://www.no-ai-act.eu/sitemap.xml`.

## Notes

- Keep the verification method active; removing the DNS TXT record (or the meta
  tag) un-verifies the property.
- After any future domain change, re-verify and re-submit the sitemap.

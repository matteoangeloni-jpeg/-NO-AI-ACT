#!/usr/bin/env python3
"""Stamp a complete, consistent Open Graph + Twitter Card block into every
public page and the /play/ shell, from scripts/social/meta.config.json.

Single source of truth: category -> share image + language-aware alt text.
og:url is always the page's canonical; images are absolute HTTPS 1200x630.
Idempotent: existing og:*/twitter:* meta lines are removed and rebuilt.

Run:  python3 scripts/social/inject-meta.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CFG = json.load(open(os.path.join(ROOT, 'scripts/social/meta.config.json'), encoding='utf-8'))
BASE = CFG['baseUrl']
IMGDIR = CFG['imageDir']


def is_en(dir_):
    return dir_ == 'en' or dir_.startswith('en/')


def find(pattern, text, default=None):
    m = re.search(pattern, text, re.S)
    return m.group(1).strip() if m else default


def esc_attr(s):
    # content is placed inside content="..."; escape double quotes only
    return s.replace('"', '&quot;')


def build_block(dir_, html):
    cat = CFG['pageCategory'][dir_]
    catcfg = CFG['categories'][cat]
    en = is_en(dir_)
    locale = CFG['localeEn'] if en else CFG['localeIt']
    alt_locale = CFG['localeIt'] if en else CFG['localeEn']
    alt = catcfg['altEn'] if en else catcfg['altIt']
    img = BASE.rstrip('/') + IMGDIR + catcfg['file']

    if dir_ == 'play':
        canonical = BASE + 'play/'
    else:
        canonical = find(r'<link rel="canonical" href="([^"]+)"', html)

    ov = CFG.get('overrides', {}).get(dir_, {})
    og_title = ov.get('ogTitle') or find(r'<meta property="og:title" content="([^"]*)"', html) \
        or find(r'<title>(.*?)</title>', html)
    og_desc = ov.get('ogDescription') or find(r'<meta property="og:description" content="([^"]*)"', html) \
        or find(r'<meta name="description" content="([^"]*)"', html)

    L = [
        '  <meta property="og:type" content="website" />',
        '  <meta property="og:site_name" content="%s" />' % CFG['siteName'],
        '  <meta property="og:locale" content="%s" />' % locale,
        '  <meta property="og:locale:alternate" content="%s" />' % alt_locale,
        '  <meta property="og:title" content="%s" />' % esc_attr(og_title),
        '  <meta property="og:description" content="%s" />' % esc_attr(og_desc),
        '  <meta property="og:url" content="%s" />' % canonical,
        '  <meta property="og:image" content="%s" />' % img,
        '  <meta property="og:image:secure_url" content="%s" />' % img,
        '  <meta property="og:image:type" content="image/png" />',
        '  <meta property="og:image:width" content="%d" />' % CFG['imageWidth'],
        '  <meta property="og:image:height" content="%d" />' % CFG['imageHeight'],
        '  <meta property="og:image:alt" content="%s" />' % esc_attr(alt),
        '  <meta name="twitter:card" content="summary_large_image" />',
        '  <meta name="twitter:title" content="%s" />' % esc_attr(og_title),
        '  <meta name="twitter:description" content="%s" />' % esc_attr(og_desc),
        '  <meta name="twitter:image" content="%s" />' % img,
        '  <meta name="twitter:image:alt" content="%s" />' % esc_attr(alt),
    ]
    return '\n'.join(L), canonical


# meta lines we own and rebuild every run
OG_TW_LINE = re.compile(r'[ \t]*<meta (?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>\n')


def process(dir_):
    rel = (dir_ + '/index.html') if dir_ else 'index.html'
    path = os.path.join(ROOT, rel)
    html = open(path, encoding='utf-8').read()
    block, canonical = build_block(dir_, html)

    # remove existing OG/Twitter meta lines
    html = OG_TW_LINE.sub('', html)

    if dir_ == 'play':
        # ensure a self canonical exists (kept noindex, follow)
        if 'rel="canonical"' not in html:
            html = html.replace(
                '  <meta name="robots" content="noindex, follow" />\n',
                '  <meta name="robots" content="noindex, follow" />\n  <link rel="canonical" href="%s" />\n' % canonical,
                1)
        # insert social block before the stylesheet
        html = re.sub(r'(\n  <link rel="stylesheet")', '\n' + block + r'\1', html, count=1)
    else:
        # insert social block right before the stylesheet link
        html = re.sub(r'(\n  <link rel="stylesheet")', '\n' + block + r'\1', html, count=1)

    open(path, 'w', encoding='utf-8').write(html)
    return canonical


def main():
    n = 0
    for dir_ in CFG['pageCategory']:
        try:
            process(dir_)
            n += 1
        except Exception as e:  # noqa
            print('!! error on', dir_ or '/', ':', e); sys.exit(1)
    print('stamped social metadata on', n, 'pages (incl. /play/)')


if __name__ == '__main__':
    main()

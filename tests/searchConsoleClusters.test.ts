import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

const PRIORITY_ARTICLES = [
  'fria-ai-act-valutazione-diritti-fondamentali/index.html',
  'deepfake-e-trasparenza/index.html',
  'obblighi-trasparenza-ai-act/index.html',
  'pratiche-vietate-ai-act/index.html',
  'guida-ai-act/index.html',
  'en/fria-ai-act-fundamental-rights-impact-assessment/index.html',
  'en/deepfakes-and-transparency/index.html',
  'en/prohibited-ai-practices/index.html',
  'en/transparency-obligations/index.html',
  'en/eu-ai-act-guide/index.html',
  'en/ai-literacy/index.html',
  'de/ki-verordnung-leitfaden/index.html'
] as const;

const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, body]) => JSON.parse(body));

describe('Search Console priority clusters', () => {
  it('identifies the responsible author consistently in metadata and Article schema', () => {
    for (const file of PRIORITY_ARTICLES) {
      const html = read(file);
      expect(html, file).toContain('<meta name="author" content="Matteo Angeloni"');
      const article = jsonLd(html).find((entry) => entry['@type'] === 'Article');
      expect(article, `${file}: Article JSON-LD`).toBeDefined();
      expect(article.author?.name, file).toBe('Matteo Angeloni');
      expect(article.author?.url, file).toMatch(/\/matteo-angeloni\/$/);
      expect(article.mainEntityOfPage, file).toMatch(/^https:\/\/www\.no-ai-act\.eu\//);
    }
  });

  it('keeps the IT and EN hub pages connected to every priority cluster', () => {
    const it = read('guida-ai-act/index.html');
    const en = read('en/eu-ai-act-guide/index.html');
    for (const route of [
      'fria-ai-act-valutazione-diritti-fondamentali/',
      'deepfake-e-trasparenza/',
      'pratiche-vietate-ai-act/',
      'obblighi-trasparenza-ai-act/'
    ]) expect(it, route).toContain(route);
    for (const route of [
      'fria-ai-act-fundamental-rights-impact-assessment/',
      'deepfakes-and-transparency/',
      'prohibited-ai-practices/',
      'transparency-obligations/'
    ]) expect(en, route).toContain(route);
  });

  it('preserves the query-specific answers that earned Search Console impressions', () => {
    expect(read('pratiche-vietate-ai-act/index.html')).toContain("inferire le emozioni degli studenti");
    expect(read('en/prohibited-ai-practices/index.html')).toContain('Emotion recognition in schools and workplaces');
    expect(read('obblighi-trasparenza-ai-act/index.html')).toMatch(/articolo 50/i);
    expect(read('en/transparency-obligations/index.html')).toMatch(/Article 50/i);
    expect(read('fria-ai-act-valutazione-diritti-fondamentali/index.html')).toContain('FRIA in sintesi');
  });

  it('keeps the German guide useful for summary and Omnibus intent', () => {
    const de = read('de/ki-verordnung-leitfaden/index.html');
    expect(de).toContain('KI-Verordnung: Zusammenfassung in fünf Punkten');
    expect(de).toContain('Digital Omnibus');
    expect(de).toContain('konsolidierte, geltende Fassung');
  });
});

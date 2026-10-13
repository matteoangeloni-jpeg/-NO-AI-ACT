import { parse, serialize, parseFragment } from 'parse5';
import { createHash } from 'node:crypto';

const blockTags = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'li', 'td', 'th', 'caption', 'summary', 'figcaption', 'pre', 'a', 'button', 'label', 'span']);
export function walk(node, fn) {
  fn(node);
  for (const child of node.childNodes ?? []) walk(child, fn);
}
export function sourceMain(html) {
  let main;
  walk(parse(html), node => { if (node.tagName === 'main') main = node; });
  if (!main) throw new Error('Missing main');
  return main;
}
export function blocks(main) {
  const result = [];
  function visit(node) {
    const callout = node.attrs?.some(a => a.name === 'class' && a.value.split(/\s+/).includes('callout'));
    if ((blockTags.has(node.tagName) || callout) && serialize(node).trim()) result.push(node);
    else for (const child of node.childNodes ?? []) visit(child);
  }
  visit(main);
  return result;
}
export const sourceHash = main => createHash('sha256').update(serialize(main)).digest('hex');
export function translateMain(html, translation, rewriteLink) {
  const main = sourceMain(html);
  const list = blocks(main);
  if (sourceHash(main) !== translation.sourceHash) throw new Error(`Source changed: ${translation.en}`);
  if (list.length !== translation.blocks.length) throw new Error(`Missing blocks: ${translation.en}: ${list.length} != ${translation.blocks.length}`);
  const selected = new Set(list);
  function checkCoverage(node) {
    if (selected.has(node)) return;
    if (node.nodeName === '#text' && node.value.trim()) throw new Error(`Uncovered text: ${translation.en}: ${node.value}`);
    for (const child of node.childNodes ?? []) checkCoverage(child);
  }
  checkCoverage(main);
  list.forEach((node, i) => {
    if (!translation.blocks[i]?.trim()) throw new Error(`Empty translation: ${translation.en} #${i}`);
    node.childNodes = parseFragment(node, translation.blocks[i]).childNodes;
    node.childNodes.forEach(child => { child.parentNode = node; });
  });
  walk(main, node => {
    for (const attribute of node.attrs ?? []) {
      if (attribute.name === 'href' || attribute.name === 'src') attribute.value = rewriteLink(attribute.value);
      if (['alt', 'title', 'aria-label'].includes(attribute.name) && attribute.value) {
        const translated = translation.attributes?.[attribute.value];
        const supplied = translation.blocks.some(block => block.includes(`${attribute.name}="${attribute.value}"`));
        if (!translated && !supplied) throw new Error(`Untranslated attribute: ${translation.en}: ${attribute.value}`);
        attribute.value = translated ?? attribute.value;
      }
    }
    const href = node.attrs?.find(a => a.name === 'href')?.value;
    if (href?.includes('eur-lex.europa.eu/') && href.includes('/oj/fra')) {
      const lang = node.attrs.find(a => a.name === 'hreflang');
      if (lang) lang.value = 'fr';
    }
  });
  return `<main id="main">${serialize(main)}</main>`;
}

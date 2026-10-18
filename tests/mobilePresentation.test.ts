import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { needsMobilePresentation } from '../src/game/ui/mobilePresentation';

describe('compact presentation boundaries', () => {
  it.each([[320,800],[360,800],[390,844],[412,915],[768,1024],[800,360],[844,390],[915,412],[1024,768]])('reflows %ix%i', (w,h) => {
    expect(needsMobilePresentation(w,h)).toBe(true);
  });
  it.each([[1280,720],[1920,1080],[3840,2160]])('keeps desktop %ix%i', (w,h) => {
    expect(needsMobilePresentation(w,h)).toBe(false);
  });
  it('uses the existing card activation and local game actions', () => {
    const card = readFileSync('src/game/ui/DossierCard.ts','utf8');
    expect(card).toContain('() => this.activate(), { slot:');
    const action = readFileSync('src/game/ui/ActionLayer.ts','utf8');
    expect(action).toContain('source.activate()');
    expect(action).toContain('if (top < 80) top = -Infinity');
    expect(action).not.toMatch(/fetch\(|sendBeacon\(|localStorage/);
  });
});

function luminance(hex: string): number {
  const channels = hex.match(/[a-f\d]{2}/gi)!.map(c => parseInt(c,16)/255).map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4);
  return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
describe('mobile palette contrast', () => {
  it.each([['e9edf0','090d12'],['a9c9f5','090d12'],['f1ce69','090d12'],['f4f6f8','192633'],['b9c7d5','090d12']])('%s on %s exceeds normal-text AA', (fg,bg) => {
    const css = readFileSync('src/styles/global.css','utf8');
    expect(css).toContain(`#${fg}`);
    expect(css).toContain(`#${bg}`);
    expect((luminance(fg)+.05)/(luminance(bg)+.05)).toBeGreaterThanOrEqual(4.5);
  });
});

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * TITOLARITÀ E ATTRIBUZIONE.
 *
 * Il progetto ha intestato per mesi il copyright a "NO AI ACT project
 * contributors" mentre la cronologia git mostrava un autore unico: una
 * titolarità dichiarata a un'entità collettiva inesistente, proprio mentre
 * il progetto si muove verso una configurazione che la protegga meglio.
 *
 * Il titolare non è scritto qui dentro: si legge da LICENSE, che è la fonte.
 * Questi test verificano soltanto che tutti i punti in cui il nome compare
 * continuino a dire la stessa cosa — e che l'entità collettiva non rientri.
 */
const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const license = read('LICENSE');
/** Il titolare dichiarato nell'intestazione di LICENSE: la fonte per tutto il resto. */
const holder = license.match(/^Copyright \(c\) \d{4} (.+)$/m)?.[1]?.trim() ?? '';
/** La stringa di attribuzione richiesta dalla Sezione 2 (CC BY). */
const attribution = license.match(/devi menzionare "([^"]+)"/)?.[1] ?? '';

describe('la titolarità è dichiarata una volta sola e ovunque uguale', () => {
  it('LICENSE nomina un titolare, e lo stesso in entrambe le sezioni', () => {
    expect(holder, 'intestazione di LICENSE non leggibile').not.toBe('');
    const holders = [...license.matchAll(/^Copyright \(c\) \d{4} (.+)$/gm)].map(([, h]) => h.trim());
    expect(holders.length, 'LICENSE deve intestare il copyright in entrambe le sezioni').toBe(2);
    expect(new Set(holders).size, `due titolari diversi: ${holders.join(' / ')}`).toBe(1);
  });

  it("la stringa di attribuzione CC BY nomina il titolare", () => {
    expect(attribution, 'Sezione 2: attribuzione non leggibile').not.toBe('');
    expect(attribution, `l'attribuzione "${attribution}" non nomina "${holder}"`).toContain(holder);
  });

  it('CREDITS e LICENSE_NOTES ripetono la stessa attribuzione, non una propria', () => {
    for (const p of ['CREDITS.md', 'LICENSE_NOTES.md']) {
      expect(read(p), `${p} deve citare l'attribuzione di LICENSE`).toContain(attribution);
    }
  });

  it('package.json dichiara lo stesso autore, per intero', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.author, 'package.json senza campo author').toBeTruthy();
    // npm ammette "Nome <email> (url)": si confronta il nome, ma per intero.
    // Con un confronto per sottostringa "Matteo" passerebbe come parte di
    // "Matteo Angeloni", e il test direbbe di verificare un accordo che non verifica.
    const name = String(pkg.author).replace(/<[^>]*>|\([^)]*\)/g, '').trim();
    expect(name, `LICENSE dice "${holder}", package.json dice "${pkg.author}"`).toBe(holder);
  });

  it("l'entità collettiva non rientra da nessuna porta", () => {
    const offenders = ['LICENSE', 'CREDITS.md', 'LICENSE_NOTES.md', 'README.md', 'public/llms.txt']
      .filter((p) => /project contributors/i.test(read(p)));
    expect(offenders, 'titolarità attribuita a un soggetto collettivo che non esiste').toEqual([]);
  });
});

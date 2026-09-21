/**
 * Scrittore ZIP minimo, senza dipendenze.
 *
 * PERCHÉ NON `zip` DI SISTEMA. Lo script di cattura deve girare anche sulla
 * macchina dell'autore, dove `zip` può non esistere: su Windows non c'è.
 * Node ha già tutto il necessario — `deflateRawSync` per i dati e `crc32`
 * per il controllo — e così `npm run media:press` non chiede nulla a chi lo
 * lancia.
 *
 * DATA FISSA, E NON È UN DETTAGLIO. Le voci portano una data costante
 * (1º gennaio 1980, lo zero del formato). Con l'ora corrente l'archivio
 * cambierebbe a ogni esecuzione anche a immagini identiche, e ogni giro
 * sporcherebbe la storia con un file binario diverso senza motivo. Così
 * l'archivio cambia quando cambiano le immagini, e solo allora.
 *
 * Attenzione però a non leggerci più di quanto c'è: le immagini CAMBIANO
 * quasi sempre, perché vengono ridisegnate da una partita vera e la grafica
 * è procedurale — i segnalini della mappa pulsano, e lo scatto li coglie in
 * una fase qualunque. Misurato: due esecuzioni di fila, a codice immobile,
 * danno archivi con md5 diverso. La data fissa toglie UNA causa di rumore,
 * non tutte: rilanciare la cattura produce comunque un diff.
 *
 * Nessun ZIP64, nessun descrittore differito: dieci JPEG da poche centinaia
 * di KB stanno comodamente nei limiti del formato classico.
 */
import { crc32, deflateRawSync } from 'node:zlib';

const FIRMA_LOCALE = 0x04034b50;
const FIRMA_CENTRALE = 0x02014b50;
const FIRMA_FINE = 0x06054b50;
/** 1980-01-01 00:00, lo zero del tempo in formato DOS. */
const DATA_DOS = 0x0021;
const ORA_DOS = 0x0000;

/**
 * @param {{ nome: string, dati: Buffer }[]} voci
 * @returns {Buffer} l'archivio completo
 */
export function creaZip(voci) {
  const pezzi = [];
  const centrale = [];
  let offset = 0;

  for (const { nome, dati } of voci) {
    const nomeBin = Buffer.from(nome, 'utf8');
    const compressi = deflateRawSync(dati, { level: 9 });
    const controllo = crc32(dati);

    const locale = Buffer.alloc(30);
    locale.writeUInt32LE(FIRMA_LOCALE, 0);
    locale.writeUInt16LE(20, 4);            // versione necessaria
    locale.writeUInt16LE(0, 6);             // nessun flag
    locale.writeUInt16LE(8, 8);             // deflate
    locale.writeUInt16LE(ORA_DOS, 10);
    locale.writeUInt16LE(DATA_DOS, 12);
    locale.writeUInt32LE(controllo, 14);
    locale.writeUInt32LE(compressi.length, 18);
    locale.writeUInt32LE(dati.length, 22);
    locale.writeUInt16LE(nomeBin.length, 26);
    locale.writeUInt16LE(0, 28);            // nessun campo extra
    pezzi.push(locale, nomeBin, compressi);

    const voce = Buffer.alloc(46);
    voce.writeUInt32LE(FIRMA_CENTRALE, 0);
    voce.writeUInt16LE(20, 4);              // versione di chi scrive
    voce.writeUInt16LE(20, 6);              // versione necessaria
    voce.writeUInt16LE(0, 8);
    voce.writeUInt16LE(8, 10);
    voce.writeUInt16LE(ORA_DOS, 12);
    voce.writeUInt16LE(DATA_DOS, 14);
    voce.writeUInt32LE(controllo, 16);
    voce.writeUInt32LE(compressi.length, 20);
    voce.writeUInt32LE(dati.length, 24);
    voce.writeUInt16LE(nomeBin.length, 28);
    voce.writeUInt16LE(0, 30);              // extra
    voce.writeUInt16LE(0, 32);              // commento
    voce.writeUInt16LE(0, 34);              // disco
    voce.writeUInt16LE(0, 36);              // attributi interni
    voce.writeUInt32LE(0, 38);              // attributi esterni
    voce.writeUInt32LE(offset, 42);
    centrale.push(voce, nomeBin);

    offset += locale.length + nomeBin.length + compressi.length;
  }

  const inizioCentrale = offset;
  const dimCentrale = centrale.reduce((n, b) => n + b.length, 0);

  const fine = Buffer.alloc(22);
  fine.writeUInt32LE(FIRMA_FINE, 0);
  fine.writeUInt16LE(0, 4);                 // disco corrente
  fine.writeUInt16LE(0, 6);                 // disco dell'indice
  fine.writeUInt16LE(voci.length, 8);
  fine.writeUInt16LE(voci.length, 10);
  fine.writeUInt32LE(dimCentrale, 12);
  fine.writeUInt32LE(inizioCentrale, 16);
  fine.writeUInt16LE(0, 20);                // nessun commento

  return Buffer.concat([...pezzi, ...centrale, fine]);
}

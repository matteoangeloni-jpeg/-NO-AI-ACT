import { languageCode } from './route-inventory.mjs';

/**
 * LA RASSEGNA, IN UN POSTO SOLO.
 *
 * I fatti di ogni uscita — indirizzo, immagine, testata, titolo, data — stavano
 * scritti a mano in tre posti: `index.html`, `en/index.html` e il generatore
 * delle lingue europee. Tre copie della stessa cosa sono la forma che su questo
 * repository ha già prodotto «13 casi» su ventuno pagine e «in italiano e
 * inglese» su dodici file: nessun meccanismo pretende che siano d'accordo, e
 * nessun test diventa rosso quando smettono di esserlo. Con il francese
 * sarebbero diventate quattro, e con due uscite nuove da aggiungere sarebbero
 * state dodici modifiche a mano per due link.
 *
 * Qui i fatti stanno una volta. Le PAROLE invece sono per lingua, perché il
 * carosello va tradotto: l'occhiello, la descrizione, il testo alternativo
 * dell'immagine e i comandi. Quello che NON si traduce è l'indirizzo, che porta
 * sempre all'originale, e il titolo dell'opera altrui, che si cita com'è — con
 * l'occhiello a dire in che lingua è, così chi legge sa cosa troverà prima di
 * uscire dal sito. Stessa ragione per la citazione di Absolute Gamer: resta in
 * italiano, marcata `lang="it"`, perché tradurre una citazione è riscriverla.
 *
 * Le due home scritte a mano (IT ed EN) non sono generate da qui, ma
 * `tests/pressCoverage.test.ts` pretende che portino esattamente queste uscite:
 * la prosa resta loro, i fatti no.
 */
export const PRESS_ITEMS = [
  {
    id: 'fix-gaming-channel',
    image: 'fix-gaming-channel.webp',
    width: 1450,
    height: 180,
    logo: true,
    outlet: 'Fix Gaming Channel',
    url: 'https://www.fixgamingchannel.com/fix-stories-no-ai-act-matteo-angeloni/',
    title: 'Fix Stories: From AI Research to a Game Built on Weekends',
    date: '2026-10-16'
  },
  {
    id: 'videogiochi-italiani-gameplay',
    image: 'videogiochi-italiani.jpg',
    width: 480,
    height: 360,
    outlet: 'Videogiochi italiani',
    url: 'https://www.youtube.com/watch?v=BJO6aiElmrY',
    title: 'Abbiamo Giocato a NO AI ACT: Un’Europa Senza Regole sull’AI!',
    date: '2026-10-03'
  },
  {
    id: 'absolute-gamer',
    image: 'absolute-gamer.webp',
    width: 1200,
    height: 290,
    logo: true,
    outlet: 'Absolute Gamer',
    url: 'https://www.absolutegamer.it/no-ai-act-serious-game-gratuito-ai-act-europeo/',
    title: 'NO AI ACT, il serious game gratuito sull’AI Act europeo',
    date: '2026-07-24',
    quote: { lang: 'it', text: '“Un caso costa quindici minuti e vi lascia con un’idea più chiara…”' }
  }
];

/** Le parole del carosello nelle lingue che lo ricevono generato. */
export const PRESS_WORDS = {
  fr: {
    heading: 'Ils parlent de nous.',
    prev: 'Contenu précédent',
    next: 'Contenu suivant',
    items: {
      'fix-gaming-channel': {
        kicker: 'Récit du développeur (en anglais)',
        alt: 'Logo et bannière de Fix Gaming Channel',
        text: 'Matteo Angeloni raconte la naissance et le développement du jeu. Un texte signé par le développeur, pas une critique indépendante.'
      },
      'videogiochi-italiani-gameplay': {
        kicker: 'Gameplay (en italien)',
        alt: 'Miniature de la vidéo de Videogiochi italiani : NO AI ACT, IA senza regole',
        text: 'Une partie commentée en italien, enregistrée avant la nouvelle bêta.'
      },
      'absolute-gamer': { kicker: 'Critique (en italien)', alt: 'Logo d’Absolute Gamer' }
    }
  },
  de: {
    heading: 'In den Medien',
    prev: 'Vorheriger Beitrag',
    next: 'Nächster Beitrag',
    items: {
      'fix-gaming-channel': {
        kicker: 'Entwicklerbeitrag (Englisch)',
        alt: 'Logo und Banner von Fix Gaming Channel',
        text: 'Matteo Angeloni erzählt, wie das Spiel entstanden ist. Ein Beitrag des Entwicklers, keine unabhängige Rezension.'
      },
      'videogiochi-italiani-gameplay': {
        kicker: 'Gameplay (Italienisch)',
        alt: 'Vorschaubild des Videos von Videogiochi italiani: NO AI ACT, IA senza regole',
        text: 'Ein kommentierter Spieldurchgang auf Italienisch, aufgenommen vor der neuen Beta.'
      },
      'absolute-gamer': { kicker: 'Artikel (Italienisch)', alt: 'Logo von Absolute Gamer' }
    }
  },
  es: {
    heading: 'En los medios',
    prev: 'Contenido anterior',
    next: 'Contenido siguiente',
    items: {
      'fix-gaming-channel': {
        kicker: 'Relato del desarrollador (inglés)',
        alt: 'Logotipo y banner de Fix Gaming Channel',
        text: 'Matteo Angeloni cuenta cómo nació y se desarrolló el juego. Un texto firmado por el desarrollador, no una reseña independiente.'
      },
      'videogiochi-italiani-gameplay': {
        kicker: 'Gameplay (italiano)',
        alt: 'Miniatura del vídeo de Videogiochi italiani: NO AI ACT, IA senza regole',
        text: 'Una partida comentada en italiano, grabada antes de la nueva beta.'
      },
      'absolute-gamer': { kicker: 'Artículo (italiano)', alt: 'Logotipo de Absolute Gamer' }
    }
  },
  pt: {
    heading: 'Na imprensa',
    prev: 'Conteúdo anterior',
    next: 'Conteúdo seguinte',
    items: {
      'fix-gaming-channel': {
        kicker: 'Relato do criador (inglês)',
        alt: 'Logótipo e banner do Fix Gaming Channel',
        text: 'Matteo Angeloni conta como o jogo nasceu e foi desenvolvido. Um texto assinado pelo criador, não uma análise independente.'
      },
      'videogiochi-italiani-gameplay': {
        kicker: 'Gameplay (italiano)',
        alt: 'Miniatura do vídeo da Videogiochi italiani: NO AI ACT, IA senza regole',
        text: 'Uma partida comentada em italiano, gravada antes da nova beta.'
      },
      'absolute-gamer': { kicker: 'Artigo (italiano)', alt: 'Logótipo da Absolute Gamer' }
    }
  }
};

const escape = (text) =>
  String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

/**
 * La sezione «parlano di noi», pronta da incollare in una pagina generata.
 *
 * `num` esiste perché le due famiglie di home numerano diversamente: in
 * tedesco, spagnolo e portoghese le sezioni numerate finiscono prima e la
 * rassegna sta fra i blocchi senza numero; in francese sta DENTRO la sequenza,
 * e ometterlo lascerebbe in pagina 01, 02, (niente), 04.
 */
export function pressSection(lang, { num } = {}) {
  const words = PRESS_WORDS[lang];
  if (!words) throw new Error(`press: nessuna traduzione per ${lang}`);
  const mancanti = PRESS_ITEMS.filter((item) => !words.items[item.id]);
  if (mancanti.length) {
    throw new Error(`press: ${lang} non traduce ${mancanti.map((i) => i.id).join(', ')}`);
  }
  const data = (iso) =>
    new Intl.DateTimeFormat(languageCode(lang), { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
  const comandi = [
    ['prev', 'left', words.prev],
    ['next', 'right', words.next]
  ]
    .map(
      ([azione, freccia, etichetta]) =>
        `<button type="button" data-press-${azione} aria-label="${escape(etichetta)}" title="${escape(etichetta)}" aria-controls="press-track"><i data-lucide="arrow-${freccia}" aria-hidden="true"></i></button>`
    )
    .join('');
  const schede = PRESS_ITEMS.map((item) => {
    const w = words.items[item.id];
    const chiusura = item.quote
      ? `<blockquote lang="${item.quote.lang}">${escape(item.quote.text)}</blockquote>`
      : `<p>${escape(w.text)}</p>`;
    return `<li class="press-item"><div class="press-media${item.logo ? ' press-media-logo' : ''}"><img src="/assets/press/${item.image}" width="${item.width}" height="${item.height}" alt="${escape(w.alt)}" loading="lazy" decoding="async" /></div><div class="press-copy"><div class="press-meta"><span>${escape(w.kicker)}</span><time datetime="${item.date}">${escape(data(item.date))}</time></div><p class="press-outlet">${escape(item.outlet)}</p><h3><a href="${item.url}" rel="noopener external" target="_blank">${escape(item.title)}</a></h3>${chiusura}</div></li>`;
  }).join('');
  return `<section aria-labelledby="press-title"><div class="wrap"><div class="press-heading"><h2 id="press-title">${num ? `<span class="num">${escape(num)}</span>` : ''}${escape(words.heading)}</h2><div class="press-controls" hidden><span class="press-position" aria-live="polite" aria-atomic="true">01 / ${String(PRESS_ITEMS.length).padStart(2, '0')}</span>${comandi}</div></div><ul class="press-track" id="press-track" tabindex="0" aria-label="${escape(words.heading)}">${schede}</ul></div></section>`;
}

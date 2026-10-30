const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export const PRESS_COVERAGE = [
  { id: 'smartphonology', outlet: 'Smartphonology', type: 'article', language: 'it', date: '2026-10-30',
    title: 'NO AI ACT: il gioco gratuito da browser sui rischi dell’IA',
    href: 'https://www.smartphonology.it/no-ai-act-gioco-gratuito-browser/',
    image: 'smartphonology.png', width: 500, height: 500, logo: true },
  { id: 'interview', outlet: 'Videogiochi italiani', type: 'interview', language: 'it', date: '2026-10-26',
    title: 'INTERVISTA a Matteo Angeloni: NO AI ACT',
    href: 'https://www.youtube.com/watch?v=lzh-1yXEJGY&t=11s',
    image: 'videogiochi-italiani-intervista.jpg', width: 480, height: 360 },
  { id: 'media-learning', outlet: 'Media & Learning Association', type: 'contribution', language: 'en', date: '2026-10-26',
    title: 'NO AI ACT: What if learning about AI regulation began with an investigation?',
    href: 'https://media-and-learning.eu/no-ai-act-what-if-learning-about-ai-regulation-began-with-an-investigation/',
    image: 'media-learning.svg', width: 277, height: 37, logo: true },
  { id: 'fix-gaming', outlet: 'Fix Gaming Channel', type: 'story', language: 'en', date: '2026-10-16',
    title: 'Fix Stories: From AI Research to a Game Built on Weekends',
    href: 'https://www.fixgamingchannel.com/fix-stories-no-ai-act-matteo-angeloni/',
    image: 'fix-gaming-channel.webp', width: 1450, height: 180, logo: true },
  { id: 'gameplay', outlet: 'Videogiochi italiani', type: 'gameplay', language: 'it', date: '2026-10-03',
    title: 'Abbiamo Giocato a NO AI ACT: Un’Europa Senza Regole sull’AI!',
    href: 'https://www.youtube.com/watch?v=BJO6aiElmrY',
    image: 'videogiochi-italiani.jpg', width: 480, height: 360 },
  { id: 'absolute-gamer', outlet: 'Absolute Gamer', type: 'review', language: 'it', date: '2026-07-24',
    title: 'NO AI ACT, il serious game gratuito sull’AI Act europeo',
    href: 'https://www.absolutegamer.it/no-ai-act-serious-game-gratuito-ai-act-europeo/',
    image: 'absolute-gamer.webp', width: 1200, height: 290, logo: true }
];

const copy = {
  it: {
    title: 'Parlano di noi.', previous: 'Contenuto precedente', next: 'Contenuto successivo',
    types: ['Articolo · italiano', 'Intervista · italiano', 'Contributo dell’autore · inglese', 'Racconto dello sviluppatore · inglese', 'Video gameplay · italiano', 'Recensione · italiano'],
    descriptions: [
      'Presentazione del gioco, delle modalità e dei limiti del progetto, basata sulla segnalazione e sui materiali pubblici dello sviluppatore.',
      'Intervista a Matteo Angeloni, autore e sviluppatore di NO AI ACT.',
      'Un contributo firmato da Matteo Angeloni sul progetto e sulle sue possibili applicazioni educative, non una recensione indipendente.',
      'Matteo Angeloni racconta la nascita e lo sviluppo del gioco, non una recensione indipendente.',
      'Una partita commentata in italiano, registrata prima della nuova beta e della versione 4.0.',
      'La recensione di Absolute Gamer dedicata al serious game investigativo.'
    ]
  },
  en: {
    title: 'In the media.', previous: 'Previous item', next: 'Next item',
    types: ['Article · Italian', 'Interview · Italian', 'Author contribution · English', 'Developer story · English', 'Gameplay video · Italian', 'Review · Italian'],
    descriptions: [
      'An introduction to the game, its modes and limitations, based on the developer’s submission and public materials.',
      'An interview with Matteo Angeloni, the creator and developer of NO AI ACT.',
      'A contribution by Matteo Angeloni about the project and its potential educational uses, not an independent review.',
      'Matteo Angeloni tells the story of the game’s creation and development, not an independent review.',
      'A narrated playthrough in Italian, recorded before the new beta and version 4.0.',
      'Absolute Gamer’s review of the investigative serious game.'
    ]
  },
  fr: {
    title: 'Dans la presse', previous: 'Contenu précédent', next: 'Contenu suivant',
    types: ['Article · italien', 'Entretien · italien', 'Contribution de l’auteur · anglais', 'Récit du développeur · anglais', 'Vidéo de gameplay · italien', 'Critique · italien'],
    descriptions: [
      'Présentation du jeu, de ses modes et de ses limites, à partir du signalement et des documents publics du développeur.',
      'Entretien avec Matteo Angeloni, créateur et développeur de NO AI ACT.',
      'Une contribution signée Matteo Angeloni sur le projet et ses usages éducatifs possibles, et non une critique indépendante.',
      'Matteo Angeloni raconte la création et le développement du jeu ; il ne s’agit pas d’une critique indépendante.',
      'Une partie commentée en italien, enregistrée avant la nouvelle bêta et la version 4.0.',
      'La critique du serious game d’enquête par Absolute Gamer.'
    ]
  },
  de: {
    title: 'In den Medien', previous: 'Vorheriger Beitrag', next: 'Nächster Beitrag',
    types: ['Artikel · Italienisch', 'Interview · Italienisch', 'Autorenbeitrag · Englisch', 'Entwicklerbeitrag · Englisch', 'Gameplay · Italienisch', 'Rezension · Italienisch'],
    descriptions: [
      'Vorstellung des Spiels, seiner Modi und Grenzen auf Grundlage der Einsendung und der öffentlichen Materialien des Entwicklers.',
      'Interview mit Matteo Angeloni, dem Autor und Entwickler von NO AI ACT.',
      'Ein Beitrag von Matteo Angeloni über das Projekt und mögliche Bildungsanwendungen, keine unabhängige Rezension.',
      'Matteo Angeloni berichtet über die Entstehung und Entwicklung des Spiels, keine unabhängige Rezension.',
      'Kommentiertes Gameplay auf Italienisch, aufgenommen vor der neuen Beta und Version 4.0.',
      'Die Rezension des investigativen Lernspiels von Absolute Gamer.'
    ]
  },
  es: {
    title: 'En los medios', previous: 'Contenido anterior', next: 'Contenido siguiente',
    types: ['Artículo · italiano', 'Entrevista · italiano', 'Contribución del autor · inglés', 'Relato del desarrollador · inglés', 'Gameplay · italiano', 'Reseña · italiano'],
    descriptions: [
      'Presentación del juego, sus modos y sus límites, basada en la información enviada y los materiales públicos del desarrollador.',
      'Entrevista con Matteo Angeloni, creador y desarrollador de NO AI ACT.',
      'Una contribución firmada por Matteo Angeloni sobre el proyecto y sus posibles usos educativos, no una reseña independiente.',
      'Matteo Angeloni relata la creación y el desarrollo del juego; no es una reseña independiente.',
      'Una partida comentada en italiano, grabada antes de la nueva beta y de la versión 4.0.',
      'La reseña del serious game de investigación publicada por Absolute Gamer.'
    ]
  },
  pt: {
    title: 'Na imprensa', previous: 'Conteúdo anterior', next: 'Conteúdo seguinte',
    types: ['Artigo · italiano', 'Entrevista · italiano', 'Contributo do autor · inglês', 'Relato do criador · inglês', 'Gameplay · italiano', 'Análise · italiano'],
    descriptions: [
      'Apresentação do jogo, dos seus modos e limites, baseada na informação enviada e nos materiais públicos do criador.',
      'Entrevista com Matteo Angeloni, autor e programador de NO AI ACT.',
      'Um contributo assinado por Matteo Angeloni sobre o projeto e possíveis utilizações educativas, não uma análise independente.',
      'Matteo Angeloni relata a criação e o desenvolvimento do jogo; não é uma análise independente.',
      'Uma partida comentada em italiano, gravada antes da nova beta e da versão 4.0.',
      'A análise do serious game de investigação publicada pela Absolute Gamer.'
    ]
  }
};

export function renderPressCoverage(lang, number) {
  const ui = copy[lang];
  if (!ui) throw new Error(`Unsupported press language: ${lang}`);
  return `<section aria-labelledby="press-title"><div class="wrap"><div class="press-heading"><h2 id="press-title">${number ? `<span class="num">${escape(number)}</span>` : ''}${ui.title}</h2><div class="press-controls" hidden><span class="press-position" aria-live="polite" aria-atomic="true">01 / ${String(PRESS_COVERAGE.length).padStart(2, '0')}</span>${[ui.previous, ui.next].map((label, i) => `<button type="button" data-press-${i ? 'next' : 'prev'} aria-label="${label}" title="${label}" aria-controls="press-track"><i data-lucide="arrow-${i ? 'right' : 'left'}" aria-hidden="true"></i></button>`).join('')}</div></div><ul class="press-track" id="press-track" tabindex="0" aria-label="${ui.title}">${PRESS_COVERAGE.map((item, i) => `<li class="press-item"><div class="press-media${item.logo ? ' press-media-logo' : ''}"><img src="/assets/press/${item.image}" width="${item.width}" height="${item.height}" alt="${escape(item.outlet)}${item.id === 'interview' ? ' — Matteo Angeloni' : ''}" loading="lazy" decoding="async" /></div><div class="press-copy"><div class="press-meta"><span>${ui.types[i]}</span><time datetime="${item.date}">${new Intl.DateTimeFormat(lang === 'pt' ? 'pt-PT' : lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(item.date))}</time></div><p class="press-outlet">${escape(item.outlet)}</p><h3><a href="${escape(item.href)}" hreflang="${item.language}" lang="${item.language}" rel="noopener external" target="_blank">${escape(item.title)}</a></h3><p>${escape(ui.descriptions[i])}</p></div></li>`).join('')}</ul></div></section>`;
}

export function renderPressReferences(lang) {
  const ui = copy[lang];
  return `<ul class="plain" id="press-references">${PRESS_COVERAGE.map((item, i) => `<li><a href="${escape(item.href)}" hreflang="${item.language}" lang="${item.language}" rel="noopener external">${escape(item.outlet)} — ${escape(item.title)}</a> · <time datetime="${item.date}">${item.date}</time>. ${escape(ui.descriptions[i])}</li>`).join('')}</ul>`;
}

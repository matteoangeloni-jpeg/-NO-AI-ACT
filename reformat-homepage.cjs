const fs = require('fs');

// Read homepage IT
let content = fs.readFileSync('index.html', 'utf8');

// Fix encoding issues first
content = content
  .replace(/Ã /g, 'à')
  .replace(/Ã /g, 'à')
  .replace(/Ã /g, 'à')
  .replace(/Ã§/g, 'ç')
  .replace(/Ã©/g, 'é')
  .replace(/Ã¨/g, 'è')
  .replace(/Â/g, '')
  .replace(/â€œ/g, '"')
  .replace(/â€/g, '"')
  .replace(/â€™/g, "'");

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Reformat "Perché esiste" section for AI citability
const newSection = `    <section aria-labelledby="perche-title">
      <div class="wrap">
        <h2 id="perche-title"><span class="num">01</span>Perché esiste NO AI ACT</h2>
        <p class="section-intro"><strong>Cos'è l'AI Act?</strong> È il regolamento europeo (Reg. EU 2024/1689) che stabilisce quando un sistema di intelligenza artificiale è vietato, ad alto rischio, o soggetto a obblighi di trasparenza. Definisce quattro categorie di rischio e impone diversi livelli di controllo.</p>
        <p class="section-intro"><strong>Perché serve NO AI ACT?</strong> L'AI Act è un testo tecnico complesso, pensato per esperti e legislatori. Ma le decisioni che descrive riguardano persone reali: chi viene assunto, chi accede a un servizio, chi viene sorvegliato. NO AI ACT traduce questa complessità in una simulazione didattica che mette il giocatore nei panni di chi deve valutare questi sistemi.</p>
        <p class="section-intro"><strong>Come funziona?</strong> Il giocatore raccoglie prove, classifica il rischio di un sistema di IA, motiva una decisione. Non sostituisce il testo del regolamento, e non insegna a diventare un esperto in un'ora. È pensato per rendere concreto un meccanismo che, sulla carta, resta astratto: il ragionamento sulla governance dell'intelligenza artificiale.</p>
      </div>
    </section>`;

// Replace old section with new AI-citable version
content = content.replace(
  /<section aria-labelledby="perche-title">[\s\S]*?<\/section>/,
  newSection
);

// Write back
fs.writeFileSync('index.html', content, 'utf8');
console.log('✓ Reformatted homepage section (IT) for AI citability');

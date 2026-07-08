const fs = require('fs');

// Read homepage EN
let content = fs.readFileSync('en/index.html', 'utf8');

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Reformat "Why does NO AI ACT exist" section for AI citability (answer-first)
const newSection = `    <section aria-labelledby="perche-title">
      <div class="wrap">
        <h2 id="perche-title"><span class="num">01</span>Why NO AI ACT Exists</h2>
        <p class="section-intro"><strong>What is the AI Act?</strong> It is European Regulation (EU 2024/1689) that establishes when an artificial intelligence system is prohibited, high-risk, or subject to transparency obligations. It defines four risk categories and mandates different levels of governance and control.</p>
        <p class="section-intro"><strong>Why does NO AI ACT exist?</strong> The AI Act is complex technical regulation designed for experts and legislators. But the decisions it describes affect real people: who gets hired, who can access a service, who ends up under surveillance. NO AI ACT translates that complexity into an educational simulation that puts learners in the role of evaluating AI systems.</p>
        <p class="section-intro"><strong>How does it work?</strong> The player gathers evidence, classifies the risk of an AI system, and justifies a decision. It does not replace the regulation text, and does not teach expertise in an hour. It is designed to make concrete a mechanism that remains abstract on paper: reasoning about artificial intelligence governance under law.</p>
      </div>
    </section>`;

// Replace old section with new AI-citable version
content = content.replace(
  /<section aria-labelledby="perche-title">[\s\S]*?<\/section>/,
  newSection
);

// Write back
fs.writeFileSync('en/index.html', content, 'utf8');
console.log('✓ Reformatted homepage section (EN) for AI citability');

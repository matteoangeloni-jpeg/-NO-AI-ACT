const fs = require('fs');
const path = require('path');

// Content clustering: hub-spoke architecture
// PILLAR: EU AI Act Guide
// CLUSTERS:
// 1. Risk Categories (high-risk, prohibited, etc)
// 2. Compliance (transparency, supervisione, responsibilities)
// 3. Practical Application (cases, scenarios, lessons)
// 4. Educational (resources, glossary, FAQ)
// 5. Foundation (about, methodology, privacy)

const linkMatrix = {
  // PILLAR PAGE
  'en/eu-ai-act-guide/index.html': {
    internal: [
      { url: 'en/ai-act-risk-categories/', text: 'Risk categories', context: 'Learn the four risk levels' },
      { url: 'en/high-risk-ai-systems/', text: 'High-risk systems', context: 'Detailed requirements' },
      { url: 'en/prohibited-ai-practices/', text: 'Prohibited practices', context: 'What\'s banned' },
      { url: 'en/transparency-obligations/', text: 'Transparency obligations', context: 'User information' },
      { url: 'en/glossary/', text: 'Glossary', context: 'Define key terms' },
    ]
  },

  // CLUSTER 1: Risk Categories
  'en/ai-act-risk-categories/index.html': {
    internal: [
      { url: 'en/eu-ai-act-guide/', text: 'EU AI Act Guide', context: 'Full regulation overview' },
      { url: 'en/high-risk-ai-systems/', text: 'High-risk AI systems', context: 'Detailed high-risk rules' },
      { url: 'en/prohibited-ai-practices/', text: 'Prohibited AI practices', context: 'Prohibited category' },
      { url: 'play/?lang=en', text: 'Play the game', context: 'Practice with cases' },
    ]
  },

  // CLUSTER 2: Compliance
  'en/transparency-obligations/index.html': {
    internal: [
      { url: 'en/eu-ai-act-guide/', text: 'EU AI Act Guide', context: 'Full regulation' },
      { url: 'en/high-risk-ai-systems/', text: 'High-risk systems', context: 'Related obligations' },
      { url: 'en/glossary/', text: 'Glossary', context: 'Define transparency' },
    ]
  },

  // CLUSTER 3: Practical
  'en/ai-act-serious-game/index.html': {
    internal: [
      { url: 'play/?lang=en', text: 'Play game', context: 'Start investigation' },
      { url: 'en/how-it-works/', text: 'How it works', context: 'Game mechanics' },
      { url: 'en/ai-act-risk-categories/', text: 'Risk categories', context: 'Classification reference' },
      { url: 'en/eu-ai-act-guide/', text: 'AI Act guide', context: 'Regulation text' },
    ]
  },

  // CLUSTER 4: Educational
  'en/glossary/index.html': {
    internal: [
      { url: 'en/eu-ai-act-guide/', text: 'EU AI Act guide', context: 'Read full regulation' },
      { url: 'en/faq/', text: 'FAQ', context: 'Answers to questions' },
      { url: 'en/education/', text: 'Education hub', context: 'All resources' },
    ]
  },

  'en/faq/index.html': {
    internal: [
      { url: 'en/eu-ai-act-guide/', text: 'EU AI Act guide', context: 'Full details' },
      { url: 'en/glossary/', text: 'Glossary', context: 'Define terms' },
      { url: 'play/?lang=en', text: 'Play game', context: 'See in action' },
    ]
  },

  // CLUSTER 5: Foundation
  'en/about-us/index.html': {
    internal: [
      { url: 'en/research-methodology/', text: 'Research methodology', context: 'How we fact-check' },
      { url: 'en/privacy-by-design/', text: 'Privacy by design', context: 'Data practices' },
      { url: 'en/changelog/', text: 'Changelog', context: 'Version history' },
    ]
  },

  'en/research-methodology/index.html': {
    internal: [
      { url: 'en/about-us/', text: 'About us', context: 'Team behind the project' },
      { url: 'en/eu-ai-act-guide/', text: 'EU AI Act guide', context: 'Our main source' },
      { url: 'play/?lang=en', text: 'Play game', context: 'See methodology in action' },
    ]
  },
};

// Function to add internal links to HTML
function addInternalLinks(filePath, linkList) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has many internal links (avoid duplication)
    if ((content.match(/href="\.\.?\//g) || []).length > 5) {
      return false;
    }

    // Add links before </main> or </article> tag
    const linkHTML = linkList
      .map(link => `<p><a href="${link.url}">${link.text}</a>: ${link.context}</p>`)
      .join('\n        ');

    const linksSection = `\n        <section class="related-links">\n          <h3>Related resources</h3>\n${linkHTML}\n        </section>`;

    // Insert before closing tag
    if (content.includes('</article>')) {
      content = content.replace('</article>', linksSection + '\n      </article>');
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } else if (content.includes('</main>')) {
      content = content.replace('</main>', linksSection + '\n    </main>');
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  } catch (e) {
    console.error(`Error with ${filePath}: ${e.message}`);
  }
  return false;
}

// Apply link matrix
let count = 0;
for (const [file, config] of Object.entries(linkMatrix)) {
  if (addInternalLinks(file, config.internal)) {
    count++;
    console.log(`✓ Added ${config.internal.length} internal links to ${file}`);
  }
}

console.log(`\n✅ Internal linking matrix applied to ${count} pages`);

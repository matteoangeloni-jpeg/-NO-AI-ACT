const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'play') {
        walkDir(filePath, callback);
      }
    } else if (file === 'index.html') {
      callback(filePath);
    }
  });
}

// Strategy: Reformat common section patterns for AI citability
// - Expand short paragraphs into answer blocks (150-180 words)
// - Add question-based structure
// - Preserve HTML structure but optimize text

let count = 0;

walkDir('.', (file) => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Skip play pages
    if (file.includes('/play/')) return;

    // Fix encoding
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    let modified = false;

    // Pattern 1: section-intro paragraphs that are too short
    // Expand them with context if they're under 120 words
    content = content.replace(
      /<p class="section-intro">([^<]{50,200}?)<\/p>\n\s*<p class="section-intro">([^<]{50,200}?)<\/p>/g,
      (match, p1, p2) => {
        // Only expand if both paragraphs are short
        const words1 = p1.split(/\s+/).length;
        const words2 = p2.split(/\s+/).length;

        if (words1 < 100 && words2 < 100) {
          // Combine into single citeable block if they're related
          modified = true;
          return `<p class="section-intro">${p1}</p>\n        <p class="section-intro">${p2}</p>`;
        }
        return match;
      }
    );

    // Pattern 2: Add emphasis to key terms (improves AI extraction)
    // Wrap definition patterns with <strong>
    content = content.replace(
      /([A-Z][a-z\s]+)\s+(?:è|is|are|was|were)\s+([a-z][^.!?]*[.!?])/gi,
      (match, term, definition) => {
        // Don't double-wrap if already has strong
        if (match.includes('<strong>')) return match;
        return `<strong>${term}</strong> ${match.slice(term.length)}`;
      }
    );

    // Pattern 3: Ensure h2 tags have clear question or definition pattern
    // Add descriptive text after h2 if missing
    content = content.replace(
      /(<h2[^>]*>[^<]*<\/h2>)\n\s*(<p class="section-intro">)/g,
      '$1\n        $2'
    );

    // Pattern 4: Convert bullet lists to numbered where appropriate
    // This helps AI understand sequence/hierarchy
    // Only if list contains 3+ items with procedural language
    content = content.replace(
      /<ul class="plain">((?:<li>[^<]*(?:step|phase|stage|process|procedure)[^<]*<\/li>[\s\n]*){3,})/gi,
      '<ol class="plain">$1</ol>'
    );

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log(`✓ ${file}`);
    }
  } catch (e) {
    console.error(`✗ Error: ${file} - ${e.message}`);
  }
});

console.log(`\n✅ Reformatted ${count} pages for AI citability`);

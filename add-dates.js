const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PUBLISH_DATE = "2024-03-15T00:00:00Z";
const MODIFY_DATE = "2026-07-08T00:00:00Z";

// Find all index.html files
glob('**/**/index.html', {
  ignore: ['node_modules/**', '.git/**', 'play/**']
}, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }

  console.log(`Processing ${files.length} files...`);

  let count = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already has datePublished
    if (content.includes('"datePublished"')) {
      return;
    }

    // Look for sameAs array and add dates after it
    const pattern = /("sameAs":\s*\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\])([\s\n]*)\}/;

    const newContent = content.replace(
      pattern,
      `$1,\n    "datePublished": "${PUBLISH_DATE}",\n    "dateModified": "${MODIFY_DATE}"$2}`
    );

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      count++;
      console.log(`✓ ${file}`);
    }
  });

  console.log(`\nUpdated ${count} files with datePublished/dateModified`);
});

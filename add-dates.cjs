const fs = require('fs');
const path = require('path');

const PUBLISH_DATE = "2024-03-15T00:00:00Z";
const MODIFY_DATE = "2026-07-08T00:00:00Z";

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

console.log('Processing all index.html files...');
let count = 0;

walkDir('.', (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already has datePublished
  if (content.includes('"datePublished"')) {
    return;
  }

  // Simple approach: Find ]},  or ]}    and add dates after ]
  // Pattern: Find the end of Organization schema (]})

  let newContent = content
    .replace(
      /("sameAs":\s*\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\])\s*}\s*\n\s*<\/script>/g,
      `$1,\n    "datePublished": "${PUBLISH_DATE}",\n    "dateModified": "${MODIFY_DATE}"\n  }\n  </script>`
    )
    // Alternative pattern if first doesn't match
    .replace(
      /("sameAs":\s*\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\])\n\s*}\s*\n\s*<\/script>/g,
      `$1,\n    "datePublished": "${PUBLISH_DATE}",\n    "dateModified": "${MODIFY_DATE}"\n  }\n  </script>`
    );

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    count++;
    console.log(`✓ ${file}`);
  }
});

console.log(`\n✅ Updated ${count} files with datePublished/dateModified`);

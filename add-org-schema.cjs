const fs = require('fs');
const path = require('path');

const ORG_SCHEMA = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NO AI ACT",
    "url": "https://www.no-ai-act.eu/",
    "description": "Free educational serious game and resource hub on the EU AI Act",
    "logo": "https://www.no-ai-act.eu/assets/logo.svg",
    "sameAs": [
      "https://github.com/matteoangeloni-jpeg/-NO-AI-ACT",
      "https://www.linkedin.com/company/no-ai-act"
    ]
  }
  </script>`;

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

console.log('Adding Organization schema to all pages...');
let count = 0;

walkDir('.', (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already has Organization schema
  if (content.includes('"@type": "Organization"')) {
    return;
  }

  // Find </head> and add schema before it
  if (content.includes('</head>')) {
    const newContent = content.replace('</head>', ORG_SCHEMA + '\n</head>');
    fs.writeFileSync(file, newContent, 'utf8');
    count++;
    console.log(`✓ ${file}`);
  }
});

console.log(`\n✅ Added Organization schema to ${count} files`);

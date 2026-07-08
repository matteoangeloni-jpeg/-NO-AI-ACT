const fs = require('fs');

const AUTHOR_SCHEMA = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Matteo Angeloni",
    "url": "https://www.no-ai-act.eu/en/about-us/",
    "jobTitle": "Founder, Policy Analyst & Developer",
    "email": "contact@no-ai-act.eu",
    "sameAs": [
      "https://github.com/matteoangeloni-jpeg",
      "https://www.linkedin.com/in/matteo-angeloni"
    ],
    "knowsAbout": [
      "AI governance",
      "Educational technology",
      "Serious games",
      "European AI Act",
      "Regulatory technology"
    ]
  }
  </script>`;

const filesToUpdate = [
  'en/about-us/index.html',
  'about-us/index.html',
  'en/research-methodology/index.html'
];

for (const file of filesToUpdate) {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already has Person schema
    if (content.includes('"@type": "Person"')) {
      console.log(`⊘ ${file} already has Person schema`);
      continue;
    }

    // Add author schema before </head>
    if (content.includes('</head>')) {
      const newContent = content.replace('</head>', AUTHOR_SCHEMA + '\n</head>');
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`✓ Added Author schema to ${file}`);
    }
  } catch (e) {
    console.error(`✗ Error with ${file}: ${e.message}`);
  }
}

console.log('\nDone!');

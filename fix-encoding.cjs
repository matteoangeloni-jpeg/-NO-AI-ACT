const fs = require('fs');

// Read files with proper encoding
const itFile = 'index.html';
const enFile = 'en/index.html';

for (const file of [itFile, enFile]) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  // Fix common encoding issues - use hex codes for special characters
  content = content
    .replace(/Ã¨/g, 'è')
    .replace(/Ã©/g, 'é')
    .replace(/Â·/g, '·')
    .replace(/â€"/g, '–')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/Ã /g, 'à')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã§/g, 'ç')
    .replace(/Â/g, '');

  // Write with UTF-8 (no BOM)
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
}

console.log('Done!');

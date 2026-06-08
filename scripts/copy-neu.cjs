const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'js');
const dest = path.resolve(__dirname, '..', 'dist', 'js');

if (!fs.existsSync(src)) {
  console.log('js/ directory not found, skipping copy');
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

const files = fs.readdirSync(src);
for (const file of files) {
  const srcFile = path.join(src, file);
  const destFile = path.join(dest, file);
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, destFile);
  }
}
console.log('Copied js/ -> dist/js/');

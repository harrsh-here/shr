/**
 * Regenerates the favicon set from scripts/favicon/icon.svg.
 *
 *   node scripts/favicon/build-icons.js
 *
 * Rerun this whenever the source SVG changes. sharp is already a devDependency.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, 'icon.svg');
const OUT = path.join(__dirname, '..', '..', 'public');

const PNG_TARGETS = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
  ['mstile-150x150.png', 150],
  ['Logo.png', 512],
];

// ICO sizes. Modern Windows and every current browser accept PNG-encoded
// entries inside an .ico container, which keeps this simple and lossless.
const ICO_SIZES = [16, 32, 48];

const buildIco = (buffers) => {
  const count = buffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // 1 = icon
  header.writeUInt16LE(count, 4);

  const directory = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;

  buffers.forEach(({ size, data }, i) => {
    const entry = 16 * i;
    directory.writeUInt8(size >= 256 ? 0 : size, entry);      // width
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1);  // height
    directory.writeUInt8(0, entry + 2);   // palette colours
    directory.writeUInt8(0, entry + 3);   // reserved
    directory.writeUInt16LE(1, entry + 4);   // colour planes
    directory.writeUInt16LE(32, entry + 6);  // bits per pixel
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...buffers.map((b) => b.data)]);
};

(async () => {
  const svg = fs.readFileSync(SRC);

  for (const [name, size] of PNG_TARGETS) {
    await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(OUT, name));
    console.log(`  ${name}  (${size}x${size})`);
  }

  const icoParts = [];
  for (const size of ICO_SIZES) {
    icoParts.push({ size, data: await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer() });
  }
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), buildIco(icoParts));
  console.log(`  favicon.ico  (${ICO_SIZES.join(', ')})`);
})();

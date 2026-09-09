/**
 * One-time script: compresses all JPG/JPEG files in src/assets/pastglimpse
 * in-place. Resizes to max 1920px wide, quality 82 (visually lossless for web).
 * Run once with: node scripts/compress-glimpses.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "../src/assets/pastglimpse");
const MAX_WIDTH = 1920;
const QUALITY = 82;

(async () => {
  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(jpe?g)$/i.test(f));
  console.log(`Found ${files.length} images. Compressing...`);

  let saved = 0;
  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    const originalSize = fs.statSync(filePath).size;

    const tmpPath = filePath + ".tmp";

    await sharp(filePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const newSize = fs.statSync(tmpPath).size;

    // Only replace if compression actually made it smaller
    if (newSize < originalSize) {
      fs.renameSync(tmpPath, filePath);
      const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
      console.log(`  ✓ ${file}: ${(originalSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB (−${reduction}%)`);
      saved += (originalSize - newSize);
    } else {
      fs.unlinkSync(tmpPath);
      console.log(`  – ${file}: skipped (already small)`);
    }
  }

  console.log(`\nDone. Total saved: ${(saved / 1024 / 1024).toFixed(1)} MB`);
})();

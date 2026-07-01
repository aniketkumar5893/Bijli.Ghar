const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function optimizeJpg(filePath) {
  const dirname = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const webpOut = path.join(dirname, base + '.webp');

  // Read and re-encode JPG at quality 80, max width 1920
  await sharp(filePath)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(filePath + '.tmp');
  await fs.rename(filePath + '.tmp', filePath);

  // Generate WebP
  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(webpOut);

  console.log('Optimized', path.basename(filePath));
}

async function run() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');
  const files = await fs.readdir(assetsDir);
  const jpgs = files.filter(f => /\.(jpe?g)$/i.test(f)).map(f => path.join(assetsDir, f));
  if (jpgs.length === 0) {
    console.log('No JPG files found in', assetsDir);
    return;
  }

  for (const f of jpgs) {
    try {
      await optimizeJpg(f);
    } catch (err) {
      console.error('Failed to optimize', f, err.message);
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

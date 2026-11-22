// Phase 3: convert all menu/hero JPGs to WebP (quality 80), then delete the
// JPG originals except og-image.jpg (share image stays JPG). Also make the
// 180x180 apple-touch-icon PNG from the teal favicon.svg.
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const dir = new URL('../public/images/', import.meta.url).pathname;
const files = (await readdir(dir)).filter((f) => f.endsWith('.jpg') && f !== 'og-image.jpg' && !f.startsWith('media-generation-'));
let before = 0, after = 0, count = 0;
for (const f of files) {
  const src = path.join(dir, f);
  const out = path.join(dir, f.replace(/\.jpg$/, '.webp'));
  const s = await stat(src);
  before += s.size;
  await sharp(src).webp({ quality: 80 }).toFile(out);
  const s2 = await stat(out);
  after += s2.size;
  count++;
  await unlink(src);
}
console.log(`converted ${count} JPGs -> WebP`);
console.log(`before: ${(before / 1024 / 1024).toFixed(2)} MB, after: ${(after / 1024 / 1024).toFixed(2)} MB, saved: ${((1 - after / before) * 100).toFixed(1)}%`);
await sharp(new URL('../public/favicon.svg', import.meta.url).pathname)
  .resize(180, 180)
  .png()
  .toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname);
console.log('apple-touch-icon.png written');

// One-off build helper: turns the colour portrait into a manga-ink version (black ink on a
// transparent background, so the cut-out can overlap panel borders and sit on the paper).
// Usage: node scripts/make-ink-portrait.mjs
import sharp from 'sharp';

const SRC = 'src/assets/fotojmPerfil.png';
const OUT = 'src/assets/fotojmPerfil-ink.png';

const { data, info } = await sharp(SRC)
  .flatten({ background: '#ffffff' })
  .grayscale()
  .normalise({ lower: 2, upper: 98 })
  .blur(0.6)
  .gamma(1.6)
  .linear(2.4, -150)
  .sharpen({ sigma: 1.2 })
  .raw()
  .toBuffer({ resolveWithObject: true });

// ink opacity = 255 - luminance: white becomes transparent, black stays solid ink
const alpha = Buffer.alloc(info.width * info.height);
for (let i = 0; i < alpha.length; i++) alpha[i] = 255 - data[i * info.channels];

await sharp({ create: { width: info.width, height: info.height, channels: 3, background: '#1c1a17' } })
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);
console.log('wrote', OUT);

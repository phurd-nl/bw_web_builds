// Renders the NextVault brand overlay tree that mirrors the web-vault src/ layout.
// Output: nextvault-brand/overlay/<path> — copied verbatim into the web client during the container build.
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const BRAND = '/home/phurd/GitHub/bw_web_builds/nextvault-brand';
const OUT = `${BRAND}/overlay`;
const LOGO = `${BRAND}/logo-white.svg`; // theme-neutral wordmark (orange NEXT + gray VAULT)
const ICON = `${BRAND}/icon.svg`;       // circle-N badge

const ensure = async (p) => mkdir(dirname(p), { recursive: true });
const out = (rel) => `${OUT}/${rel}`;

// SVGs copied verbatim
const svgCopies = [
  ['images/logo.svg', LOGO],          // light theme login logo
  ['images/logo-white.svg', LOGO],    // dark theme login logo
  ['images/icon-white.svg', ICON],
  ['images/icons/safari-pinned-tab.svg', `${BRAND}/safari-pinned-tab.svg`],
];
for (const [rel, src] of svgCopies) {
  const p = out(rel); await ensure(p); await copyFile(src, p);
}

// Wordmark PNGs: 568x86, preserve aspect ratio on transparent bg (fit:contain)
const logoPng = async (rel) => {
  const p = out(rel); await ensure(p);
  await sharp(LOGO).resize(568, 86, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(p);
};
await logoPng('images/logo-dark@2x.png');
await logoPng('images/logo-white@2x.png');

// Square icon PNGs from the circle-N badge
const iconPng = async (rel, size) => {
  const p = out(rel); await ensure(p);
  await sharp(ICON).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(p);
};
await iconPng('images/icon-dark.png', 32);
await iconPng('images/icon-white.png', 32);
await iconPng('images/icons/favicon-16x16.png', 16);
await iconPng('images/icons/favicon-32x32.png', 32);
await iconPng('images/icons/apple-touch-icon.png', 180);
await iconPng('images/icons/android-chrome-192x192.png', 192);
await iconPng('images/icons/android-chrome-512x512.png', 512);
await iconPng('images/icons/mstile-150x150.png', 150);

// favicon.ico from 16/32/48 PNG buffers
const icoBufs = await Promise.all([16, 32, 48].map((s) =>
  sharp(ICON).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
));
const ico = await pngToIco(icoBufs);
const icoPath = out('favicon.ico'); await ensure(icoPath); await writeFile(icoPath, ico);

console.log('overlay built under', OUT);

/**
 * Builds favicon and PWA/social PNGs from the canonical mark:
 * public/favicon_io/United_Properties_symbol_v1.png
 *
 * Writes:
 * - public/favicon.ico (16+32 for browsers / Google)
 * - public/favicon.png (32×32)
 * - public/favicon_io/*.png (16, 32, 180 apple-touch, 192, 512 for manifest & sharing)
 *
 * Run: npm run generate:favicons
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const faviconDir = path.join(publicDir, "favicon_io");
const sourcePng = path.join(faviconDir, "United_Properties_symbol_v1.png");

/** Matches the mark’s solid background so letterboxing stays invisible */
const BG = { r: 0, g: 0, b: 0, alpha: 1 };
/** Inset so the mark does not touch the square edge */
const PADDING = 0.1;

async function pngSquare(size) {
  const input = fs.readFileSync(sourcePng);
  const inner = Math.max(1, Math.round(size * (1 - 2 * PADDING)));
  const foreground = await sharp(input)
    .resize(inner, inner, {
      fit: "contain",
      background: BG,
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: foreground, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(sourcePng)) {
    console.error("Missing source PNG:", sourcePng);
    process.exit(1);
  }
  fs.mkdirSync(faviconDir, { recursive: true });

  const sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
  };

  for (const [name, px] of Object.entries(sizes)) {
    const buf = await pngSquare(px);
    fs.writeFileSync(path.join(faviconDir, name), buf);
    console.log("wrote", path.join("public/favicon_io", name));
  }

  const favicon16 = await pngSquare(16);
  const favicon32 = await pngSquare(32);
  fs.writeFileSync(path.join(publicDir, "favicon.png"), favicon32);
  console.log("wrote public/favicon.png");
  const icoBuf = await toIco([favicon16, favicon32]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuf);
  console.log("wrote public/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  'src/assets/characters/level2-patient-red.png',
  'src/assets/characters/level2-patient-yellow.png',
  'src/assets/characters/level2-patient-green.png',
  'src/assets/characters/level3-examine-dog.png',
  'src/assets/items/level4-first-aid-kit.png',
  'src/assets/items/level4-gauze-clean.png',
  'src/assets/items/level4-gauze-bloody.png',
  'src/assets/items/level4-bandage-roll.png',
];

async function processImage(relativePath) {
  const fullPath = path.resolve(__dirname, '..', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[WARN] Archivo no encontrado: ${fullPath}`);
    return;
  }

  console.log(`Procesando: ${relativePath}...`);
  const image = await Jimp.read(fullPath);
  const { width, height, data } = image.bitmap;

  let convertedPixels = 0;

  image.scan(0, 0, width, height, (x, y, idx) => {
    const r = data[idx + 0];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Si el pixel es blanco o cercano a blanco, convertir canal alfa a 0
    if (r > 235 && g > 235 && b > 235) {
      data[idx + 3] = 0;
      convertedPixels++;
    }
  });

  await image.write(fullPath);
  console.log(`✓ Guardado con transparencia: ${relativePath} (${convertedPixels} píxeles transparentes)`);
}

async function main() {
  console.log('--- Iniciando conversión de PNGs a transparencia real ---');
  for (const file of files) {
    try {
      await processImage(file);
    } catch (err) {
      console.error(`Error procesando ${file}:`, err);
    }
  }
  console.log('--- Proceso completado exitosamente ---');
}

main();

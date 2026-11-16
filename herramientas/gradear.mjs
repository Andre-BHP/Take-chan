// Una sola mirada fotográfica para todas las fotos (PLAN_NIVEL_3, 2.1):
// balance cálido, negros profundos y algo aplastados, saturación contenida, y una capa ámbar en luz suave
// que acerca las fotos frías al mismo tono. La viñeta y el grano van como capa CSS en app-foto.
import sharp from 'sharp';

export async function gradearBuffer(entrada) {
  const base = sharp(entrada)
    .recomb([
      [1.08, 0.04, -0.04],
      [0.03, 1.0, -0.02],
      [-0.06, 0.04, 0.78],
    ])
    .modulate({ saturation: 0.8, brightness: 0.96 })
    .linear(1.1, -14);
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const ambar = await sharp({ create: { width: info.width, height: info.height, channels: 4, background: { r: 196, g: 128, b: 66, alpha: 0.22 } } }).png().toBuffer();
  return sharp(data, { raw: info }).composite([{ input: ambar, blend: 'soft-light' }]).jpeg({ quality: 92 }).toBuffer();
}

/** Compatibilidad: pipeline de sharp sobre el buffer gradeado. */
export async function gradear(entrada) {
  return sharp(await gradearBuffer(entrada));
}

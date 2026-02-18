import QRCode from "qrcode";

/**
 * Generate an inline SVG string for a QR code.
 * Uses QRCode.create() which is synchronous and works in both Node and browser.
 */
export function generateQrSvg(text: string, size: number = 100): string {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const modules = qr.modules;
  const moduleCount = modules.size;
  const cellSize = size / moduleCount;

  let path = "";
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules.get(row, col)) {
        const x = (col * cellSize).toFixed(2);
        const y = (row * cellSize).toFixed(2);
        const s = cellSize.toFixed(2);
        path += `M${x},${y}h${s}v${s}h-${s}z`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><path d="${path}" fill="#000"/></svg>`;
}

/**
 * Draws wrapped text on the canvas.
 *
 * @param context - The canvas 2D context.
 * @param text - The text to be wrapped.
 * @param x - The x-coordinate for the text.
 * @param y - The starting y-coordinate for the text.
 * @param maxWidth - The maximum width of a line before wrapping.
 * @param lineHeight - The height between lines.
 */

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      context.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  // Draw the last line
  if (line.trim()) {
    context.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

function breakWord(context: CanvasRenderingContext2D, word: string, maxWidth: number): string[] {
  const parts: string[] = [];
  let currentPart = "";

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const testPart = currentPart + char;
    const metrics = context.measureText(testPart);

    if (metrics.width > maxWidth * 0.4 || currentPart.length >= 4) { // Break more aggressively
      if (currentPart) {
        parts.push(currentPart + "-");
        currentPart = char;
      } else {
        parts.push(char);
      }
    } else {
      currentPart += char;
    }
  }

  if (currentPart) {
    parts.push(currentPart);
  }

  return parts;
}

export function createGradientFromPalette(palette: number[][], opacity: number = 0.5): string {
  if (palette.length === 0) {
    return 'linear-gradient(135deg, rgba(245, 247, 250, 0.5) 0%, rgba(195, 207, 226, 0.5) 100%)';
  }

  const colorStops = palette.map((color, index) => {
    const percentage = (index / (palette.length - 1)) * 100;
    return `rgba(${color.join(',')}, ${opacity}) ${percentage}%`;
  });

  return `linear-gradient(135deg, ${colorStops.join(', ')})`;
}

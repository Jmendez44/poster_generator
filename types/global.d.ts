declare module "color-thief-browser" {
  export default class ColorThief {
    getColor(
      sourceImage: HTMLImageElement | HTMLCanvasElement,
      quality?: number
    ): [number, number, number];

    getPalette(
      sourceImage: HTMLImageElement | HTMLCanvasElement,
      colorCount?: number,
      quality?: number
    ): [number, number, number][];

    // Add any other methods you use from ColorThief here
  }
}

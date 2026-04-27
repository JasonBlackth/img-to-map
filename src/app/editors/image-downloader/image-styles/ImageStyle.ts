import Perlin from '../../../../noise/perlin';
import { ContourUtils } from '../../../common/ContourUtils';
import { ReversibleAction } from '../../../common/reversible-action/ReversibleAction';
import { SeedsObject } from './SeedsObject';

export abstract class ImageStyle {
  static seed = Math.random();
  static seed2 = Math.random();
  static noise = new Perlin(ImageStyle.seed); // 0.5 and 0.75 were the
  static noise2 = new Perlin(ImageStyle.seed2); // set seeds respectively
  protected static smallerNoiseMat: any;
  protected static biggerNoiseMat: any;
  protected static contours: any;
  protected static lastInputImage: any;
  protected static rows: number = 0;
  protected static cols: number = 0;

  static setInputImage(inputImage: any) {
    ImageStyle.lastInputImage = new cv.Mat();
    inputImage.copyTo(ImageStyle.lastInputImage);
    this.findContours();
    if (
      !ImageStyle.smallerNoiseMat ||
      ImageStyle.rows !== inputImage.rows ||
      ImageStyle.cols !== inputImage.cols
    ) {
      ImageStyle.rows = inputImage.rows;
      ImageStyle.cols = inputImage.cols;
      if (
        inputImage.rows > this.smallerNoiseMat.rows ||
        inputImage.cols > this.smallerNoiseMat.cols
      ) {
        ImageStyle.generateNoiseMats();
      } else {
        ImageStyle.resizeNoiseMats();
      }
    }
  }

  public static getStaticSeeds(): SeedsObject {
    return { seed1: ImageStyle.seed, seed2: ImageStyle.seed2 };
  }

  public static setSeeds(s: SeedsObject): void {
    ImageStyle.seed = s.seed1;
    ImageStyle.seed2 = s.seed2;
    ImageStyle.noise = new Perlin(ImageStyle.seed);
    ImageStyle.noise2 = new Perlin(ImageStyle.seed2);
    this.generateNoiseMats();
  }
  static generateNoiseMats() {
    if (!ImageStyle.lastInputImage) return;
    let startTime = performance.now();
    // if (ImageStyle.smallerNoiseMat) {
    //   ImageStyle.smallerNoiseMat.delete();
    //   ImageStyle.biggerNoiseMat.delete();
    // }
    ImageStyle.smallerNoiseMat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    ImageStyle.biggerNoiseMat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < this.cols; ++j) {
        ImageStyle.smallerNoiseMat.floatPtr(i, j)[0] = ImageStyle.smallerNoise(j, i);
        ImageStyle.biggerNoiseMat.floatPtr(i, j)[0] = ImageStyle.perlinNoise(j, i);
      }
    }
    let endTime = performance.now();
    console.log(`Finished generating noise mats in ${endTime - startTime} milliseconds`);
  }

  public abstract apply(image: any): any;

  abstract drawWithNewSeeds(): any;

  getThreshold(value: number): number {
    return 0;
  }

  static perlinNoise(x: number, y: number): number {
    let scale = 2.5 / Math.max(this.rows, this.cols);
    let value = ImageStyle.noise.perlin2(x * scale, y * scale);
    value = (value + 1) / 2;
    return value;
  }

  static smallerNoise(x: number, y: number): number {
    let scale = 25 / Math.max(this.rows, this.cols);
    let value = ImageStyle.noise2.perlin2(x * scale, y * scale);
    value = (value + 1) / 2;
    return value;
  }

  perlinNoise(x: number, y: number): number {
    return ImageStyle.perlinNoise(x, y);
  }

  smallerNoise(x: number, y: number): number {
    return ImageStyle.smallerNoise(x, y);
  }

  static findContours(): any {
    if (this.contours) this.contours.delete();
    this.contours = ContourUtils.findContours(this.lastInputImage);
  }

  static setBiggerNoiseMat(mat: any) {
    if (ImageStyle.biggerNoiseMat) ImageStyle.biggerNoiseMat.delete();
    ImageStyle.biggerNoiseMat = mat;
  }
  static setSmallerNoiseMat(mat: any) {
    if (ImageStyle.smallerNoiseMat) ImageStyle.smallerNoiseMat.delete();
    ImageStyle.smallerNoiseMat = mat;
  }

  static resizeNoiseMats() {
    const maxSize = Math.max(this.rows, this.cols);
    const scaleFactor =
      maxSize / Math.max(ImageStyle.smallerNoiseMat.rows, ImageStyle.smallerNoiseMat.cols);

    const newSmallerNoiseMat = new cv.Mat();
    const newBiggerNoiseMat = new cv.Mat();
    cv.resize(
      this.smallerNoiseMat,
      newSmallerNoiseMat,
      new cv.Size(),
      scaleFactor,
      scaleFactor,
      cv.INTER_AREA,
    );
    cv.resize(
      this.biggerNoiseMat,
      newBiggerNoiseMat,
      new cv.Size(),
      scaleFactor,
      scaleFactor,
      cv.INTER_AREA,
    );
    const cropArea = new cv.Rect(0, 0, this.cols, this.rows);
    ImageStyle.setSmallerNoiseMat(newSmallerNoiseMat.roi(cropArea));
    ImageStyle.setBiggerNoiseMat(newBiggerNoiseMat.roi(cropArea));
  }
}

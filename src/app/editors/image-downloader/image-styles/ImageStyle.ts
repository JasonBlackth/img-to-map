import Perlin from '../../../../noise/perlin';
import { CvUtils } from '../../../common/CvUtils';

export abstract class ImageStyle {
  static seed = 0.6452150732801007;
  static noise = new Perlin(ImageStyle.seed);
  static noise2 = new Perlin(ImageStyle.seed + 0.1);
  protected static smallerNoiseMat: any;
  protected static biggerNoiseMat: any;
  protected static contours: any;
  protected static lastInputImage: any;
  protected static rows: number = 0;
  protected static cols: number = 0;
  private static readonly NOISE_MAT_GENERATION_SIZE: number = 1000;

  public abstract apply(image: any): any;

  public abstract drawWithNewSeeds(): any;

  public static setInputImage(inputImage: any) {
    ImageStyle.lastInputImage = new cv.Mat();
    inputImage.copyTo(ImageStyle.lastInputImage);
    this.findContours();
    ImageStyle.rows = inputImage.rows;
    ImageStyle.cols = inputImage.cols;
    if (!this.isNoiseMatsValid()) {
      if (
        inputImage.rows > this.smallerNoiseMat.rows ||
        inputImage.cols > this.smallerNoiseMat.cols
      ) {
        ImageStyle.generateNewNoiseMats();
      } else {
        ImageStyle.scaleAndCropNoiseMats();
      }
    }
  }

  public static getSeed(): number {
    return this.seed;
  }

  public static setSeed(seed: number): void {
    ImageStyle.seed = seed;
    ImageStyle.noise = new Perlin(ImageStyle.seed);
    ImageStyle.noise2 = new Perlin(ImageStyle.seed + 0.1);
    this.generateNewNoiseMats();
  }

  public static setBiggerNoiseMat(mat: any) {
    if (ImageStyle.biggerNoiseMat) ImageStyle.biggerNoiseMat.delete();
    ImageStyle.biggerNoiseMat = mat;
  }
  public static setSmallerNoiseMat(mat: any) {
    if (ImageStyle.smallerNoiseMat) ImageStyle.smallerNoiseMat.delete();
    ImageStyle.smallerNoiseMat = mat;
  }
  public static getSmallerNoiseMat(): any {
    return this.smallerNoiseMat;
  }
  public static getBiggerNoiseMat(): any {
    return this.biggerNoiseMat;
  }

  protected static findContours(): any {
    if (this.contours) this.contours.delete();
    this.contours = CvUtils.findContours(this.lastInputImage);
  }

  private static getBiggerNoiseAt(x: number, y: number): number {
    let scale = 2.5 / this.NOISE_MAT_GENERATION_SIZE; //Math.max(this.rows, this.cols);
    let value = ImageStyle.noise.perlin2(x * scale, y * scale);
    value = (value + 1) / 2;
    return value;
  }

  private static getSmallerNoiseAt(x: number, y: number): number {
    let scale = 25 / this.NOISE_MAT_GENERATION_SIZE; //Math.max(this.rows, this.cols);
    let value = ImageStyle.noise2.perlin2(x * scale, y * scale);
    value = (value + 1) / 2;
    return value;
  }

  private static generateNewNoiseMats() {
    if (!ImageStyle.lastInputImage) return;

    const sideLength = this.NOISE_MAT_GENERATION_SIZE;
    const smallerNoiseMat = new cv.Mat(sideLength, sideLength, cv.CV_32F);
    const biggerNoiseMat = new cv.Mat(sideLength, sideLength, cv.CV_32F);
    for (let i = 0; i < sideLength; ++i) {
      for (let j = 0; j < sideLength; ++j) {
        smallerNoiseMat.floatPtr(i, j)[0] = ImageStyle.getSmallerNoiseAt(i, j);
        biggerNoiseMat.floatPtr(i, j)[0] = ImageStyle.getBiggerNoiseAt(i, j);
      }
    }

    ImageStyle.setSmallerNoiseMat(smallerNoiseMat);
    ImageStyle.setBiggerNoiseMat(biggerNoiseMat);
    this.scaleAndCropNoiseMats();
  }

  private static scaleAndCropNoiseMats() {
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

  private static isNoiseMatsValid(): boolean {
    return (
      ImageStyle.smallerNoiseMat &&
      ImageStyle.biggerNoiseMat &&
      ImageStyle.smallerNoiseMat.rows === this.rows &&
      ImageStyle.smallerNoiseMat.cols === this.cols &&
      ImageStyle.biggerNoiseMat.rows === this.rows &&
      ImageStyle.biggerNoiseMat.cols === this.cols
    );
  }
}

import { Colors } from '../Model/Colors';
import { ImageStyle } from './ImageStyle';

export class VintageStyle extends ImageStyle {
  public override apply(image: any): any {
    let dst = new cv.Mat(image.rows, image.cols, cv.CV_8UC3);
    image.copyTo(ImageStyle.lastInputImage);

    for (let i = 0; i < dst.rows; ++i) {
      for (let j = 0; j < dst.cols; ++j) {
        let value = this.perlinNoise(i, j) + this.smallerNoise(i, j) * 0.06;
        value = this.getThreshold(value);

        dst.ucharPtr(i, j)[0] = 192 + Math.floor(value * 50);
        dst.ucharPtr(i, j)[1] = 112 + Math.floor(value * 90);
        dst.ucharPtr(i, j)[2] = 43 + Math.floor(value * 100);
      }
    }
    ImageStyle.findContours(ImageStyle.lastInputImage);
    cv.drawContours(dst, ImageStyle.contours, -1, Colors.BLACK, 4, cv.LINE_4);

    return dst;
  }
  drawWithNewSeeds(): any {
    return this.apply(ImageStyle.lastInputImage);
  }

  override getThreshold(value: number): number {
    if (value > 0.75) return 0.4;
    else if (value > 0.68) return 0.5;
    else if (value > 0.6) return 0.6;
    else if (value > 0.5) return 0.7;
    else return 0.75;
  }
}

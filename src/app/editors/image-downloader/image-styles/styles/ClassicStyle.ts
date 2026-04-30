import { rgb } from '../../../../common/Colors';
import { ImageStyle } from '../ImageStyle';

export class ClassicStyle extends ImageStyle {
  LAND_COLOR = rgb(3, 100, 3);

  SEA_DEPTH_0 = rgb(40, 151, 185);
  SEA_DEPTH_1 = rgb(30, 141, 175);
  SEA_DEPTH_2 = rgb(19, 130, 164);
  SEA_DEPTH_3 = rgb(9, 120, 154);
  SEA_DEPTH_4 = rgb(3, 114, 148);

  FLOAT_WHITE = new cv.Scalar(1.0);

  thresholds = [0.1, 0.2, 0.4, 0.8, 2.0];

  private blurredInputImage: any;
  private blurredInputImageFloat: any;

  public override apply(image: any): any {
    let startTime = performance.now();

    image.copyTo(ImageStyle.lastInputImage);
    this.blurredInputImage = new cv.Mat();
    this.calculateSeaDepth();
    let output = this.getOutputImage();

    let endTime = performance.now();

    return output;
  }

  drawWithNewSeeds(): any {
    if (this.blurredInputImage && ImageStyle.lastInputImage) {
      return this.getOutputImage(); //this.getOutputImage();
    }
    throw new Error('No image to draw with ClassicStyle');
  }

  private getOutputImage(): any {
    let dst = new cv.Mat();
    cv.addWeighted(this.blurredInputImageFloat, 1.0, ImageStyle.smallerNoiseMat, 0.1, 0, dst);
    dst = this.applyThresholds(dst);
    cv.drawContours(dst, ImageStyle.contours, -1, this.LAND_COLOR, cv.FILLED);
    return dst;
  }

  private applyThresholds(image: any): any {
    const outputImage = new cv.Mat(image.rows, image.cols, cv.CV_8UC3, this.SEA_DEPTH_4);
    let mask = new cv.Mat();

    let thresholdMats: any[] = [];
    let colors = [this.SEA_DEPTH_3, this.SEA_DEPTH_2, this.SEA_DEPTH_1, this.SEA_DEPTH_0];
    this.thresholds.forEach((threshold) => {
      let t = new cv.Mat(image.rows, image.cols, cv.CV_32FC1, new cv.Scalar(threshold));
      thresholdMats.push(t);
    });
    thresholdMats.forEach((t, index) => {
      if (index === thresholdMats.length - 1) return;
      cv.inRange(image, t, thresholdMats[index + 1], mask);
      outputImage.setTo(colors[index], mask);
    });

    thresholdMats.forEach((t) => t.delete());
    mask.delete();
    return outputImage;
  }

  private calculateSeaDepth(): any {
    let dst = new cv.Mat();
    ImageStyle.lastInputImage.copyTo(dst);
    dst.convertTo(dst, cv.CV_32F, 1 / 255);
    let originalImage = dst.clone();

    let x = Math.floor(Math.min(dst.rows, dst.cols) / 20) * 2 + 1;
    let ksize = new cv.Size(2 * x + 1, 2 * x + 1);

    let startTime = performance.now();
    ImageStyle.findContours();
    for (let j = 0; j < ImageStyle.contours.size(); ++j) {
      let contour = ImageStyle.contours.get(j);
      let area = cv.contourArea(contour);
      if (area > 200) {
        cv.drawContours(dst, ImageStyle.contours, j, this.FLOAT_WHITE, 20);
      }
    }
    let endTime = performance.now();

    startTime = performance.now();
    cv.blur(dst, dst, ksize);
    cv.addWeighted(originalImage, 1.0, dst, 2.0, 0, dst);
    cv.drawContours(dst, ImageStyle.contours, -1, this.FLOAT_WHITE, 5);
    x = Math.floor(Math.min(dst.rows, dst.cols) / 60) * 2 + 1;
    ksize = new cv.Size(x, x);
    cv.blur(dst, dst, ksize);
    endTime = performance.now();

    this.blurredInputImageFloat = dst;
  }
}

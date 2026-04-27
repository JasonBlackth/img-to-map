import { Colors, rgb } from '../../../../common/Colors';
import { ImageStyle } from '../ImageStyle';

export class VintageStyle extends ImageStyle {
  AGING_STRENGTH_0 = rgb(229, 179, 118);
  AGING_STRENGTH_1 = rgb(227, 174, 113);
  AGING_STRENGTH_2 = rgb(222, 166, 103);
  AGING_STRENGTH_3 = rgb(217, 157, 93);
  AGING_STRENGTH_4 = rgb(212, 148, 83);

  thresholds = [0.5, 0.6, 0.68, 0.75, 2.0];

  public override apply(image: any): any {
    ImageStyle.lastInputImage = image.clone();
    ImageStyle.findContours();

    return this.drawWithNewSeeds();
  }
  drawWithNewSeeds(): any {
    let dst = new cv.Mat(ImageStyle.rows, ImageStyle.cols, cv.CV_8UC3);
    cv.addWeighted(ImageStyle.biggerNoiseMat, 1, ImageStyle.smallerNoiseMat, 0.06, 0, dst);
    const outputImage = this.applyThresholds(dst);
    cv.drawContours(outputImage, ImageStyle.contours, -1, Colors.BLACK, 4, cv.LINE_4);
    dst.delete();
    return outputImage;
  }

  applyThresholds(image: any): any {
    const outputImage = new cv.Mat(image.rows, image.cols, cv.CV_8UC3, this.AGING_STRENGTH_0);
    let mask = new cv.Mat();

    let thresholdMats: any[] = [];
    let colors = [
      this.AGING_STRENGTH_1,
      this.AGING_STRENGTH_2,
      this.AGING_STRENGTH_3,
      this.AGING_STRENGTH_4,
    ];
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
}

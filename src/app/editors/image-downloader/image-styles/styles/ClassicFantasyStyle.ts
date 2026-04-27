import { Colors, rgb } from '../../../../common/Colors';
import { ImageStyle } from '../ImageStyle';

export class ClassicStyle extends ImageStyle {
  LAND_COLOR = rgb(3, 100, 3);

  SEA_DEPTH_0 = rgb(40, 151, 185);
  SEA_DEPTH_1 = rgb(30, 141, 175);
  SEA_DEPTH_2 = rgb(19, 130, 164);
  SEA_DEPTH_3 = rgb(9, 120, 154);
  SEA_DEPTH_4 = rgb(3, 114, 148);

  FLOAT_WHITE = new cv.Scalar(1.0);
  private blurredInputImage: any;
  private blurredInputImageFloat: any;

  public override apply(image: any): any {
    let startTime = performance.now();
    image.copyTo(ImageStyle.lastInputImage);
    this.blurredInputImage = new cv.Mat();

    // this.calculateSeaDepth();
    // return this.getOutputImage();
    this.calculateSeaDepthFloat();
    let output = this.getOutputImageFaster();
    let endTime = performance.now();
    console.log(`ClassicStyle apply method took ${endTime - startTime} milliseconds`);
    return output;
  }

  override getThreshold(value: number): number {
    if (value > 0.8) return 0.65;
    else if (value > 0.4) return 0.75;
    else if (value > 0.2) return 0.85;
    else if (value > 0.1) return 0.95;
    else return 1;
  }

  drawWithNewSeeds(): any {
    if (this.blurredInputImage && ImageStyle.lastInputImage) {
      return this.getOutputImageFaster(); //this.getOutputImage();
    }
    throw new Error('No image to draw with ClassicStyle');
  }

  private calculateSeaDepth(): any {
    let dst = new cv.Mat();
    ImageStyle.lastInputImage.copyTo(dst);

    let x = Math.floor(Math.min(dst.rows, dst.cols) / 20) * 2 + 1;
    let ksize = new cv.Size(2 * x + 1, 2 * x + 1);

    let startTime = performance.now();
    ImageStyle.findContours();
    for (let j = 0; j < ImageStyle.contours.size(); ++j) {
      let contour = ImageStyle.contours.get(j);
      let area = cv.contourArea(contour);
      if (area > 200) {
        cv.drawContours(dst, ImageStyle.contours, j, Colors.WHITE, 20);
      }
    }
    let endTime = performance.now();
    console.log(`Contour processing took ${endTime - startTime} milliseconds`);
    startTime = performance.now();
    cv.blur(dst, dst, ksize);
    cv.addWeighted(ImageStyle.lastInputImage, 1.0, dst, 2.0, 0, dst);
    cv.drawContours(dst, ImageStyle.contours, -1, Colors.WHITE, 5);
    x = Math.floor(Math.min(dst.rows, dst.cols) / 60) * 2 + 1;
    ksize = new cv.Size(x, x);
    cv.blur(dst, dst, ksize);
    endTime = performance.now();
    console.log(`Blurring took ${endTime - startTime} milliseconds`);

    dst.copyTo(this.blurredInputImage);
  }

  private getOutputImage(): any {
    let startTime = performance.now();
    const dst = this.blurredInputImage;
    let outputImage = cv.Mat.zeros(dst.rows, dst.cols, cv.CV_8UC3);
    for (let i = 0; i < dst.rows; ++i) {
      for (let j = 0; j < dst.cols; ++j) {
        if (ImageStyle.lastInputImage.ucharPtr(i, j)[0] !== 0) {
          outputImage.ucharPtr(i, j)[0] = 3;
          outputImage.ucharPtr(i, j)[1] = 100;
          outputImage.ucharPtr(i, j)[2] = 3;
        } else {
          let value = dst.ucharPtr(i, j)[0] / 255 + this.smallerNoise(i, j) * 0.1;
          value = this.getThreshold(value);

          outputImage.ucharPtr(i, j)[0] = 108 - Math.floor(value * 105);
          outputImage.ucharPtr(i, j)[1] = 219 - Math.floor(value * 105);
          outputImage.ucharPtr(i, j)[2] = 253 - Math.floor(value * 105);
        }
      }
    }
    let endTime = performance.now();
    console.log(`Output image generation took ${endTime - startTime} milliseconds`);
    return outputImage;
  }

  private getOutputImageFaster(): any {
    const dst = new cv.Mat();
    cv.addWeighted(this.blurredInputImageFloat, 1.0, ImageStyle.smallerNoiseMat, 0.1, 0, dst);

    let outputImage = new cv.Mat(dst.rows, dst.cols, cv.CV_8UC3, this.SEA_DEPTH_4);
    let mask = new cv.Mat();
    let t1 = new cv.Mat(dst.rows, dst.cols, cv.CV_32FC1, new cv.Scalar(0.1));
    let t2 = new cv.Mat(dst.rows, dst.cols, cv.CV_32FC1, new cv.Scalar(0.2));
    let t3 = new cv.Mat(dst.rows, dst.cols, cv.CV_32FC1, new cv.Scalar(0.4));
    let t4 = new cv.Mat(dst.rows, dst.cols, cv.CV_32FC1, new cv.Scalar(0.8));
    let t5 = new cv.Mat(dst.rows, dst.cols, cv.CV_32FC1, new cv.Scalar(2.0));
    cv.inRange(dst, t1, t2, mask);
    outputImage.setTo(this.SEA_DEPTH_3, mask);
    cv.inRange(dst, t2, t3, mask);
    outputImage.setTo(this.SEA_DEPTH_2, mask);
    cv.inRange(dst, t3, t4, mask);
    outputImage.setTo(this.SEA_DEPTH_1, mask);
    cv.inRange(dst, t4, t5, mask);
    outputImage.setTo(this.SEA_DEPTH_0, mask);

    cv.drawContours(outputImage, ImageStyle.contours, -1, this.LAND_COLOR, cv.FILLED);

    t1.delete();
    t2.delete();
    t3.delete();
    t4.delete();
    t5.delete();
    mask.delete();
    dst.delete();
    return outputImage;
  }

  private calculateSeaDepthFloat(): any {
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
    console.log(`Contour processing took ${endTime - startTime} milliseconds`);
    startTime = performance.now();
    cv.blur(dst, dst, ksize);
    cv.addWeighted(originalImage, 1.0, dst, 2.0, 0, dst);
    cv.drawContours(dst, ImageStyle.contours, -1, this.FLOAT_WHITE, 5);
    x = Math.floor(Math.min(dst.rows, dst.cols) / 60) * 2 + 1;
    ksize = new cv.Size(x, x);
    cv.blur(dst, dst, ksize);
    endTime = performance.now();
    console.log(`Blurring took ${endTime - startTime} milliseconds`);

    this.blurredInputImageFloat = dst;
  }
}

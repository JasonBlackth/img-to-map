import { CvUtils } from '../CvUtils';
import { BinaryImage } from './BinaryImage';

export class GrayscaleImage {
  private mat: CvMat;

  constructor(width: number, height: number) {
    this.mat = new cv.Mat(height, width, cv.CV_8UC1);
  }

  static fromMat(mat: CvMat): GrayscaleImage {
    const output = new GrayscaleImage(mat.cols, mat.rows);
    output.mat = CvUtils.convertMatToGrayscale(mat);

    return output;
  }

  public applyAdaptiveThreshold(sampleSize: number, increaseThreshold: number): BinaryImage {
    const output = new cv.Mat(this.mat.rows, this.mat.cols, cv.CV_8UC1);
    const constantAddedToEachPixel = -increaseThreshold;

    cv.adaptiveThreshold(
      this.mat,
      output,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY,
      sampleSize,
      constantAddedToEachPixel,
    );

    return BinaryImage.fromMat(output);
  }
}

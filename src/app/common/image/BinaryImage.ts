import { CvUtils } from '../CvUtils';

export class BinaryImage {
  private mat: CvMat;

  constructor(width: number, height: number) {
    this.mat = new cv.Mat(height, width, cv.CV_8UC1);
  }

  static fromBinaryMat(mat: CvMat): BinaryImage {
    const output = new BinaryImage(mat.cols, mat.rows);
    output.mat = mat;
    return output;
  }

  static fromMat(output: CvMat): BinaryImage {
    const binaryMat = CvUtils.convertMatToBinary(output);
    return BinaryImage.fromBinaryMat(binaryMat);
  }

  public invert(): void {
    cv.bitwise_not(this.mat, this.mat);
  }

  public dilate(iterations: number): void {
    const anchor = new cv.Point(-1, -1);
    const M = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.dilate(
      this.mat,
      this.mat,
      M,
      anchor,
      iterations,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
  }

  public erode(iterations: number): void {
    const anchor = new cv.Point(-1, -1);
    const M = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.erode(
      this.mat,
      this.mat,
      M,
      anchor,
      iterations,
      cv.BORDER_CONSTANT,
      cv.morphologyDefaultBorderValue(),
    );
  }

  public getMat(): CvMat {
    return this.mat;
  }
}

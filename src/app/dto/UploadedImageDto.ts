export class UploadedImageDto {
  public readonly image: CvMat;
  public readonly originalSize: CvSize;

  constructor(image: CvMat) {
    this.image = image;
    this.originalSize = new cv.Size(image.cols, image.rows);
  }

  public isValid(): boolean {
    return this.image !== null && this.originalSize !== null;
  }
}

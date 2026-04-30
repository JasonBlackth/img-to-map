export class CvUtils {
  static findContours(image: any): any {
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    hierarchy.delete();
    return contours;
  }

  static convertToGrayscale(image: any): any {
    const gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);
    return gray;
  }

  static convertToFloat(image: any): any {
    const floatImage = new cv.Mat();
    if (image.channels() !== 1) {
      const grayImage = this.convertToGrayscale(image);
      grayImage.convertTo(floatImage, cv.CV_32F, 1 / 255);
      grayImage.delete();
    } else {
      image.convertTo(floatImage, cv.CV_32F, 1 / 255);
    }

    return floatImage;
  }
}

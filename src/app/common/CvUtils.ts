export class CvUtils {
  static findContours(image: CvMat): CvMatVector {
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    hierarchy.delete();
    return contours;
  }

  static convertMatToGrayscale(mat: CvMat): CvMat {
    if (mat.channels() === 1) {
      return mat;
    } else {
      const gray = new cv.Mat();
      cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
      return gray;
    }
  }

  static convertToFloat(image: CvMat): CvMat {
    const floatImage = new cv.Mat();
    if (image.channels() !== 1) {
      const grayImage = this.convertMatToGrayscale(image);
      grayImage.convertTo(floatImage, cv.CV_32F, 1 / 255);
      grayImage.delete();
    } else {
      image.convertTo(floatImage, cv.CV_32F, 1 / 255);
    }

    return floatImage;
  }

  static convertMatToBinary(inputMat: CvMat): CvMat {
    const binaryMat = new cv.Mat();
    cv.threshold(inputMat, binaryMat, 0, 255, cv.THRESH_BINARY);
    return binaryMat;
  }
}

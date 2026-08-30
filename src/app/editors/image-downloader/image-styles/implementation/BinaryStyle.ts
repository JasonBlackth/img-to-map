import { ImageStyle } from '../ImageStyle';

export class BinaryStyle extends ImageStyle {
  public override apply(image: CvMat): CvMat {
    return image.clone();
  }
  override drawWithNewSeeds(): CvMat {
    return ImageStyle.lastInputImage.clone();
  }
}

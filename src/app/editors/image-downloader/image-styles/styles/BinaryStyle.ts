import { ImageStyle } from '../ImageStyle';

export class BinaryStyle extends ImageStyle {
  public override apply(image: any) {
    return image.clone();
  }
  override drawWithNewSeeds() {
    return ImageStyle.lastInputImage.clone();
  }
}

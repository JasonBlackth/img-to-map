import { ImageStyle } from '../ImageStyle';

export class SmallNoise extends ImageStyle {
  public override apply(image: any): any {
    return ImageStyle.smallerNoiseMat;
  }
  public override drawWithNewSeeds(): any {
    return ImageStyle.smallerNoiseMat;
  }
}

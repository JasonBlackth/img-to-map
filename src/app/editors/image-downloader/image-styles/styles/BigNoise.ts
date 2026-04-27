import { ImageStyle } from '../ImageStyle';

export class BigNoise extends ImageStyle {
  public override apply(image: any): any {
    return ImageStyle.biggerNoiseMat;
  }
  public override drawWithNewSeeds(): any {
    return ImageStyle.biggerNoiseMat;
  }
}

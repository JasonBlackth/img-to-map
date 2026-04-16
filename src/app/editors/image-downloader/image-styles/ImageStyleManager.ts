import { ImageStyle } from './ImageStyle';
import { ImageStyleEnum } from './ImageStyleEnum';
import { SeedsObject } from './SeedsObject';
import { BinaryStyle } from './styles/BinaryStyle';
import { ClassicStyle } from './styles/ClassicFantasyStyle';
import { VintageStyle } from './styles/VintageStyle';

export class ImageStyleManager {
  private binaryStyle = new BinaryStyle();
  private vintageStyle = new VintageStyle();
  private classicStyle = new ClassicStyle();
  private activeStyle: ImageStyle;
  private inputImage: any;

  constructor(style: ImageStyleEnum) {
    this.activeStyle = this.getStyle(style);
  }

  public setActive(style: ImageStyleEnum): void {
    this.activeStyle = this.getStyle(style);
  }

  public apply(): any {
    return this.activeStyle.apply(this.inputImage);
  }

  public setInputImage(image: any): void {
    this.inputImage = image;
    ImageStyle.setInputImage(image);
  }

  private getStyle(style: ImageStyleEnum): ImageStyle {
    if (style === ImageStyleEnum.BINARY) return this.binaryStyle;
    if (style === ImageStyleEnum.VINTAGE) return this.vintageStyle;
    if (style === ImageStyleEnum.CLASSIC) return this.classicStyle;
    return this.binaryStyle;
  }

  resetSeedsAndGetImage(): any {
    ImageStyle.setSeeds({ seed1: Math.random(), seed2: Math.random() });
    return this.activeStyle.drawWithNewSeeds();
  }

  setSeedsAndGetImage(seeds: SeedsObject): any {
    ImageStyle.setSeeds(seeds);
    return this.activeStyle.drawWithNewSeeds();
  }
}

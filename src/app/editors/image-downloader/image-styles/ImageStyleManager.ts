import { ImageStyle } from './ImageStyle';
import { ImageStyleEnum } from './ImageStyleEnum';
import { BinaryStyle } from './styles/BinaryStyle';
import { ClassicStyle } from './styles/ClassicStyle';
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

  public apply(): any {
    return this.activeStyle.apply(this.inputImage);
  }

  public setActive(style: ImageStyleEnum): void {
    this.activeStyle = this.getStyle(style);
  }

  public setInputImage(image: any): void {
    this.inputImage = image;
    ImageStyle.setInputImage(image);
  }

  public setSeedAndGetImage(seed: number): any {
    ImageStyle.setSeed(seed);
    return this.activeStyle.drawWithNewSeeds();
  }

  private getStyle(style: ImageStyleEnum): ImageStyle {
    if (style === ImageStyleEnum.BINARY) return this.binaryStyle;
    if (style === ImageStyleEnum.VINTAGE) return this.vintageStyle;
    if (style === ImageStyleEnum.CLASSIC) return this.classicStyle;
    return this.binaryStyle;
  }
}

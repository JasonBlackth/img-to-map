import { BinaryStyle } from './BinaryStyle';
import { ClassicStyle } from './ClassicFantasyStyle';
import { ImageStyle } from './ImageStyle';
import { ImageStyleEnum } from './ImageStyleEnum';
import { VintageStyle } from './VintageStyle';

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
    return this.activeStyle.resetSeedsAndGetImage();
  }
}

import { ImageStyle } from './ImageStyle';
import { ImageStyleEnum } from './ImageStyleEnum';
import { BinaryStyle } from './implementation/BinaryStyle';
import { ClassicStyle } from './implementation/ClassicStyle';
import { VintageStyle } from './implementation/VintageStyle';

export class ImageStyleManager {
  private binaryStyle = new BinaryStyle();
  private vintageStyle = new VintageStyle();
  private classicStyle = new ClassicStyle();
  private activeStyle: ImageStyle;
  private inputImage!: CvMat;

  constructor(style: ImageStyleEnum) {
    this.activeStyle = this.getStyle(style);
  }

  public apply(): CvMat {
    return this.activeStyle.apply(this.inputImage);
  }

  public setActive(style: ImageStyleEnum): void {
    this.activeStyle = this.getStyle(style);
  }

  public setInputImage(image: CvMat): void {
    this.inputImage = image;
    ImageStyle.setInputImage(image);
  }

  public setSeedAndGetImage(seed: number): CvMat {
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

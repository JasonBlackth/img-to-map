import { BinaryStyle } from "./BinaryStyle";
import { ClassicStyle } from "./ClassicFantasyStyle";
import { ImageStyle } from "./ImageStyle";
import { ImageStyleEnum } from "./ImageStyleEnum";
import { VintageStyle } from "./VintageStyle";

export class ImageStyleManager {
    private static binaryStyle = new BinaryStyle();
    private static vintageStyle = new VintageStyle();
    private static classicStyle = new ClassicStyle();
    private static activeStyle: ImageStyle;
    private static _inputImage: any;

    public static setActive(style: ImageStyleEnum): void {
        this.activeStyle = this.getStyle(style);
    }

    public static apply(): any{
        return this.activeStyle.apply(this._inputImage);
    }

    public static setInputImage(inputImage: any): void {
        this._inputImage = inputImage;
        ImageStyle.setInputImage(inputImage);
    }

    private static getStyle(style: ImageStyleEnum): ImageStyle {
        if (style === ImageStyleEnum.BINARY) return this.binaryStyle;
        if (style === ImageStyleEnum.VINTAGE) return this.vintageStyle;
        if (style === ImageStyleEnum.CLASSIC) return this.classicStyle;
        return this.binaryStyle;
    }

    static resetSeedsAndGetImage(): any {
      return this.activeStyle.resetSeedsAndGetImage();
    }

}

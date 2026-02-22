import { Showable } from './Showable.js';
import type { Initializable } from './Initializable.js';
import { ImageStyleEnum } from './ImageStyleEnum.js';
import type { Editor } from '../Model/Editor.js';
export declare class ImageDownloadWindow extends Showable implements Initializable {
    private imageDisplay;
    private editedImage;
    private imageStyle;
    private enableImageGraphics;
    constructor(outputTarget: HTMLElement, imageDisplay: HTMLCanvasElement, prevEditor: Editor);
    initialize(): void;
    private getCurrentImage;
    setImageStyle(to: ImageStyleEnum): void;
    setImageGraphics(to: boolean): void;
    updateImageDisplay(): void;
}
//# sourceMappingURL=ImageDownloadWindow.d.ts.map
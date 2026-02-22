import { Showable } from './Showable.js';
import type { Initializable } from './Initializable.js';
export declare class ImageUploader extends Showable implements Initializable {
    private imageInput;
    private uploadedImage;
    constructor(outputTarget: HTMLElement, imageInput: HTMLInputElement, uploadedImage: HTMLImageElement);
    initialize(): void;
    getUploadedImageElement(): HTMLImageElement;
    private onInput;
}
//# sourceMappingURL=ImageUploader.d.ts.map
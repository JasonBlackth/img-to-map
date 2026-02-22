
import { Showable } from './Showable.js';
import type { Initializable } from './Initializable.js';
import { Application } from '../index.js';

export class ImageUploader extends Showable implements Initializable {
    private imageInput: HTMLInputElement;
    private uploadedImage: HTMLImageElement;


    constructor(outputTarget: HTMLElement, imageInput: HTMLInputElement, uploadedImage: HTMLImageElement) {
        super(outputTarget, outputTarget);  // ez itt hülyeség
        this.imageInput = imageInput;
        this.uploadedImage = uploadedImage;
    }

    initialize(): void {
        this.imageInput.addEventListener('input', () => this.onInput());
    }

    getUploadedImageElement(): HTMLImageElement {
        return this.uploadedImage;
    }

    private onInput(): void {
        this.uploadedImage.src = URL.createObjectURL(this.imageInput.files![0]);
        let inputImage = cv.imread(this.uploadedImage);
        this.uploadedImage.onload = () => {
            Application.createEditors(inputImage.clone());
        }
        inputImage.delete();
    }
}

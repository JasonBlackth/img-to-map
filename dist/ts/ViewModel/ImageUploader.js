import { Showable } from './Showable.js';
import { Application } from '../index.js';
export class ImageUploader extends Showable {
    constructor(outputTarget, imageInput, uploadedImage) {
        super(outputTarget, outputTarget); // ez itt hülyeség
        this.imageInput = imageInput;
        this.uploadedImage = uploadedImage;
    }
    initialize() {
        this.imageInput.addEventListener('input', () => this.onInput());
    }
    getUploadedImageElement() {
        return this.uploadedImage;
    }
    onInput() {
        this.uploadedImage.src = URL.createObjectURL(this.imageInput.files[0]);
        this.uploadedImage.onload = () => {
            Application.createEditors();
        };
    }
}
//# sourceMappingURL=ImageUploader.js.map
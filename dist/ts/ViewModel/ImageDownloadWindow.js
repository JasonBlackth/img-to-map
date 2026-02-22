import { Showable } from './Showable.js';
import { ImageStyleEnum } from './ImageStyleEnum.js';
export class ImageDownloadWindow extends Showable {
    constructor(outputTarget, imageDisplay, prevEditor) {
        super(outputTarget, outputTarget);
        this.imageStyle = ImageStyleEnum.ORIGINAL;
        this.enableImageGraphics = false;
        this.imageDisplay = imageDisplay;
        this.editedImage = prevEditor.getImage().clone();
    }
    initialize() {
        // Inicializálás
    }
    getCurrentImage() {
        return this.editedImage;
    }
    setImageStyle(to) {
        this.imageStyle = to;
    }
    setImageGraphics(to) {
        this.enableImageGraphics = to;
    }
    updateImageDisplay() {
        // Kép megjelenítés frissítése
    }
}
//# sourceMappingURL=ImageDownloadWindow.js.map
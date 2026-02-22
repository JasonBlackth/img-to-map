import { Action } from './Action.js';
import { DenoiseModeEnum } from './DenoiseModeEnum.js';
import { ChangeValueAction } from '../index.js';
export class Editor1 {
    constructor(imgElement) {
        this._denoiseMode = DenoiseModeEnum.NONE;
        this._contrast = 0;
        this._contrastCentre = 128;
        this.inputImage = cv.imread(imgElement);
        this.currentImage = this.inputImage.clone();
        this.rows = this.inputImage.rows;
        this.cols = this.inputImage.cols;
    }
    getImage() {
        return this.currentImage;
    }
    setDenoiseMode(to) {
        return ChangeValueAction.createAndChangeValue(this, "_denoiseMode", to);
    }
    setContrast(to) {
        return ChangeValueAction.createAndChangeValue(this, "_contrast", to);
    }
    setContrastCentre(to) {
        return ChangeValueAction.createAndChangeValue(this, "_contrastCentre", to);
    }
}
//# sourceMappingURL=Editor1.js.map
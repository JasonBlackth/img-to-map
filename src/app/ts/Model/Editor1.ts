
import type { Editor } from './Editor.js';
import { Action } from './Action.js';
import { DenoiseModeEnum } from './DenoiseModeEnum.js';
import { ChangeValueAction } from '../index.js';

export class Editor1 implements Editor {
    private inputImage: any;
    private currentImage: any;
    private _denoiseMode: DenoiseModeEnum = DenoiseModeEnum.NONE;
    private _contrast: number = 0;
    private _contrastCentre: number = 128;

    readonly rows: number;
    readonly cols: number;

    constructor(inputImage: any) {
        this.inputImage = inputImage.clone();
        this.currentImage = this.inputImage.clone();
        this.rows = this.inputImage.rows;
        this.cols = this.inputImage.cols;
    }

    getImage(): any {
        return this.currentImage;
    }

    setDenoiseMode(to: DenoiseModeEnum): Action {
        return ChangeValueAction.createAndChangeValue(this, "_denoiseMode", to);
    }

    setContrast(to: number): Action {
        return ChangeValueAction.createAndChangeValue(this, "_contrast", to);
    }

    setContrastCentre(to: number): Action {
        return ChangeValueAction.createAndChangeValue(this, "_contrastCentre", to);
    }
}

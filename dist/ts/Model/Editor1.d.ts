import type { Editor } from './Editor.js';
import { Action } from './Action.js';
import { DenoiseModeEnum } from './DenoiseModeEnum.js';
export declare class Editor1 implements Editor {
    private inputImage;
    private currentImage;
    private _denoiseMode;
    private _contrast;
    private _contrastCentre;
    readonly rows: number;
    readonly cols: number;
    constructor(imgElement: HTMLImageElement);
    getImage(): any;
    setDenoiseMode(to: DenoiseModeEnum): Action;
    setContrast(to: number): Action;
    setContrastCentre(to: number): Action;
}
//# sourceMappingURL=Editor1.d.ts.map
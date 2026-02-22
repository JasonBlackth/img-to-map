import type { Editor } from './Editor.js';
import { Action } from './Action.js';
export declare class Editor2 implements Editor {
    private inputImage;
    private currentImage;
    private contours;
    private contourMap;
    private selectedContour;
    lowThreshold: number;
    highThreshold: number;
    declutterThreshold: number;
    readonly rows: number;
    readonly cols: number;
    contourImage: any;
    private grayscaleImage;
    constructor(prevEditor: Editor);
    getImage(): any;
    deleteSelectedContour(): Action;
    setLowThreshold(to: number): Action;
    setHighThreshold(to: number): Action;
    setDeclutterThreshold(to: number): Action;
    drawNewContour(input: any): Action;
    createContourImage(): void;
    selectContourClosestTo(clickX: number, clickY: number): boolean;
    private createContourMap;
    logSelectedContour(): void;
    private deleteSelected;
}
//# sourceMappingURL=Editor2.d.ts.map
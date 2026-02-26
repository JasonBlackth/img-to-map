
import { Showable } from './Showable.js';
import { ImageStyleEnum } from './ImageStyleEnum.js';
import type { Editor } from '../Model/Editor.js';

export class ImageDownloadWindow extends Showable {
    private imageDisplay: HTMLCanvasElement;
    private editedImage: any;
    private imageStyle: ImageStyleEnum = ImageStyleEnum.ORIGINAL;
    private enableImageGraphics: boolean = false;

    constructor(outputTarget: HTMLElement, imageDisplay: HTMLCanvasElement, prevEditor: Editor) {
        super(outputTarget, outputTarget);
        this.imageDisplay = imageDisplay;
        //this.editedImage = prevEditor.getImage().clone();
    }

    initialize(): void {
        // Inicializálás
    }

    private getCurrentImage(): any {
        return this.editedImage;
    }

    setImageStyle(to: ImageStyleEnum): void {
        this.imageStyle = to;
    }

    setImageGraphics(to: boolean): void {
        this.enableImageGraphics = to;
    }

    updateImageDisplay(): void {
        // Kép megjelenítés frissítése
    }
}

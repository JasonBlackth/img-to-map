declare let cv: any;
import type { Editor } from './Editor.js';
import { Action } from './Action.js';

export class Editor3 implements Editor {
    private inputImage: any;
    private currentImage: any;

    readonly rows: number;
    readonly cols: number;

    constructor(prevEditor: Editor) {
        this.inputImage = prevEditor.getImage();
        this.currentImage = this.inputImage.clone();
        this.rows = this.inputImage.rows;
        this.cols = this.inputImage.cols;
    }

    getImage(): any {
        return this.currentImage;
    }

    createFjords(subImage: any): Action {
        throw new Error('Implement');
    }

    createSmallIslands(subImage: any): Action {
        throw new Error('Implement');
    }

    evenOutCoastLine(subImage: any): Action {
        throw new Error('Implement');
    }

    makeCoastlineUneven(subImage: any): Action {
        throw new Error('Implement');
    }
}

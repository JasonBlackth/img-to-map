import type { Editor } from './Editor.js';
import { Action } from './Action.js';
export declare class Editor3 implements Editor {
    private inputImage;
    private currentImage;
    readonly rows: number;
    readonly cols: number;
    constructor(prevEditor: Editor);
    getImage(): any;
    createFjords(subImage: any): Action;
    createSmallIslands(subImage: any): Action;
    evenOutCoastLine(subImage: any): Action;
    makeCoastlineUneven(subImage: any): Action;
}
//# sourceMappingURL=Editor3.d.ts.map
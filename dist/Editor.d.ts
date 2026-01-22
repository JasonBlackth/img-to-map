export declare class Editor {
    private image;
    private contours;
    private selected;
    constructor(imageElement: HTMLImageElement);
    getGrayscaleImage(): any;
    getContourImage(low: number, high: number): any;
    selectContour(index: number): any;
    deleteSelectedContour(): void;
}
//# sourceMappingURL=Editor.d.ts.map
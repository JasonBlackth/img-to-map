export declare class Editor {
    contours: any;
    selected: number;
    contourImage: any;
    rows: number;
    cols: number;
    private grayscaleImage;
    private contourMap;
    constructor(imageElement: HTMLImageElement);
    createContourImage(low: number, high: number): void;
    deleteSelectedContour(): void;
    logSelectedContour(): void;
    private createContourMap;
    selectContourClosestTo(clickX: number, clickY: number): boolean;
}
//# sourceMappingURL=Editor.d.ts.map
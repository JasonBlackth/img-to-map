export declare class Editor {
    contours: any;
    selected: number;
    contourImage: any;
    rows: number;
    cols: number;
    low: number;
    high: number;
    private grayscaleImage;
    private contourMap;
    constructor(imageElement: HTMLImageElement);
    createContourImage(low: number, high: number): void;
    private deleteSelected;
    logSelectedContour(): void;
    private createContourMap;
    selectContourClosestTo(clickX: number, clickY: number): boolean;
}
//# sourceMappingURL=Editor.d.ts.map
import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Action, ChangeValueAction, Editor } from '../ts';
import { Colors } from '../ts/Model/Colors';
import { Slider } from "../slider/slider";



@Component({
  selector: 'editor2',
  imports: [Slider],
  templateUrl: './editor2.html',
  styleUrl: './editor2.css',
})
export class Editor2 implements Editor {
    public contours: any;
    private contourMap: any;
    private selectedContours: Set<number> = new Set();
    protected lowThreshold: number = 0;
    protected highThreshold: number = 255;
    public declutterThreshold: number = 0;

    rows: number = 0;
    cols: number = 0;

    @Output()
    public contourImage: any;


    @ViewChild('editorCanvas')
    canvasRef!: ElementRef<HTMLCanvasElement>;
    private inputImageGrayScale: any;


    @Input()
    set inputImage(image: any) {
        if (!image) return;  
        this.rows = image.rows;
        this.cols = image.cols;
        this.inputImageGrayScale = new cv.Mat();
        cv.cvtColor(image, this.inputImageGrayScale, cv.COLOR_RGBA2GRAY);
        
        this.contourMap = new cv.Mat();
        this.contourImage = new cv.Mat();
        this.createContourImage();
    }


    @HostListener('window:keydown', ['$event'])
    keyboardEventHandler(event: KeyboardEvent) {
        if (this.canvasRef.nativeElement === document.activeElement){
            if (event.key === 'Delete') {
                this.deleteSelectedContours();
            }
            if (event.key === 'Escape') {
                this.dropSelection();
            }
        }
    }

    onCanvasClicked($event: PointerEvent) {
        const ctrlHeld = $event.ctrlKey || $event.metaKey || $event.shiftKey;

        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        const clickX = ($event.clientX - rect.left) * (this.cols / rect.width);
        const clickY = ($event.clientY - rect.top) * (this.rows / rect.height);

        const selectedIndex = this.findContourClosestTo(clickX, clickY);
        if (selectedIndex !== -1){
            if (!ctrlHeld) {
                this.dropSelection();
            }
            this.selectedContours.add(selectedIndex);
            this.reDrawContour(selectedIndex, Colors.RED);
        }
        
    }

    deleteSelectedContours(): Action {
        const deletedIndices = Array.from(this.selectedContours);
        const deletedContours = deletedIndices
            .map(i => this.contours.get(i).clone());

        return Action.createAndApply({
            dataStorage: { editor: this, deletedIndices, deletedContours },
            apply: (ds: any) => {
                ds.editor.deleteContoursAtIndices(
                    ds.deletedIndices);             

            },
            revert: (ds: any) => {
                ds.deletedIndices.forEach((originalIndex: number, index: number) => {
                    ds.editor.contours.set(originalIndex, ds.deletedContours[index]);
                });
                ds.editor.reDrawContours(
                    ds.deletedIndices,
                    Colors.WHITE
                );
            }
        });
    }

    setDeclutterThreshold(to: number): void {
        this.setProperty("declutterThreshold", to);
    }

    drawNewContour(input: any): Action {
        throw new Error('Implement');
    }

    public createContourImage() : void {
        this.selectedContours.clear();
        this.contourImage = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC3);
        const canny = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC1);
        const hierarchy = new cv.Mat();
        this.contours = new cv.MatVector();
        cv.Canny(this.inputImageGrayScale, canny, this.lowThreshold, this.highThreshold);
        cv.findContours(
            canny,
            this.contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );
        this.reDrawAllContours(Colors.WHITE);
        this.createContourMap();
        cv.imshow(this.canvasRef.nativeElement, this.contourImage);
        canny.delete();
        hierarchy.delete();
    }

    public findContourClosestTo(clickX :number, clickY :number) : number {
        clickX = Math.round(clickX);
        clickY = Math.round(clickY);
        const r = 9;
        const r2 = r * r;
        let closest: { contour_idx: number; sqDist: number } | null = null;
        const valAtClick = this.contourMap.data16U[clickY * this.contourMap.cols + clickX] - 1;
        if (valAtClick !== -1) {
            return valAtClick;
        }
        else{

            for (let x = Math.max(clickX - r, 0); x < Math.min(clickX + r, this.contourMap.cols); ++x) {
                for (let y = Math.max(clickY - r, 0); y < Math.min(clickY + r, this.contourMap.rows); ++y) {
                    const sqDist = (x - clickX) ** 2 + (y - clickY) ** 2;
                    const val = this.contourMap.data16U[y * this.contourMap.cols + x] -1;
                    if (sqDist <= r2 && val !== -1) {
                        if (!closest || closest.sqDist > sqDist) {
                            closest = { contour_idx: val, sqDist: sqDist };
                        }
                    }
                }   
            }
        }
        if (closest) return closest.contour_idx;
        return -1;
    }

    private createContourMap(){
        this.contourMap = cv.Mat.zeros(this.rows, this.cols, cv.CV_16UC1)
        for (let i = 0; i < this.contours.size(); ++i) {
            cv.drawContours(this.contourMap, this.contours, i, new cv.Scalar(i + 1), cv.FILLED);
        }
    }

    public logSelectedContour() : void {
        if (this.selectedContours.size === 0) return;
        const contour = this.contours.get(Array.from(this.selectedContours)[0]);
        const area = cv.contourArea(contour, false);
        const rect = cv.boundingRect(contour);
        const rectArea = rect.width * rect.height;
        console.log(rect)

        const hull = new cv.Mat();
        cv.convexHull(contour, hull, false, true);
        const hullArea = cv.contourArea(hull, false);

        console.log(`
            Area: ${area}
            Arc Length: ${cv.arcLength(contour, true)}
            Extent: ${area / rectArea}
            Solidity: ${area / hullArea}`
        );

        hull.delete();
    }

    public deleteContoursAtIndices(indices: number[]) : void {
        if (!indices) return;
        this.reDrawContours(indices, Colors.BLACK);
        for (const index of indices) {
            const contourToDelete = this.contours.get(index).clone();
            const dummyReplacement = new cv.Mat(
                contourToDelete.rows,
                1,
                cv.CV_32SC2,
                new cv.Scalar(-1)
            );
            this.contours.set(index, dummyReplacement);
        }
    }



    protected setProperty<T>(propertyName: string, newValue: T): void {
        ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
    }

    handleValuesChanged(): void {
       this.createContourImage();
    }

    private reDrawAllContours(colour: any): void{
        this.reDrawContours([-1], colour);
    }
    private reDrawContour(ind: number, colour: any): void{
        this.reDrawContours([ind], colour);
    }
    private reDrawContours(inds: number[], colour: any): void{
        for (const ind of inds) {
            cv.drawContours(this.contourImage, this.contours, ind, colour, cv.FILLED);
        }
        cv.imshow(this.canvasRef.nativeElement, this.contourImage);
    }

    private dropSelection(): void {
        this.reDrawContours(Array.from(this.selectedContours), Colors.WHITE);
        this.selectedContours.clear();
    }

}



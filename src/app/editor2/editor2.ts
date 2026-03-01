/*
 * <<licensetext>>
 */

import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ɵgenerateStandaloneInDeclarationsError } from '@angular/core';
import { Action, ChangeValueAction, Editor } from '../ts';
import { Colors } from '../ts/Model/Colors';



@Component({
  selector: 'editor2',
  imports: [],
  templateUrl: './editor2.html',
  styleUrl: './editor2.css',
})
export class Editor2 implements Editor {
    public contours: any;
    private contourHierarchy: any;
    private contourMap: any;
    private selectedContours: Set<number> = new Set();
    protected lowThreshold: number = 0;
    protected highThreshold: number = 255;
    protected hierarchy: number = 1;



    rows: number = 0;
    cols: number = 0;

    @Output()
    displayImageChanged = new EventEmitter<any>(); 

    private contourImage: any;


    @ViewChild('editorCanvas')
    canvasRef!: ElementRef<HTMLCanvasElement>;
    

    private _inputImage: any;
    @Input()
    set inputImage(image: any) {
        if (!image) return;    
        if (this._inputImage !== undefined){
            this._inputImage.delete();
        }
        this.rows = image.rows;
        this.cols = image.cols;
        this._inputImage = image.clone();

        this.contourMap = new cv.Mat();
        this.contourImage = new cv.Mat();
        this.contourHierarchy = new cv.Mat();
        this.createContourImage();
    }
    get inputImage(){ return this._inputImage; }


    @HostListener('window:keydown', ['$event'])
    keyboardEventHandler(event: KeyboardEvent) {
        if (this.canvasRef.nativeElement === document.activeElement){
            if (event.key === 'Delete') {
                this.deleteSelectedContours();
            }
            if (event.key === 'Escape') {
                this.dropSelection();
            }
            if (event.key === 'Enter') {
                this.keepOnlySelected();
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
            if (this.selectedContours.has(selectedIndex)){
                this.selectedContours.delete(selectedIndex);
                this.reDrawContour(selectedIndex, Colors.WHITE);
            } else {
                this.selectedContours.add(selectedIndex);
                this.reDrawContour(selectedIndex, Colors.RED);
            }
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
                ds.editor.displayImageChanged.emit(this.contourImage);        
            },
            revert: (ds: any) => {
                ds.deletedIndices.forEach((originalIndex: number, index: number) => {
                    ds.editor.contours.set(originalIndex, ds.deletedContours[index]);
                });
                ds.editor.reDrawContours(
                    ds.deletedIndices,
                    Colors.WHITE
                );
                ds.editor.displayImageChanged.emit(this.contourImage);  
            }
        });
    }

    public createContourImage() : void {
        this.selectedContours.clear();
        this.contourImage = cv.Mat.zeros(this.rows, this.cols, cv.CV_8UC3);
        this.contours = new cv.MatVector();
        cv.findContours(
            this.inputImage,
            this.contours,
            this.contourHierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_NONE
        );
        this.reDrawAllContours(Colors.WHITE);
        this.createContourMap();
        cv.imshow(this.canvasRef.nativeElement, this.contourImage);
        this.displayImageChanged.emit(this.contourImage);
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

    keepOnlySelected() :Action{
       const inverseOfSelection = Array.from(Array(this.contours.size()).keys()).filter(index => !this.selectedContours.has(index))
       this.dropSelection();
       this.selectedContours = new Set(inverseOfSelection);

       return this.deleteSelectedContours()
    }

    private dropSelection(): void {
        this.reDrawContours(Array.from(this.selectedContours), Colors.WHITE);
        this.selectedContours.clear();
    }

}



// Még Erosion + Dilation segíthet
// Illetve fordítva

// aztán findContours-ban a hierarchiában a külsőket megtartani csak





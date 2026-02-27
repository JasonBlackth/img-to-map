/*
 * <<licensetext>>
 */


import { Component, ElementRef, EventEmitter, input, Input, Output, ViewChild } from '@angular/core';
import type { Editor } from '../ts/Model/Editor.js';
import { DenoiseModeEnum } from '../ts/Model/DenoiseModeEnum.js';
import { ChangeValueAction } from '../ts/index.js';
import { FormsModule } from '@angular/forms';
import { Slider } from "../slider/slider";


@Component({
  selector: 'editor1',
  imports: [FormsModule, Slider],
  templateUrl: './editor1.html',
  styleUrl: './editor1.css',
})
export class Editor1 implements Editor {
    protected _denoiseMode: DenoiseModeEnum = DenoiseModeEnum.NONE;


    protected brightness = 0;
    protected contrast = 1;
    protected contrastCenter = 128;
    protected denoiseAmount = 0;

    private mask: any;


    private _inputImage: any;
    private displayImage: any;
    rows: number = 0;
    cols: number = 0;

    @Output()
    displayImageChanged = new EventEmitter<any>(); 

    @ViewChild('editorCanvas')
    canvasRef!: ElementRef<HTMLCanvasElement>;
    bgdModel: any;
    fgdModel: any;


    @Input()
    set inputImage(image: any) {
        this.rows = image.rows;
        this.cols = image.cols;
        this._inputImage = image.clone();
        this.displayImage = image.clone();
        this.adjustBrightnessContrast();
    }
    get inputImage(): any {
        return this._inputImage;
    }

    performDenoising(){
       const dst = new cv.Mat();
       cv.fastNlMeansDenoisingColored(this.inputImage,dst,10,10,7,21)
       this.inputImage = dst; 
    }

    adjustBrightnessContrast(): void {
        const adjustedBrightness = (1-this.contrast)*this.contrastCenter + (this.brightness);
        
        const src = this._inputImage.clone();
        const dst = new cv.Mat();
        src.convertTo(dst, cv.CV_8U3C, this.contrast, adjustedBrightness);
        this.displayImage = dst.clone();
        src.delete();
        dst.delete();

        this.updateDisplayImage();
    }

    adaptiveThres(){
        let src = this._inputImage.clone();
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        // You can try more different parameters
        cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 13, 12);
        
        const displayMat = new cv.Mat();
        cv.cvtColor(dst, displayMat, cv.COLOR_GRAY2BGR, 0);
        
        this.displayImage = displayMat.clone();
        this.updateDisplayImage();

        src.delete();
        dst.delete();
        displayMat.delete();
    }

    applyClahe() {
        const src = this._inputImage.clone();
        const gray = new cv.Mat();
        const dst = new cv.Mat();
        
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.equalizeHist(gray, gray);

        let tileGridSize = new cv.Size(8, 8);
        let clahe = new cv.CLAHE(40, tileGridSize);
        console.log(clahe);
        clahe.apply(gray, dst);


        // Convert back to 3-channel for display
        const displayMat = new cv.Mat();
        cv.cvtColor(dst, displayMat, cv.COLOR_GRAY2BGR, 0);
        
        this.displayImage = displayMat.clone();
        
        src.delete();
        gray.delete();
        dst.delete();
        displayMat.delete();

        this.updateDisplayImage();
    }

    onMouseOverCanvas(event: MouseEvent) {
      if (event.buttons == 1 || event.buttons == 2){
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        let x = event.offsetX;
        let y = event.offsetY;
        if (x > 0 && x < rect.width
            && y > 0 && y < rect.height){
            const newValue = (event.buttons == 1) ? cv.GC_FGD : cv.GC_BGD;
            const X = Math.round(x * (this.cols / rect.width));
            const Y = Math.round(y * (this.rows / rect.height));       
            this.mask.ucharPtr(X, Y)[0] = newValue;
            this.mask.ucharPtr(X, Y)[1] = newValue;
            this.mask.ucharPtr(X, Y)[2] = newValue;
            console.log(`Value at (${X}, ${Y}): ${this.mask.ucharPtr(X, Y)}`);
            
        }
      }  
      
    }

    extractForeground(){
        let src = this._inputImage.clone();
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        this.mask = new cv.Mat();
        this.bgdModel = new cv.Mat();
        this.fgdModel = new cv.Mat();
        let rect = new cv.Rect(0, 0, this.rows, this.cols);
        cv.grabCut(src, this.mask, rect, this.bgdModel, this.fgdModel, 1, cv.GC_INIT_WITH_RECT);
        // draw foreground
        for (let i = 0; i < src.rows; i++) {
            for (let j = 0; j < src.cols; j++) {
                if (this.mask.ucharPtr(i, j)[0] == 0 || this.mask.ucharPtr(i, j)[0] == 2) {
                    src.ucharPtr(i, j)[0] = 0;
                    src.ucharPtr(i, j)[1] = 0;
                    src.ucharPtr(i, j)[2] = 0;
                }
            }
        }
        // draw grab rect
        this.displayImage = src.clone();
        this.updateDisplayImage();
        src.delete();
    }

    iterExtractForeground() {
        console.log("iterating")
        let src = this._inputImage.clone();
        let rect = new cv.Rect(0, 0, this.rows, this.cols);
        cv.grabCut(src, this.mask, rect, this.bgdModel, this.fgdModel, 1, cv.GC_INIT_WITH_MASK);

        for (let i = 0; i < src.rows; i++) {
            for (let j = 0; j < src.cols; j++) {
                if (this.mask.ucharPtr(i, j)[0] == 0 || this.mask.ucharPtr(i, j)[0] == 2) {
                    src.ucharPtr(i, j)[0] = 0;
                    src.ucharPtr(i, j)[1] = 0;
                    src.ucharPtr(i, j)[2] = 0;
                }
            }
        }

        this.displayImage = src.clone();
        this.updateDisplayImage();
        src.delete();
    }

    updateDisplayImage(): void {
        cv.imshow(this.canvasRef.nativeElement, this.displayImage);
        console.log(this.displayImage);
        this.displayImageChanged.emit(this.displayImage);
    }

    setDenoiseMode(to: DenoiseModeEnum): void {
        this.setProperty("_denoiseMode", to);
    }

    protected setProperty<T>(propertyName: string, newValue: T): void {
        ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
    }

    handleValuesChanged(): void {
        this.adjustBrightnessContrast();
    }

}

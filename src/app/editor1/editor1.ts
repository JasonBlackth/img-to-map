
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


    private _inputImage: any;
    private displayImage: any;
    rows: number = 0;
    cols: number = 0;

    @Output()
    displayImageChanged = new EventEmitter<any>(); 

    @ViewChild('editorCanvas')
    canvasRef!: ElementRef<HTMLCanvasElement>;


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

    extractForeground(){
        let src = this._inputImage.clone();
        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
        let mask = new cv.Mat();
        let bgdModel = new cv.Mat();
        let fgdModel = new cv.Mat();
        let rect = new cv.Rect(260, 260, 460, 460);
        cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
        // draw foreground
        for (let i = 0; i < src.rows; i++) {
            for (let j = 0; j < src.cols; j++) {
                if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
                    src.ucharPtr(i, j)[0] = 0;
                    src.ucharPtr(i, j)[1] = 0;
                    src.ucharPtr(i, j)[2] = 0;
                }
            }
        }
        // draw grab rect
        let color = new cv.Scalar(0, 0, 255);
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(src, point1, point2, color);
        this.displayImage = src.clone();
        this.updateDisplayImage();
        src.delete(); mask.delete(); bgdModel.delete(); fgdModel.delete();
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


import { Component, ElementRef, EventEmitter, input, Input, Output, ViewChild } from '@angular/core';
import type { Editor } from '../ts/Model/Editor.js';
import { DenoiseModeEnum } from '../ts/Model/DenoiseModeEnum.js';
import { ChangeValueAction } from '../ts/index.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'editor1',
  imports: [FormsModule],
  templateUrl: './editor1.html',
  styleUrl: './editor1.css',
})
export class Editor1 implements Editor {
    protected previewContrast: number = 128;
    protected previewContrastCentre: number = 128;
    protected previewBrightness: number = 128;

    protected _denoiseMode: DenoiseModeEnum = DenoiseModeEnum.NONE;
    protected _contrast: number = this.previewContrast;
    protected _contrastCentre: number = this.previewContrastCentre;
    protected _brightness: number = this.previewBrightness;

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


    adjustBrightnessContrast(): void {
        const contrast = this._contrast / 128.0;
        const adjustedBrightness = (1-contrast)*this._contrastCentre + (this._brightness - 128);
        
        const src = this._inputImage;
        const dst = this.displayImage;
        cv.convertScaleAbs(src, dst, contrast, adjustedBrightness);
        this.updateDisplayImage();
    }

    updateDisplayImage(): void {
        cv.imshow(this.canvasRef.nativeElement, this.displayImage);
        this.displayImageChanged.emit(this.displayImage);
    }


    getImage(): any {
        return this.displayImage;
    }

    setDenoiseMode(to: DenoiseModeEnum): void {
        this.setProperty("_denoiseMode", to);
    }
    setBrightness() {
        this.setProperty("_brightness", this.previewBrightness);
    }

    setContrast() : void {
        this.setProperty("_contrast", this.previewContrast);
    }

    setContrastCentre(): void {
        this.setProperty("_contrastCentre", this.previewContrastCentre);
    }

    onDragBrightness(newValue: string) {
        this.previewBrightness = parseInt(newValue);
    }

    onDragContrast(newValue: string) {
        this.previewContrast = parseInt(newValue);
    }
    
    onDragContrastCentre(newValue: string) {
        this.previewContrastCentre = parseInt(newValue);
    }

    private setProperty<T>(propertyName: string, newValue: T): void {
        ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
    }

    updatePreviewValues(): void {
        this.previewContrast = this._contrast;
        this.previewContrastCentre = this._contrastCentre;
        this.previewBrightness = this._brightness;
        this.adjustBrightnessContrast();

    }

}

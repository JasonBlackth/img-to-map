import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Editor } from '../ts/Model/Editor';
import { Slider } from '../slider/slider';
import { ChangeValueAction } from '../ts';
import { Colors } from '../ts/Model/Colors';
import panzoom from 'panzoom';

@Component({
  selector: 'editor3',
  imports: [Slider],
  templateUrl: './editor3.html',
  styleUrl: './editor3.css',
})
export class Editor3 implements Editor {
  rows: number = 0;
  cols: number = 0;
  coastlineSmoothness: number = 7;
  contours: any;

  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output()
  displayImageChanged = new EventEmitter<any>();

  private _inputImage: any;
  @Input()
  set inputImage(image: any) {
    if (!image) return;
    if (this._inputImage !== undefined) {
      this._inputImage.delete();
    }
    this.rows = image.rows;
    this.cols = image.cols;

    this._inputImage = image.clone();
    panzoom(this.canvasRef.nativeElement, {
      maxZoom: 2,
      minZoom: 0.8,
      bounds: true,
    });

    this.blurCoastlines();
  }
  get inputImage() {
    return this._inputImage;
  }

  blurCoastlines() {
    const dst = new cv.Mat();
    let ksize = new cv.Size(this.coastlineSmoothness + 1, this.coastlineSmoothness + 1);
    let anchor = new cv.Point(-1, -1);
    cv.blur(this._inputImage, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.threshold(dst, dst, 200, 255, cv.THRESH_BINARY);

    cv.imshow(this.canvasRef.nativeElement, dst);
    this.displayImageChanged.emit(dst);
    dst.delete();
  }

  makeCoastlinesJagged() {
    let src = cv.imread(this.canvasRef.nativeElement);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);
    this.contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, this.contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);
    let amount = 3;
    for (let c = 0; c < this.contours.size(); c++) {
      const contour = this.contours.get(c);
      for (let i = 0; i < contour.data32S.length; i += 2) {
        contour.data32S[i] += (Math.random() - 0.5) * amount; // x
        contour.data32S[i + 1] += (Math.random() - 0.5) * amount; // y
      }
    }

    cv.drawContours(dst, this.contours, -1, Colors.WHITE, cv.FILLED);
    cv.imshow(this.canvasRef.nativeElement, dst);
    this.displayImageChanged.emit(dst);

    hierarchy.delete();
    src.delete();
    dst.delete();
  }

  handleValuesChanged() {
    this.blurCoastlines();
  }

  protected setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
  }
}

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Editor } from '../ts/Model/Editor';
import { Slider } from '../slider/slider';
import { ChangeValueAction } from '../ts';
import { Colors } from '../ts/Model/Colors';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../ts/Model/AbstractEditor';

@Component({
  selector: 'editor3',
  imports: [Slider, BaseEditorComponent],
  templateUrl: './editor3.html',
  styleUrl: './editor3.css',
})
export class Editor3 extends AbstractEditor {
  coastlineSmoothness: number = 7;
  contours: any;

  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage() {
    this.blurCoastlines();
  }

  blurCoastlines() {
    const dst = new cv.Mat();
    let ksize = new cv.Size(this.coastlineSmoothness + 1, this.coastlineSmoothness + 1);
    let anchor = new cv.Point(-1, -1);
    cv.blur(this.inputImage, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.threshold(dst, dst, 200, 255, cv.THRESH_BINARY);
    this.displayImage = dst;
  }

  makeCoastlinesJagged() {
    const src = cv.imread(this.baseEditor.canvasRef.nativeElement);
    const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);
    this.contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, this.contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
    const amount = 20;
    const jumpSize = 28;
    for (let c = 0; c < this.contours.size(); c++) {
      const contour = this.contours.get(c);
      for (let i = 0; i < contour.data32S.length; i += jumpSize) {
        let x = contour.data32S[i] + (Math.random() - 0.5) * amount;
        let y = contour.data32S[i + 1] + (Math.random() - 0.5) * amount;
        contour.data32S[i] = x;
        contour.data32S[i + 1] = y;

        if (i > 0) {
          let prevI = i - jumpSize;
          let prevX = contour.data32S[prevI];
          let prevY = contour.data32S[prevI + 1];
          let f = (x: number) => Math.cos(x) ** 2 * 0.5 + 0.5;
          for (let j = 2; j < jumpSize; j += 2) {
            let iterCount = j / 2 - 1;
            let t = iterCount / (jumpSize / 2);
            t = f(t * Math.PI);
            contour.data32S[prevI + j] = prevX + (x - prevX) * t;
            contour.data32S[prevI + j + 1] = prevY + (y - prevY) * t;
          }
        }
      }
    }

    cv.drawContours(dst, this.contours, -1, Colors.WHITE, cv.FILLED);
    this.displayImage = dst;

    hierarchy.delete();
    src.delete();
  }

  private getVertex(contour: any, index: number): { x: number; y: number } {
    return {
      x: contour.data32S[index * 2],
      y: contour.data32S[index * 2 + 1],
    };
  }
  private setVertex(contour: any, index: number, x: number, y: number): void {
    contour.data32S[index * 2] = x;
    contour.data32S[index * 2 + 1] = y;
  }
}

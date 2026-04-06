import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from '../slider/slider';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { NgTemplateOutlet } from '@angular/common';
import { AbstractEditor } from '../ts/Model/AbstractEditor.js';

@Component({
  selector: 'editor1',
  imports: [FormsModule, Slider, BaseEditorComponent, NgTemplateOutlet],
  templateUrl: './editor1.html',
  styleUrls: ['./editor1.css'],
})
export class Editor1 extends AbstractEditor {
  isEditor1Collapsed: boolean = true;

  protected sampleSize = 31;
  protected addedConstant = 4;
  protected dilationIters = 3;
  protected erosionIters = 3;
  protected isDilationFirst: boolean = true;

  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage() {
    this.adatptiveThreshold();
  }

  adatptiveThreshold() {
    const dst = new cv.Mat();
    cv.cvtColor(this.inputImage, dst, cv.COLOR_RGBA2GRAY, 0);

    let ksize = new cv.Size(31, 31);
    let anchor = new cv.Point(-1, -1);
    cv.blur(dst, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY_INV,
      this.sampleSize,
      this.addedConstant,
    );
    this.performMorphology(dst, anchor);

    this.displayImage = dst;
  }

  private performMorphology(dst: any, anchor: any): void {
    let M = cv.Mat.ones(3, 3, cv.CV_8U);
    let dilate = () =>
      cv.dilate(
        dst,
        dst,
        M,
        anchor,
        this.dilationIters,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );
    let erode = () =>
      cv.erode(
        dst,
        dst,
        M,
        anchor,
        this.erosionIters,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );

    if (this.isDilationFirst) {
      dilate();
      erode();
    } else {
      erode();
      dilate();
    }
  }

  toggleIsDilationFirst(): void {
    this.setProperty('isDilationFirst', !this.isDilationFirst);
  }
}

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from '../../slider/slider';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { NgTemplateOutlet } from '@angular/common';
import { AbstractEditor } from '../AbstractEditor.js';

@Component({
  selector: 'editor1',
  imports: [FormsModule, Slider, BaseEditorComponent, NgTemplateOutlet],
  templateUrl: './editor1.html',
  styleUrls: ['./editor1.css'],
})
export class Editor1 extends AbstractEditor {
  protected sampleSize = 501;
  protected addedConstant = 0;
  protected dilationIters = 0;
  protected erosionIters = 0;
  protected isDilationFirst: boolean = true;

  private grayScaleInputImage: any;

  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage() {
    const dst = this.grayScaleInputImage.clone();
    this.adatptiveThreshold(dst);
    this.performMorphology(dst);
    this.displayImage = dst;
  }

  override onNewInputImage(): void {
    if (this.grayScaleInputImage) {
      this.grayScaleInputImage.delete();
    }
    this.grayScaleInputImage = new cv.Mat();
    cv.cvtColor(this.inputImage, this.grayScaleInputImage, cv.COLOR_RGBA2GRAY, 0);
  }

  adatptiveThreshold(dst: any): void {
    let ksize = new cv.Size(3, 3);
    let anchor = new cv.Point(-1, -1);
    cv.blur(dst, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY,
      this.sampleSize,
      this.addedConstant,
    );
  }

  private performMorphology(dst: any): void {
    let anchor = new cv.Point(-1, -1);
    let M = cv.Mat.ones(3, 3, cv.CV_8U);
    let dilate = () => {
      cv.dilate(
        dst,
        dst,
        M,
        anchor,
        this.dilationIters,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );
    };
    let erode = () => {
      cv.erode(
        dst,
        dst,
        M,
        anchor,
        this.erosionIters,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );
    };

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

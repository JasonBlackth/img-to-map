import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from '../../slider/slider';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { NgTemplateOutlet } from '@angular/common';
import { AbstractEditor } from '../AbstractEditor.js';
import { CvUtils } from '../../common/CvUtils';

@Component({
  selector: 'editor1',
  imports: [FormsModule, Slider, BaseEditorComponent, NgTemplateOutlet],
  templateUrl: './editor1.html',
  styleUrls: ['./editor1.css'],
})
export class Editor1 extends AbstractEditor {
  protected sampleSize = 501;
  protected shiftThreshold = 0;
  protected dilationIters = 0;
  protected erosionIters = 0;
  protected isDilationFirst: boolean = true;
  protected isResultInverted: boolean = false;
  protected isChangeIgnorable: boolean = false;

  private grayScaleInputImage: any;

  @Output()
  override displayImageChanged = new EventEmitter<any>();
  @Output()
  override editorExpanded = new EventEmitter<void>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage() {
    const dst = this.grayScaleInputImage.clone();
    this.adaptiveThreshold(dst);
    this.dilateAndErode(dst);
    this.setDisplayImage(dst);
  }

  override onNewInputImage(): void {
    if (this.grayScaleInputImage) {
      this.grayScaleInputImage.delete();
    }
    this.grayScaleInputImage = CvUtils.convertToGrayscale(this.getInputImage());
  }

  private adaptiveThreshold(dst: any): void {
    let ksize = new cv.Size(3, 3);
    let anchor = new cv.Point(-1, -1);
    cv.blur(dst, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      this.isResultInverted ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY,
      this.sampleSize,
      -this.shiftThreshold,
    );
  }

  private dilateAndErode(dst: any): void {
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

  protected toggleIsDilationFirst(): void {
    this.isChangeIgnorable = this.dilationIters === 0 || this.erosionIters === 0;
    this.setProperty('isDilationFirst', !this.isDilationFirst);
  }
  override handlePropertyChanged(): void {
    if (this.isChangeIgnorable) {
      this.isChangeIgnorable = false;
      return;
    }
    this.scheduleProcessImage();
  }
}

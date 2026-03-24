import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import type { Editor } from '../ts/Model/Editor.js';
import { ChangeValueAction } from '../ts/index.js';
import { FormsModule } from '@angular/forms';
import { Slider } from '../slider/slider';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'editor1',
  imports: [FormsModule, Slider, BaseEditorComponent, NgTemplateOutlet],
  templateUrl: './editor1.html',
  styleUrls: ['./editor1.css'],
})
export class Editor1 implements Editor {
  isEditor1Collapsed: boolean = true;

  protected sampleSize = 31;
  protected addedConstant = 4;
  protected dilationIters = 3;
  protected erosionIters = 3;
  protected dilationFirst: boolean = true;

  private _inputImage: any;
  private _displayImage: any;
  rows: number = 0;
  cols: number = 0;

  @Output()
  displayImageChanged = new EventEmitter<any>();

  @ViewChild(BaseEditorComponent)
  baseEditor!: BaseEditorComponent;

  set displayImage(image: any) {
    if (this._displayImage !== undefined) {
      if (image.rows !== this.rows || image.cols !== this.cols) {
        throw new Error(
          `Cannot set image of differring size (${image.rows}, ${image.cols}) to display (${this.rows}, ${this.cols})`,
        );
      }
      if (image.type() !== this._displayImage.type()) {
        image.convertTo(image, this._displayImage.type());
      }
      this._displayImage.delete();
    }
    this._displayImage = image;

    this.updateDisplayImage();
  }
  get displayImage() {
    return this._displayImage;
  }

  @Input()
  set inputImage(image: any) {
    this.rows = image.rows;
    this.cols = image.cols;
    this._inputImage = image.clone();
    this.adatptiveThreshold();
  }
  get inputImage(): any {
    return this._inputImage;
  }

  adatptiveThreshold() {
    const dst = new cv.Mat();
    cv.cvtColor(this.inputImage, dst, cv.COLOR_RGBA2GRAY, 0);

    let ksize = new cv.Size(3, 3);
    let anchor = new cv.Point(-1, -1);
    cv.blur(dst, dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
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

    if (this.dilationFirst) {
      dilate();
      erode();
    } else {
      erode();
      dilate();
    }
  }

  protected setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
  }

  toggleDilationFirst(): void {
    this.setProperty('dilationFirst', !this.dilationFirst);
  }

  handleValuesChanged(): void {
    this.adatptiveThreshold();
  }

  updateDisplayImage(doNotify = true): void {
    this.baseEditor.setDisplayImage(this.displayImage);
    if (doNotify) {
      this.displayImageChanged.emit(this.displayImage);
    }
  }
}

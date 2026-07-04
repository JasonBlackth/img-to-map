import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractEditor } from '../AbstractEditor';
import { Slider } from '../../slider/slider';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
@Component({
  selector: 'editor3',
  imports: [Slider, BaseEditorComponent],
  templateUrl: './editor3.html',
  styleUrl: './editor3.css',
})
export class Editor3 extends AbstractEditor {
  protected coastlineSmoothness: number = 7;

  @Output()
  override displayImageChanged = new EventEmitter<any>();
  @Output()
  override editorExpanded = new EventEmitter<void>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  public override resetPropertiesToDefault(): void {
    this.coastlineSmoothness = 7;
  }

  override processImage() {
    this.blurCoastlines();
  }

  protected override onNewInputImage(): void {
    cv.cvtColor(this.getInputImage(), this.getInputImage(), cv.COLOR_RGBA2GRAY);
    cv.threshold(this.getInputImage(), this.getInputImage(), 0, 255, cv.THRESH_BINARY);
  }

  private blurCoastlines() {
    const dst = new cv.Mat();
    let ksize = new cv.Size(this.coastlineSmoothness + 1, this.coastlineSmoothness + 1);
    let anchor = new cv.Point(-1, -1);
    cv.blur(this.getInputImage(), dst, ksize, anchor, cv.BORDER_DEFAULT);
    cv.threshold(dst, dst, 200, 255, cv.THRESH_BINARY);
    this.setDisplayImage(dst);
  }
}

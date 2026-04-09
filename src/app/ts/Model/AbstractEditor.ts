import { EventEmitter } from '@angular/core';
import { BaseEditorComponent } from '../../base-editor-component/base-editor-component';
import { EventPolicy } from './EventPolicy';
import { ChangeValueAction } from './ChangeValueAction';

export abstract class AbstractEditor {
  protected baseEditor: BaseEditorComponent | undefined;
  protected displayImageChanged = new EventEmitter<any>();

  private _displayImage: any;
  private _inputImage: any;
  private pendingProcessTimeoutId: number | null = null;
  private readonly processingDebounceMs = 50;

  set displayImage(image: any) {
    if (!image) return;
    if (this._displayImage !== undefined) {
      this._displayImage.delete();
    }
    this._displayImage = image;
    this.updateDisplayImage();
  }
  get displayImage() {
    return this._displayImage;
  }

  set inputImage(image: any) {
    if (!image) return;
    if (this._inputImage !== undefined) {
      this._inputImage.delete();
    }
    this._inputImage = image;

    this.onNewInputImage();
    this.scheduleLatestOnlyProcessing();
  }
  get inputImage() {
    return this._inputImage;
  }

  updateDisplayImage(eventPolicy = EventPolicy.EMIT_EVENT): void {
    if (!this.baseEditor) {
      return;
    }
    this.baseEditor.setDisplayImage(this.displayImage);

    if (eventPolicy === EventPolicy.EMIT_EVENT) {
      this.displayImageChanged.emit(this.displayImage);
    }
  }

  protected onNewInputImage(): void {}

  abstract processImage(): any;

  handlePropertyChanged(): any {
    this.scheduleLatestOnlyProcessing();
  }

  setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
  }

  private scheduleLatestOnlyProcessing(): void {
    if (this.pendingProcessTimeoutId !== null) {
      window.clearTimeout(this.pendingProcessTimeoutId);
    }

    this.pendingProcessTimeoutId = window.setTimeout(() => {
      this.pendingProcessTimeoutId = null;
      if (!this._inputImage) {
        return;
      }
      this.processImage();
    }, this.processingDebounceMs);
  }

  public setIsCollapsed(isCollapsed: boolean): void {
    if (this.baseEditor) {
      this.baseEditor.setIsCollapsed(isCollapsed);
    }
  }
}

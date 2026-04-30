import { EventEmitter } from '@angular/core';
import { BaseEditorComponent } from './base-editor-component/base-editor-component';
import { ChangeValueAction } from '../common/reversible-action/ChangeValueAction';

export abstract class AbstractEditor {
  protected baseEditor: BaseEditorComponent | undefined;
  public displayImageChanged = new EventEmitter<any>();
  public editorExpanded = new EventEmitter<void>();

  private _displayImage: any;
  private _inputImage: any;
  private pendingProcessTimeoutId: number | null = null;
  private readonly WAIT_BEFORE_PROCESSING_MS = 100;

  setDisplayImage(image: any) {
    this.setDisplayImageWithoutUpdate(image);
    this.updateDisplayImage();
  }
  setDisplayImageWithoutUpdate(image: any) {
    if (!image) return;
    if (this._displayImage !== undefined) {
      this._displayImage.delete();
    }
    this._displayImage = image;
  }
  getDisplayImage() {
    return this._displayImage;
  }

  set inputImage(image: any) {
    if (!image) return;
    if (this._inputImage !== undefined) {
      this._inputImage.delete();
    }
    this._inputImage = image;

    this.onNewInputImage();
    this.scheduleProcessImage();
  }
  get inputImage() {
    return this._inputImage;
  }

  updateDisplayImage(): void {
    this.updateDisplayImageWithoutEvent();
    this.displayImageChanged.emit(this.getDisplayImage());
  }
  updateDisplayImageWithoutEvent() {
    if (this.baseEditor) {
      this.baseEditor.setDisplayImage(this.getDisplayImage());
    }
  }

  protected onNewInputImage(): void {}

  abstract processImage(): void;

  handlePropertyChanged(): void {
    this.scheduleProcessImage();
  }

  setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.for(this, propertyName, newValue);
  }

  protected scheduleProcessImage(): void {
    if (this.pendingProcessTimeoutId !== null) {
      window.clearTimeout(this.pendingProcessTimeoutId);
    }

    this.pendingProcessTimeoutId = window.setTimeout(() => {
      this.pendingProcessTimeoutId = null;
      if (!this._inputImage) {
        return;
      }
      this.processImage();
    }, this.WAIT_BEFORE_PROCESSING_MS);
  }

  public setIsCollapsed(isCollapsed: boolean): void {
    if (this.baseEditor) {
      this.baseEditor.setIsCollapsed(isCollapsed);
    }
  }
  public isCollapsed(): boolean {
    return this.baseEditor ? this.baseEditor.isCollapsed : true;
  }
  protected emitEditorExpanded(): void {
    this.editorExpanded.emit();
  }
}

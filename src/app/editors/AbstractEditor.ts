import { EventEmitter } from '@angular/core';
import { BaseEditorComponent } from './base-editor-component/base-editor-component';
import { ChangeValueAction } from '../common/reversible-action/ChangeValueAction';
import { ReversibleAction } from '../common/reversible-action/ReversibleAction';

export abstract class AbstractEditor {
  protected baseEditor: BaseEditorComponent | undefined;
  public displayImageChanged = new EventEmitter<any>();
  public editorExpanded = new EventEmitter<void>();

  private _displayImage: any;
  private _inputImage: any;
  private pendingProcessTimeoutId: number | null = null;
  private readonly WAIT_BEFORE_PROCESSING_MS = 100;

  public setDisplayImage(image: any) {
    this.setDisplayImageWithoutUpdate(image);
    this.updateDisplayImage();
  }
  public setDisplayImageWithoutUpdate(image: any) {
    if (!image) return;
    if (this._displayImage !== undefined) {
      this._displayImage.delete();
    }
    this._displayImage = image;
  }
  public getDisplayImage() {
    return this._displayImage;
  }

  public setInputImage(image: any) {
    if (!image) return;
    if (this._inputImage !== undefined) {
      this._inputImage.delete();
    }
    this._inputImage = image;

    this.onNewInputImage();
    this.scheduleProcessImage();
  }
  public getInputImage() {
    return this._inputImage;
  }

  public setIsCollapsed(isCollapsed: boolean): void {
    if (this.baseEditor) {
      this.baseEditor.setIsCollapsed(isCollapsed);
    }
  }
  public isCollapsed(): boolean {
    return this.baseEditor ? this.baseEditor.isCollapsed : true;
  }

  public setProperty<T>(propertyName: string, value: T): void {
    (this as any)[propertyName] = value;
    this.handlePropertyChanged();
  }

  protected updateDisplayImage(): void {
    this.updateDisplayImageWithoutEvent();
    this.displayImageChanged.emit(this.getDisplayImage());
  }
  protected updateDisplayImageWithoutEvent() {
    if (this.baseEditor) {
      this.baseEditor.setDisplayImage(this.getDisplayImage());
    }
  }

  protected onNewInputImage(): void {}

  protected abstract processImage(): void;

  protected handlePropertyChanged(): void {
    this.scheduleProcessImage();
  }

  protected changePropertyAction<T>(propertyName: string, newValue: T): ReversibleAction<T> {
    return ChangeValueAction.for(this, propertyName, newValue);
  }

  protected scheduleProcessImage(): void {
    if (this.pendingProcessTimeoutId !== null) {
      window.clearTimeout(this.pendingProcessTimeoutId);
    }
    this.baseEditor?.setIsCanvasLoading(true);

    this.pendingProcessTimeoutId = window.setTimeout(() => {
      this.pendingProcessTimeoutId = null;
      if (!this._inputImage) {
        return;
      }
      this.processImage();
    }, this.WAIT_BEFORE_PROCESSING_MS);
  }

  protected emitEditorExpanded(): void {
    this.editorExpanded.emit();
  }
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChangeValueAction, ImageStyleEnum } from '../ts';
import { FormsModule } from '@angular/forms';
import { ImageStyleManager } from '../ts/ViewModel/ImageStyleManager';

@Component({
  selector: 'image-downloader',
  imports: [FormsModule],
  templateUrl: './image-downloader.html',
  styleUrl: './image-downloader.css',
})
export class ImageDownloader {
  rows = 0;
  cols = 0;

  public imageStyleSelected = ImageStyleEnum.BINARY;
  public imageStyle = ImageStyleManager.setActive(this.imageStyleSelected);

  private displayImage: any;

  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

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
    ImageStyleManager.setInputImage(this._inputImage);

    this.applyStyleChanges();
  }
  get inputImage() {
    return this._inputImage;
  }

  onStyleChange(newVal: ImageStyleEnum) {
    this.setProperty('imageStyleSelected', newVal);
  }

  protected setProperty<T>(propertyName: string, newValue: T): void {
    ChangeValueAction.createAndChangeValue(this, propertyName, newValue);
  }

  handleValuesChanged(): void {
    ImageStyleManager.setActive(this.imageStyleSelected);
    this.applyStyleChanges();
  }

  applyStyleChanges() {
    if (!this._inputImage) return;
    console.log(this._inputImage);
    this.displayImage = ImageStyleManager.apply();
    cv.imshow(this.canvasRef.nativeElement, this.displayImage);
  }
  resetRandomSeeds() {
    this.displayImage = ImageStyleManager.resetSeedsAndGetImage();
    cv.imshow(this.canvasRef.nativeElement, this.displayImage);
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.download = this.getSuggestedDownloadName();
    link.click();
    link.remove();
  }

  private getSuggestedDownloadName(): string {
    const date = new Date();
    const localDate = date.toLocaleDateString().replace(/[^0-9]/g, '');
    const localTime = date.toLocaleTimeString().replace(/[^0-9]/g, '');
    return `${this.imageStyleSelected.toLowerCase().replace('_', '-')}-map-${localDate}-${localTime}.png`;
  }
}

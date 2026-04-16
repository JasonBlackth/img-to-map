/*
 * <<licensetext>>
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'image-uploader',
  imports: [NgTemplateOutlet],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {
  protected acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  protected fileName: string = '';
  protected fileUrl: string = '';
  private readonly IMAGE_LOAD_TIMEOUT_MS = 2000;
  private readonly TIMEOUT_WARNING_MESSAGE =
    'Image loading timed out. Your file may be too large or corrupted.';
  private readonly INVALID_FORMAT_WARNING_MESSAGE =
    'Please upload a valid image format (JPEG, JPG or PNG).';
  protected loadTimeoutId: number | undefined = undefined;

  @Output()
  uploadedImage = new EventEmitter<any>();
  protected isWarningVisible: boolean = false;

  protected warningMessage: string = '';

  constructor(private readonly cdr: ChangeDetectorRef) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const input = event.dataTransfer as DataTransfer;
    if (!input || !input.files) {
      return;
    }
    const file = input.files[0];
    if (!this.acceptedImageTypes.includes(file.type)) {
      this.showWarning(this.INVALID_FORMAT_WARNING_MESSAGE);
      return;
    }
    this.handleUploadedFile(file);
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleUploadedFile(input.files[0]);
      input.files = null;
      input.value = '';
    }
  }

  handleUploadedFile(file: File) {
    if (!file) return;
    this.closeWarning();
    this.uploadedImage.emit(null);

    this.fileName = file.name;
    this.fileUrl = URL.createObjectURL(file);
    let img = this.startImageLoading(this.fileUrl);

    if (this.loadTimeoutId) {
      clearTimeout(this.loadTimeoutId);
    }
    this.loadTimeoutId = window.setTimeout(() => {
      this.fileUrl = '';
      this.fileName = '';
      this.showWarning(this.TIMEOUT_WARNING_MESSAGE);
      this.loadTimeoutId = undefined;
      document.body.removeChild(img);
    }, this.IMAGE_LOAD_TIMEOUT_MS);
  }

  isFilePresent(): boolean {
    return this.fileName.length !== 0;
  }

  isImageLoading(): boolean {
    return this.loadTimeoutId !== undefined;
  }

  startImageLoading(url: string): HTMLImageElement {
    let img = new Image();
    img.src = url;
    img.hidden = true;
    img.onload = () => {
      clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = undefined;

      this.uploadedImage.emit(cv.imread(img));
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
    return img;
  }

  closeWarning(): void {
    this.isWarningVisible = false;
    this.cdr.detectChanges();
  }

  showWarning(message: string): void {
    this.warningMessage = message;
    this.isWarningVisible = true;
    this.cdr.detectChanges();
  }
}

// img méret mint "valid-e"
// ne essen ennyire szét pici képernyőn
// túl kicsi/nagy képnél üzenet, vagy ilyesmi
// erre teszteset
// disp flex nagyon hasznos

//kezdjünk el írni

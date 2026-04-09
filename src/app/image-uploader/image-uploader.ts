/*
 * <<licensetext>>
 */

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'image-uploader',
  imports: [],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {
  protected fileName: string = '';
  protected fileUrl: string = '';

  @Output()
  uploadedImage = new EventEmitter<any>();

  private validImageTypes = ['image/jpeg', 'image/png'];
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const input = event.dataTransfer as DataTransfer;
    if (input && input.files) {
      this.handleUploadedFile(input.files[0]);
    }
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleUploadedFile(input.files[0]);
    }
  }

  handleUploadedFile(file: File) {
    if (!file) return;
    if (!this.validImageTypes.includes(file.type)) {
      alert('Please upload a valid image format (JPEG or PNG).');
      return;
    }
    this.fileName = file.name;
    this.fileUrl = URL.createObjectURL(file);
  }

  onImageLoaded(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.width === 0 || img.height === 0) {
      alert('Failed to load possibly corrupted image. Please try again with another file.');
      return;
    }
    let imageCvMat = cv.imread(img);
    this.uploadedImage.emit(imageCvMat);
  }
}

// img méret mint "valid-e"
// ne essen ennyire szét pici képernyőn
// túl kicsi/nagy képnél üzenet, vagy ilyesmi
// erre teszteset
// disp flex nagyon hasznos

//kezdjünk el írni

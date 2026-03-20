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
    throw new Error('Method not implemented.');
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    let file: File;
    if (input.files && (file = input.files[0])) {
      if (!this.validImageTypes.includes(file.type)) {
        input.files = null;
        alert('Please upload a valid image format (JPEG or PNG).');
        return;
      }
      this.fileName = file.name;
      this.fileUrl = URL.createObjectURL(file);
    }
  }

  onImageLoaded(event: Event) {
    console.log((event.target as HTMLImageElement).width, event)
    let imageCvMat = cv.imread(event.target as HTMLImageElement);
    this.uploadedImage.emit(imageCvMat);
  }
}

// img méret mint "valid-e"
// ne essen ennyire szét pici képernyőn
// túl kicsi/nagy képnél üzenet, vagy ilyesmi
// erre teszteset
// disp flex nagyon hasznos

//kezdjünk el írni



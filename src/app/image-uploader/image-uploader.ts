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

    
  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    let file : File;
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
    let imageCvMat = cv.imread(event.target as HTMLImageElement);
    this.uploadedImage.emit(imageCvMat);
    console.log('Image loaded and converted to OpenCV Mat');
  }
}

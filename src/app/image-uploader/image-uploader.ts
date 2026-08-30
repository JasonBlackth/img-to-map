/*
 * <<licensetext>>
 */

import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { AlertTypes } from './AlertTypes';
import { UploadedImageDto } from '../dto/UploadedImageDto';

@Component({
  selector: 'image-uploader',
  imports: [NgTemplateOutlet, TitleCasePipe],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {
  protected acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  protected fileName: string = '';
  protected fileUrl: string = '';
  private readonly IMAGE_LOAD_TIMEOUT_MS = 2000;
  private readonly MAX_IMAGE_SIDELENGTH_PX = 2500;
  private readonly TIMEOUT_WARNING_MESSAGE =
    'Image loading timed out. Your file may be too large or corrupted.';
  private readonly INVALID_FORMAT_WARNING_MESSAGE =
    'Please upload a valid image format (JPEG/JPG or PNG).';
  private readonly SIZE_INFO_MESSAGE = `Image is larger than ${this.MAX_IMAGE_SIDELENGTH_PX}x${this.MAX_IMAGE_SIDELENGTH_PX} pixels and has been converted to a smaller size to prevent performance issues. Output will be scaled back to the original size using interpolation.`;
  protected activeLoadingProcessId: number | undefined = undefined;
  private originalImageSize: CvSize | null = null;

  @Output()
  imageLoadingSuccessful = new EventEmitter<UploadedImageDto>();
  @Output()
  imageLoadingStarted = new EventEmitter<void>();

  protected isAlertVisible: boolean = false;
  protected isInfoVisible: boolean = false;

  protected alertMessage: string = '';
  protected infoMessage: string = '';
  protected isNewUploadWarningVisible: boolean = false;
  protected alertType: AlertTypes = AlertTypes.WARNING;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public isFilePresent(): boolean {
    return this.fileName.length !== 0;
  }

  public isImageLoading(): boolean {
    return this.activeLoadingProcessId !== undefined;
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  protected onFileDrop(event: DragEvent) {
    event.preventDefault();
    const input = event.dataTransfer as DataTransfer;
    if (!input || !input.files) {
      return;
    }
    const file = input.files[0];
    if (!this.acceptedImageTypes.includes(file.type)) {
      this.showAlert(this.INVALID_FORMAT_WARNING_MESSAGE);
      return;
    }
    this.handleUploadedFile(file);
  }

  protected onFileUpload(event: Event) {
    this.hideNewUploadWarning();
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleUploadedFile(input.files[0]);
      input.files = null;
      input.value = '';
    }
  }

  protected showAlert(message: string, type: AlertTypes = AlertTypes.WARNING): void {
    this.alertType = type;
    this.alertMessage = message;
    this.isAlertVisible = true;
    this.cdr.detectChanges();
  }

  protected closeAlert(): void {
    this.isAlertVisible = false;
    this.cdr.detectChanges();
  }

  protected showNewUploadWarning() {
    this.isNewUploadWarningVisible = true;
    this.cdr.detectChanges();
  }
  protected hideNewUploadWarning() {
    this.isNewUploadWarningVisible = false;
    this.cdr.detectChanges();
  }

  protected calculateMaxAllowedSize(cvImage: CvMat): CvSize {
    const maxSide = Math.max(cvImage.cols, cvImage.rows);
    const scale =
      maxSide > this.MAX_IMAGE_SIDELENGTH_PX ? this.MAX_IMAGE_SIDELENGTH_PX / maxSide : 1;
    return new cv.Size(cvImage.cols * scale, cvImage.rows * scale);
  }

  private handleUploadedFile(file: File) {
    if (!file) return;
    this.closeAlert();
    this.imageLoadingStarted.emit();

    this.fileName = file.name;
    this.fileUrl = URL.createObjectURL(file);
    let img = this.startImageLoading(this.fileUrl);

    if (this.activeLoadingProcessId) {
      clearTimeout(this.activeLoadingProcessId);
    }
    this.activeLoadingProcessId = window.setTimeout(() => {
      this.fileUrl = '';
      this.fileName = '';
      this.showAlert(this.TIMEOUT_WARNING_MESSAGE);
      this.activeLoadingProcessId = undefined;
      document.body.removeChild(img);
    }, this.IMAGE_LOAD_TIMEOUT_MS);
  }

  private startImageLoading(url: string): HTMLImageElement {
    let img = new Image();
    img.src = url;
    img.hidden = true;
    img.onload = () => {
      clearTimeout(this.activeLoadingProcessId);
      this.activeLoadingProcessId = undefined;
      let cvImage = cv.imread(img);
      this.originalImageSize = cvImage.size();
      if (img.width > this.MAX_IMAGE_SIDELENGTH_PX || img.height > this.MAX_IMAGE_SIDELENGTH_PX) {
        this.showAlert(this.SIZE_INFO_MESSAGE, AlertTypes.INFO);
        cv.resize(cvImage, cvImage, this.calculateMaxAllowedSize(cvImage), 0, 0, cv.INTER_AREA);
      }

      this.imageLoadingSuccessful.emit(new UploadedImageDto(cvImage));
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
    return img;
  }
}

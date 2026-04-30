import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../AbstractEditor';
import { ImageStyleEnum } from './image-styles/ImageStyleEnum';
import { ReversibleAction } from '../../common/reversible-action/ReversibleAction';
import { ImageStyleManager } from './image-styles/ImageStyleManager';
import { ImageStyle } from './image-styles/ImageStyle';
import { CvUtils } from '../../common/CvUtils';

@Component({
  selector: 'image-downloader',
  imports: [FormsModule, BaseEditorComponent],
  templateUrl: './image-downloader.html',
  styleUrl: './image-downloader.css',
})
export class ImageDownloader extends AbstractEditor {
  public imageStyleSelected = ImageStyleEnum.BINARY;
  private styleManager = new ImageStyleManager(this.imageStyleSelected);

  @Output()
  override editorExpanded = new EventEmitter<void>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;
  downloadFormat: string = 'image/jpeg';

  protected override onNewInputImage(): void {
    this.styleManager.setInputImage(this.inputImage);
  }

  override processImage() {
    let startTime = performance.now();
    this.styleManager.setActive(this.imageStyleSelected);
    this.applyStyleChanges();
    let endTime = performance.now();
    console.log(`Time taken to process image in image-downloader: ${endTime - startTime} ms`);
  }

  applyStyleChanges() {
    if (!this.inputImage) return;
    this.setDisplayImage(this.styleManager.apply());
  }
  resetRandomSeeds() {
    let oldSeed = ImageStyle.getSeed();
    let newSeed = Math.random();
    ReversibleAction.of<{ old: number; new: number }>({
      dataStorage: { old: oldSeed, new: newSeed },
      apply: (dataStorage: { old: number; new: number }) => {
        this.setDisplayImage(this.styleManager.setSeedAndGetImage(dataStorage.new));
      },
      reverse: (dataStorage: { old: number; new: number }) => {
        this.setDisplayImage(this.styleManager.setSeedAndGetImage(dataStorage.old));
      },
    });
  }

  async downloadImage() {
    const link = document.createElement('a');
    const imgToDownload = new cv.Mat();

    try {
      cv.resize(
        this.getDisplayImage(),
        imgToDownload,
        window.ActiveProject.getOriginalImageSize(),
        0,
        0,
        cv.INTER_CUBIC,
      );

      const blob = await this.matToBlob(imgToDownload);

      link.href = URL.createObjectURL(blob);
      link.download = this.getDownloadName();
      link.click();

      URL.revokeObjectURL(link.href);
      link.remove();
    } finally {
      imgToDownload.delete();
    }
  }

  private matToBlob(mat: any): Promise<Blob> {
    const canvas = document.createElement('canvas');
    cv.imshow(canvas, mat);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        canvas.remove();

        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob.'));
        }
      }, this.downloadFormat);
    });
  }

  private getDownloadName(): string {
    const styleName = this.imageStyleSelected.toLowerCase().replace('_', '-');
    const date = new Date();
    const localDate = date.toLocaleDateString().replace(/[^0-9]/g, '');
    const localTime = date.toLocaleTimeString().replace(/[^0-9]/g, '');
    const extension = this.downloadFormat.split('/')[1];
    return `${styleName}-map-${localDate}-${localTime}.${extension}`;
  }

  protected loadNoiseMat($event: Event) {
    const img = $event.target as HTMLImageElement;
    const mat = cv.imread(img);
    const floatMat = CvUtils.convertToFloat(mat);

    if (img.id === 'bigger') {
      ImageStyle.setBiggerNoiseMat(floatMat);
    } else if (img.id === 'smaller') {
      ImageStyle.setSmallerNoiseMat(floatMat);
    }
    img.remove();
    mat.delete();
  }
}

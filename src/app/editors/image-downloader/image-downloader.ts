import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../AbstractEditor';
import { ImageStyleEnum } from './image-styles/ImageStyleEnum';
import { ReversibleAction } from '../../common/reversible-action/ReversibleAction';
import { ImageStyleManager } from './image-styles/ImageStyleManager';
import { ImageStyle } from './image-styles/ImageStyle';
import { SeedsObject } from './image-styles/SeedsObject';

@Component({
  selector: 'image-downloader',
  imports: [FormsModule, BaseEditorComponent],
  templateUrl: './image-downloader.html',
  styleUrl: './image-downloader.css',
})
export class ImageDownloader extends AbstractEditor {
  public imageStyleSelected = ImageStyleEnum.BINARY;
  private styleManager = new ImageStyleManager(this.imageStyleSelected);

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;
  downloadFormat: string = 'image/jpeg';

  override processImage() {
    this.styleManager.setInputImage(this.inputImage);
    this.styleManager.setActive(this.imageStyleSelected);
    this.applyStyleChanges();
  }

  applyStyleChanges() {
    if (!this.inputImage) return;
    this.displayImage = this.styleManager.apply();
  }
  resetRandomSeeds() {
    let oldSeeds = ImageStyle.getStaticSeeds();
    let newSeeds = { seed1: Math.random(), seed2: Math.random() };
    ReversibleAction.of<{ old: SeedsObject; new: SeedsObject }>({
      dataStorage: { old: oldSeeds, new: newSeeds },
      apply: () => {
        this.displayImage = this.styleManager.setSeedsAndGetImage(newSeeds);
      },
      revert: (dataStorage: { old: SeedsObject; new: SeedsObject }) => {
        this.displayImage = this.styleManager.setSeedsAndGetImage(dataStorage.old);
      },
    });
  }

  async downloadImage() {
    const link = document.createElement('a');
    const imgToDownload = new cv.Mat();

    try {
      cv.resize(
        this.displayImage,
        imgToDownload,
        window.ActiveProject.getOriginalImageSize(),
        0,
        0,
        cv.INTER_CUBIC,
      );

      const blob = await this.matToBlob(imgToDownload);

      link.href = URL.createObjectURL(blob);
      link.download = this.getSuggestedDownloadName();
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

  private getSuggestedDownloadName(): string {
    const styleName = this.imageStyleSelected.toLowerCase().replace('_', '-');
    const date = new Date();
    const localDate = date.toLocaleDateString().replace(/[^0-9]/g, '');
    const localTime = date.toLocaleTimeString().replace(/[^0-9]/g, '');
    const extension = this.downloadFormat.split('/')[1];
    return `${styleName}-map-${localDate}-${localTime}.${extension}`;
  }
}

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

  override processImage() {
    this.styleManager.setInputImage(this.inputImage);
    this.styleManager.setActive(this.imageStyleSelected);
    this.applyStyleChanges();
  }

  applyStyleChanges() {
    if (!this.inputImage) return;
    this.baseEditor.setDisplayImage(this.styleManager.apply());
  }
  resetRandomSeeds() {
    let oldSeeds = ImageStyle.getStaticSeeds();
    let newSeeds = { seed1: Math.random(), seed2: Math.random() };
    ReversibleAction.of<{ old: SeedsObject; new: SeedsObject }>({
      dataStorage: { old: oldSeeds, new: newSeeds },
      apply: () => {
        this.baseEditor.setDisplayImage(this.styleManager.setSeedsAndGetImage(newSeeds));
      },
      revert: (dataStorage: { old: SeedsObject; new: SeedsObject }) => {
        this.baseEditor.setDisplayImage(this.styleManager.setSeedsAndGetImage(dataStorage.old));
      },
    });
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.baseEditor.canvasRef.nativeElement.toDataURL();
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

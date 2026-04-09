import { Component, ViewChild } from '@angular/core';
import { ImageStyleEnum } from '../ts';
import { FormsModule } from '@angular/forms';
import { ImageStyleManager } from '../ts/ViewModel/ImageStyleManager';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../ts/Model/AbstractEditor';

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
    this.baseEditor.setDisplayImage(this.styleManager.resetSeedsAndGetImage());
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

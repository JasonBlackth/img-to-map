import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action } from '../ts/Model/Action.js';
import { ImageUploader } from '../image-uploader/image-uploader';
import { ImageDownloader } from '../image-downloader/image-downloader';
import { Editor1 } from '../editor1/editor1';
import { Editor3 } from '../editor3/editor3';
import { Editor2 } from '../editor2/editor2';

@Component({
  selector: 'project',
  imports: [CommonModule, ImageUploader, Editor1, Editor2, Editor3, ImageDownloader],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class Project {
  private actionHistory: Action[] = [];
  private undoneActions: Action[] = [];
  protected displayEditors = false;
  protected testSliderValue = 85;

  @ViewChild(ImageUploader) imageUploader!: ImageUploader;
  @ViewChild(Editor1) editor1!: Editor1;
  @ViewChild(Editor2) editor2!: Editor2;
  @ViewChild(Editor3) editor3!: Editor3;
  @ViewChild(ImageDownloader) imageDownloader!: ImageDownloader;

  constructor() {
    (window as any).ActiveProject = this;
  }

  @HostListener('window:keydown', ['$event'])
  keyboardEventHandler(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'y') {
        event.preventDefault();
        this.redo();
        console.log('Redo triggered');
      }
      if (event.key === 'z') {
        event.preventDefault();
        this.undo();
        console.log('Undo triggered');
      }
    }
  }

  onImageUploaded(image: any): void {
    this.editor1.inputImage = image;
    this.displayEditors = true;
  }

  onEditor1ImageChanged(image: any): void {
    this.editor2.inputImage = image;
  }

  onEditor2ImageChanged(image: any) {
    const gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY);
    this.editor3.inputImage = gray;
    gray.delete();
  }
  onEditor3ImageChanged(image: any) {
    this.imageDownloader.inputImage = image;
  }

  undo(): void {
    const action = this.actionHistory.pop();
    if (action) {
      action.revert();
      this.undoneActions.push(action);
      console.log('Action undone. Current history length: ' + this.actionHistory.length);
    }
  }

  redo(): void {
    const action = this.undoneActions.pop();
    if (action) {
      action.apply();
      this.actionHistory.push(action);
      console.log('Action redone. Current history length: ' + this.actionHistory.length);
    }
  }

  registerAction(action: Action): void {
    this.actionHistory.push(action);
    this.undoneActions = [];
  }
}

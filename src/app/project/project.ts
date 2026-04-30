import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploader } from '../image-uploader/image-uploader';
import { ImageDownloader } from '../editors/image-downloader/image-downloader.js';
import { Editor1 } from '../editors/editor1/editor1.js';
import { Editor3 } from '../editors/editor3/editor3.js';
import { Editor2 } from '../editors/editor2/editor2.js';
import { AbstractEditor } from '../editors/AbstractEditor.js';
import { ReversibleAction } from '../common/reversible-action/ReversibleAction';

@Component({
  selector: 'project',
  imports: [CommonModule, ImageUploader, Editor1, Editor2, Editor3, ImageDownloader],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
})
export class Project {
  private actionHistory: ReversibleAction<any>[] = [];
  private undoneActions: ReversibleAction<any>[] = [];
  protected displayEditors = false;

  @ViewChild(ImageUploader) imageUploader!: ImageUploader;
  @ViewChild(Editor1) editor1!: Editor1;
  @ViewChild(Editor2) editor2!: Editor2;
  @ViewChild(Editor3) editor3!: Editor3;
  @ViewChild(ImageDownloader) imageDownloader!: ImageDownloader;

  constructor() {
    (window as any).ActiveProject = this;
  }

  public undo(): void {
    const action = this.actionHistory.pop();
    if (action) {
      action.reverse();
      this.undoneActions.push(action);
    }
  }

  public redo(): void {
    const action = this.undoneActions.pop();
    if (action) {
      action.apply();
      this.actionHistory.push(action);
    }
  }

  public registerAction(action: ReversibleAction<any>): void {
    this.actionHistory.push(action);
    this.undoneActions = [];
  }

  public getOriginalImageSize() {
    return this.imageUploader.getOriginalImageSize();
  }

  @HostListener('window:keydown', ['$event'])
  protected keyboardEventHandler(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'y') {
        event.preventDefault();
        this.redo();
      }
      if (event.key === 'z') {
        event.preventDefault();
        this.undo();
      }
    }
  }

  protected onImageUploaded(image: any): void {
    if (!image) {
      this.displayEditors = false;
      return;
    }
    this.actionHistory = [];
    this.undoneActions = [];
    this.displayEditors = true;
    this.editor1.inputImage = image;

    this.getEditors().forEach((editor, index) => editor.setIsCollapsed(index > 0));
  }

  protected propagateImageChangeFrom(editorIndex: number): void {
    if (this.isAnyEditorExpandedAfter(editorIndex)) {
      const currentEditor = this.getEditors()[editorIndex];
      const nextEditor = this.getEditors()[editorIndex + 1];
      nextEditor.inputImage = currentEditor.getDisplayImage().clone();
    }
  }

  protected onEditorExpanded(expandedEditorIndex: number): void {
    if (!this.isAnyEditorExpandedAfter(expandedEditorIndex)) {
      const lastExpandedEditorIndex = this.getEditors().findLastIndex(
        (editor, index) => index < expandedEditorIndex && !editor.isCollapsed(),
      );
      if (lastExpandedEditorIndex !== -1) {
        this.propagateImageChangeFrom(lastExpandedEditorIndex);
      } else {
        this.propagateImageChangeFrom(0);
      }
    }
  }

  private isAnyEditorExpandedAfter(editorIndex: number): boolean {
    return this.getEditors().some((editor, index) => index > editorIndex && !editor.isCollapsed());
  }

  private getEditors(): AbstractEditor[] {
    return [this.editor1, this.editor2, this.editor3, this.imageDownloader];
  }
}

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../AbstractEditor';
import { Colors } from '../../common/Colors';
import { ReversibleAction } from '../../common/reversible-action/ReversibleAction';
import { Slider } from '../../slider/slider';
import { CvUtils } from '../../common/CvUtils';

@Component({
  selector: 'editor2',
  imports: [BaseEditorComponent, Slider],
  templateUrl: './editor2.html',
  styleUrls: ['./editor2.css'],
})
export class Editor2 extends AbstractEditor {
  protected minContourArea: number = 1500;
  private contours: any;
  private contourMap: any;
  private selectedContours: Set<number> = new Set();
  private readonly CONTOUR_CLICK_RADIUS = 9;

  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @Output()
  override editorExpanded = new EventEmitter<void>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage(): void {
    this.createContourImage();
    this.createContourMap();
    this.updateDisplayImage();
  }

  protected handleCanvasClick(event: PointerEvent) {
    const ctrlHeld = event.ctrlKey || event.metaKey || event.shiftKey;

    const rect = this.baseEditor.canvasRef.nativeElement.getBoundingClientRect();
    let clickX = (event.clientX - rect.left) * (this.getInputImage().cols / rect.width);
    let clickY = (event.clientY - rect.top) * (this.getInputImage().rows / rect.height);
    clickX = Math.round(clickX);
    clickY = Math.round(clickY);

    const selectedIndex = this.getClickedContour(clickX, clickY);
    if (selectedIndex !== -1) {
      if (!ctrlHeld) {
        this.dropSelection();
      }
      if (this.selectedContours.has(selectedIndex)) {
        this.selectedContours.delete(selectedIndex);
        this.redrawContours([selectedIndex], Colors.WHITE);
      } else {
        this.selectedContours.add(selectedIndex);
        this.redrawContoursWithoutEvent([selectedIndex], Colors.RED);
      }
    }
  }
  protected handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteSelectedContours();
    }
    if (event.key === 'Escape') {
      this.dropSelection();
    }
    if (event.key === 'Enter') {
      this.keepSelectedOnly();
    }
  }

  protected deleteSelectedContours(): ReversibleAction<deleteContourDataStorage> {
    const deletedIndices = Array.from(this.selectedContours);
    const deletedContours = deletedIndices.map((i) => this.contours.get(i).clone());

    return ReversibleAction.of({
      dataStorage: { editor: this, deletedIndices, deletedContours } as deleteContourDataStorage,
      apply: (ds: deleteContourDataStorage) => {
        ds.editor.deleteContoursAtIndices(ds.deletedIndices);
      },
      reverse: (ds: deleteContourDataStorage) => {
        ds.deletedIndices.forEach((originalIndex: number, index: number) => {
          ds.editor.contours.set(originalIndex, ds.deletedContours[index]);
        });
        ds.editor.redrawContours(ds.deletedIndices, Colors.WHITE);
      },
    });
  }

  protected keepSelectedOnly(): ReversibleAction<any> {
    const inverseOfSelection = Array.from(Array(this.contours.size()).keys()).filter(
      (index) => !this.selectedContours.has(index) && this.isAboveMinContourArea(index),
    );
    this.dropSelection();
    this.selectedContours = new Set(inverseOfSelection);

    return this.deleteSelectedContours();
  }

  protected dropSelection(): void {
    this.redrawContours(Array.from(this.selectedContours), Colors.WHITE);
    this.selectedContours.clear();
  }

  private createContourImage(): void {
    this.selectedContours.clear();

    this.contours = CvUtils.findContours(this.getInputImage());

    this.setDisplayImageWithoutUpdate(
      cv.Mat.zeros(this.getInputImage().rows, this.getInputImage().cols, cv.CV_8UC3),
    );
    this.drawContoursAboveMinArea(this.getDisplayImage(), () => Colors.WHITE);
  }

  private createContourMap() {
    this.contourMap = cv.Mat.zeros(
      this.getInputImage().rows,
      this.getInputImage().cols,
      cv.CV_16UC1,
    );
    this.drawContoursAboveMinArea(this.contourMap, (index: number) => new cv.Scalar(index + 1));
  }

  private getClickedContour(clickX: number, clickY: number): number {
    const indexAtClick = this.contourMap.data16U[clickY * this.contourMap.cols + clickX] - 1;
    if (indexAtClick !== -1) {
      return indexAtClick;
    } else {
      return this.findContourClosestToClick(clickX, clickY);
    }
  }

  private findContourClosestToClick(clickX: number, clickY: number): number {
    const r = this.CONTOUR_CLICK_RADIUS;
    const r2 = r * r;
    let closestSoFar: { contour_idx: number; sqDist: number } | null = null;

    for (let x = Math.max(clickX - r, 0); x < Math.min(clickX + r, this.contourMap.cols); ++x) {
      for (let y = Math.max(clickY - r, 0); y < Math.min(clickY + r, this.contourMap.rows); ++y) {
        const sqDist = (x - clickX) ** 2 + (y - clickY) ** 2;
        const index = this.contourMap.data16U[y * this.contourMap.cols + x] - 1;
        if (sqDist <= r2 && index !== -1) {
          if (!closestSoFar || closestSoFar.sqDist > sqDist) {
            closestSoFar = { contour_idx: index, sqDist: sqDist };
          }
        }
      }
    }
    if (closestSoFar) return closestSoFar.contour_idx;
    return -1;
  }

  private deleteContoursAtIndices(indices: number[]): void {
    if (!indices) return;
    this.redrawContours(indices, Colors.BLACK);
    for (const index of indices) {
      const contourToDelete = this.contours.get(index).clone();
      const dummyReplacement = new cv.Mat(contourToDelete.rows, 1, cv.CV_32SC2, new cv.Scalar(-1));
      this.contours.set(index, dummyReplacement);
    }
  }

  private redrawContours(inds: number[], color: any): void {
    for (const ind of inds) {
      cv.drawContours(this.getDisplayImage(), this.contours, ind, color, cv.FILLED);
    }
    this.updateDisplayImage();
  }
  private redrawContoursWithoutEvent(inds: number[], color: any): void {
    for (const ind of inds) {
      cv.drawContours(this.getDisplayImage(), this.contours, ind, color, cv.FILLED);
    }
    this.updateDisplayImageWithoutEvent();
  }

  private drawContoursAboveMinArea(image: any, colorFunction: (index: number) => any): void {
    for (let i = 0; i < this.contours.size(); ++i) {
      if (this.isAboveMinContourArea(i)) {
        cv.drawContours(image, this.contours, i, colorFunction(i), cv.FILLED);
      }
    }
  }

  private isAboveMinContourArea(index: number): boolean {
    return cv.contourArea(this.contours.get(index)) > this.minContourArea;
  }
}

interface deleteContourDataStorage {
  editor: Editor2;
  deletedIndices: number[];
  deletedContours: any[];
}

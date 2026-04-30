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
  public contours: any;
  protected minContourArea: number = 1500;
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
    let startTime = performance.now();
    this.createContourImage();
    this.createContourMap();
    this.updateDisplayImage();
    let endTime = performance.now();
  }

  handleCanvasClick(event: PointerEvent) {
    const ctrlHeld = event.ctrlKey || event.metaKey || event.shiftKey;

    const rect = this.baseEditor.canvasRef.nativeElement.getBoundingClientRect();
    let clickX = (event.clientX - rect.left) * (this.inputImage.cols / rect.width);
    let clickY = (event.clientY - rect.top) * (this.inputImage.rows / rect.height);
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
  handleKeydown(event: KeyboardEvent) {
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

  deleteSelectedContours(): ReversibleAction<deleteContourDataStorage> {
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

  createContourImage(): void {
    this.selectedContours.clear();
    let startTime = performance.now();
    this.contours = CvUtils.findContours(this.inputImage);
    let endTime = performance.now();

    startTime = performance.now();
    this.setDisplayImageWithoutUpdate(
      cv.Mat.zeros(this.inputImage.rows, this.inputImage.cols, cv.CV_8UC3),
    );
    this.drawContoursAboveMinArea(this.getDisplayImage(), () => Colors.WHITE);
    endTime = performance.now();
  }

  getClickedContour(clickX: number, clickY: number): number {
    const indexAtClick = this.contourMap.data16U[clickY * this.contourMap.cols + clickX] - 1;
    if (indexAtClick !== -1) {
      return indexAtClick;
    } else {
      return this.findContourClosestToClick(clickX, clickY);
    }
  }
  findContourClosestToClick(clickX: number, clickY: number): number {
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

  createContourMap() {
    this.contourMap = cv.Mat.zeros(this.inputImage.rows, this.inputImage.cols, cv.CV_16UC1);
    this.drawContoursAboveMinArea(this.contourMap, (index: number) => new cv.Scalar(index + 1));
  }

  deleteContoursAtIndices(indices: number[]): void {
    if (!indices) return;
    this.redrawContours(indices, Colors.BLACK);
    for (const index of indices) {
      const contourToDelete = this.contours.get(index).clone();
      const dummyReplacement = new cv.Mat(contourToDelete.rows, 1, cv.CV_32SC2, new cv.Scalar(-1));
      this.contours.set(index, dummyReplacement);
    }
  }

  redrawContours(inds: number[], colour: any): void {
    for (const ind of inds) {
      cv.drawContours(this.getDisplayImage(), this.contours, ind, colour, cv.FILLED);
    }
    this.updateDisplayImage();
  }
  redrawContoursWithoutEvent(inds: number[], colour: any): void {
    for (const ind of inds) {
      cv.drawContours(this.getDisplayImage(), this.contours, ind, colour, cv.FILLED);
    }
    this.updateDisplayImageWithoutEvent();
  }

  drawContoursAboveMinArea(image: any, colourFunction: (index: number) => any): void {
    for (let i = 0; i < this.contours.size(); ++i) {
      if (cv.contourArea(this.contours.get(i)) > this.minContourArea) {
        cv.drawContours(image, this.contours, i, colourFunction(i), cv.FILLED);
      }
    }
  }

  keepSelectedOnly(): ReversibleAction<any> {
    const inverseOfSelection = Array.from(Array(this.contours.size()).keys()).filter(
      (index) => !this.selectedContours.has(index),
    );
    this.dropSelection();
    this.selectedContours = new Set(inverseOfSelection);

    return this.deleteSelectedContours();
  }

  dropSelection(): void {
    this.redrawContours(Array.from(this.selectedContours), Colors.WHITE);
    this.selectedContours.clear();
  }
}

interface deleteContourDataStorage {
  editor: Editor2;
  deletedIndices: number[];
  deletedContours: any[];
}

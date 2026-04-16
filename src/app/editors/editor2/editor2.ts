import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../AbstractEditor';
import { Colors } from '../../common/Colors';
import { EventPolicy } from '../../common/EventPolicy';
import { ReversibleAction } from '../../common/reversible-action/ReversibleAction';

@Component({
  selector: 'editor2',
  imports: [BaseEditorComponent],
  templateUrl: './editor2.html',
  styleUrl: './editor2.css',
})
export class Editor2 extends AbstractEditor {
  public contours: any;
  private contourMap: any;
  private selectedContours: Set<number> = new Set();

  private readonly ALL_CONTOURS = [-1];

  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  override processImage(): void {
    this.createContourImage();
  }

  handleCanvasClick(event: PointerEvent) {
    const ctrlHeld = event.ctrlKey || event.metaKey || event.shiftKey;

    const rect = this.baseEditor.canvasRef.nativeElement.getBoundingClientRect();
    const clickX = (event.clientX - rect.left) * (this.inputImage.cols / rect.width);
    const clickY = (event.clientY - rect.top) * (this.inputImage.rows / rect.height);

    const selectedIndex = this.findContourClosestTo(clickX, clickY);
    if (selectedIndex !== -1) {
      if (!ctrlHeld) {
        this.dropSelection();
      }
      if (this.selectedContours.has(selectedIndex)) {
        this.selectedContours.delete(selectedIndex);
        this.reDrawContours([selectedIndex], Colors.WHITE);
      } else {
        this.selectedContours.add(selectedIndex);
        this.reDrawContours([selectedIndex], Colors.RED, EventPolicy.SUPPRESS_EVENT);
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
      revert: (ds: deleteContourDataStorage) => {
        ds.deletedIndices.forEach((originalIndex: number, index: number) => {
          ds.editor.contours.set(originalIndex, ds.deletedContours[index]);
        });
        ds.editor.reDrawContours(ds.deletedIndices, Colors.WHITE);
      },
    });
  }

  createContourImage(): void {
    this.selectedContours.clear();

    this.contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      this.inputImage,
      this.contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_NONE,
    );
    hierarchy.delete();

    this.displayImage = cv.Mat.zeros(this.inputImage.rows, this.inputImage.cols, cv.CV_8UC3);
    this.reDrawContours(this.ALL_CONTOURS, Colors.WHITE);

    this.createContourMap();
  }

  findContourClosestTo(clickX: number, clickY: number): number {
    clickX = Math.round(clickX);
    clickY = Math.round(clickY);
    const r = 9;
    const r2 = r * r;
    let closest: { contour_idx: number; sqDist: number } | null = null;
    const valAtClick = this.contourMap.data16U[clickY * this.contourMap.cols + clickX] - 1;
    if (valAtClick !== -1) {
      return valAtClick;
    } else {
      for (let x = Math.max(clickX - r, 0); x < Math.min(clickX + r, this.contourMap.cols); ++x) {
        for (let y = Math.max(clickY - r, 0); y < Math.min(clickY + r, this.contourMap.rows); ++y) {
          const sqDist = (x - clickX) ** 2 + (y - clickY) ** 2;
          const val = this.contourMap.data16U[y * this.contourMap.cols + x] - 1;
          if (sqDist <= r2 && val !== -1) {
            if (!closest || closest.sqDist > sqDist) {
              closest = { contour_idx: val, sqDist: sqDist };
            }
          }
        }
      }
    }
    if (closest) return closest.contour_idx;
    return -1;
  }

  createContourMap() {
    this.contourMap = cv.Mat.zeros(this.inputImage.rows, this.inputImage.cols, cv.CV_16UC1);
    for (let i = 0; i < this.contours.size(); ++i) {
      cv.drawContours(this.contourMap, this.contours, i, new cv.Scalar(i + 1), cv.FILLED);
    }
  }

  deleteContoursAtIndices(indices: number[]): void {
    if (!indices) return;
    this.reDrawContours(indices, Colors.BLACK);
    for (const index of indices) {
      const contourToDelete = this.contours.get(index).clone();
      const dummyReplacement = new cv.Mat(contourToDelete.rows, 1, cv.CV_32SC2, new cv.Scalar(-1));
      this.contours.set(index, dummyReplacement);
    }
  }

  reDrawContours(inds: number[], colour: any, eventPolicy = EventPolicy.EMIT_EVENT): void {
    for (const ind of inds) {
      cv.drawContours(this.displayImage, this.contours, ind, colour, cv.FILLED);
    }
    this.updateDisplayImage(eventPolicy);
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
    this.reDrawContours(Array.from(this.selectedContours), Colors.WHITE);
    this.selectedContours.clear();
  }
}

interface deleteContourDataStorage {
  editor: Editor2;
  deletedIndices: number[];
  deletedContours: any[];
}

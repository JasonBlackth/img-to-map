import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { BaseEditorComponent } from '../base-editor-component/base-editor-component';
import { AbstractEditor } from '../AbstractEditor';

@Component({
  selector: 'app-divergence-calculator',
  imports: [BaseEditorComponent],
  templateUrl: './divergence-calculator.html',
  styleUrls: ['./divergence-calculator.css'],
})
export class DivergenceCalculator extends AbstractEditor {
  @Output()
  override displayImageChanged = new EventEmitter<any>();

  @Output()
  override editorExpanded = new EventEmitter<void>();

  @ViewChild(BaseEditorComponent)
  override baseEditor: BaseEditorComponent = undefined as any;

  @ViewChild('heightMap')
  heightMap: HTMLImageElement = undefined as any;

  public override resetPropertiesToDefault(): void {}

  override processImage(): void {
    const vectorField = this.generateVectorFieldOf(this.getInputImage());
    const divergenceImage = cv.Mat.zeros(vectorField.rows, vectorField.cols, cv.CV_8UC1);
  }

  private generateVectorFieldOf(image: any): any {
    const vectorField = cv.Mat.zeros(image.rows, image.cols, cv.CV_8SC2);
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        let currentPoint = HeightMapPoint.of(x, y, image);
        const lowestNeighbour = this.findALowestNeighbour(x, y, image);

        if (lowestNeighbour.height > currentPoint.height) {
          vectorField.ucharPtr(y, x)[0] = 0;
          vectorField.ucharPtr(y, x)[1] = 0;
        } else {
          const vectorXtoNeighbour = lowestNeighbour.x - currentPoint.x;
          const vectorYtoNeighbour = lowestNeighbour.y - currentPoint.y;
          vectorField.ucharPtr(y, x)[0] = vectorXtoNeighbour;
          vectorField.ucharPtr(y, x)[1] = vectorYtoNeighbour;
        }
      }
    }
    return vectorField;
  }

  private getNeighboursInImage(x: number, y: number, image: any): Array<{ x: number; y: number }> {
    const neighbours: Array<{ x: number; y: number }> = [];
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        if (i === 0 && j === 0) continue;
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && nx < image.width && ny >= 0 && ny < image.height) {
          neighbours.push({ x: nx, y: ny });
        }
      }
    }
    return neighbours;
  }

  private findALowestNeighbour(x: number, y: number, image: any): HeightMapPoint {
    const neighboursSorted = this.getNeighboursInImage(x, y, image)
      .map((neighbour) => HeightMapPoint.of(neighbour.x, neighbour.y, image))
      .sort((a, b) => a.height - b.height);
    const oneLowestNeighbour = neighboursSorted[0];

    const allLowestNeighbours = neighboursSorted.filter((neighbour) =>
      neighbour.isSameHeightAs(oneLowestNeighbour),
    );

    const randomLowestNeighbour =
      allLowestNeighbours[Math.floor(Math.random() * allLowestNeighbours.length)];

    return randomLowestNeighbour;
  }
}

class HeightMapPoint {
  x: number;
  y: number;
  height: number;

  constructor(x: number, y: number, height: number) {
    this.x = x;
    this.y = y;
    this.height = height;
  }

  static of(x: number, y: number, image: any): HeightMapPoint {
    const height = image.ucharPtr(y, x)[0];
    return new HeightMapPoint(x, y, height);
  }

  isSameHeightAs(other: HeightMapPoint): boolean {
    return this.height === other.height;
  }
}

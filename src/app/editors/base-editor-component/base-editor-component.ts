/*
 * <<licensetext>>
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import panzoom, { Transform, PanZoom } from 'panzoom';

@Component({
  selector: 'base-editor-component',
  imports: [],
  templateUrl: './base-editor-component.html',
  styleUrls: ['./base-editor-component.css'],
})
export class BaseEditorComponent {
  protected panzoomInstance!: PanZoom;
  static globalPanzoomInstances: PanZoom[] = new Array();
  static isChangingTransforms: boolean = false;
  static globalTransform: Transform = { x: 0, y: 0, scale: 1 };

  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('collapseToggle')
  collapseToggleRef!: ElementRef<HTMLAnchorElement>;

  @Input()
  headingText: string = 'Untitled Editor';
  @Input()
  editorId: string = 'noIdEditor';

  @Output()
  displayImageChanged = new EventEmitter<any>();
  @Output()
  canvasClick = new EventEmitter<PointerEvent>();
  @Output()
  myKeydown = new EventEmitter<KeyboardEvent>();

  isCollapsed: boolean = true;

  public setDisplayImage(image: any) {
    if (!image) return;
    if (!this.panzoomInstance) {
      this.createPanzoomInstance();
    }
    cv.imshow(this.canvasRef.nativeElement, image);
  }

  public setIsCollapsed(isCollapsed: boolean): void {
    if (isCollapsed !== this.isCollapsed) {
      this.collapseToggleRef.nativeElement.click();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyboardEventHandler(event: KeyboardEvent) {
    if (!this.panzoomInstance) return;
    if (event.key === 'Alt') {
      this.panzoomInstance.resume();
    } else if (event.key === 'r') {
      this.resetGlobalTransform();
    } else if (this.panzoomInstance.isPaused()) {
      this.myKeydown.emit(event);
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyboardEventKeyUpHandler(event: KeyboardEvent) {
    if (!this.panzoomInstance) return;
    if (event.key === 'Alt') {
      this.panzoomInstance.pause();
    }
  }

  handleCanvasClick(event: PointerEvent) {
    if (this.panzoomInstance.isPaused()) {
      this.canvasClick.emit(event);
    }
  }

  protected onCollapsePressed() {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      BaseEditorComponent.setGlobalPanzoomTransform(BaseEditorComponent.globalTransform);
    }
  }
  static setGlobalPanzoomTransform(t: Transform): void {
    if (!BaseEditorComponent.isChangingTransforms) {
      BaseEditorComponent.isChangingTransforms = true;
      BaseEditorComponent.globalTransform = t;
      this.globalPanzoomInstances.forEach((p) => {
        p.zoomAbs(0, 0, t.scale);
        p.moveTo(t.x, t.y);
      });
      BaseEditorComponent.isChangingTransforms = false;
    }
  }
  resetGlobalTransform() {
    BaseEditorComponent.setGlobalPanzoomTransform({ x: 0, y: 0, scale: 1 });
  }

  private createPanzoomInstance() {
    const panzoomOptions = {
      maxZoom: 2,
      minZoom: 0.8,
      bounds: true,
    };
    this.panzoomInstance = panzoom(this.canvasRef.nativeElement, panzoomOptions);
    this.panzoomInstance.pause();
    this.panzoomInstance.on('pan', (p: PanZoom) => {
      BaseEditorComponent.setGlobalPanzoomTransform(p.getTransform());
    });
    this.panzoomInstance.on('zoom', (p: PanZoom) => {
      BaseEditorComponent.setGlobalPanzoomTransform(p.getTransform());
    });
    BaseEditorComponent.globalPanzoomInstances.push(this.panzoomInstance);
  }
}

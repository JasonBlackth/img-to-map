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

  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

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
      const panzoomOptions = {
        maxZoom: 2,
        minZoom: 0.8,
        bounds: true,
      };
      this.panzoomInstance = panzoom(this.canvasRef.nativeElement, panzoomOptions);
      this.panzoomInstance.pause();
      BaseEditorComponent.startListeningTo(this.panzoomInstance);
      BaseEditorComponent.globalPanzoomInstances.push(this.panzoomInstance);
    }
    cv.imshow(this.canvasRef.nativeElement, image);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardEventHandler(event: KeyboardEvent) {
    if (!this.panzoomInstance) return;
    if (event.key === 'Alt') {
      this.panzoomInstance.resume();
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

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  static setGlobalPanzoomTransform(t: Transform): void{
    this.globalPanzoomInstances.forEach(p => {
      BaseEditorComponent.stopListeningTo(p);
      p.zoomTo(t.x, t.x, t.scale);
      BaseEditorComponent.startListeningTo(p);
    });
    console.log('doin shit')
  }
  static stopListeningTo(p: PanZoom): void{
    p.on('transform', function (e){
      return;
    });
  }
  static startListeningTo(p: PanZoom): void{
    p.on('transform', function (panZoom: PanZoom){
      console.log("I'm listening");
      BaseEditorComponent.setGlobalPanzoomTransform(panZoom.getTransform());  
    })
  }
}

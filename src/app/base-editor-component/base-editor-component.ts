import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import panzoom from 'panzoom';

@Component({
  selector: 'base-editor-component',
  imports: [],
  templateUrl: './base-editor-component.html',
  styleUrls: ['./base-editor-component.css'],
})
export class BaseEditorComponent {
  protected panzoomInstance: any;

  @ViewChild('editorCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input()
  headingText: string = 'Untitled Editor';
  @Input()
  id: string = 'noIdEditor';

  @Output()
  displayImageChanged = new EventEmitter<any>();
  @Output()
  canvasClick = new EventEmitter<PointerEvent>();
  @Output()
  myKeydown = new EventEmitter<KeyboardEvent>();

  isCollapsed: boolean = true;

  public setDisplayImage(image: any) {
    if (!image) return;
    if (this.panzoomInstance) {
      this.panzoomInstance.dispose();
    }

    this.panzoomInstance = panzoom(this.canvasRef.nativeElement, {
      maxZoom: 2,
      minZoom: 0.8,
      bounds: true,
    });
    this.panzoomInstance.pause();
    cv.imshow(this.canvasRef.nativeElement, image);
    console.log('BaseEditorComponent: displayImage set');
  }

  @HostListener('window:keydown', ['$event'])
  keyboardEventHandler(event: KeyboardEvent) {
    if (this.canvasRef.nativeElement === document.activeElement) {
      if (event.key === 'Alt') {
        this.panzoomInstance.resume();
      } else if (this.panzoomInstance.isPaused()) {
        this.myKeydown.emit(event);
      }
    }
  }
  @HostListener('window:keyup', ['$event'])
  keyboardEventKeyUpHandler(event: KeyboardEvent) {
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
}

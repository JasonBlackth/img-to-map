import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() id?: string;


  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();


//  set value(newValue: number) {
//     this.actualValue = newValue;
//     this.previewValue = newValue;
//   }

//   get value(): number {
//     return this.actualValue;
//   }

  protected actualValue: number = 0;
  protected previewValue: number = 0;

  onInput(newValue: string) {
    this.previewValue = parseFloat(newValue);
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.html'
})
export class Slider {
  static count: number = 0;

  @Input() min = 0;
  @Input() max = 255;
  @Input() step = 1;
  @Input() id = `unnamedSlider${Slider.count++}`;

  private actualValue: number = 0;
  protected previewValue: number = this.actualValue;

  @Input()
  set value(v: number) {
    this.actualValue = v;
    this.previewValue = v;
  }
  get value(): number {
    return this.actualValue;
  }
  @Output() valueChange = new EventEmitter<number>();

  onInput(newValue: string) {
    this.previewValue = parseFloat(newValue);
  }

  onChange() {
    this.actualValue = this.previewValue;
    this.valueChange.emit(this.actualValue);
  }

}

import { Component, Input, ViewEncapsulation, ElementRef, Renderer } from '@angular/core';
import { Ion } from '../ion';
import { Config } from '../../config/config';
export type progressIndicator = 'determinate' | 'indeterminate' | 'buffer' | 'query';

@Component({
  selector: 'ion-progress',
  template : `
    <div class="progress" [style.width.%]="value"></div>
    <div class="animatable"></div>
    <div class="buffer-circles"></div>
    <div class="buffer" [style.width.%]="buffer"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'indicator'
  }
})
export class Progress extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'progress');
   }

  /**
   * @input {'determinate' | 'indeterminate' | 'buffer' | 'query'} The current mode of the progress indicator
   */
  @Input()
  indicator: progressIndicator = 'determinate';
  /**
   * @input {number} The value of the progress indicator, as a percentage (out of 100)
   */
  @Input() value: number = 0;

  /**
   * @input {number} The current buffer value of the progress indicator
   */
  @Input() buffer: number = 100;

}

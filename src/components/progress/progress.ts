import { Component, Input, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'ion-progress',
  templateUrl : './progress.html',
  encapsulation: ViewEncapsulation.None
})
export class Progress {

  constructor( ) { }

  /**
   * @input {'determinate' | 'indeterminate' | 'buffer' | 'query'} The current mode of the progress indicator
   */
  @Input()
  @HostBinding('class')
  indicator: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'determinate';
  /**
   * @input {number} The value of the progress indicator, as a percentage (out of 100)
   */
  @Input() value: number = 0;

  /**
   * @input {number} The current buffer value of the progress indicator
   */
  @Input() buffer: number = 100;

}

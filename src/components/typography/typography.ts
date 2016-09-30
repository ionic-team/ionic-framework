import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @private
  * Select all of the HTML text elements with the color attribute to apply the text-color class.
 */
@Directive({
  selector: 'h1[color], h2[color], h3[color], h4[color], h5[color], h6[color], a[color]:not([ion-button]), p[color], span[color], b[color], i[color], strong[color], em[color], small[color], sub[color], sup[color]'
})
export class Typography extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('text', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('text', val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
  }

}

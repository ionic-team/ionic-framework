import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @private
  */
@Directive({
  selector: 'ion-card'
})
export class Card extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('card', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('card', val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-card-content'
})
export class CardContent {}


/**
 * @private
 */
@Directive({
  selector: 'ion-card-header'
})
export class CardHeader {}

/**
 * @private
 */
@Directive({
  selector: 'ion-card-title'
})
export class CardTitle {}

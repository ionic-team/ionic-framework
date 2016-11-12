import { Attribute, Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';

/**
 * @private
 */
@Directive({
  selector: 'ion-list-header'
})
export class ListHeader extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, renderer: Renderer, elementRef: ElementRef, @Attribute('id') private _id: string) {
    super(config, elementRef, renderer, 'list-header');
  }

  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
    this.setElementAttribute('id', val);
  }
}

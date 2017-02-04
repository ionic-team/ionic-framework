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
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/v2/theming/theming-your-app).
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"`, `"md"`, or `"wp"`.
   * For more information, see [Platform Styles](/docs/v2/theming/platform-specific-styles).
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

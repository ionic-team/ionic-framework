import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';

/**
 * @hidden
 */
@Directive({
  selector: 'ion-item-divider',
  host: {
    'class': 'item-divider'
  }
})
export class ItemDivider extends Ion {

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

  constructor(form: Form, config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'item-divider');
  }
}

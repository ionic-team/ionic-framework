import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @name Badge
  * @module ionic
  * @description
  * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
  * @see {@link /docs/v2/components/#badges Badges Component Docs}
 */
@Directive({
  selector: 'ion-badge'
})
export class Badge extends Ion {

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

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'badge');
  }

}

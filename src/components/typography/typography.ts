import { Attribute, Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @private TODO remove this line when we remove the other selectors in order to document it
  * @name Typography
  * @module ionic
  * @description
  *
  * The Typography component is a simple component that can be used to style the text color of any element.
  * The `ion-text` attribute should be added to the element in order to pass a color from the Sass `$colors`
  * map and change the text color of that element.
  *
  * @usage
  *
  * ```html
  * <h1 ion-text color="secondary">The quick brown fox jumps over the lazy dog</h1>
  *
  * <h2 ion-text [color]="dynamicColor">The quick brown fox jumps over the lazy dog</h6>
  *
  * <p>
  *   The <i ion-text color="primary">quick</i> brown fox jumps over the lazy 
  *   <a ion-text color="secondary">dog</a>
  * </p>
  * ```
 */
@Directive({
  selector: 'h1[color], h2[color], h3[color], h4[color], h5[color], h6[color], a[color]:not([ion-button]):not([ion-item]):not([ion-fab]), p[color], span[color], b[color], i[color], strong[color], em[color], small[color], sub[color], sup[color], [ion-text]'
})
export class Typography extends Ion {

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

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Attribute('ion-text') ionText: string) {
    super(config, elementRef, renderer, 'text');

    // TODO: Deprecated: all selectors besides `[ion-text]` rc.3
    // Remove all other selectors and the `ionText` attribute
    if (ionText === null) {
      console.warn('Deprecated: The color input has been removed from HTML elements. Please add the `ion-text` attribute in order to use the color input. For example: `<a ion-text color="secondary">Link</a>`');
    }
  }

}

import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';

/**
  * @name Note
  * @module ionic
  * @description
  * A note adds a greyed out element that can be on the left or right side of an item.
  * @usage
  *
  * ```html
  * <ion-content>
  *   <ion-list>
  *     <ion-item>
  *       <ion-note item-left>
  *         Left Note
  *       </ion-note>
  *       My Item
  *       <ion-note item-right>
  *         Right Note
  *       </ion-note>
  *     </ion-item>
  *   </ion-list>
  * </ion-content>
  *```
  * @demo /docs/v2/demos/src/note/basic  
  * {@link /docs/v2/api/components/api/components/item/item ion-item}
  */
@Directive({
  selector: 'ion-note'
})
export class Note extends Ion {

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor(val);
  }

  /**
   * @input {string} The mode to apply to this component. Mode can be `ios`, `wp`, or `md`.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'note');
  }

}

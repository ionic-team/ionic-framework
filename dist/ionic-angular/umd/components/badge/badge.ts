import { Directive, ElementRef, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
  * @name Badge
  * @module ionic
  * @description
  * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
  * @see {@link /docs/components/#badges Badges Component Docs}
 */
@Directive({
  selector: 'ion-badge'
})
export class Badge extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'badge');
  }
}

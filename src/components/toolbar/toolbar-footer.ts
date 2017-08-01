import { Directive, ElementRef, Optional, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Footer as IFooter } from '../../navigation/nav-interfaces';
import { ViewController } from '../../navigation/view-controller';

/**
 * @name Footer
 * @description
 * Footer is a root component of a page that sits at the bottom of the page.
 * Footer can be a wrapper for `ion-toolbar` to make sure the content area is sized correctly.
 *
 * @usage
 *
 * ```html
 * <ion-content></ion-content>
 *
 * <ion-footer>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 */
@Directive({
  selector: 'ion-footer'
})
export class Footer extends Ion implements IFooter {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer, 'footer');
    viewCtrl && viewCtrl._setFooter(this);
  }
}

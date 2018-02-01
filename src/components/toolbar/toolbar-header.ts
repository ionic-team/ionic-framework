import { Directive, ElementRef, Optional, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Header as IHeader } from '../../navigation/nav-interfaces';
import { ViewController } from '../../navigation/view-controller';

/**
 * @name Header
 * @description
 * Header is a parent component that holds the navbar and toolbar component.
 * It's important to note that `ion-header` needs to be one of the three root elements of a page
 *
 * @usage
 *
 * ```html
 * <ion-header>
 *   <ion-navbar>
 *     <ion-title>Page1</ion-title>
 *   </ion-navbar>
 *
 *   <ion-toolbar>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content></ion-content>
 * ```
 *
 */
@Directive({
  selector: 'ion-header'
})
export class Header extends Ion implements IHeader {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer, 'header');
    viewCtrl && viewCtrl._setHeader(this);
  }
}

import {Directive, Input, HostListener} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Menu} from './menu';


/**
* @name MenuClose
* @description
* Place `menuClose` on a button to automatically close an open menu. Note that the menu's id must be either
* `leftMenu` or `rightMenu`
*
* @usage
 * ```html
 * <ion-menu [content]="mycontent" id="leftMenu">
 *   <ion-content>
 *     <ion-list>
 *     <ion-item menuClose>Close the menu</ion-item>
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
* @demo /docs/v2/demos/menu/
* @see {@link /docs/v2/components#menus Menu Component Docs}
* @see {@link ../../menu/Menu Menu API Docs}
*/
@Directive({
  selector: '[menuClose]'
})
export class MenuClose {

  /**
   * @private
   */
  @Input() menuClose;

  constructor(private _app: IonicApp) {}

  /**
  * @private
  */
  @HostListener('click')
  close() {
    let menu = Menu.getById(this._app, this.menuClose);
    menu && menu.close();
  }

}

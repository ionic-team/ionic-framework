import {Directive, Input, HostListener} from 'angular2/core';

import {MenuController} from './menu-controller';


/**
* @name MenuClose
* @description
* Place `menuClose` on a button to automatically close an open menu.
*
* @usage
 * ```html
 * <ion-menu [content]="mycontent">
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

  constructor(private _menu: MenuController) {}

  /**
  * @private
  */
  @HostListener('click')
  close() {
    let menu = this._menu.get(this.menuClose);
    menu && menu.close();
  }

}

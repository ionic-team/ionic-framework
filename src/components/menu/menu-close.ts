import { Directive, HostListener, Input } from '@angular/core';

import { MenuController } from './menu-controller';


/**
 * @name MenuClose
 * @description
 * The `menuClose` directive can be placed on any button to close an open menu.
 *
 * @usage
 *
 * A simple `menuClose` button can be added using the following markup:
 *
 * ```html
 * <button ion-button menuClose>Close Menu</button>
 * ```
 *
 * To close a certain menu by its id or side, give the `menuClose`
 * directive a value.
 *
 * ```html
 * <button ion-button menuClose="left">Close Left Menu</button>
 * ```
 *
 * @demo /docs/v2/demos/src/menu/
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
  @Input() menuClose: string;

  constructor(private _menu: MenuController) {}

  /**
  * @private
  */
  @HostListener('click')
  close() {
    const menu = this._menu.get(this.menuClose);
    menu && menu.close();
  }

}

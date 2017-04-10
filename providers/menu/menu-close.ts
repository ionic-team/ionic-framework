import { Directive, HostListener, Input } from '@angular/core';

import { MenuController } from '../app/menu-controller';


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
 * @demo /docs/demos/src/menu/
 * @see {@link /docs/components#menus Menu Component Docs}
 * @see {@link ../../menu/Menu Menu API Docs}
 */
@Directive({
  selector: '[menuClose]'
})
export class MenuClose {

  /**
   * @hidden
   */
  @Input() menuClose: string;

  constructor(private _menu: MenuController) {}

  /**
  * @hidden
  */
  @HostListener('click')
  close() {
    const menu = this._menu.get(this.menuClose);
    menu && menu.close();
  }

}

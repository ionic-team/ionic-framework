import {Directive, ElementRef, Optional, Input, HostListener} from 'angular2/core';

import {ViewController} from '../nav/view-controller';
import {Navbar} from '../navbar/navbar';
import {MenuController} from './menu-controller';

/**
 * @name MenuToggle
 * @description
 * The `menuToggle` directive can be placed on any button to
 * automatically close an open menu.
 *
 * @usage
 * ```html
 * <button menuToggle>Toggle Menu</button>
 * ```
 *
 * To toggle a certain menu by its id or side, give the `menuToggle`
 * directive a value.
 *
 * ```html
 * <button menuToggle="right">Toggle Right Menu</button>
 * ```
 *
 * @demo /docs/v2/demos/menu/
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link ../../menu/Menu Menu API Docs}
 */
@Directive({
  selector: '[menuToggle]',
  host: {
    '[hidden]': 'isHidden',
    'menuToggle': '' // ensures the attr is there for css when using [menuToggle]
  }
})
export class MenuToggle {

  /**
   * @private
   */
  @Input() menuToggle;

  /**
   * @private
   */
  private _inNavbar: boolean;

  constructor(
    private _menu: MenuController,
    elementRef: ElementRef,
    @Optional() private _viewCtrl: ViewController,
    @Optional() private _navbar: Navbar
  ) {
    this._inNavbar = !!_navbar;
  }

  /**
  * @private
  */
  @HostListener('click')
  toggle() {
    let menu = this._menu.get(this.menuToggle);
    menu && menu.toggle();
  }

  /**
  * @private
  */
  get isHidden() {
    if (this._inNavbar && this._viewCtrl) {
      if (this._viewCtrl.isFirst()) {
        // this is the first view, so it should always show
        return false;
      }

      let menu = this._menu.get(this.menuToggle);
      if (menu) {
        // this is not the root view, so see if this menu
        // is configured to still be enabled if it's not the root view
        return !menu.persistent;
      }
    }
    return false;
  }

}

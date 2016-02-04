import {Directive, ElementRef, Optional, Input, HostListener} from 'angular2/core';

import {ViewController} from '../nav/view-controller';
import {Navbar} from '../navbar/navbar';
import {MenuController} from './menu-controller';


/**
* @name MenuToggle
* @description
* Toggle a menu by placing this directive on any item.
* Note that the menu's id must be either `leftMenu` or `rightMenu`
*
* @usage
 * ```html
 *<ion-content>
 *  <h3>Page 1</h3>
 *  <button menuToggle>Toggle Menu</button>
 *</ion-content>
 *
 * ```
* @demo /docs/v2/demos/menu/
* @see {@link /docs/v2/components#menus Menu Component Docs}
* @see {@link ../../menu/Menu Menu API Docs}
*/
@Directive({
  selector: '[menuToggle]',
  host: {
    '[hidden]': 'isHidden',
    'menuToggle': '' //ensures the attr is there for css when using [menuToggle]
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

    // Deprecation warning
    if (this._inNavbar && elementRef.nativeElement.tagName === 'A') {
      console.warn('Menu toggles within a navbar should use <button menuToggle> instead of <a menu-toggle>')
    }
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
      return !this._viewCtrl.isRoot();
    }
    return false;
  }

}

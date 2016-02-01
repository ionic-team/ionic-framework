import {Directive, ElementRef, Optional, Input, HostListener} from 'angular2/core';

import {IonicApp} from '../app/app';
import {ViewController} from '../nav/view-controller';
import {Navbar} from '../navbar/navbar';
import {Menu} from './menu';


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
  withinNavbar: boolean;

  constructor(
    private _app: IonicApp,
    elementRef: ElementRef,
    @Optional() private _viewCtrl: ViewController,
    @Optional() private _navbar: Navbar
  ) {
    this.withinNavbar = !!_navbar;

    // Deprecation warning
    if (this.withinNavbar && elementRef.nativeElement.tagName === 'A') {
      console.warn('Menu toggles within a navbar should use <button menuToggle> instead of <a menu-toggle>')
    }
  }

  /**
  * @private
  */
  @HostListener('click')
  toggle() {
    let menu = Menu.getById(this._app, this.menuToggle);
    menu && menu.toggle();
  }

  /**
  * @private
  */
  get isHidden() {
    if (this.withinNavbar && this._viewCtrl) {
      return !this._viewCtrl.isRoot();
    }
    return false;
  }

}

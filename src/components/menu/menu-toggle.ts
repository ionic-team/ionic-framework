import { Directive, HostListener, Input, Optional } from '@angular/core';

import { Button } from '../button/button';
import { MenuController } from '../app/menu-controller';
import { Navbar } from '../toolbar/navbar';
import { ViewController } from '../../navigation/view-controller';

/**
 * @name MenuToggle
 * @description
 * The `menuToggle` directive can be placed on any button to toggle a menu open or closed.
 * If it is added to the [NavBar](../../toolbar/Navbar) of a page, the button will only appear
 * when the page it's in is currently a root page. See the [Menu Navigation Bar Behavior](../Menu#navigation-bar-behavior)
 * docs for more information.
 *
 *
 * @usage
 *
 * A simple `menuToggle` button can be added using the following markup:
 *
 * ```html
 * <button ion-button menuToggle>Toggle Menu</button>
 * ```
 *
 * To toggle a specific menu by its id or side, give the `menuToggle`
 * directive a value.
 *
 * ```html
 * <button ion-button menuToggle="right">Toggle Right Menu</button>
 * ```
 *
 * If placing the `menuToggle` in a navbar or toolbar, it should be
 * placed as a child of the `<ion-navbar>` or `<ion-toolbar>`, and not in
 * the `<ion-buttons>` element:
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-buttons start>
 *       <button ion-button>
 *         <ion-icon name="contact"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *     <button ion-button menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *     <ion-title>
 *       Title
 *     </ion-title>
 *     <ion-buttons end>
 *       <button ion-button (click)="doClick()">
 *         <ion-icon name="more"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * Similar to `<ion-buttons>`, the `menuToggle` can be positioned using
 * `start`, `end`, `left`, or `right`:
 *
 * ```html
 * <ion-toolbar>
 *   <button ion-button menuToggle right>
 *     <ion-icon name="menu"></ion-icon>
 *   </button>
 *   <ion-title>
 *     Title
 *   </ion-title>
 *   <ion-buttons end>
 *     <button ion-button (click)="doClick()">
 *       <ion-icon name="more"></ion-icon>
 *     </button>
 *   </ion-buttons>
 * </ion-toolbar>
 * ```
 *
 * See the [Toolbar API docs](../../toolbar/Toolbar) for more information
 * on the different positions.
 *
 * @demo /docs/demos/src/menu/
 * @see {@link /docs/components#menus Menu Component Docs}
 * @see {@link ../../menu/Menu Menu API Docs}
 */
@Directive({
  selector: '[menuToggle]',
  host: {
    '[hidden]': 'isHidden'
  }
})
export class MenuToggle {

  /**
   * @hidden
   */
  @Input() menuToggle: string;

  /**
   * @hidden
   */
  private _isButton: boolean;

  /**
   * @hidden
   */
  private _inNavbar: boolean;

  constructor(
    private _menu: MenuController,
    @Optional() private _viewCtrl: ViewController,
    @Optional() private _button: Button,
    @Optional() _navbar: Navbar
  ) {
    this._isButton = !!_button;
    this._inNavbar = !!_navbar;
  }

  ngAfterContentInit() {
    // Add the bar-button-menutoggle / button-menutoggle class
    if (this._isButton) {
      this._button._setClass('menutoggle', true);
    }
  }

  /**
  * @hidden
  */
  @HostListener('click')
  toggle() {
    const menu = this._menu.get(this.menuToggle);
    menu && menu.toggle();
  }

  /**
  * @hidden
  */
  get isHidden() {
    const menu = this._menu.get(this.menuToggle);
    if (this._inNavbar && this._viewCtrl) {
      if (!menu || !menu._canOpen()) {
        return true;
      }

      if (this._viewCtrl.isFirst()) {
        // this is the first view, so it should always show
        return false;
      }

      if (menu) {
        // this is not the root view, so see if this menu
        // is configured to still be enabled if it's not the root view
        return !menu.persistent;
      }
    }
    return false;
  }

}

import { Directive, ElementRef, Input, HostListener, Optional } from '@angular/core';

import { MenuController } from './menu-controller';
import { Navbar } from '../navbar/navbar';
import { ViewController } from '../../navigation/view-controller';

/**
 * @name MenuToggle
 * @description
 * The `menuToggle` directive can be placed on any button to toggle a menu open or closed.
 * If it is added to the [NavBar](../../nav/NavBar) of a page, the button will only appear
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
 * @demo /docs/v2/demos/src/menu/
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
  @Input() menuToggle: string;

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

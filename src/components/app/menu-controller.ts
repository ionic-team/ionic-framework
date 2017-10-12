import { Menu, MenuType } from './menu-interface';
import { Platform } from '../../platform/platform';
import { assert, removeArrayItem  } from '../../util/util';


/**
 * @name MenuController
 * @description
 * The MenuController is a provider which makes it easy to control a [Menu](../../Menu/Menu/).
 * Its methods can be used to display the menu, enable the menu, toggle the menu, and more.
 * The controller will grab a reference to the menu by the `side`, `id`, or, if neither
 * of these are passed to it, it will grab the first menu it finds.
 *
 *
 * @usage
 *
 * Add a basic menu component to start with. See the [Menu](../../Menu/Menu/) API docs
 * for more information on adding menu components.
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *     ...
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * To call the controller methods, inject the `MenuController` provider
 * into the page. Then, create some methods for opening, closing, and
 * toggling the menu.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { MenuController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage {
 *
 *  constructor(public menuCtrl: MenuController) {
 *
 *  }
 *
 *  openMenu() {
 *    this.menuCtrl.open();
 *  }
 *
 *  closeMenu() {
 *    this.menuCtrl.close();
 *  }
 *
 *  toggleMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 * }
 * ```
 *
 * Since only one menu exists, the `MenuController` will grab the
 * correct menu and call the correct method for each.
 *
 *
 * ### Multiple Menus on Different Sides
 *
 * For applications with both a left and right menu, the desired menu can be
 * grabbed by passing the `side` of the menu. If nothing is passed, it will
 * default to the `"left"` menu.
 *
 * ```html
 * <ion-menu side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  toggleLeftMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 *  toggleRightMenu() {
 *    this.menuCtrl.toggle('right');
 *  }
 * ```
 *
 *
 * ### Multiple Menus on the Same Side
 *
 * An application can have multiple menus on the same side. In order to determine
 * the menu to control, an `id` should be passed. In the example below, the menu
 * with the `authenticated` id will be enabled, and the menu with the `unauthenticated`
 * id will be disabled.
 *
 * ```html
 * <ion-menu id="authenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu id="unauthenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  enableAuthenticatedMenu() {
 *    this.menuCtrl.enable(true, 'authenticated');
 *    this.menuCtrl.enable(false, 'unauthenticated');
 *  }
 * ```
 *
 * Note: if an app only has one menu, there is no reason to pass an `id`.
 *
 *
 * @demo /docs/demos/src/menu/
 *
 * @see {@link /docs/components#menus Menu Component Docs}
 * @see {@link ../Menu Menu API Docs}
 *
 */
export class MenuController {
  private _menus: Array<Menu> = [];

  /**
   * Programatically open the Menu.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu is fully opened
   */
  open(menuId?: string): Promise<boolean> {
    const menu = this.get(menuId);
    if (menu && !this.isAnimating()) {
      let openedMenu = this.getOpen();
      if (openedMenu && menu !== openedMenu) {
        openedMenu.setOpen(false, false);
      }
      return menu.open();
    }
    return Promise.resolve(false);
  }

  /**
   * Programatically close the Menu. If no `menuId` is given as the first
   * argument then it'll close any menu which is open. If a `menuId`
   * is given then it'll close that exact menu.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu is fully closed
   */
  close(menuId?: string): Promise<boolean> {
    let menu: Menu;

    if (menuId) {
      // find the menu by its id
      menu = this.get(menuId);

    } else {
      // find the menu that is open
      menu = this.getOpen();
    }

    if (menu) {
      // close the menu
      return menu.close();
    }

    return Promise.resolve(false);
  }


  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it
   * will close.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu has been toggled
   */
  toggle(menuId?: string): Promise<boolean> {
    const menu = this.get(menuId);
    if (menu && !this.isAnimating()) {
      var openedMenu = this.getOpen();
      if (openedMenu && menu !== openedMenu) {
        openedMenu.setOpen(false, false);
      }
      return menu.toggle();
    }
    return Promise.resolve(false);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be opened at the same
   * time. If there are multiple menus on the same side, then enabling one menu
   * will also automatically disable all the others that are on the same side.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean, menuId?: string): Menu {
    const menu = this.get(menuId);
    if (menu) {
      return menu.enable(shouldEnable);
    }
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable: boolean, menuId?: string): Menu {
    const menu = this.get(menuId);
    if (menu) {
      return menu.swipeEnable(shouldEnable);
    }
  }

  /**
   * @param {string} [menuId] Optionally get the menu by its id, or side.
   * @return {boolean} Returns true if the specified menu is currently open, otherwise false.
   * If the menuId is not specified, it returns true if ANY menu is currenly open.
   */
  isOpen(menuId?: string): boolean {
    if (menuId) {
      var menu = this.get(menuId);
      return menu && menu.isOpen || false;
    } else {
      return !!this.getOpen();
    }
  }

  /**
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
   */
  isEnabled(menuId?: string): boolean {
    const menu = this.get(menuId);
    return menu && menu.enabled || false;
  }

  /**
   * Used to get a menu instance. If a `menuId` is not provided then it'll
   * return the first menu found. If a `menuId` is `left` or `right`, then
   * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
   * provided, then it'll try to find the menu using the menu's `id`
   * property. If a menu is not found then it'll return `null`.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu} Returns the instance of the menu if found, otherwise `null`.
   */
  get(menuId?: string): Menu {
    var menu: Menu;

    if (menuId === 'left' || menuId === 'right') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      menu = this._menus.find(m => m.side === menuId && m.enabled);
      if (menu) {
        return menu;
      }

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      return this._menus.find(m => m.side === menuId) || null;

    } else if (menuId) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      return this._menus.find(m => m.id === menuId) || null;
    }

    // return the first enabled menu
    menu = this._menus.find(m => m.enabled);
    if (menu) {
      return menu;
    }

    // get the first menu in the array, if one exists
    return (this._menus.length ? this._menus[0] : null);
  }

  /**
   * @return {Menu} Returns the instance of the menu already opened, otherwise `null`.
   */
  getOpen(): Menu {
    return this._menus.find(m => m.isOpen);
  }

  /**
   * @return {Array<Menu>}  Returns an array of all menu instances.
   */
  getMenus(): Array<Menu> {
    return this._menus;
  }

  /**
   * @hidden
   * @return {boolean} if any menu is currently animating
   */
  isAnimating(): boolean {
    return this._menus.some(menu => menu.isAnimating());
  }

  /**
   * @hidden
   */
  _register(menu: Menu) {
    assert(this._menus.indexOf(menu) < 0, 'menu was already registered');
    this._menus.push(menu);
  }

  /**
   * @hidden
   */
  _unregister(menu: Menu) {
    assert(this._menus.indexOf(menu) >= 0, 'menu is not registered');
    removeArrayItem(this._menus, menu);
  }

  /**
   * @hidden
   */
  _setActiveMenu(menu: Menu) {
    assert(menu.enabled, 'menu must be enabled');
    assert(this._menus.indexOf(menu) >= 0, 'menu is not registered');

    // if this menu should be enabled
    // then find all the other menus on this same side
    // and automatically disable other same side menus
    const side = menu.side;
    this._menus
      .filter(m => m.side === side && m !== menu)
      .map(m => m.enable(false));
  }


  /**
   * @hidden
   */
  static registerType(name: string, cls: new(...args: any[]) => MenuType) {
    menuTypes[name] = cls;
  }

  /**
   * @hidden
   */
  static create(type: string, menuCmp: Menu, plt: Platform) {
    return new menuTypes[type](menuCmp, plt);
  }

}

let menuTypes: { [name: string]: new(...args: any[]) => MenuType } = {};



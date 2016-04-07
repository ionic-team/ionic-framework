import {Menu} from './menu';
import {MenuType} from './menu-types';


/**
 * @name Menu
 * @description
 * _For basic Menu usage, see the [Menu section](../../../../components/#menus)
 * of the Component docs._
 *
 * Menu is a side-menu interface that can be dragged and toggled to open or close.
 * An Ionic app can have numerous menus, all of which can be controlled within
 * template HTML, or programmatically.
 *
 * @usage
 * In order to use Menu, you must specify a [reference](https://angular.io/docs/ts/latest/guide/user-input.html#local-variables)
 * to the content element that Menu should listen on for drag events, using the `content` property.
 * This is telling the menu which content the menu is attached to, so it knows which element to
 * move over, and to respond to drag events. Note that a **menu is a sibling to its content**.
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
 * By default, Menus are on the left, but this can be overridden with the `side`
 * property:
 *
 * ```html
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * ```
 *
 *
 * ### Programmatic Interaction
 *
 * To programmatically interact with any menu, you can inject the `MenuController`
 * provider into any component or directive. This makes it easy get ahold of and
 * control the correct menu instance. By default Ionic will find the app's menu
 * without requiring a menu ID.
 *
 * ```ts
 * import{Page, MenuController} from 'ionic-angular';
 * @Page({...})
 * export class MyPage {
 *  constructor(menu: MenuController) {
 *    this.menu = menu;
 *  }
 *
 *  openMenu() {
 *    this.menu.open();
 *  }
 *
 * }
 * ```
 *
 * Note that if you want to easily toggle or close a menu just from a page's
 * template, you can use `menuToggle` and/or `menuClose` to accomplish the same
 * tasks as above.
 *
 *
 * ### Apps With Left And Right Menus
 *
 * For apps with a left and right menu, you can control the desired
 * menu by passing in the side of the menu.
 *
 * ```html
 * <ion-menu side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  openLeftMenu() {
 *    this.menu.open('left');
 *  }
 *
 *  closeRightMenu() {
 *    this.menu.close('right');
 *  }
 * ```
 *
 *
 * ### Apps With Multiple, Same Side Menus
 *
 * Since more than one menu on a the same side is possible, and you wouldn't want
 * both to be open at the same time, an app can decide which menu should be enabled.
 * For apps with multiple menus on the same side, it's required to give each menu a
 * unique ID. In the example below, we're saying that the left menu with the
 * `authenticated` id should be enabled, and the left menu with the `unauthenticated`
 * id be disabled.
 *
 * ```html
 * <ion-menu id="authenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu id="unauthenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  enableAuthenticatedMenu() {
 *    this.menu.enable(true, 'authenticated');
 *    this.menu.enable(false, 'unauthenticated');
 *  }
 * ```
 *
 * Note that if an app only had one menu, there is no reason to pass a menu id.
 *
 *
 * ### Menu Types
 *
 * Menu supports two display types: `overlay`, `reveal` and `push`. Overlay
 * is the traditional Material Design drawer type, and Reveal is the traditional
 * iOS type. By default, menus will use to the correct type for the platform,
 * but this can be overriden using the `type` property:
 *
 * ```html
 * <ion-menu type="overlay" [content]="mycontent">...</ion-menu>
 * ```
 *
 *
 * ### Persistent Menus
 *
 * By default, menus, and specifically their menu toggle buttons in the navbar,
 * only show on the root page within its `NavController`. For example, on Page 1
 * the menu toggle will show in the navbar. However, when navigating to Page 2,
 * because it is not the root Page for that `NavController`, the menu toggle
 * will not show in the navbar.
 *
 * Not showing the menu toggle button in the navbar is commonly seen within
 * native apps after navigating past the root Page. However, it is still possible
 * to always show the menu toggle button in the navbar by setting
 * `persistent="true"` on the `ion-menu` component.
 *
 * ```html
 * <ion-menu persistent="true" [content]="content">...</ion-menu>
 * ```
 *
 * @demo /docs/v2/demos/menu/
 *
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 *
 */
export class MenuController {
  private _menus: Array<Menu> = [];

  /**
   * Progamatically open the Menu.
   * @return {Promise} returns a promise when the menu is fully opened
   */
  open(menuId?: string): Promise<boolean> {
    let menu = this.get(menuId);
    if (menu) {
      return menu.open();
    }

    return Promise.resolve(false);
  }

  /**
   * Progamatically close the Menu. If no `menuId` is given as the first
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
      menu = this._menus.find(m => m.isOpen);
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
    let menu = this.get(menuId);
    if (menu) {
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
    let menu = this.get(menuId);
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
    let menu = this.get(menuId);
    if (menu) {
      return menu.swipeEnable(shouldEnable);
    }
  }

  /**
   * @return {boolean} Returns true if the menu is currently open, otherwise false.
   */
  isOpen(menuId?: string): boolean {
    let menu = this.get(menuId);
    return menu && menu.isOpen || false;
  }

  /**
   * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
   */
  isEnabled(menuId?: string): boolean {
    let menu = this.get(menuId);
    return menu && menu.enabled || false;
  }

  /**
   * Used to get a menu instance. If a `menuId` is not provided then it'll
   * return the first menu found. If a `menuId` is `left` or `right`, then
   * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
   * provided, then it'll try to find the menu using the menu's `id`
   * property. If a menu is not found then it'll return `null`.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu if found, otherwise `null`.
   */
  get(menuId?: string): Menu {
    var menu: Menu;

    if (menuId === 'left' || menuId === 'right') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      menu = this._menus.find(m => m.side === menuId && m.enabled);
      if (menu) return menu;

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
    if (menu) return menu;

    // get the first menu in the array, if one exists
    return (this._menus.length ? this._menus[0] : null);
  }


  /**
   * @return {Array<Menu>}  Returns an array of all menu instances.
   */
  getMenus(): Array<Menu> {
    return this._menus;
  }

  /**
   * @private
   */
  register(menu: Menu) {
    this._menus.push(menu);
  }

  /**
   * @private
   */
  unregister(menu: Menu) {
    let index = this._menus.indexOf(menu);
    if (index > -1) {
      this._menus.splice(index, 1);
    }
  }

  /**
   * @private
   */
  static registerType(name: string, cls: new(...args: any[]) => MenuType) {
    menuTypes[name] = cls;
  }

  /**
   * @private
   */
  static create(type, menuCmp) {
    return new menuTypes[type](menuCmp);
  }

}

let menuTypes: { [name: string]: new(...args: any[]) => MenuType } = {};

import { Menu, MenuType } from '../../index';
import { MenuRevealType, MenuPushType, MenuOverlayType } from './menu-types';


export class MenuController {
  private _menus: Array<Menu> = [];
  private _menuTypes: { [name: string]: new(...args: any[]) => MenuType } = {};

  constructor() {
    this.registerType('reveal', MenuRevealType);
    this.registerType('push', MenuPushType);
    this.registerType('overlay', MenuOverlayType);
  }

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
    return (menu && menu.enable(shouldEnable)) || null;
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable: boolean, menuId?: string): Menu {
    const menu = this.get(menuId);
    return (menu && menu.swipeEnable(shouldEnable)) || null;
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
    return this._menus.some(menu => menu.isAnimating);
  }

  /**
   * @hidden
   */
  _register(menu: Menu) {
    if (this._menus.indexOf(menu) < 0) {
      this._menus.push(menu);
    }
  }

  /**
   * @hidden
   */
  _unregister(menu: Menu) {
    const index = this._menus.indexOf(menu);
    if (index > -1) {
      this._menus.splice(index, 1);
    }
  }

  /**
   * @hidden
   */
  _setActiveMenu(menu: Menu) {
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
  registerType(name: string, cls: new(...args: any[]) => MenuType) {
    this._menuTypes[name] = cls;
  }

  /**
   * @hidden
   */
  create(type: string, menuCmp: Menu) {
    return new this._menuTypes[type](menuCmp);
  }

}
